import React from 'react';
import { BookOpen, MapPin, Calendar, Award } from 'lucide-react';
import { SectionHeader } from './ui';

const About = () => {
    return (
        <section id="about" className="py-24 relative reveal-section section-hidden">
            <SectionHeader title="About Me" />
            <div className="grid lg:grid-cols-5 gap-12 items-start">
                <div className="lg:col-span-3 space-y-6 text-slate-400 leading-relaxed text-lg">
                    <p>
                        I'm a B.Tech Computer Science & Engineering (AI/ML) student at Manipal Institute of Technology. I enjoy building full-stack MERN applications and finding practical ways to integrate AI features into them.
                    </p>
                    <p>
                        So far, I've worked on projects ranging from AI-assisted interview platforms to developer networking tools. I've gained hands-on experience handling the frontend, backend, REST APIs, and databases. I also frequently use LLMs for things like text summaries, handling embeddings, and building search features.
                    </p>
                    <p>
                        Outside of web development, I spend time strengthening my fundamentals in Data Structures and Algorithms, Object-Oriented Programming, and Database Systems. Currently, I'm looking for a Software Development internship to apply what I've learned to real-world projects.
                    </p>
                </div>

                <div className="lg:col-span-2 space-y-8">
                    <div className="bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800/80 p-8 rounded-3xl relative overflow-hidden group hover:border-indigo-500/50 transition-colors duration-500">
                        <div className="absolute -top-20 -right-20 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl group-hover:bg-indigo-500/20 transition-all duration-500"></div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                            <BookOpen className="mr-3 text-indigo-400" size={24} /> Education
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="text-lg font-bold text-slate-200">Manipal Institute of Technology</h4>
                                <p className="text-indigo-400 font-medium mt-1">B.Tech in Computer Science & Engineering (AI/ML)</p>
                            </div>
                            <div className="flex flex-col gap-y-3 mt-4 bg-slate-900/50 p-4 rounded-2xl border border-slate-800">
                                <div className="flex items-center text-sm text-slate-400">
                                    <MapPin size={16} className="mr-3 text-slate-500" /> Bangalore, India
                                </div>
                                <div className="flex items-center text-sm text-slate-400">
                                    <Calendar size={16} className="mr-3 text-slate-500" /> 2023 – 2027
                                </div>
                                <div className="flex items-center text-sm text-white font-bold">
                                    <Award size={16} className="mr-3 text-yellow-500" /> CGPA: 8.66
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default About;
