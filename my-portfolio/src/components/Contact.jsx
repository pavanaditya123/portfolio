import React from 'react';
import { Mail, Phone, Linkedin, Code2 } from 'lucide-react';

const Contact = () => {
    return (
        <section id="contact" className="py-24 border-t border-white/5 reveal-section section-hidden">
            <div className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-white/10 rounded-3xl p-12 text-center relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Let's Connect.</h2>
                <p className="text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
                    I'm currently seeking a Software Development internship to apply my skills in real-world projects. Whether you have an open position or just want to network, my inbox is open.
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-10">
                    <a href="mailto:Pavanadi88@gmail.com" className="flex items-center px-6 py-4 bg-white text-slate-900 rounded-xl font-bold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                        <Mail className="mr-3" size={20} /> Pavanadi88@gmail.com
                    </a>
                    <span className="flex items-center px-6 py-4 bg-white/5 border border-white/10 text-white rounded-xl font-medium">
                        <Phone className="mr-3 text-indigo-400" size={20} /> +91-6304702569
                    </span>
                </div>
            </div>

            <div className="pt-12 flex flex-col md:flex-row items-center justify-between text-sm text-slate-500">
                <p>© {new Date().getFullYear()} Muttavarapu Pavan Aditya.</p>
                <div className="flex space-x-8 mt-6 md:mt-0">
                    <a href="https://linkedin.com/in/pavan-aditya-75a8b8286" target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition-colors">
                        <Linkedin size={16} className="mr-2" /> LinkedIn
                    </a>
                    <a href="https://leetcode.com/u/Pavan200053/" target="_blank" rel="noreferrer" className="flex items-center hover:text-white transition-colors">
                        <Code2 size={16} className="mr-2" /> LeetCode
                    </a>
                </div>
            </div>
        </section>
    );
};

export default Contact;
