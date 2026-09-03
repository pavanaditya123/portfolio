import React from 'react';

/**
 * Console primitives.
 *
 * Every surface on the site is a Panel: a bordered box with a label strip,
 * optional status on the right. Keeping that one shape consistent is what
 * makes the page read as an instrument rather than a set of cards.
 */

export const Panel = ({ label, meta, status, children, className = '', bodyClass = 'p-5' }) => (
    <div className={`panel panel-ticks ${className}`}>
        {(label || meta || status) && (
            <div className="panel-head">
                {status && <span className={`dot ${status === 'live' ? 'dot-live' : ''}`} style={status !== 'live' ? { background: status } : undefined} />}
                <span className="truncate">{label}</span>
                {meta && <span className="ml-auto text-ink-dim normal-case tracking-normal truncate">{meta}</span>}
            </div>
        )}
        <div className={bodyClass}>{children}</div>
    </div>
);

/** Section heading, styled as a numbered console region. */
export const SectionHeader = ({ index, title, note }) => (
    <div className="flex items-baseline gap-4 mb-6 border-b border-line pb-3">
        <span className="mono text-signal text-xs font-bold">{index}</span>
        <h2 className="mono text-sm font-bold text-ink-bright uppercase tracking-[0.14em]">{title}</h2>
        {note && <span className="ml-auto label hidden sm:block">{note}</span>}
    </div>
);

/** Big readout: value on top, unit label under it. */
export const Readout = ({ value, label, tone = 'text-ink-bright', delta, sub }) => (
    <div>
        <div className={`num text-2xl md:text-[28px] font-bold leading-none ${tone}`}>
            {value}
            {delta && <span className="text-signal text-xs font-semibold ml-1.5 align-middle">{delta}</span>}
        </div>
        <div className="label mt-2">{label}</div>
        {sub && <div className="mono text-[10px] text-ink-dim mt-1">{sub}</div>}
    </div>
);

/** Inline sparkline. Points are normalised, so any scale of series works. */
export const Sparkline = ({ points = [], tone = '#3fb950', width = 72, height = 20 }) => {
    if (points.length < 2) return null;
    const max = Math.max(...points);
    const min = Math.min(...points);
    const span = max - min || 1;
    const step = width / (points.length - 1);
    const d = points
        .map((p, i) => `${i === 0 ? 'M' : 'L'}${(i * step).toFixed(1)},${(height - ((p - min) / span) * height).toFixed(1)}`)
        .join(' ');

    return (
        <svg width={width} height={height} className="shrink-0 overflow-visible" aria-hidden="true">
            <path d={d} fill="none" stroke={tone} strokeWidth="1.25" strokeLinejoin="round" strokeLinecap="round" />
        </svg>
    );
};

/** A row in a metric table: name, optional trend, value. */
export const MetricRow = ({ name, value, series, tone = '#3fb950', note }) => (
    <div className="flex items-center gap-4 py-2.5 border-b border-line last:border-0">
        <span className="mono text-xs text-ink-mute flex-1 min-w-0 truncate">{name}</span>
        {series && <Sparkline points={series} tone={tone} />}
        <span className="num text-sm font-bold text-ink-bright shrink-0">{value}</span>
        {note && <span className="mono text-[10px] shrink-0 w-12 text-right" style={{ color: tone }}>{note}</span>}
    </div>
);

/** Monospace chip for tech names. Square corners, hairline border. */
export const Tag = ({ children, tone }) => (
    <span
        className="mono text-[11px] px-2 py-1 border border-line bg-panel-2 text-ink-mute hover:text-ink-bright hover:border-line-bright transition-colors"
        style={tone ? { color: tone, borderColor: `${tone}33` } : undefined}
    >
        {children}
    </span>
);

/** Status pill: OK / WARN / INCOMING etc. */
export const Status = ({ tone = 'signal', children }) => {
    const tones = {
        signal: 'text-signal border-signal/30 bg-signal/5',
        warn: 'text-warn border-warn/30 bg-warn/5',
        info: 'text-info border-info/30 bg-info/5',
        accent: 'text-accent border-accent/30 bg-accent/5',
        mute: 'text-ink-mute border-line bg-panel-2',
    };
    return (
        <span className={`mono text-[10px] font-bold uppercase tracking-[0.1em] px-2 py-1 border ${tones[tone] ?? tones.mute}`}>
            {children}
        </span>
    );
};
