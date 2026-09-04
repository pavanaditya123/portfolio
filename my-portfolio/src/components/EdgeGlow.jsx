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
const CURSOR_FADE = 1500; // ms of stillness before the cursor light fades out

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
        let panelPath = new Path2D();
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
            // Built once per layout change and re-stroked by every light.
            panelPath = new Path2D();
            for (const r of found) panelPath.rect(r.left, r.top, r.width, r.height);
            rectsDirty = false;
        };

        // Two independent lights. The roaming one never stops, so the edges are
        // alive whether or not anyone touches the page; the cursor light is
        // additional, and fades away when the pointer goes still.
        const roam = { x: 0, y: 0 };
        const cursor = { x: -900, y: -900, tx: -900, ty: -900, alpha: 0 };
        let lastPointer = -Infinity;

        const onMove = (e) => {
            cursor.tx = e.clientX;
            cursor.ty = e.clientY;
            if (cursor.alpha === 0) {
                cursor.x = e.clientX;
                cursor.y = e.clientY;
            }
            lastPointer = performance.now();
        };

        let raf = 0;
        let last = 0;
        let running = true;
        const onVis = () => { running = !document.hidden; };

        // One light -> gradient stroke over the shared panel path.
        function strokeLight(x, y, intensity) {
            if (intensity <= 0.01) return;

            const grad = ctx.createRadialGradient(x, y, 0, x, y, RADIUS);
            grad.addColorStop(0, `rgba(63,185,80,${1 * intensity})`);
            grad.addColorStop(0.28, `rgba(63,185,80,${0.72 * intensity})`);
            grad.addColorStop(0.62, `rgba(63,185,80,${0.26 * intensity})`);
            grad.addColorStop(1, 'rgba(63,185,80,0)');
            ctx.strokeStyle = grad;
            ctx.lineWidth = 1.6;
            ctx.stroke(panelPath);

            ctx.save();
            ctx.globalCompositeOperation = 'lighter';
            const core = ctx.createRadialGradient(x, y, 0, x, y, RADIUS * 0.42);
            core.addColorStop(0, `rgba(150,255,180,${0.8 * intensity})`);
            core.addColorStop(1, 'rgba(63,185,80,0)');
            ctx.strokeStyle = core;
            ctx.lineWidth = 1.6;
            ctx.stroke(panelPath);
            ctx.restore();

            const amb = ctx.createRadialGradient(x, y, 0, x, y, RADIUS * 1.15);
            amb.addColorStop(0, `rgba(63,185,80,${0.06 * intensity})`);
            amb.addColorStop(1, 'rgba(63,185,80,0)');
            ctx.fillStyle = amb;
            ctx.fillRect(x - RADIUS * 1.15, y - RADIUS * 1.15, RADIUS * 2.3, RADIUS * 2.3);
        }

        function paint(now) {
            if (rectsDirty) readRects();
            const t = now / 1000;

            // Lissajous with incommensurate periods (~13s and ~19s), so the
            // path does not visibly repeat. Fast enough to read as motion.
            roam.x = w * (0.5 + 0.46 * Math.sin(t * 0.48));
            roam.y = h * (0.5 + 0.42 * Math.sin(t * 0.33 + 1.1));

            cursor.x += (cursor.tx - cursor.x) * 0.14;
            cursor.y += (cursor.ty - cursor.y) * 0.14;
            const wanted = now - lastPointer < CURSOR_FADE ? 1 : 0;
            cursor.alpha += (wanted - cursor.alpha) * 0.09;

            ctx.clearRect(0, 0, w, h);
            if (!rects.length) return;

            strokeLight(roam.x, roam.y, 1);
            strokeLight(cursor.x, cursor.y, cursor.alpha);
        }

        function loop(now) {
            raf = requestAnimationFrame(loop);
            if (!running) return;
            if (now - last < 1000 / FPS) return;
            last = now;
            paint(now);
        }

        resize();
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
