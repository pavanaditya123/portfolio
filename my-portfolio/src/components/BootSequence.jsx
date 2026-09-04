import React, { useState, useEffect, useRef } from 'react';

/**
 * Terminal boot overlay shown on first load.
 *
 * Runs once per tab (sessionStorage) so it never becomes an obstacle on the
 * way back to the page, skips entirely under prefers-reduced-motion, and any
 * key or click dismisses it immediately. The content underneath is already
 * mounted and in the DOM the whole time -- this is a cosmetic layer, so it
 * costs nothing for crawlers or screen readers.
 */

const LINES = [
    { t: 'sys', text: 'initializing pavan_aditya.console' },
    { t: 'ok', text: 'mounting profile manifest ......... OK' },
    { t: 'req', text: 'GET leetcode/Pavan200053' },
    { t: 'req', text: 'GET github/pavanaditya123' },
    { t: 'ok', text: 'telemetry stream established ...... OK' },
    { t: 'sys', text: 'resolving service topology' },
    { t: 'ok', text: '5 services · kafka · redis · saga .. OK' },
    { t: 'warn', text: 'codeforces handle unset ... SKIPPED' },
    { t: 'ok', text: 'render pipeline ready ............. OK' },
];

const TONE = {
    sys: 'text-ink-mute',
    ok: 'text-signal',
    req: 'text-info',
    warn: 'text-warn',
};

const SEEN_KEY = 'portfolio:booted';

export default function BootSequence() {
    const skip =
        typeof window === 'undefined' ||
        window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ||
        sessionStorage.getItem(SEEN_KEY) === '1';

    const [active, setActive] = useState(!skip);
    const [shown, setShown] = useState(0);
    const [closing, setClosing] = useState(false);
    const timers = useRef([]);

    useEffect(() => {
        if (!active) return undefined;

        const dismiss = () => {
            setClosing(true);
            timers.current.push(setTimeout(() => setActive(false), 420));
            sessionStorage.setItem(SEEN_KEY, '1');
        };

        LINES.forEach((_, i) => {
            timers.current.push(setTimeout(() => setShown(i + 1), 110 + i * 105));
        });
        timers.current.push(setTimeout(dismiss, 110 + LINES.length * 105 + 380));

        window.addEventListener('keydown', dismiss, { once: true });
        window.addEventListener('pointerdown', dismiss, { once: true });

        const pending = timers.current;
        return () => {
            pending.forEach(clearTimeout);
            window.removeEventListener('keydown', dismiss);
            window.removeEventListener('pointerdown', dismiss);
        };
    }, [active]);

    if (!active) return null;

    return (
        <div
            aria-hidden="true"
            className={`fixed inset-0 z-[100] bg-bg flex items-center justify-center px-6 transition-opacity duration-[400ms] ${closing ? 'opacity-0' : 'opacity-100'}`}
        >
            <div className="w-full max-w-md">
                {LINES.slice(0, shown).map((l, i) => (
                    <p key={i} className={`mono text-[11px] leading-6 ${TONE[l.t] ?? 'text-ink'}`}>
                        <span className="text-ink-dim">{String(i + 1).padStart(2, '0')} </span>
                        {l.text}
                    </p>
                ))}
                {shown < LINES.length && (
                    <p className="mono text-[11px] leading-6 text-signal">
                        <span className="typing-cursor" />
                    </p>
                )}
                <p className="mono text-[10px] text-ink-dim mt-6">press any key to skip</p>
            </div>
        </div>
    );
}
