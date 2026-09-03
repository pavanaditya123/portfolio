import React from 'react';
import { SectionHeader, Panel } from './ui';
import { contact, links, profile, RESUME_PATH } from '../data/profile';

const endpoints = [
    { method: 'MAIL', path: contact.email, href: `mailto:${contact.email}` },
    { method: 'TEL', path: contact.phone, href: contact.phoneHref },
    { method: 'GET', path: 'github.com/pavanaditya123', href: links.github },
    { method: 'GET', path: 'linkedin.com/in/pavan-aditya', href: links.linkedin },
    { method: 'GET', path: 'leetcode.com/u/Pavan200053', href: links.leetcode },
    { method: 'GET', path: 'resume.pdf', href: RESUME_PATH },
].filter((e) => Boolean(e.href));

const Contact = () => (
    <section id="contact" className="py-14 reveal-section section-hidden">
        <SectionHeader index="07" title="Endpoints" note="contact" />

        <Panel label="open channels" status="live" bodyClass="p-0">
            <div className="px-5 py-6 border-b border-line">
                <h2 className="mono text-xl md:text-2xl font-bold text-ink-bright mb-3">
                    Let's build something.
                </h2>
                <p className="text-sm text-ink leading-relaxed max-w-2xl">
                    Open to software engineering roles and internships — backend, distributed
                    systems, and applied AI especially. Fastest reply is email.
                </p>
            </div>

            {endpoints.map((e) => (
                <a
                    key={e.path}
                    href={e.href}
                    {...(e.method === 'GET' ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                    className="flex items-center gap-4 px-5 py-3.5 border-b border-line last:border-0 hover:bg-panel-2 transition-colors group"
                >
                    <span className="mono text-[10px] font-bold text-ink-dim w-10 shrink-0">
                        {e.method}
                    </span>
                    <span className="mono text-xs text-ink group-hover:text-signal transition-colors truncate">
                        {e.path}
                    </span>
                    <span className="mono text-[10px] text-ink-dim ml-auto shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                        200 OK
                    </span>
                </a>
            ))}
        </Panel>

        <div className="flex flex-wrap items-center justify-between gap-3 mt-6 pt-5 border-t border-line">
            <p className="mono text-[10px] text-ink-dim">
                © {new Date().getFullYear()} {profile.name.toLowerCase()}
            </p>
            <p className="mono text-[10px] text-ink-dim">
                built with react · vite · live platform apis
            </p>
        </div>
    </section>
);

export default Contact;
