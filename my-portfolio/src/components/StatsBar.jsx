import React from 'react';
import useCodingStats from '../hooks/useCodingStats';
import useCountUp from '../hooks/useCountUp';
import { handles, education, experience } from '../data/profile';

/** One readout in the top-level gauge strip. */
const Gauge = ({ value, label, tone, loading, suffix = '' }) => {
    const shown = useCountUp(typeof value === 'number' ? value : 0);
    return (
        <div className="panel panel-ticks px-4 py-3.5">
            <div className={`num text-xl md:text-2xl font-bold ${tone}`}>
                {loading ? (
                    <span className="text-ink-dim">--</span>
                ) : typeof value === 'number' ? (
                    `${shown.toLocaleString()}${suffix}`
                ) : (
                    value
                )}
            </div>
            <div className="label mt-1.5">{label}</div>
        </div>
    );
};

const StatsBar = () => {
    const lc = useCodingStats('leetcode', handles.leetcode);
    const gh = useCodingStats('github', handles.github);

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-3">
            <Gauge
                value={lc.data?.totalSolved ?? 0}
                label="problems solved"
                tone="text-signal"
                loading={lc.status === 'loading'}
            />
            <Gauge
                value={gh.data?.contributionTotal ?? 0}
                label="commits / yr"
                tone="text-info"
                loading={gh.status === 'loading'}
            />
            <Gauge value={education.cgpa.split(' ')[0]} label="cgpa" tone="text-accent" />
            <Gauge value={String(experience.length)} label="engineering roles" tone="text-warn" />
        </div>
    );
};

export default StatsBar;
