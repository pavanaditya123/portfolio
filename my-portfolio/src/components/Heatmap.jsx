import React, { useMemo } from 'react';
import { computeStreaks } from '../lib/codingStats';

/**
 * GitHub-style activity grid.
 *
 * Takes a dense run of { date, count } days and lays them out in week columns
 * of seven, padded so every column starts on a Sunday. Intensity is bucketed
 * against the busiest day in the range rather than fixed thresholds, so a
 * quiet year still produces a readable gradient instead of a flat wash.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const PALETTE = {
    emerald: ['#11161e', '#0e4429', '#006d32', '#26a641', '#3fb950'],
    amber: ['#11161e', '#4d3308', '#8a5a06', '#c18a0b', '#d29922'],
    indigo: ['#11161e', '#122c4d', '#1f4f8f', '#2f6fc4', '#58a6ff'],
};

function toWeeks(days) {
    if (!days.length) return [];
    const weeks = [];
    let column = [];

    // Pad so the first column lines up with the correct weekday row.
    const firstDay = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
    for (let i = 0; i < firstDay; i += 1) column.push(null);

    for (const day of days) {
        column.push(day);
        if (column.length === 7) {
            weeks.push(column);
            column = [];
        }
    }
    if (column.length) {
        while (column.length < 7) column.push(null);
        weeks.push(column);
    }
    return weeks;
}

export default function Heatmap({ days = [], accent = 'emerald', label = 'contributions', showSummary = true }) {
    const { weeks, level, stats, monthMarks } = useMemo(() => {
        const safe = Array.isArray(days) ? days : [];
        const built = toWeeks(safe);
        const peak = safe.reduce((m, d) => Math.max(m, d.count), 0);

        // Four buckets scaled to the busiest day in the window.
        const levelOf = (count) => {
            if (count <= 0) return 0;
            if (peak <= 4) return Math.min(count, 4);
            const ratio = count / peak;
            if (ratio <= 0.25) return 1;
            if (ratio <= 0.5) return 2;
            if (ratio <= 0.75) return 3;
            return 4;
        };

        // One label per month, placed on the column where that month starts.
        const marks = [];
        let lastMonth = -1;
        built.forEach((week, i) => {
            const first = week.find(Boolean);
            if (!first) return;
            const month = new Date(`${first.date}T00:00:00Z`).getUTCMonth();
            if (month !== lastMonth) {
                lastMonth = month;
                marks.push({ index: i, name: MONTHS[month] });
            }
        });

        return {
            weeks: built,
            level: levelOf,
            stats: computeStreaks(safe),
            monthMarks: marks,
        };
    }, [days]);

    if (!weeks.length) return null;

    const colors = PALETTE[accent] ?? PALETTE.emerald;

    return (
        <div>
            {showSummary && (
            <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2 mb-4">
                <p className="mono text-xs text-ink-mute">
                    <span className="num text-ink-bright font-bold">{stats.total.toLocaleString()}</span>{' '}
                    {label} · last 365d
                </p>
                <div className="flex items-center gap-5 mono text-[11px] text-ink-dim">
                    <span>
                        <span className="num text-ink font-bold">{stats.active}</span> active
                    </span>
                    <span>
                        <span className="num text-ink font-bold">{stats.longest}</span> streak
                    </span>
                </div>
            </div>
            )}

            {/* The grid is wider than a phone, so it scrolls on its own axis
                rather than pushing the page sideways. */}
            <div className="overflow-x-auto pb-1">
                <div className="inline-block min-w-full">
                    <div
                        className="grid gap-[3px] mb-1.5 mono text-[9px] text-ink-dim"
                        style={{ gridTemplateColumns: `repeat(${weeks.length}, 11px)` }}
                    >
                        {weeks.map((_, i) => {
                            const mark = monthMarks.find((m) => m.index === i);
                            return (
                                <span key={i} className="whitespace-nowrap">
                                    {mark ? mark.name : ''}
                                </span>
                            );
                        })}
                    </div>

                    <div className="flex gap-[3px]">
                        {weeks.map((week, wi) => (
                            <div key={wi} className="flex flex-col gap-[3px]">
                                {week.map((day, di) => (
                                    <div
                                        key={di}
                                        title={day ? `${day.count} on ${day.date}` : undefined}
                                        className="w-[11px] h-[11px]  transition-colors"
                                        style={{
                                            backgroundColor: day ? colors[level(day.count)] : 'transparent',
                                            outline: day && day.count > 0 ? '1px solid rgba(255,255,255,0.04)' : 'none',
                                            outlineOffset: '-1px',
                                        }}
                                    />
                                ))}
                            </div>
                        ))}
                    </div>

                    <div className="flex items-center justify-end gap-1.5 mt-3 mono text-[9px] text-ink-dim">
                        <span className="mr-0.5">Less</span>
                        {colors.map((c) => (
                            <span
                                key={c}
                                className="w-[11px] h-[11px] "
                                style={{ backgroundColor: c }}
                            />
                        ))}
                        <span className="ml-0.5">More</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
