import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { SectionHeader, Panel, Tag, Readout } from './ui';
import { projects, links } from '../data/profile';
import ServiceTopology from './ServiceTopology';

const TONE = {
    indigo: 'text-info',
    cyan: 'text-signal',
    purple: 'text-accent',
};

const Projects = () => (
    <section id="projects" className="py-14 reveal-section section-hidden">
        <SectionHeader index="02" title="Services" note={`${projects.length} deployed`} />

        <div className="space-y-3">
            {projects.map((p, idx) => {
                const repoUrl = `${links.github}/${p.repo}`;
                return (
                    <Panel
                        key={p.title}
                        label={`svc/${p.repo}`}
                        meta={`0${idx + 1}`}
                        status="live"
                        bodyClass="p-5 md:p-6"
                    >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                            <h3 className={`text-lg font-bold ${TONE[p.accent] ?? 'text-ink-bright'}`}>
                                {p.title}
                            </h3>
                            <a
                                href={repoUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mono text-[11px] text-ink-mute hover:text-signal transition-colors flex items-center shrink-0"
                            >
                                source <ArrowUpRight size={13} className="ml-1" />
                            </a>
                        </div>

                        {p.metrics?.length > 0 && (
                            <div className="flex flex-wrap gap-x-10 gap-y-4 mb-6 pb-6 border-b border-line">
                                {p.metrics.map((m) => (
                                    <Readout key={m.label} value={m.value} label={m.label} tone="text-ink-bright" />
                                ))}
                            </div>
                        )}

                        {/* The streaming backend is the one project whose story is
                            architectural, so it gets the topology drawing. */}
                        {p.repo === 'streaming_backend_netflix' && (
                            <div className="mb-6 pb-6 border-b border-line">
                                <div className="label mb-4">topology</div>
                                <ServiceTopology />
                            </div>
                        )}

                        <ul className="space-y-3 mb-6">
                            {p.points.map((point, i) => (
                                <li key={i} className="flex gap-3 text-sm text-ink leading-relaxed">
                                    <span className="text-ink-dim shrink-0 mono text-[11px] pt-1">
                                        {String(i + 1).padStart(2, '0')}
                                    </span>
                                    <span>{point}</span>
                                </li>
                            ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5">
                            {p.stack.map((tech) => (
                                <Tag key={tech}>{tech}</Tag>
                            ))}
                        </div>
                    </Panel>
                );
            })}
        </div>
    </section>
);

export default Projects;
