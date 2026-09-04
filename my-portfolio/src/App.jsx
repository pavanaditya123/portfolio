import React, { useState, useEffect } from 'react';
import { ArrowUp } from 'lucide-react';

import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Experience from './components/Experience';
import Projects from './components/Projects';
import Skills from './components/Skills';
import CodingProfiles from './components/CodingProfiles';
import Achievements from './components/Achievements';
import Resume from './components/Resume';
import Contact from './components/Contact';
import ConsoleBackground from './components/ConsoleBackground';
import BootSequence from './components/BootSequence';
import Crosshair from './components/Crosshair';
import CommandPalette from './components/CommandPalette';
import AIChatbot from './AIChatbot';

const App = () => {
    const [activeSection, setActiveSection] = useState('home');
    const [showBackToTop, setShowBackToTop] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const handleScroll = () => {
            const sections = document.querySelectorAll('section');
            let current = '';
            sections.forEach((section) => {
                // Achievements has no id; skipping it keeps the previous
                // section highlighted instead of clearing the nav.
                const id = section.getAttribute('id');
                if (id && window.scrollY >= section.offsetTop - 250) {
                    current = id;
                }
            });
            setActiveSection(current);
            setShowBackToTop(window.scrollY > 500);

            const scrollable = document.body.scrollHeight - window.innerHeight;
            setProgress(scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0);
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll();
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('section-visible');
                        entry.target.classList.remove('section-hidden');
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -50px 0px' },
        );
        document.querySelectorAll('.reveal-section').forEach((el) => observer.observe(el));
        return () => observer.disconnect();
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            window.scrollTo({ top: element.offsetTop - 80, behavior: 'smooth' });
        }
        setMobileMenuOpen(false);
    };

    return (
        <div className="min-h-screen relative">
            <BootSequence />
            <ConsoleBackground />
            <Crosshair />
            <CommandPalette scrollToSection={scrollToSection} />
            <div className="scroll-rail" style={{ width: `${progress}%` }} aria-hidden="true" />

            <Navbar
                activeSection={activeSection}
                mobileMenuOpen={mobileMenuOpen}
                setMobileMenuOpen={setMobileMenuOpen}
                scrollToSection={scrollToSection}
            />

            <main className="max-w-5xl mx-auto px-5 pt-20 pb-12 relative z-10">
                <Hero scrollToSection={scrollToSection} />
                <About />
                <Experience />
                <Projects />
                <Skills />
                <CodingProfiles />
                <Achievements />
                <Resume />
                <Contact />
            </main>

            <button
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className={`fixed bottom-6 right-6 p-2.5 border border-line-bright bg-panel text-ink-mute hover:text-signal hover:border-signal transition-all z-50 ${showBackToTop ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                aria-label="Back to top"
            >
                <ArrowUp size={16} />
            </button>

            <AIChatbot />
        </div>
    );
};

export default App;
