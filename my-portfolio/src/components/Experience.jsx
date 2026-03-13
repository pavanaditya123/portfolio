import React from 'react';
import { SectionHeader } from './ui';

const Experience = () => {
    return (
        <section id="experience" className="py-24 reveal-section section-hidden">
            <SectionHeader title="Experience" />
            <div className="relative border-l-2 border-slate-800/80 ml-4 md:ml-0 space-y-16">

                <div className="relative pl-8 md:pl-0 group">
                    <div className="md:hidden absolute w-5 h-5 bg-[#030712] rounded-full -left-[11px] top-1 border-[4px] border-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div>

                    <div className="md:grid md:grid-cols-5 md:gap-8 items-start">
                        <div className="hidden md:block col-span-1 text-right pt-1.5 relative">
                            <span className="text-sm font-bold text-indigo-400 tracking-wider uppercase">Feb 2026 – Present</span>
                            <div className="absolute w-5 h-5 bg-[#030712] rounded-full -right-[26px] top-1 border-[4px] border-indigo-500 group-hover:scale-125 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.6)] transition-all duration-300"></div>
                        </div>

                        <div className="md:col-span-4 bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 p-8 rounded-3xl hover:bg-slate-900/80 hover:-translate-y-1 hover:border-indigo-500/30 transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/5">
                            <div className="md:hidden mb-4 text-xs font-bold text-indigo-400 tracking-wider uppercase">Feb 2026 – Present</div>
                            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-6 gap-4">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">AI Engineer Intern</h3>
                                    <p className="text-lg text-slate-400 mt-1 font-medium">Swarmlens</p>
                                </div>
                                <span className="px-4 py-1.5 bg-indigo-500/10 text-indigo-300 text-xs font-bold rounded-full border border-indigo-500/20 w-fit">Remote</span>
                            </div>
                            <ul className="space-y-4 text-slate-400 leading-relaxed">
                                <li className="flex items-start">
                                    <div className="mr-4 mt-2 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                    <span>Building Agentic RAG systems to automate complex tasks and improve decision-making.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="mr-4 mt-2 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                    <span>Implementing RAG pipelines with LLMs to fetch accurate, real-time data for AI models.</span>
                                </li>
                                <li className="flex items-start">
                                    <div className="mr-4 mt-2 w-1.5 h-1.5 bg-indigo-500 rounded-full flex-shrink-0"></div>
                                    <span>Working directly with the engineering team to build and launch real-world AI products.</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Experience;
