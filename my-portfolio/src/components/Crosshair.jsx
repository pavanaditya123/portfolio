import React, { useState, useEffect } from 'react';

/**
 * Instrument crosshair that tracks the pointer, with a live coordinate
 * readout. Mounted only for fine pointers -- on touch there is no cursor to
 * track, and the lines would just be visual noise.
 */
export default function Crosshair() {
    const [pos, setPos] = useState(null);

    useEffect(() => {
        const fine = window.matchMedia?.('(pointer: fine)').matches;
        const reduced = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
        if (!fine || reduced) return undefined;

        let frame = 0;
        const onMove = (e) => {
            cancelAnimationFrame(frame);
            frame = requestAnimationFrame(() => setPos({ x: e.clientX, y: e.clientY }));
        };
        const onLeave = () => setPos(null);

        window.addEventListener('pointermove', onMove, { passive: true });
        document.addEventListener('pointerleave', onLeave);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('pointermove', onMove);
            document.removeEventListener('pointerleave', onLeave);
        };
    }, []);

    if (!pos) return null;

    return (
        <div className="fixed inset-0 z-[45] pointer-events-none" aria-hidden="true">
            <div
                className="absolute left-0 right-0 border-t border-signal/12"
                style={{ top: pos.y }}
            />
            <div
                className="absolute top-0 bottom-0 border-l border-signal/12"
                style={{ left: pos.x }}
            />
            <span
                className="absolute mono text-[9px] text-signal/45 tabular-nums"
                style={{
                    left: Math.min(pos.x + 10, window.innerWidth - 76),
                    top: Math.min(pos.y + 10, window.innerHeight - 18),
                }}
            >
                {String(pos.x).padStart(4, '0')},{String(pos.y).padStart(4, '0')}
            </span>
        </div>
    );
}
