import React from 'react';
import { SectionHeader, Panel, Readout } from './ui';
import { education } from '../data/profile';

const About = () => (
    <section id="about" className="py-14 reveal-section section-hidden">
        <SectionHeader index="05" title="Readme" note="about" />

        <div className="grid lg:grid-cols-3 gap-3">
            <Panel label="manifest" className="lg:col-span-2" bodyClass="p-5 md:p-6">
                <div className="space-y-4 text-sm text-ink leading-relaxed">
                    <p>
                        I work on backend and distributed systems — the parts that decide
                        whether a service stays up when traffic is real. The pattern is the
                        same across everything below: split the monolith when scaling demands
                        it, move to Kafka when synchronous calls become the bottleneck, cache
                        in Redis when reads get slow.
                    </p>
                    <p>
                        On the AI side I care about measurement over demos. At Handshake AI I
                        design benchmarks that test whether coding agents can actually find
                        root causes; at Swarmlens I cut a pipeline's hallucination rate by
                        ~55% by splitting it into verifiable stages. My RAG work is scored
                        with RAGAS, not vibes.
                    </p>
                    <p className="text-ink-mute">
                        Every figure on this page is fetched live from the source platform.
                        Nothing is typed in by hand.
                    </p>
                </div>
            </Panel>

            <Panel label="education" status="#3fb950" bodyClass="p-5 md:p-6">
                <div className="space-y-5">
                    <div>
                        <h3 className="mono text-sm font-bold text-ink-bright leading-snug">
                            {education.school}
                        </h3>
                        <p className="mono text-[11px] text-ink-mute mt-2 leading-relaxed">
                            {education.degree}
                        </p>
                    </div>
                    <div className="pt-5 border-t border-line grid grid-cols-2 gap-4">
                        <Readout value={education.cgpa.split(' ')[0]} label="cgpa" tone="text-signal" />
                        <Readout value="2027" label="graduating" tone="text-ink-bright" />
                    </div>
                    <div className="mono text-[11px] text-ink-dim pt-4 border-t border-line">
                        {education.location}
                    </div>
                </div>
            </Panel>
        </div>
    </section>
);

export default About;
