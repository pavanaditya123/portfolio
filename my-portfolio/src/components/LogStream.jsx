import React, { useState, useEffect, useRef } from 'react';
import { onStatsEvent } from '../lib/codingStats';

/**
 * Rolling log of real network activity.
 *
 * Every line here is emitted by the stats layer during an actual fetch, so
 * what scrolls past is genuinely what happened: cache hits with their age,
 * response times, stale fallbacks when an upstream is down. Hitting refresh
 * in the telemetry section makes new lines appear, which is the point -- it
 * demonstrates the "live" claim instead of asserting it.
 */

const TONE = {
    req: 'text-info',
    ok: 'text-signal',
    cache: 'text-ink-mute',
    warn: 'text-warn',
    err: 'text-crit',
};

const clock = (t) =>
    new Date(t).toLocaleTimeString('en-GB', { hour12: false });

const MAX = 14;

export default function LogStream() {
    const [lines, setLines] = useState([]);
    const endRef = useRef(null);

    useEffect(
        () =>
            onStatsEvent((e) =>
                setLines((prev) =>
                    // Buffered events replay to every new subscriber, and React
                    // subscribes twice in StrictMode, so drop anything already held.
                    prev.some((x) => x.id === e.id) ? prev : [...prev, e].slice(-MAX),
                ),
            ),
        [],
    );

    useEffect(() => {
        endRef.current?.scrollIntoView({ block: 'nearest' });
    }, [lines]);

    return (
        <div className="panel">
            <div className="panel-head">
                <span className="dot dot-live" />
                <span>stdout</span>
                <span className="ml-auto text-ink-dim normal-case tracking-normal">
                    {lines.length ? `${lines.length} events` : 'waiting'}
                </span>
            </div>

            <div className="h-[168px] overflow-y-auto px-4 py-3 space-y-0.5">
                {lines.length === 0 && (
                    <p className="mono text-[10.5px] text-ink-dim">
                        <span className="typing-cursor" />
                    </p>
                )}
                {lines.map((l) => (
                    <p key={l.id} className="mono text-[10.5px] leading-5 flex gap-2.5">
                        <span className="text-ink-dim shrink-0">{clock(l.t)}</span>
                        <span className={`shrink-0 w-11 ${TONE[l.level] ?? 'text-ink'}`}>
                            {l.level.toUpperCase()}
                        </span>
                        <span className="text-ink truncate">{l.msg}</span>
                    </p>
                ))}
                <div ref={endRef} />
            </div>
        </div>
    );
}
