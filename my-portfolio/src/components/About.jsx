import React from 'react';
import { SectionHeader, Panel, Readout } from './ui';
import { education } from '../data/profile';

const About = () => (
    <section id="about" className="py-14 reveal-section section-hidden">
        <SectionHeader index="01" title="Readme" note="about" />

        <div className="grid lg:grid-cols-3 gap-3">
            <Panel label="manifest" className="lg:col-span-2" bodyClass="p-5 md:p-6">
                <div className="space-y-4 text-sm text-ink leading-relaxed">
                    <p>
                        B.Tech Computer Science &amp; Engineering (AI/ML) student at Manipal
                        Institute of Technology, working mostly on backend and distributed
                        systems — the parts that decide whether a service stays up when traffic
                        is real.
                    </p>
                    <p>
                        At <span className="text-ink-bright font-medium">Handshake AI</span> I design
                        benchmarks that test whether AI coding agents can find root causes, which
                        mostly means writing failing systems on purpose and verifying that fixes
                        hold. Before that, at <span className="text-ink-bright font-medium">Swarmlens</span>,
                        I split a meeting-processing pipeline into specialized components and cut
                        its measured hallucination rate by about 55%.
                    </p>
                    <p>
                        My projects follow the same pattern: break a monolith into services when
                        scaling demands it, add Kafka and Saga when synchronous calls become the
                        bottleneck, cache in Redis when reads get slow. On the AI side I care about
                        measurement — RAGAS evaluation, benchmarking harnesses, numbers I can
                        defend rather than a demo that happened to work once.
                    </p>
                    <p className="text-ink-mute">
                        Every figure on this page is fetched live from the source platform. Nothing
                        is typed in by hand.
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
