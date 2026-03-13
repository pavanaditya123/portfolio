import React, { useState, useEffect } from 'react';
import { Linkedin, Mail, Code2, Download, ChevronDown } from 'lucide-react';
import { SocialLink } from './ui';
import StatsBar from './StatsBar';

const Hero = ({ scrollToSection }) => {
    const [typedText, setTypedText] = useState('');
    const [showCursor, setShowCursor] = useState(true);
    const fullText = 'Full-Stack Developer focused on AI/LLM features.';

    useEffect(() => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < fullText.length) {
                setTypedText(fullText.slice(0, i + 1));
                i++;
            } else {
                clearInterval(timer);
                setTimeout(() => setShowCursor(false), 2000);
            }
        }, 50);
        return () => clearInterval(timer);
    }, []);

    return (
        <section id="home" className="min-h-[90vh] flex flex-col justify-center py-20 relative">

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] opacity-30 pointer-events-none -z-10 flex justify-center items-center">
                <div className="absolute w-[400px] h-[400px] bg-indigo-600 rounded-full mix-blend-screen filter blur-[100px] animate-pulse"></div>
                <div className="absolute w-[300px] h-[300px] bg-cyan-500 rounded-full mix-blend-screen filter blur-[100px] translate-x-32 -translate-y-32 animate-float"></div>
                <div className="absolute w-[350px] h-[350px] bg-purple-600 rounded-full mix-blend-screen filter blur-[100px] -translate-x-32 translate-y-32"></div>
            </div>

            <div className="relative">
                <div className="animate-fadeInUp inline-flex items-center space-x-2 bg-indigo-500/10 text-indigo-300 px-4 py-2 rounded-full text-sm font-semibold mb-8 w-fit border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.2)]">
                    <span className="relative flex h-2.5 w-2.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-500"></span>
                    </span>
                    <span>Seeking Software Development Internship</span>
                </div>

                <h1 className="animate-fadeInUp delay-200 text-5xl md:text-8xl font-black text-white mb-6 tracking-tight leading-[1.1]">
                    Hi, I'm <br className="hidden md:block" />
                    <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-cyan-400 bg-clip-text text-transparent animate-shimmer">
                        Pavan Aditya
                    </span>
                </h1>

                <h2 className="animate-fadeInUp delay-400 text-2xl md:text-3xl font-medium text-slate-400 mb-8 max-w-3xl leading-snug">
                    <span className={showCursor ? 'typing-cursor' : ''}>{typedText}</span>
                </h2>

                <p className="animate-fadeInUp delay-500 text-lg text-slate-400 max-w-2xl mb-12 leading-relaxed">
                    I'm a computer science student building full-stack MERN applications. I enjoy integrating AI components—like LLMs and Agentic RAG—into everyday web tools to make them more useful.
                </p>

                <div className="animate-fadeInUp delay-600 flex flex-wrap items-center gap-5">
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="px-8 py-3.5 bg-white text-slate-950 hover:bg-indigo-50 rounded-xl font-bold transition-all hover:scale-105 active:scale-95 flex items-center shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                    >
                        Get In Touch
                    </button>
                    <button
                        onClick={() => window.print()}
                        className="px-8 py-3.5 bg-white/5 border border-white/10 hover:bg-white/10 text-white rounded-xl font-semibold transition-all hover:scale-105 active:scale-95 flex items-center"
                    >
                        <Download size={18} className="mr-2" /> Resume
                    </button>

                    <div className="flex items-center space-x-3 md:ml-4 mt-4 md:mt-0 w-full md:w-auto">
                        <SocialLink href="https://linkedin.com/in/pavan-aditya-75a8b8286" icon={<Linkedin size={22} />} />
                        <SocialLink href="mailto:Pavanadi88@gmail.com" icon={<Mail size={22} />} />
                        <SocialLink href="https://leetcode.com/u/Pavan200053/" icon={<Code2 size={22} />} title="LeetCode" />
                    </div>
                </div>

                <StatsBar />
            </div>

            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center animate-bounce text-slate-500 cursor-pointer hidden md:flex" onClick={() => scrollToSection('about')}>
                <span className="text-xs tracking-widest uppercase mb-2">Scroll</span>
                <ChevronDown size={20} />
            </div>
        </section>
    );
};

export default Hero;
