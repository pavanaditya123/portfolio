import React, { useState, useEffect } from 'react';
import { ArrowRight, Download } from 'lucide-react';
import { profile, links, contact, education, RESUME_PATH } from '../data/profile';
import { Panel, Status } from './ui';
import StatsBar from './StatsBar';
import AsciiName from './AsciiName';

const TYPE_SPEED = 52;
const ERASE_SPEED = 26;
const HOLD = 1700;

/** Types each role, holds, erases, advances. */
function useRotatingText(words) {
    const [index, setIndex] = useState(0);
    const [text, setText] = useState('');
    const [erasing, setErasing] = useState(false);

    useEffect(() => {
        const word = words[index % words.length];

        if (!erasing && text === word) {
            const hold = setTimeout(() => setErasing(true), HOLD);
            return () => clearTimeout(hold);
        }
        if (erasing && text === '') {
            // Advancing the typing state machine one step per tick.
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setErasing(false);
            setIndex((i) => (i + 1) % words.length);
            return undefined;
        }

        const timer = setTimeout(
            () => setText(erasing ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)),
            erasing ? ERASE_SPEED : TYPE_SPEED,
        );
        return () => clearTimeout(timer);
    }, [text, erasing, index, words]);

    return text;
}

const META = [
    ['host', 'bengaluru.in'],
    ['role', 'backend / distributed systems / applied ai'],
    ['edu', `${education.school.toLowerCase()} · cgpa ${education.cgpa.split(' ')[0]}`],
];

const Hero = ({ scrollToSection }) => {
    const typed = useRotatingText(profile.roles);

    return (
        <section id="home" className="pt-10 pb-16">
            <Panel
                label="system · identity"
                meta={`uid: ${contact.email}`}
                status="live"
                bodyClass="p-6 md:p-10"
            >
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <Status tone="accent">{profile.status}</Status>
                    <Status tone="signal">available</Status>
                </div>

                <AsciiName className="mb-6 -mx-1" />

                <p className="mono text-base md:text-lg text-signal mb-8 min-h-[1.75rem]">
                    <span className="text-ink-dim">$ </span>
                    <span className="typing-cursor">{typed}</span>
                </p>

                <p className="text-ink max-w-2xl leading-relaxed mb-9">{profile.tagline}</p>

                <dl className="grid sm:grid-cols-3 gap-x-8 gap-y-3 mb-9 pb-9 border-b border-line">
                    {META.map(([k, v]) => (
                        <div key={k} className="flex gap-3 min-w-0">
                            <dt className="mono text-[11px] text-ink-dim shrink-0 w-9">{k}</dt>
                            <dd className="mono text-[11px] text-ink-mute truncate">{v}</dd>
                        </div>
                    ))}
                </dl>

                <div className="flex flex-wrap items-center gap-3">
                    <button
                        onClick={() => scrollToSection('contact')}
                        className="mono text-xs font-bold uppercase tracking-[0.1em] px-5 py-3 bg-signal text-bg hover:bg-signal/85 transition-colors flex items-center"
                    >
                        Open channel <ArrowRight size={14} className="ml-2" />
                    </button>
                    <a
                        href={RESUME_PATH}
                        download
                        className="mono text-xs font-bold uppercase tracking-[0.1em] px-5 py-3 border border-line-bright text-ink hover:text-ink-bright hover:border-signal transition-colors flex items-center"
                    >
                        <Download size={14} className="mr-2" /> resume.pdf
                    </a>
                    <div className="flex items-center gap-4 sm:ml-3">
                        {[
                            ['github', links.github],
                            ['linkedin', links.linkedin],
                            ['leetcode', links.leetcode],
                        ].map(([name, href]) => (
                            <a
                                key={name}
                                href={href}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mono text-[11px] text-ink-mute hover:text-signal transition-colors underline-offset-4 hover:underline"
                            >
                                {name}
                            </a>
                        ))}
                    </div>
                </div>
            </Panel>

            <StatsBar />
        </section>
    );
};

export default Hero;
