import React, { useRef, useEffect } from 'react';

/**
 * Live instrument field behind the whole page.
 *
 * Oscilloscope traces drift across the viewport and a scan bar sweeps them
 * periodically, blooming whatever it passes -- the read is a monitoring wall
 * running behind the console, which is the one background that belongs under
 * these panels.
 *
 * Costs are kept low because this runs for the entire session:
 *   - 24fps; the traces are slow and soft, so more frames buy nothing
 *   - device pixel ratio capped at 1.5 (everything here is blurred anyway)
 *   - paused whenever the tab is hidden
 *   - a single static frame under prefers-reduced-motion, then it stops
 */

const TRACES = [
    { y: 0.18, amp: 0.055, speed: 0.16, color: '63,185,80', alpha: 0.30, k: [1.7, 3.1, 5.3] },
    { y: 0.38, amp: 0.040, speed: -0.11, color: '88,166,255', alpha: 0.24, k: [2.3, 4.7, 7.1] },
    { y: 0.62, amp: 0.062, speed: 0.09, color: '188,140,255', alpha: 0.20, k: [1.3, 2.9, 6.1] },
    { y: 0.82, amp: 0.035, speed: -0.14, color: '63,185,80', alpha: 0.22, k: [3.1, 5.9, 8.3] },
];

const SEGMENTS = 150;
const FPS = 24;
const SWEEP_PERIOD = 11; // seconds for one pass

export default function ConsoleBackground() {
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
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            w = window.innerWidth;
            h = window.innerHeight;
            canvas.width = Math.floor(w * dpr);
            canvas.height = Math.floor(h * dpr);
            canvas.style.width = `${w}px`;
            canvas.style.height = `${h}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        };

        // Layered sines with non-integer frequency ratios, so the trace never
        // visibly repeats the way a single sine would.
        const sample = (tr, x, t) => {
            const p = x / w;
            return (
                Math.sin(p * tr.k[0] * Math.PI * 2 + t * tr.speed * 6) * 0.55 +
                Math.sin(p * tr.k[1] * Math.PI * 2 - t * tr.speed * 4.1) * 0.30 +
                Math.sin(p * tr.k[2] * Math.PI * 2 + t * tr.speed * 2.7) * 0.15
            );
        };

        function paint(t) {
            ctx.clearRect(0, 0, w, h);

            const sweepX = ((t % SWEEP_PERIOD) / SWEEP_PERIOD) * (w + 260) - 130;

            for (const tr of TRACES) {
                const baseY = tr.y * h;
                const amp = tr.amp * h;

                ctx.beginPath();
                for (let i = 0; i <= SEGMENTS; i += 1) {
                    const x = (i / SEGMENTS) * w;
                    const y = baseY + sample(tr, x, t) * amp;
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.strokeStyle = `rgba(${tr.color},${tr.alpha})`;
                ctx.lineWidth = 1;
                ctx.stroke();

                // The sweep bar re-energises the slice of trace it is over.
                if (!reduced) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(sweepX - 130, 0, 130, h);
                    ctx.clip();
                    ctx.beginPath();
                    for (let i = 0; i <= SEGMENTS; i += 1) {
                        const x = (i / SEGMENTS) * w;
                        const y = baseY + sample(tr, x, t) * amp;
                        if (i === 0) ctx.moveTo(x, y);
                        else ctx.lineTo(x, y);
                    }
                    ctx.strokeStyle = `rgba(${tr.color},${Math.min(0.72, tr.alpha * 2.4)})`;
                    ctx.lineWidth = 1.5;
                    ctx.shadowColor = `rgba(${tr.color},0.85)`;
                    ctx.shadowBlur = 9;
                    ctx.stroke();
                    ctx.restore();
                }
            }

            if (!reduced) {
                const g = ctx.createLinearGradient(sweepX - 130, 0, sweepX, 0);
                g.addColorStop(0, 'rgba(63,185,80,0)');
                g.addColorStop(1, 'rgba(63,185,80,0.16)');
                ctx.fillStyle = g;
                ctx.fillRect(sweepX - 130, 0, 130, h);

                ctx.fillStyle = 'rgba(63,185,80,0.30)';
                ctx.fillRect(sweepX - 1, 0, 1, h);
            }
        }

        let raf = 0;
        let last = 0;
        let running = true;

        function loop(now) {
            raf = requestAnimationFrame(loop);
            if (!running) return;
            if (now - last < 1000 / FPS) return;
            last = now;
            paint(now / 1000);
        }

        const onVis = () => { running = !document.hidden; };

        resize();
        paint(0);
        if (!reduced) raf = requestAnimationFrame(loop);

        window.addEventListener('resize', resize);
        document.addEventListener('visibilitychange', onVis);
        return () => {
            cancelAnimationFrame(raf);
            window.removeEventListener('resize', resize);
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    return (
        <>
            <div className="console-grid" aria-hidden="true" />
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className="fixed inset-0 -z-[9] pointer-events-none"
            />
            <div className="console-vignette" aria-hidden="true" />
            <div className="scanline" aria-hidden="true" />
        </>
    );
}
