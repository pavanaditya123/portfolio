import React from 'react';

/**
 * Static graph-paper grid plus a faint scanline wash.
 *
 * Deliberately not animated: the drifting particle field this replaced was the
 * most template-looking element on the page, and in a console layout the
 * panels themselves should carry the design.
 */
export default function ConsoleBackground() {
    return (
        <>
            <div className="console-grid" aria-hidden="true" />
            <div className="scanline" aria-hidden="true" />
        </>
    );
}
