import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { Panel } from './ui';
import { achievements, certifications } from '../data/profile';

const Achievements = () => (
    <section className="py-14 reveal-section section-hidden">
        <div className="grid lg:grid-cols-2 gap-3">
            <Panel label="signals" bodyClass="p-0">
                {achievements.map((a) => (
                    <div key={a.text} className="px-5 py-4 border-b border-line last:border-0">
                        <p className="text-sm text-ink leading-relaxed">
                            {a.highlight && a.text.includes(a.highlight) ? (
                                <>
                                    {a.text.split(a.highlight)[0]}
                                    <span className="num text-signal font-bold">{a.highlight}</span>
                                    {a.text.split(a.highlight).slice(1).join(a.highlight)}
                                </>
                            ) : (
                                a.text
                            )}
                        </p>
                        {a.link && (
                            <a
                                href={a.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mono text-[11px] text-ink-mute hover:text-signal transition-colors inline-flex items-center mt-2.5"
                            >
                                verify <ArrowUpRight size={12} className="ml-1" />
                            </a>
                        )}
                    </div>
                ))}
            </Panel>

            <Panel label="certifications" meta={`${certifications.length}`} bodyClass="p-0">
                {certifications.map((c) => (
                    <div
                        key={c.title}
                        className="px-5 py-4 border-b border-line last:border-0 flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-5"
                    >
                        <span className="text-sm text-ink-bright">{c.title}</span>
                        {/* Long issuers ("takeUforward (Raj Vikramaditya)") blow out a
                            narrow row, so they stack under the title on phones. */}
                        <span className="mono text-[10px] text-ink-dim sm:text-right min-w-0">{c.issuer}</span>
                    </div>
                ))}
            </Panel>
        </div>
    </section>
);

export default Achievements;
