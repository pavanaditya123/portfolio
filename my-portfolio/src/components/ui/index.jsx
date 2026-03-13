import React from 'react';
import { Award, ExternalLink, BookOpen } from 'lucide-react';

export const SectionHeader = ({ title }) => (
    <div className="flex items-center mb-12">
        <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">{title}</h2>
        <div className="h-[2px] bg-gradient-to-r from-indigo-500 to-transparent w-32 ml-6"></div>
    </div>
);

export const SocialLink = ({ href, icon, title }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="p-3.5 bg-white/5 text-slate-300 rounded-xl hover:bg-white/10 hover:text-white transition-all border border-white/10 hover:border-white/20 hover:scale-110 active:scale-95 flex items-center justify-center"
        title={title}
    >
        {icon}
    </a>
);

export const SkillCategory = ({ icon, title, skills, colorClass }) => (
    <div className={`bg-slate-900/30 backdrop-blur-sm border border-slate-800/80 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl ${colorClass} group gradient-border`}>
        <h3 className="text-xl font-bold text-white mb-6 flex items-center">
            <span className="p-2.5 bg-white/5 border border-white/5 rounded-xl mr-4 group-hover:bg-white/10 group-hover:rotate-12 transition-all duration-300">
                {icon}
            </span>
            {title}
        </h3>
        <div className="flex flex-wrap gap-2.5">
            {skills.map(skill => (
                <span key={skill} className="px-4 py-2 bg-slate-950/50 text-slate-300 text-sm font-medium rounded-lg border border-slate-800/80 hover:bg-indigo-500/10 hover:text-white hover:border-indigo-500/30 hover:shadow-[0_0_10px_rgba(99,102,241,0.15)] transition-all duration-200 cursor-default">
                    {skill}
                </span>
            ))}
        </div>
    </div>
);

export const AchievementCard = ({ text, link }) => (
    <div className="flex items-start bg-slate-950/40 p-5 rounded-2xl border border-slate-800/60 hover:border-indigo-500/30 hover:shadow-lg hover:shadow-indigo-500/5 transition-all duration-300 group">
        <div className="mr-5 mt-1">
            <div className="w-10 h-10 rounded-full bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all duration-300">
                <Award size={20} className="text-indigo-400" />
            </div>
        </div>
        <div className="flex-1 pt-1">
            <p className="text-slate-300 leading-relaxed text-base">{text}</p>
            {link && (
                <a href={link} target="_blank" rel="noreferrer" className="inline-flex items-center mt-3 text-indigo-400 hover:text-indigo-300 text-sm font-bold transition-colors group/link">
                    View Profile <ExternalLink size={14} className="ml-1.5 group-hover/link:translate-x-1 group-hover/link:-translate-y-1 transition-transform" />
                </a>
            )}
        </div>
    </div>
);

export const CertBadge = ({ title, issuer }) => (
    <div className="flex flex-col bg-slate-950/40 border border-slate-800/60 px-5 py-4 rounded-2xl min-w-[220px] flex-grow hover:border-cyan-500/40 hover:bg-slate-900/60 transition-all cursor-default group">
        <span className="text-white font-bold text-base mb-1.5 group-hover:text-cyan-300 transition-colors">{title}</span>
        <span className="text-slate-400 text-sm font-medium flex items-center">
            <BookOpen size={14} className="mr-1.5 text-slate-500" /> {issuer}
        </span>
    </div>
);
