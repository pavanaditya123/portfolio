import React from 'react';
import { Menu, X, Download } from 'lucide-react';
import { RESUME_PATH } from '../data/profile';

const NAV_ITEMS = [
    ['01', 'about'], ['02', 'experience'], ['03', 'projects'],
    ['04', 'skills'], ['05', 'coding'], ['06', 'resume'], ['07', 'contact'],
];

const Navbar = ({ activeSection, mobileMenuOpen, setMobileMenuOpen, scrollToSection }) => (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/92 backdrop-blur-sm border-b border-line">
        <div className="max-w-5xl mx-auto px-5">
            <div className="flex items-center justify-between h-14">
                <button
                    className="mono text-xs font-bold text-ink-bright tracking-tight flex items-center gap-2"
                    onClick={() => scrollToSection('home')}
                >
                    <span className="dot dot-live" />
                    pavan_aditya
                </button>

                <div className="hidden lg:flex items-center gap-1">
                    {NAV_ITEMS.map(([num, item]) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item)}
                            className={`mono text-[11px] px-2.5 py-1.5 transition-colors ${activeSection === item
                                ? 'text-signal'
                                : 'text-ink-mute hover:text-ink-bright'
                                }`}
                        >
                            <span className="text-ink-dim mr-1.5">{num}</span>
                            {item}
                        </button>
                    ))}
                    <a
                        href={RESUME_PATH}
                        download
                        className="mono text-[11px] font-bold ml-3 px-3 py-1.5 border border-line-bright text-ink hover:text-signal hover:border-signal transition-colors flex items-center"
                    >
                        <Download size={12} className="mr-1.5" /> cv
                    </a>
                </div>

                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="lg:hidden text-ink-mute hover:text-ink-bright p-1.5 transition-colors"
                    aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                    aria-expanded={mobileMenuOpen}
                >
                    {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
                </button>
            </div>
        </div>

        {mobileMenuOpen && (
            <div className="lg:hidden border-t border-line bg-panel">
                {NAV_ITEMS.map(([num, item]) => (
                    <button
                        key={item}
                        onClick={() => scrollToSection(item)}
                        className={`mono text-xs w-full text-left px-5 py-3 border-b border-line transition-colors ${activeSection === item ? 'text-signal' : 'text-ink-mute'
                            }`}
                    >
                        <span className="text-ink-dim mr-2.5">{num}</span>
                        {item}
                    </button>
                ))}
                <a
                    href={RESUME_PATH}
                    download
                    className="mono text-xs font-bold flex items-center px-5 py-3 text-signal"
                >
                    <Download size={13} className="mr-2" /> download cv
                </a>
            </div>
        )}
    </nav>
);

export default Navbar;
