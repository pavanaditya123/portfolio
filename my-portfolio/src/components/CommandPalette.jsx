import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Search, CornerDownLeft } from 'lucide-react';
import { links, contact, RESUME_PATH } from '../data/profile';

/**
 * Command palette on Cmd/Ctrl-K.
 *
 * Navigation for people who would rather type than scroll, and a small signal
 * in its own right -- a recruiter who knows what Cmd-K is will recognise the
 * reference. Plain scrolling still works for everyone else, so nothing is
 * gated behind it.
 */

const openExternal = (url) => window.open(url, '_blank', 'noopener,noreferrer');

export default function CommandPalette({ scrollToSection }) {
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');
    const [cursor, setCursor] = useState(0);
    const inputRef = useRef(null);

    const commands = useMemo(
        () => [
            { group: 'goto', label: 'about', run: () => scrollToSection('about') },
            { group: 'goto', label: 'experience', run: () => scrollToSection('experience') },
            { group: 'goto', label: 'projects', run: () => scrollToSection('projects') },
            { group: 'goto', label: 'skills', run: () => scrollToSection('skills') },
            { group: 'goto', label: 'live telemetry', run: () => scrollToSection('coding') },
            { group: 'goto', label: 'resume', run: () => scrollToSection('resume') },
            { group: 'goto', label: 'contact', run: () => scrollToSection('contact') },
            { group: 'open', label: 'github', run: () => openExternal(links.github) },
            { group: 'open', label: 'linkedin', run: () => openExternal(links.linkedin) },
            { group: 'open', label: 'leetcode', run: () => openExternal(links.leetcode) },
            { group: 'run', label: 'download resume.pdf', run: () => openExternal(RESUME_PATH) },
            { group: 'run', label: `email ${contact.email}`, run: () => { window.location.href = `mailto:${contact.email}`; } },
        ],
        [scrollToSection],
    );

    const results = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return commands;
        return commands.filter((c) => `${c.group} ${c.label}`.toLowerCase().includes(q));
    }, [commands, query]);

    useEffect(() => {
        const onKey = (e) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
                e.preventDefault();
                setOpen((v) => !v);
                setQuery('');
                setCursor(0);
            } else if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    useEffect(() => {
        if (open) inputRef.current?.focus();
    }, [open]);

    if (!open) return null;

    const choose = (cmd) => {
        setOpen(false);
        cmd?.run();
    };

    const onKeyDown = (e) => {
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            setCursor((c) => (c + 1) % Math.max(results.length, 1));
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            setCursor((c) => (c - 1 + results.length) % Math.max(results.length, 1));
        } else if (e.key === 'Enter') {
            e.preventDefault();
            choose(results[cursor]);
        }
    };

    return (
        <div
            className="fixed inset-0 z-[90] bg-bg/80 flex items-start justify-center pt-[14vh] px-5"
            onClick={() => setOpen(false)}
            role="presentation"
        >
            <div className="panel w-full max-w-lg" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Command palette">
                <div className="flex items-center gap-3 px-4 py-3 border-b border-line">
                    <Search size={14} className="text-ink-dim shrink-0" />
                    <input
                        ref={inputRef}
                        value={query}
                        onChange={(e) => { setQuery(e.target.value); setCursor(0); }}
                        onKeyDown={onKeyDown}
                        placeholder="type a command"
                        className="flex-1 mono text-xs bg-transparent text-ink-bright placeholder-ink-dim focus:outline-none min-w-0"
                    />
                    <kbd className="mono text-[9px] text-ink-dim border border-line px-1.5 py-0.5 shrink-0">esc</kbd>
                </div>

                <div className="max-h-[320px] overflow-y-auto py-1.5">
                    {results.length === 0 && (
                        <p className="mono text-[11px] text-ink-dim px-4 py-4">no matches</p>
                    )}
                    {results.map((c, i) => (
                        <button
                            key={c.label}
                            onMouseEnter={() => setCursor(i)}
                            onClick={() => choose(c)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors ${i === cursor ? 'bg-panel-2' : ''}`}
                        >
                            <span className="mono text-[9px] text-ink-dim w-8 shrink-0 uppercase">{c.group}</span>
                            <span className={`mono text-[11px] truncate ${i === cursor ? 'text-signal' : 'text-ink'}`}>
                                {c.label}
                            </span>
                            {i === cursor && <CornerDownLeft size={11} className="ml-auto text-ink-dim shrink-0" />}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}
