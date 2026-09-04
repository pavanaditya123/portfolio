import React, { useRef, useEffect, useState } from 'react';

/**
 * The name rendered as live ASCII art on a canvas.
 *
 * The text is rasterised once into a tiny offscreen buffer -- one pixel per
 * character cell -- and that mask drives which cells are "lit". From then on
 * the loop only paints glyphs, never re-measures text, so the per-frame cost
 * is a few hundred fillText calls and nothing else.
 *
 * Performance guards, because this sits at the top of the page:
 *   - only lit cells are drawn, plus a little sparse static
 *   - capped at ~30fps; the glyph churn reads the same as 60 and costs half
 *   - paused entirely when scrolled out of view or the tab is hidden
 *   - device pixel ratio clamped to 2
 *   - static single render under prefers-reduced-motion
 */

const TEXT = 'PAVAN ADITYA';
const COLS = 96;
const ROWS = 18;
const CHARS = '01#%&*+=<>/\\|';
const FPS = 30;

// Cheap deterministic hash so each cell has its own stable phase.
const hash = (x, y) => {
    const n = Math.sin(x * 12.9898 + y * 78.233) * 43758.5453;
    return n - Math.floor(n);
};

export default function AsciiName({ className = '' }) {
    const canvasRef = useRef(null);
    const [fallback, setFallback] = useState(false);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return undefined;
        const ctx = canvas.getContext('2d', { alpha: true });
        if (!ctx) {
            // No 2D context: show the name as plain styled text rather than
            // leaving the most important element on the page blank.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setFallback(true);
            return undefined;
        }

        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

        // --- rasterise the text once into a COLS x ROWS mask ---
        const off = document.createElement('canvas');
        off.width = COLS;
        off.height = ROWS;
        const octx = off.getContext('2d', { willReadFrequently: true });
        octx.fillStyle = '#fff';
        octx.textBaseline = 'middle';
        octx.textAlign = 'center';

        let size = ROWS + 2;
        octx.font = `900 ${size}px monospace`;
        while (octx.measureText(TEXT).width > COLS - 1 && size > 3) {
            size -= 0.5;
            octx.font = `900 ${size}px monospace`;
        }
        octx.fillText(TEXT, COLS / 2, ROWS / 2 + 0.5);

        const pixels = octx.getImageData(0, 0, COLS, ROWS).data;
        const lit = [];
        let minY = ROWS;
        let maxY = 0;
        for (let y = 0; y < ROWS; y += 1) {
            for (let x = 0; x < COLS; x += 1) {
                if (pixels[(y * COLS + x) * 4 + 3] > 110) {
                    lit.push({ x, y, h: hash(x, y) });
                    if (y < minY) minY = y;
                    if (y > maxY) maxY = y;
                }
            }
        }

        // Font metrics leave blank rows above and below the cap height. Cropping
        // to the actual glyph bounds means the name fills its block instead of
        // floating in dead space, whatever font the browser resolves.
        const rowOffset = minY;
        const usedRows = Math.max(1, maxY - minY + 1);
        for (const c of lit) c.y -= rowOffset;

        let cellW = 0;
        let cellH = 0;
        let dpr = 1;

        const resize = () => {
            const rect = canvas.getBoundingClientRect();
            if (!rect.width) return;
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            cellW = rect.width / COLS;
            cellH = cellW * 1.55;
            canvas.width = Math.floor(rect.width * dpr);
            canvas.height = Math.floor(cellH * usedRows * dpr);
            canvas.style.height = `${cellH * usedRows}px`;
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.textBaseline = 'middle';
            ctx.textAlign = 'center';
        };

        const pointer = { x: -999, y: -999 };
        const onMove = (e) => {
            const r = canvas.getBoundingClientRect();
            pointer.x = e.clientX - r.left;
            pointer.y = e.clientY - r.top;
        };
        const onLeave = () => {
            pointer.x = -999;
            pointer.y = -999;
        };

        let raf = 0;
        let last = 0;
        let visible = true;
        let running = true;

        function paint(t) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.font = `700 ${Math.max(cellW * 1.35, 6)}px 'JetBrains Mono', monospace`;

            for (let i = 0; i < lit.length; i += 1) {
                const c = lit[i];
                const px = c.x * cellW + cellW / 2;
                const py = c.y * cellH + cellH / 2;

                // A slow wave travels left to right across the letterforms.
                const wave = 0.62 + 0.38 * Math.sin(c.x * 0.22 - t * 2.1 + c.y * 0.35);

                // Pointer proximity blooms the nearby cells.
                const dx = px - pointer.x;
                const dy = py - pointer.y;
                const near = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 110);

                const alpha = Math.min(1, reduced ? 0.92 : wave * 0.85 + near * 0.6);
                const idx = reduced
                    ? 0
                    : Math.floor(c.h * 97 + t * (4 + c.h * 5) + near * 22) % CHARS.length;

                ctx.fillStyle = near > 0.15
                    ? `rgba(240,246,252,${alpha})`
                    : `rgba(63,185,80,${alpha})`;
                ctx.fillText(reduced ? '#' : CHARS[idx], px, py);
            }

            // Sparse static in the empty space, so the field feels alive.
            if (!reduced) {
                ctx.fillStyle = 'rgba(118,126,138,0.5)';
                for (let i = 0; i < 26; i += 1) {
                    const s = hash(i, Math.floor(t * 3) + i);
                    const gx = Math.floor(s * COLS);
                    const gy = Math.floor(hash(gx, i * 7 + Math.floor(t * 3)) * usedRows);
                    ctx.fillText(CHARS[Math.floor(s * CHARS.length)], gx * cellW + cellW / 2, gy * cellH + cellH / 2);
                }
            }

        }

        function loop(now) {
            raf = requestAnimationFrame(loop);
            if (!running || !visible) return;
            if (now - last < 1000 / FPS) return;
            last = now;
            paint(now / 1000);
        }

        resize();
        // Paint once synchronously. requestAnimationFrame does not fire in a
        // background tab, and without this the name would stay blank until the
        // tab was focused -- on the one element that matters most.
        paint(0);
        if (!reduced) raf = requestAnimationFrame(loop);

        const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
        io.observe(canvas);

        const onVis = () => { running = !document.hidden; };

        window.addEventListener('resize', resize);
        canvas.addEventListener('pointermove', onMove, { passive: true });
        canvas.addEventListener('pointerleave', onLeave);
        document.addEventListener('visibilitychange', onVis);

        return () => {
            cancelAnimationFrame(raf);
            io.disconnect();
            window.removeEventListener('resize', resize);
            canvas.removeEventListener('pointermove', onMove);
            canvas.removeEventListener('pointerleave', onLeave);
            document.removeEventListener('visibilitychange', onVis);
        };
    }, []);

    if (fallback) {
        return (
            <h1 className={`mono text-4xl md:text-6xl font-extrabold text-signal tracking-tight leading-[1.05] ${className}`}>
                {TEXT}
            </h1>
        );
    }

    return (
        <div className={className}>
            {/* The heading stays real text for screen readers and crawlers;
                the canvas is decoration layered over it. */}
            <h1 className="sr-only">{TEXT}</h1>
            <canvas ref={canvasRef} aria-hidden="true" className="w-full block" />
        </div>
    );
}
