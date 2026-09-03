import React from 'react';

/**
 * Service topology for the streaming backend.
 *
 * Drawn to match what the project write-up actually describes: a gateway
 * fanning out to the services the monolith was split into, asynchronous
 * traffic over Kafka, Saga picking up billing failures, and Redis in front of
 * the read-heavy path. The dashed edges animate to suggest flow; the animation
 * is dropped entirely under prefers-reduced-motion.
 */

const NODES = [
    { id: 'client', x: 8, y: 116, w: 62, h: 28, label: 'client', tone: '#6e7781' },
    { id: 'gateway', x: 104, y: 116, w: 78, h: 28, label: 'gateway', tone: '#58a6ff' },
    { id: 'playback', x: 250, y: 22, w: 116, h: 28, label: 'playback', tone: '#3fb950' },
    { id: 'watch', x: 250, y: 72, w: 116, h: 28, label: 'watch-history', tone: '#3fb950' },
    { id: 'notify', x: 250, y: 122, w: 116, h: 28, label: 'notifications', tone: '#3fb950' },
    { id: 'subs', x: 250, y: 172, w: 116, h: 28, label: 'subscriptions', tone: '#3fb950' },
    { id: 'billing', x: 250, y: 222, w: 116, h: 28, label: 'billing', tone: '#d29922' },
    { id: 'redis', x: 412, y: 22, w: 78, h: 28, label: 'redis', tone: '#f85149' },
    { id: 'kafka', x: 412, y: 122, w: 78, h: 28, label: 'kafka', tone: '#bc8cff' },
    { id: 'saga', x: 412, y: 222, w: 78, h: 28, label: 'saga', tone: '#d29922' },
];

const byId = Object.fromEntries(NODES.map((n) => [n.id, n]));
const rightOf = (n) => [n.x + n.w, n.y + n.h / 2];
const leftOf = (n) => [n.x, n.y + n.h / 2];

/** Orthogonal elbow between two nodes: out right, across, into the left edge. */
function elbow(fromId, toId) {
    const [x1, y1] = rightOf(byId[fromId]);
    const [x2, y2] = leftOf(byId[toId]);
    const mid = x1 + (x2 - x1) / 2;
    return `M${x1},${y1} H${mid} V${y2} H${x2}`;
}

const EDGES = [
    ['client', 'gateway', '#2f3947'],
    ['gateway', 'playback', '#2f3947'],
    ['gateway', 'watch', '#2f3947'],
    ['gateway', 'notify', '#2f3947'],
    ['gateway', 'subs', '#2f3947'],
    ['gateway', 'billing', '#2f3947'],
    ['playback', 'redis', '#f85149'],
    ['subs', 'kafka', '#bc8cff'],
    ['notify', 'kafka', '#bc8cff'],
    ['billing', 'saga', '#d29922'],
];

export default function ServiceTopology() {
    return (
        <div className="overflow-x-auto">
            <svg
                viewBox="0 0 512 262"
                className="w-full min-w-[440px] h-auto"
                role="img"
                aria-label="Service topology: a gateway fanning out to playback, watch-history, notifications, subscriptions and billing, with Redis caching reads, Kafka carrying async events, and Saga orchestrating billing failures."
            >
                <style>{`
                    @keyframes dashFlow { to { stroke-dashoffset: -12; } }
                    .flow { stroke-dasharray: 3 3; animation: dashFlow 1.1s linear infinite; }
                    @media (prefers-reduced-motion: reduce) { .flow { animation: none; } }
                `}</style>

                {EDGES.map(([from, to, tone]) => (
                    <path
                        key={`${from}-${to}`}
                        d={elbow(from, to)}
                        fill="none"
                        stroke={tone}
                        strokeWidth="1"
                        className={tone === '#2f3947' ? undefined : 'flow'}
                        opacity={tone === '#2f3947' ? 0.9 : 0.75}
                    />
                ))}

                {NODES.map((n) => (
                    <g key={n.id}>
                        <rect
                            x={n.x} y={n.y} width={n.w} height={n.h}
                            fill="#11161e" stroke={n.tone} strokeWidth="1" opacity="0.95"
                        />
                        <text
                            x={n.x + n.w / 2} y={n.y + n.h / 2 + 3.5}
                            textAnchor="middle"
                            fill={n.tone}
                            style={{ font: "600 10px 'JetBrains Mono', monospace", letterSpacing: '0.04em' }}
                        >
                            {n.label}
                        </text>
                    </g>
                ))}
            </svg>
        </div>
    );
}
