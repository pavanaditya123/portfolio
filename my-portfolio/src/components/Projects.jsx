import React from 'react';
import { Github } from 'lucide-react';
import { SectionHeader } from './ui';

const Projects = () => {
    return (
        <section id="projects" className="py-24 reveal-section section-hidden">
            <SectionHeader title="Featured Projects" />
            <div className="grid lg:grid-cols-2 gap-8">

                <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 flex flex-col h-full hover:border-indigo-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 rounded-full blur-3xl group-hover:bg-cyan-500/10 transition-colors"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">Dev Tinder</h3>
                            <p className="text-slate-400 mt-1">Developer Networking Platform</p>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-xs font-bold text-slate-300">2026</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                        {['Node.js', 'Express', 'React', 'Redux', 'MongoDB', 'AWS'].map(tech => (
                            <span key={tech} className="px-3 py-1 bg-slate-950/50 text-slate-300 text-xs font-medium rounded-md border border-slate-800">{tech}</span>
                        ))}
                    </div>

                    <ul className="space-y-3 text-slate-400 text-sm flex-grow mb-8 relative z-10">
                        <li className="flex items-start"><span className="mr-3 text-indigo-500 mt-0.5 font-bold">✓</span>Built a full-stack developer networking platform with profile discovery and connection requests.</li>
                        <li className="flex items-start"><span className="mr-3 text-indigo-500 mt-0.5 font-bold">✓</span>Implemented swipe-style feed logic with pagination and request management.</li>
                        <li className="flex items-start"><span className="mr-3 text-indigo-500 mt-0.5 font-bold">✓</span>Developed 15+ REST APIs using Node.js and Express with JWT-based authentication.</li>
                        <li className="flex items-start"><span className="mr-3 text-indigo-500 mt-0.5 font-bold">✓</span>Reduced user feed API response time by <span className="text-emerald-400 font-bold mx-1">30%</span> by adding indexes on frequently queried fields.</li>
                        <li className="flex items-start"><span className="mr-3 text-indigo-500 mt-0.5 font-bold">✓</span>Deployed backend on AWS EC2 (Linux); used SES for emails and CloudWatch for logging.</li>
                    </ul>

                    <div className="mt-auto relative z-10 flex gap-4">
                        <button className="flex items-center text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                            <Github size={16} className="mr-2" /> Code
                        </button>
                    </div>
                </div>

                <div className="bg-slate-900/40 backdrop-blur-sm border border-slate-800/80 rounded-3xl p-8 flex flex-col h-full hover:border-purple-500/50 hover:-translate-y-2 hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 group relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/5 rounded-full blur-3xl group-hover:bg-purple-500/10 transition-colors"></div>

                    <div className="flex justify-between items-start mb-6 relative z-10">
                        <div>
                            <h3 className="text-2xl font-bold text-white group-hover:text-purple-300 transition-colors">Live Coding & Interview</h3>
                            <p className="text-slate-400 mt-1">Real-time Collaboration App</p>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/10 text-xs font-bold text-slate-300">2026 - Present</div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-8 relative z-10">
                        {['React', 'Node.js', 'Express', 'Stream Video', 'Inngest', 'AI'].map(tech => (
                            <span key={tech} className="px-3 py-1 bg-slate-950/50 text-slate-300 text-xs font-medium rounded-md border border-slate-800">{tech}</span>
                        ))}
                    </div>

                    <ul className="space-y-3 text-slate-400 text-sm flex-grow mb-8 relative z-10">
                        <li className="flex items-start"><span className="mr-3 text-purple-500 mt-0.5 font-bold">✓</span>Building a real-time coding and interview platform with shared code editor, video calls, and chat for two users.</li>
                        <li className="flex items-start"><span className="mr-3 text-purple-500 mt-0.5 font-bold">✓</span>Achieving under <span className="text-emerald-400 font-bold mx-1">150ms</span> video delay using Stream Video SDK; using Inngest for secure code execution.</li>
                        <li className="flex items-start"><span className="mr-3 text-purple-500 mt-0.5 font-bold">✓</span>Adding an AI helper that checks code with 10+ test cases and provides helpful hints and error explanations.</li>
                    </ul>

                    <div className="mt-auto relative z-10 flex gap-4">
                        <button className="flex items-center text-sm font-semibold text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                            <Github size={16} className="mr-2" /> Code
                        </button>
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Projects;
