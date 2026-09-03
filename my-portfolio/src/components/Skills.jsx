import React from 'react';
import { SectionHeader, Panel, Tag } from './ui';
import { skills } from '../data/profile';

const TONE = {
    indigo: '#58a6ff',
    cyan: '#3fb950',
    purple: '#bc8cff',
    emerald: '#3fb950',
    amber: '#d29922',
};

const Skills = () => (
    <section id="skills" className="py-14 reveal-section section-hidden">
        <SectionHeader index="04" title="Capability matrix" note={`${skills.length} groups`} />

        <Panel label="stack" bodyClass="p-0">
            {skills.map((group) => (
                <div
                    key={group.title}
                    className="grid md:grid-cols-4 gap-4 px-5 py-4 border-b border-line last:border-0"
                >
                    <div className="label pt-1" style={{ color: TONE[group.color] }}>
                        {group.title}
                    </div>
                    <div className="md:col-span-3 flex flex-wrap gap-1.5">
                        {group.items.map((item) => (
                            <Tag key={item}>{item}</Tag>
                        ))}
                    </div>
                </div>
            ))}
        </Panel>
    </section>
);

export default Skills;
