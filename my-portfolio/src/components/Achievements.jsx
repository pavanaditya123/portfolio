import React from 'react';
import { Award, BookOpen } from 'lucide-react';
import { AchievementCard, CertBadge } from './ui';

const Achievements = () => {
    return (
        <section className="py-24 reveal-section section-hidden">
            <div className="grid lg:grid-cols-2 gap-16">

                <div className="bg-gradient-to-b from-slate-900/50 to-transparent p-8 rounded-3xl border border-slate-800/50">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                        <Award className="mr-4 text-indigo-400" size={32} /> Achievements
                    </h3>
                    <div className="space-y-4">
                        <AchievementCard
                            text={<span>Solved <span className="text-white font-bold">500+ problems</span> on LeetCode (Rating: 1585).</span>}
                            link="https://leetcode.com/u/Pavan200053/"
                        />
                        <AchievementCard
                            text={<span>Designed an AI Meeting Intelligence System that extracted tasks and deadlines with <span className="text-white font-bold">95% accuracy</span>.</span>}
                        />
                        <AchievementCard
                            text={<span>Ranked <span className="text-white font-bold">10th college-wide</span> in Data Structures and Algorithms (DSA) problem-solving on GeeksforGeeks.</span>}
                        />
                    </div>
                </div>

                <div className="bg-gradient-to-b from-slate-900/50 to-transparent p-8 rounded-3xl border border-slate-800/50">
                    <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                        <BookOpen className="mr-4 text-cyan-400" size={32} /> Certifications
                    </h3>
                    <div className="flex flex-wrap gap-4">
                        <CertBadge title="Python Programming" issuer="Coursera" />
                        <CertBadge title="MERN Stack Web Dev" issuer="Namaste Dev" />
                        <CertBadge title="Data Structures & Algorithms" issuer="TakeUForward" />
                        <CertBadge title="Interview Preparation" issuer="Meta Coursera" />
                        <CertBadge title="Object Oriented Programming" issuer="Coursera" />
                    </div>
                </div>

            </div>
        </section>
    );
};

export default Achievements;
