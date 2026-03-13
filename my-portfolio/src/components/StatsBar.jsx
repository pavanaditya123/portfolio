import React from 'react';
import useCounter from '../hooks/useCounter';

const StatsBar = () => {
    const [lc, lcRef] = useCounter(500, 1500);
    const [apis, apisRef] = useCounter(15, 1200);
    const [cgpa, cgpaRef] = useCounter(866, 1500);

    const stats = [
        { label: 'LeetCode Problems', value: `${lc}+`, ref: lcRef, color: 'text-cyan-400' },
        { label: 'REST APIs Built', value: `${apis}+`, ref: apisRef, color: 'text-purple-400' },
        { label: 'CGPA', value: (cgpa / 100).toFixed(2), ref: cgpaRef, color: 'text-emerald-400' },
        { label: 'AI Internship', value: '1', ref: null, color: 'text-amber-400' },
    ];

    return (
        <div className="animate-fadeInUp delay-800 grid grid-cols-2 md:grid-cols-4 gap-4 mt-16 pt-10 border-t border-white/5">
            {stats.map((s, i) => (
                <div key={i} ref={s.ref} className="text-center group">
                    <div className={`text-3xl md:text-4xl font-black ${s.color} group-hover:scale-110 transition-transform`}>{s.value}</div>
                    <div className="text-sm text-slate-500 mt-1 font-medium">{s.label}</div>
                </div>
            ))}
        </div>
    );
};

export default StatsBar;
