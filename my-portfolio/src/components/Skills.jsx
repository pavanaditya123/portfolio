import React from 'react';
import { Terminal, Code2, Database, BrainCircuit } from 'lucide-react';
import { SectionHeader, SkillCategory } from './ui';

const Skills = () => {
    return (
        <section id="skills" className="py-24 reveal-section section-hidden">
            <SectionHeader title="Technical Skills" />
            <div className="grid md:grid-cols-2 gap-6">

                <SkillCategory
                    icon={<Terminal size={22} className="text-cyan-400" />}
                    title="Languages"
                    colorClass="hover:border-cyan-500/50"
                    skills={['Python', 'NumPy', 'Pandas', 'C++', 'Java', 'JavaScript', 'C']}
                />

                <SkillCategory
                    icon={<BrainCircuit size={22} className="text-purple-400" />}
                    title="Machine Learning & NLP"
                    colorClass="hover:border-purple-500/50"
                    skills={['Scikit-Learn', 'Perceptron', 'Tokenization', 'Regex', 'N-grams', 'Bigrams']}
                />

                <SkillCategory
                    icon={<Code2 size={22} className="text-blue-400" />}
                    title="Web Development"
                    colorClass="hover:border-blue-500/50"
                    skills={['React', 'Redux', 'Node.js', 'Express.js', 'Tailwind CSS', 'HTML5', 'CSS', 'Daisy UI']}
                />

                <SkillCategory
                    icon={<Database size={22} className="text-emerald-400" />}
                    title="Databases & Tools"
                    colorClass="hover:border-emerald-500/50"
                    skills={['MongoDB', 'MySQL', 'Git', 'Inngest', 'Stream SDK', 'OpenAI API', 'AWS (EC2, SES)']}
                />

            </div>
        </section>
    );
};

export default Skills;
