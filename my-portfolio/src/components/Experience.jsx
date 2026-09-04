import React from 'react';
import { SectionHeader, Panel, Tag, Status } from './ui';
import { experience } from '../data/profile';

/**
 * Experience rendered as a deployment log: each role is an entry with a state
 * (INCOMING / ACTIVE / RESOLVED) rather than a timeline card.
 */

const stateOf = (job) => {
    if (job.upcoming) return { tone: 'accent', text: 'incoming' };
    if (job.current) return { tone: 'signal', text: 'active' };
    return { tone: 'mute', text: 'resolved' };
};

const Experience = () => (
    <section id="experience" className="py-14 reveal-section section-hidden">
        <SectionHeader index="01" title="Deployment log" note={`${experience.length} entries`} />

        <div className="space-y-3">
            {experience.map((job) => {
                const state = stateOf(job);
                return (
                    <Panel
                        key={`${job.company}-${job.period}`}
                        label={job.company}
                        meta={job.location}
                        status={job.upcoming ? '#bc8cff' : job.current ? 'live' : '#4a515c'}
                        bodyClass="p-5 md:p-6"
                    >
                        <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                            <div className="flex items-center gap-3 flex-wrap">
                                <h3 className="mono text-sm font-bold text-ink-bright">{job.role}</h3>
                                <Status tone={state.tone}>{state.text}</Status>
                            </div>
                            <span className="mono text-[11px] text-ink-dim">{job.period}</span>
                        </div>

                        <ul className="space-y-3">
                            {job.points.map((p, i) => (
                                <li key={i} className="flex gap-3 text-sm text-ink leading-relaxed">
                                    <span className="mono text-ink-dim shrink-0 text-[11px] pt-1">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span>{p}</span>
                                </li>
                            ))}
                        </ul>

                        {job.stack?.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mt-5 pt-5 border-t border-line">
                                {job.stack.map((t) => (
                                    <Tag key={t}>{t}</Tag>
                                ))}
                            </div>
                        )}
                    </Panel>
                );
            })}
        </div>
    </section>
);

export default Experience;
