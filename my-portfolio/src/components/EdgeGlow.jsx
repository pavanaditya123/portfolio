import React, { useRef, useEffect } from 'react';

/**
 * A travelling light that illuminates the panel borders it passes over.
 *
 * The trick is that the gradient lives in canvas space, not element space: all
 * panel rectangles go into one path, and a single radial gradient centred on
 * the light is used as the stroke. So one stroke call lights every edge near
 * the light and leaves the rest dark -- no per-panel styles, no per-panel
 * shadows, no layout writes.
 *
 * The light follows the pointer, and drifts on its own along a slow Lissajous
 * path when the pointer has been still or absent.
 */

const FPS = 30;
const RADIUS = 420;
const IDLE_AFTER = 2600; // ms before the light resumes drifting

export default function EdgeGlow() {
    const canvasRef = useRef(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) return undefined;

        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        let w = 0;
        let h = 0;
        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // Rects are read on scroll/resize rather than per frame, so the draw
        // loop never forces layout.
        let rects = [];
        let rectsDirty = true;
        const markDirty = () => { rectsDirty = true; };

        const readRects = () => {
            const found = [];
            for (const el of document.querySelectorAll('.panel')) {
                const r = el.getBoundingClientRect();
                if (r.bottom < -80 || r.top > h + 80) continue; // offscreen
                found.push(r);
            }
            rects = found;
            rectsDirty = false;
        };

        // Seeded on-screen rather than off it, so the very first frame already
        // lights something -- otherwise the glow is absent entirely wherever
        // requestAnimationFrame does not run, and swoops in from a corner where it does.
        const light = { x: 0, y: 0, tx: 0, ty: 0 };
        let lastPointer = 0;

        const onMove = (e) => {
            light.tx = e.clientX;
            light.ty = e.clientY;
            lastPointer = performance.now();
        };

        let raf = 0;
        let last = 0;
        let running = true;
        const onVis = () => { running = !document.hidden; };

        function paint(now) {
            if (rectsDirty) readRects();

            // Drift when the pointer has gone quiet, so the effect is alive
            // even before anyone touches the page.
            if (now - lastPointer > IDLE_AFTER) {
                const t = now / 1000;
                light.tx = w * (0.5 + 0.42 * Math.sin(t * 0.21));
                light.ty = h * (0.5 + 0.38 * Math.sin(t * 0.29 + 1.1));
            }

            light.x += (light.tx - light.x) * 0.085;
            light.y += (light.ty - light.y) * 0.085;

            ctx.clearRect(0, 0, w, h);
            if (!rects.length) return;

            const grad = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, RADIUS);
            grad.addColorStop(0, 'rgba(63,185,80,1)');
            grad.addColorStop(0.28, 'rgba(63,185,80,0.72)');
            grad.addColorStop(0.62, 'rgba(63,185,80,0.26)');
            grad.addColorStop(1, 'rgba(63,185,80,0)');

            // Every edge in one path, lit by one gradient, in one stroke.
            ctx.beginPath();
            for (const r of rects) ctx.rect(r.left, r.top, r.width, r.height);

            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.6;
            ctx.stroke();

            // A second, tighter pass gives the very centre a hot core.
            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const core = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, RADIUS * 0.42);
            core.addColorStop(0, 'rgba(150,255,180,0.8)');
            core.addColorStop(1, 'rgba(63,185,80,0)');
            ctx.strokeStyle = core;
            ctx.lineWidth = 1.6;
            ctx.stroke();
            ctx.restore();

            // Faint ambient wash so the light reads on the background too.
            const amb = ctx.createRadialGradient(light.x, light.y, 0, light.x, light.y, RADIUS * 1.15);
            amb.addColorStop(0, 'rgba(63,185,80,0.06)');
            amb.addColorStop(1, 'rgba(63,185,80,0)');
            ctx.fillStyle = amb;
            ctx.fillRect(light.x - RADIUS * 1.15, light.y - RADIUS * 1.15, RADIUS * 2.3, RADIUS * 2.3);
        }

        function loop(now) {
            raf = requestAnimationFrame(loop);
            if (!running) return;
            if (now - last < 1000 / FPS) return;
            last = now;
            paint(now);
        }

        resize();
        light.x = w * 0.5;
        light.y = h * 0.42;
        light.tx = light.x;
        light.ty = light.y;
        readRects();
        paint(performance.now());
        if (!reduced) raf = requestAnimationFrame(loop);

        // Layout settles after the live stats land, so re-read for a while.
        const settle = setInterval(markDirty, 700);
        setTimeout(() => clearInterval(settle), 15000);

        window.addEventListener('resize', () => { resize(); markDirty(); });
        window.addEventListener('scroll', markDirty, { passive: true });
        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('visibilitychange', onVis);

        return () => {
            cancelAnimationFrame(raf);
            clearInterval(settle);
            window.removeEventListener('resize', resize);
            window.removeEventListener('scroll', markDirty);
            window.removeEventListener('pointermove', onMove);
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="fixed inset-0 z-20 pointer-events-none"
        />
    );
}
