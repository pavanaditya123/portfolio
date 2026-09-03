import React, { useState } from 'react';
import { RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';

import { handles, links } from '../data/profile';
import useCodingStats from '../hooks/useCodingStats';
import useCountUp from '../hooks/useCountUp';
import { computeStreaks } from '../lib/codingStats';
import { SectionHeader, Panel, Readout, MetricRow } from './ui';
import Heatmap from './Heatmap';

const AnimatedNumber = ({ value, className = '' }) => {
    const shown = useCountUp(value);
    return <span className={className}>{shown.toLocaleString()}</span>;
};

const Loading = () => (
    <div className="mono text-xs text-ink-dim py-6">
        <span className="text-signal">›</span> fetching…
    </div>
);

const Unavailable = ({ href }) => (
    <div className="flex items-start gap-2.5 py-6 mono text-xs text-ink-dim">
        <AlertCircle size={14} className="shrink-0 mt-px text-warn" />
        <span>
            upstream unreachable ·{' '}
            {href && (
                <a href={href} target="_blank" rel="noopener noreferrer" className="text-info hover:underline">
                    open profile
                </a>
            )}
        </span>
    </div>
);

const External = ({ href, children }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mono text-[11px] text-ink-mute hover:text-signal transition-colors inline-flex items-center"
    >
        {children} <ArrowUpRight size={12} className="ml-1" />
    </a>
);

/* -------------------------------- cards --------------------------------- */

const LeetCodeCard = ({ nonce }) => {
    const state = useCodingStats('leetcode', handles.leetcode, nonce);
    // Contest history sits on a slower host, so it loads independently.
    const contest = useCodingStats('leetcodeContest', handles.leetcode, nonce);
    if (state.status === 'disabled') return null;
    const d = state.data;
    const c = contest.data;

    return (
        <Panel
            label="leetcode"
            meta={state.stale ? 'cached' : `@${handles.leetcode}`}
            status="live"
            bodyClass="p-5 md:p-6"
        >
            {state.status === 'loading' && <Loading />}
            {state.status === 'error' && <Unavailable href={links.leetcode} />}

            {d && (
                <>
                    <div className="flex flex-wrap items-end gap-x-12 gap-y-5 mb-6 pb-6 border-b border-line">
                        <div>
                            <AnimatedNumber
                                value={d.totalSolved}
                                className="num text-5xl font-extrabold text-signal leading-none"
                            />
                            <div className="label mt-2.5">problems solved</div>
                        </div>
                        {d.ranking > 0 && (
                            <Readout value={`#${d.ranking.toLocaleString()}`} label="global rank" tone="text-ink-bright" />
                        )}
                    </div>

                    <div className="mb-6">
                        <MetricRow name="easy" value={`${d.easy.solved} / ${d.easy.total}`} tone="#3fb950"
                            note={`${Math.round((d.easy.solved / (d.easy.total || 1)) * 100)}%`} />
                        <MetricRow name="medium" value={`${d.medium.solved} / ${d.medium.total}`} tone="#d29922"
                            note={`${Math.round((d.medium.solved / (d.medium.total || 1)) * 100)}%`} />
                        <MetricRow name="hard" value={`${d.hard.solved} / ${d.hard.total}`} tone="#f85149"
                            note={`${Math.round((d.hard.solved / (d.hard.total || 1)) * 100)}%`} />
                    </div>

                    {c && (
                        <div className="mb-6 pb-6 border-b border-line">
                            <div className="label mb-4">contest</div>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
                                <Readout value={c.rating.toLocaleString()} label="rating" tone="text-warn" />
                                <Readout value={c.attended} label="attended" tone="text-ink-bright" />
                                <Readout value={`#${c.globalRanking.toLocaleString()}`} label="rank"
                                    tone="text-ink-bright" sub={`of ${c.totalParticipants.toLocaleString()}`} />
                                <Readout value={`${c.topPercentage}%`} label="percentile" tone="text-signal" />
                            </div>
                        </div>
                    )}

                    {d.calendar?.length > 0 && (
                        <div className="mb-5">
                            <Heatmap days={d.calendar} accent="amber" label="submissions" />
                        </div>
                    )}

                    <External href={links.leetcode}>view profile</External>
                </>
            )}
        </Panel>
    );
};

const GitHubCard = ({ nonce }) => {
    const state = useCodingStats('github', handles.github, nonce);
    if (state.status === 'disabled') return null;
    const d = state.data;
    // Stars and followers are zero for most students; consistency reads better.
    const activity = computeStreaks(d?.contributions ?? []);

    return (
        <Panel
            label="github"
            meta={state.stale ? 'cached' : `@${handles.github}`}
            status="live"
            bodyClass="p-5 md:p-6"
        >
            {state.status === 'loading' && <Loading />}
            {state.status === 'error' && <Unavailable href={links.github} />}

            {d && (
                <>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 mb-6 pb-6 border-b border-line">
                        <Readout value={d.contributionTotal.toLocaleString()} label="contributions" tone="text-signal" />
                        <Readout value={d.repos} label="public repos" tone="text-info" />
                        <Readout value={activity.active} label="active days" tone="text-ink-bright" />
                        <Readout value={activity.longest} label="longest streak" tone="text-accent" />
                    </div>

                    {d.contributions?.length > 0 && (
                        <div className="mb-6">
                            <Heatmap days={d.contributions} accent="emerald" label="contributions" showSummary={false} />
                        </div>
                    )}

                    {d.languages.length > 0 && (
                        <div className="mb-5 pt-5 border-t border-line">
                            <div className="label mb-3.5">languages by repo count</div>
                            {d.languages.map((l) => (
                                <MetricRow key={l.name} name={l.name} value={l.count} tone="#58a6ff" />
                            ))}
                        </div>
                    )}

                    <External href={links.github}>view profile</External>
                </>
            )}
        </Panel>
    );
};

const CF_RANK_TONE = (rank = '') => {
    const r = rank.toLowerCase();
    if (r.includes('grandmaster') || r.includes('legendary')) return 'text-crit';
    if (r.includes('master')) return 'text-warn';
    if (r.includes('candidate')) return 'text-accent';
    if (r.includes('expert')) return 'text-info';
    if (r.includes('specialist')) return 'text-signal';
    if (r.includes('pupil')) return 'text-signal';
    return 'text-ink-mute';
};

const CodeforcesCard = ({ nonce }) => {
    const state = useCodingStats('codeforces', handles.codeforces, nonce);
    if (state.status === 'disabled') return null;
    const d = state.data;

    return (
        <Panel label="codeforces" meta={handles.codeforces ? `@${handles.codeforces}` : null} status="live" bodyClass="p-5 md:p-6">
            {state.status === 'loading' && <Loading />}
            {state.status === 'error' && <Unavailable href={links.codeforces} />}
            {d && (
                <>
                    <div className="flex flex-wrap items-end gap-x-10 gap-y-5 mb-6 pb-6 border-b border-line">
                        <div>
                            <AnimatedNumber value={d.rating} className="num text-5xl font-extrabold text-info leading-none" />
                            <div className="label mt-2.5">rating</div>
                        </div>
                        {d.rank && (
                            <div className={`mono text-xs font-bold uppercase tracking-[0.1em] ${CF_RANK_TONE(d.rank)}`}>
                                {d.rank}
                            </div>
                        )}
                    </div>
                    <div className="grid grid-cols-2 gap-5 mb-5">
                        <Readout value={d.maxRating.toLocaleString()} label="peak rating" tone="text-warn" />
                        <Readout value={d.solved} label="solved" tone="text-ink-bright" />
                    </div>
                    <External href={links.codeforces}>view profile</External>
                </>
            )}
        </Panel>
    );
};

const GFGCard = ({ nonce }) => {
    const state = useCodingStats('geeksforgeeks', handles.geeksforgeeks, nonce);
    if (state.status === 'disabled') return null;
    const d = state.data;

    return (
        <Panel label="geeksforgeeks" meta={handles.geeksforgeeks ? `@${handles.geeksforgeeks}` : null} status="live" bodyClass="p-5 md:p-6">
            {state.status === 'loading' && <Loading />}
            {state.status === 'error' && <Unavailable href={links.geeksforgeeks} />}
            {d && (
                <>
                    <div className="grid grid-cols-2 gap-5 mb-6 pb-6 border-b border-line">
                        <Readout value={d.totalSolved.toLocaleString()} label="solved" tone="text-signal" />
                        {d.codingScore > 0 && <Readout value={d.codingScore.toLocaleString()} label="coding score" tone="text-ink-bright" />}
                    </div>
                    <div className="mb-5">
                        {d.school > 0 && <MetricRow name="school" value={d.school} tone="#6e7781" />}
                        {d.basic > 0 && <MetricRow name="basic" value={d.basic} tone="#3fb950" />}
                        {d.easy > 0 && <MetricRow name="easy" value={d.easy} tone="#3fb950" />}
                        {d.medium > 0 && <MetricRow name="medium" value={d.medium} tone="#d29922" />}
                        {d.hard > 0 && <MetricRow name="hard" value={d.hard} tone="#f85149" />}
                    </div>
                    <External href={links.geeksforgeeks}>view profile</External>
                </>
            )}
        </Panel>
    );
};

/* ------------------------------- section -------------------------------- */

const CodingProfiles = () => {
    const [nonce, setNonce] = useState(0);
    const [spinning, setSpinning] = useState(false);

    const refresh = () => {
        setSpinning(true);
        setNonce((n) => n + 1);
        setTimeout(() => setSpinning(false), 900);
    };

    return (
        <section id="coding" className="py-14 reveal-section section-hidden">
            <div className="flex items-baseline gap-4 mb-6 border-b border-line pb-3">
                <span className="mono text-signal text-xs font-bold">05</span>
                <h2 className="mono text-sm font-bold text-ink-bright uppercase tracking-[0.14em]">
                    Live telemetry
                </h2>
                <div className="ml-auto flex items-center gap-3">
                    <span className="mono text-[10px] text-signal flex items-center gap-2">
                        <span className="dot dot-live" /> POLLING
                    </span>
                    <button
                        onClick={refresh}
                        className="text-ink-dim hover:text-signal transition-colors p-1"
                        aria-label="Refresh stats"
                        title="Refresh"
                    >
                        <RefreshCw size={13} className={spinning ? 'animate-spin' : ''} />
                    </button>
                </div>
            </div>

            <p className="mono text-[11px] text-ink-dim mb-5 leading-relaxed">
                fetched from each platform on load · cached 6h · falls back to last good response
            </p>

            <div className="space-y-3">
                <LeetCodeCard nonce={nonce} />
                <GitHubCard nonce={nonce} />
                <div className="grid md:grid-cols-2 gap-3">
                    <CodeforcesCard nonce={nonce} />
                    <GFGCard nonce={nonce} />
                </div>
            </div>
        </section>
    );
};

export default CodingProfiles;
