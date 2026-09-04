import React from 'react';

/**
 * Static field behind the page: graph-paper grid, a vignette pulling focus to
 * the centre, and a faint scanline wash.
 *
 * Deliberately still. The motion now lives on the panel edges (see EdgeGlow),
 * and two competing animated layers just made the page noisier without making
 * it better.
 */
export default function ConsoleBackground() {
    return (
        <>
            <div className="console-grid" aria-hidden="true" />
            <div className="console-vignette" aria-hidden="true" />
            <div className="scanline" aria-hidden="true" />
        </>
    );
}
