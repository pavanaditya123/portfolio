import { useState, useEffect, useRef } from 'react';

const prefersReducedMotion = () =>
    typeof window !== 'undefined' &&
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

/**
 * Animate 0 -> value whenever value changes.
 *
 * Unlike a fixed-target counter this re-runs when the number arrives from the
 * network, which is what the live stat cards need: they render at 0 and roll
 * up once the fetch resolves.
 */
export default function useCountUp(value, duration = 1200) {
    const target = Number.isFinite(Number(value)) ? Number(value) : 0;
    const [display, setDisplay] = useState(0);
    const frame = useRef(0);

    useEffect(() => {
        if (target === 0 || prefersReducedMotion()) {
            // Snapping to the final value is the whole point when animation is off.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setDisplay(target);
            return undefined;
        }

        const start = performance.now();
        // easeOutCubic -- fast off the line, gentle landing on the real number.
        const ease = (t) => 1 - Math.pow(1 - t, 3);

        const tick = (now) => {
            const t = Math.min((now - start) / duration, 1);
            setDisplay(Math.round(ease(t) * target));
            if (t < 1) frame.current = requestAnimationFrame(tick);
        };

        frame.current = requestAnimationFrame(tick);

        // Background and throttled tabs stop firing rAF, which would strand the
        // counter at 0. This guarantees the real number lands either way.
        const settle = setTimeout(() => setDisplay(target), duration + 400);

        return () => {
            cancelAnimationFrame(frame.current);
            clearTimeout(settle);
        };
    }, [target, duration]);

    return display;
}
