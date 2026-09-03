import React from 'react';
import { FileText, Download, ExternalLink } from 'lucide-react';
import { SectionHeader, Panel, Status } from './ui';
import { RESUME_PATH, profile, contact } from '../data/profile';

const RESUME_FILE = 'Muttavarapu_Pavan_Aditya_Resume.pdf';

const Resume = () => (
    <section id="resume" className="py-14 reveal-section section-hidden">
        <SectionHeader index="06" title="Artifact" note="resume.pdf" />

        <div className="grid lg:grid-cols-3 gap-3 items-start">
            <Panel label="download" status="#3fb950" bodyClass="p-5 md:p-6">
                <div className="flex items-center gap-3 mb-5">
                    <FileText size={18} className="text-signal" />
                    <div className="min-w-0">
                        <p className="mono text-xs text-ink-bright truncate">{RESUME_FILE}</p>
                        <p className="mono text-[10px] text-ink-dim mt-1">pdf · 1 page · 120 KB</p>
                    </div>
                </div>

                <p className="text-sm text-ink leading-relaxed mb-6">
                    Everything on this page in the format recruiters ask for.
                </p>

                <div className="flex flex-col gap-2.5">
                    <a
                        href={RESUME_PATH}
                        download={RESUME_FILE}
                        className="mono text-xs font-bold uppercase tracking-[0.1em] px-4 py-3 bg-signal text-bg hover:bg-signal/85 transition-colors flex items-center justify-center"
                    >
                        <Download size={14} className="mr-2" /> download
                    </a>
                    <a
                        href={RESUME_PATH}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mono text-xs font-bold uppercase tracking-[0.1em] px-4 py-3 border border-line-bright text-ink hover:text-ink-bright hover:border-signal transition-colors flex items-center justify-center"
                    >
                        <ExternalLink size={14} className="mr-2" /> open
                    </a>
                </div>

                <div className="mt-6 pt-5 border-t border-line">
                    <Status tone="mute">or</Status>
                    <a
                        href={`mailto:${contact.email}`}
                        className="mono text-[11px] text-ink-mute hover:text-signal transition-colors block mt-3 truncate"
                    >
                        {contact.email}
                    </a>
                </div>
            </Panel>

            {/* Mobile browsers largely refuse to render embedded PDFs, so the
                buttons stay the reliable path on small screens. */}
            <div className="lg:col-span-2 hidden md:block">
                <Panel label="preview" meta="read-only" bodyClass="p-2">
                    <object
                        data={`${RESUME_PATH}#view=FitH&toolbar=1`}
                        type="application/pdf"
                        className="w-full h-[720px] bg-bg"
                        aria-label={`Resume of ${profile.name}`}
                    >
                        <div className="w-full h-[720px] flex flex-col items-center justify-center text-center p-8">
                            <FileText size={32} className="text-ink-dim mb-4" />
                            <p className="mono text-xs text-ink-mute mb-5">
                                inline pdf unsupported in this browser
                            </p>
                            <a
                                href={RESUME_PATH}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mono text-xs font-bold uppercase px-4 py-2.5 border border-signal text-signal hover:bg-signal hover:text-bg transition-colors"
                            >
                                open resume
                            </a>
                        </div>
                    </object>
                </Panel>
            </div>
        </div>
    </section>
);

export default Resume;
