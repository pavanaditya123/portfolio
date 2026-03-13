import React from 'react';
import { Menu, X } from 'lucide-react';

const NAV_ITEMS = ['Home', 'About', 'Experience', 'Projects', 'Skills', 'Contact'];

const Navbar = ({ activeSection, mobileMenuOpen, setMobileMenuOpen, scrollToSection }) => {
    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-[#030712]/80 backdrop-blur-xl border-b border-white/5 transition-all duration-300">
            <div className="max-w-6xl mx-auto px-6">
                <div className="flex items-center justify-between h-20">
                    <span
                        className="text-2xl font-black tracking-tighter bg-gradient-to-r from-indigo-500 via-purple-500 to-cyan-400 bg-clip-text text-transparent cursor-pointer animate-shimmer"
                        onClick={() => scrollToSection('home')}
                    >
                        Portfolio.
                    </span>

                    <div className="hidden md:flex space-x-1 bg-white/5 p-1 rounded-full border border-white/10">
                        {NAV_ITEMS.map((item) => (
                            <button
                                key={item}
                                onClick={() => scrollToSection(item.toLowerCase())}
                                className={`px-5 py-2 rounded-full text-sm font-medium transition-all duration-300 ${activeSection === item.toLowerCase()
                                    ? 'bg-white/10 text-white shadow-sm'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                {item}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        className="md:hidden text-slate-300 p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                        {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {mobileMenuOpen && (
                <div className="md:hidden bg-[#030712]/95 backdrop-blur-xl border-t border-white/5 px-6 py-4 space-y-1 animate-fadeInUp" style={{ animationDuration: '0.3s' }}>
                    {NAV_ITEMS.map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase())}
                            className={`block w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeSection === item.toLowerCase()
                                ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                }`}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
        </nav>
    );
};

export default Navbar;
