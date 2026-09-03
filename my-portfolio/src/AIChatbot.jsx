import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';
import {
    profile, contact, links, education, skills,
    experience, projects, achievements, certifications, handles,
} from './data/profile';
import useCodingStats from './hooks/useCodingStats';

const KNOWLEDGE = {
    name: profile.shortName,
    fullName: profile.name,
    role: 'Software Engineer — backend, distributed systems, and applied AI',
    email: contact.email,
    phone: contact.phone,
    location: profile.location,
    university: education.school,
    degree: education.degree,
    cgpa: education.cgpa,
    graduationYear: education.period,
    linkedin: links.linkedin,
    github: links.github,
    leetcode: links.leetcode,
};

const list = (items) => items.map((i) => `• ${i}`).join('\n');

/**
 * Rule-based responder over the profile data.
 * `live` carries the fetched coding stats when they are available, so the
 * chatbot quotes the same numbers as the cards rather than a stale constant.
 */
function findResponse(input, live = {}) {
    const q = input.toLowerCase().trim();
    const solved = live.leetcode?.totalSolved;
    const solvedText = solved ? `${solved.toLocaleString()}` : '600+';

    if (/^(hi|hello|hey|yo|sup|hola|greetings)/.test(q)) {
        return `Hey there! I'm ${KNOWLEDGE.name}'s assistant. Ask me about his experience, projects, skills, education, or how to reach him.`;
    }

    if (/what.*(your|his) name|who (are you|is (he|pavan))/.test(q)) {
        return `He's **${KNOWLEDGE.fullName}** — a ${KNOWLEDGE.role}, studying at ${KNOWLEDGE.university}. He's currently a contract Software Engineer at Handshake AI and is **joining Eli Lilly as a Software Engineer Intern** in Bengaluru.`;
    }

    if (/contact|email|phone|reach|hire|connect/.test(q)) {
        return `Email: **${KNOWLEDGE.email}**\nPhone: ${KNOWLEDGE.phone}\nLinkedIn: ${KNOWLEDGE.linkedin}\nGitHub: ${KNOWLEDGE.github}\n\nHe's open to software engineering roles and internships — feel free to reach out.`;
    }

    if (/education|college|university|degree|cgpa|gpa|study|student|academic/.test(q)) {
        return `**${KNOWLEDGE.university}**\n${KNOWLEDGE.degree}\nCGPA: **${KNOWLEDGE.cgpa}**\n${KNOWLEDGE.graduationYear}\n${KNOWLEDGE.location}`;
    }

    if (/skill|tech|stack|language|framework|tool|what.*(know|use|work with)/.test(q)) {
        return skills.map((g) => `**${g.title}:** ${g.items.join(', ')}`).join('\n\n');
    }

    if (/experience|intern|work|job|company|swarmlens|handshake|current/.test(q)) {
        return experience
            .map((j) => `**${j.role}** — ${j.company}${j.team ? ` (${j.team})` : ''}\n_${j.period} · ${j.location}_\n${list(j.points)}`)
            .join('\n\n');
    }

    if (/project|built|build|portfolio|streaming|interview|rag|what.*(made|create)/.test(q)) {
        return `**Featured Projects:**\n\n${projects
            .map((p, i) => `**${i + 1}. ${p.title}**\n${p.points[0]}\n_Tech: ${p.stack.join(', ')}_`)
            .join('\n\n')}`;
    }

    if (/leetcode|dsa|algorithm|data structure|competitive|problem|coding/.test(q)) {
        const breakdown = live.leetcode
            ? `\n\nBreakdown: **${live.leetcode.easy.solved}** easy · **${live.leetcode.medium.solved}** medium · **${live.leetcode.hard.solved}** hard.`
            : '';
        return `Pavan has solved **${solvedText} problems** on LeetCode.${breakdown}\n\nHe also ranked **top 10 college-wide** in DSA on GeeksforGeeks.\n\nThe "Coding Profiles" section on this page pulls these numbers live.`;
    }

    if (/achievement|accomplishment|award|win|rank/.test(q)) {
        return `**Key Achievements:**\n\n${list(achievements.map((a) => a.text))}`;
    }

    if (/certification|certificate|course|learn/.test(q)) {
        return `**Certifications:**\n\n${list(certifications.map((c) => `${c.title} — ${c.issuer}`))}`;
    }

    if (/\bai\b|artificial|machine learning|llm|rag|agentic|nlp|model|benchmark/.test(q)) {
        return `Pavan's AI work is measurement-first:\n\n• At **Handshake AI** he designs benchmarks that test whether coding agents can isolate root causes — frontier agents averaged **0.2/1.0**\n• At **Swarmlens** he split a meeting pipeline into 4 components, cutting hallucination rate by **~55%**\n• Built a RAG platform evaluated with **RAGAS**, hitting **95% Faithfulness**\n• Tools: LangChain, Qdrant, WhisperX, Text-to-SQL, OpenAI and Gemini APIs`;
    }

    if (/resume|cv|download/.test(q)) {
        return `You can read the full resume in the **Resume** section of this page, or download the PDF with the **CV** button in the navigation bar.`;
    }

    if (/where|location|city|based/.test(q)) {
        return `Pavan is based in **${KNOWLEDGE.location}**, studying at ${KNOWLEDGE.university}. He's open to **remote** and **on-site** roles.`;
    }

    if (/why.*hire|strength|what makes|stand out|unique|special/.test(q)) {
        return `**Why Pavan stands out:**\n\n• Ships real distributed systems — split a monolith into 6 services, cut response time from 1.2s to under 150ms\n• Measures AI instead of demoing it — RAGAS evaluation, benchmarking harnesses, regression dashboards\n• Production experience at two companies while still an undergrad\n• **${solvedText}** LeetCode problems — strong DSA fundamentals\n• Comfortable across the stack: FastAPI, Node, Kafka, Redis, Postgres, Docker, NGINX`;
    }

    if (/thank|thanks|great|awesome|cool|nice/.test(q)) {
        return `You're welcome! To reach Pavan directly, email **${KNOWLEDGE.email}**. Have a great day.`;
    }

    return `I can tell you about Pavan's **experience, projects, skills, education, achievements, and coding stats**. Try asking:\n\n• "What's his experience?"\n• "Tell me about his projects"\n• "How many LeetCode problems has he solved?"\n• "Why should I hire him?"`;
}

function formatMessage(text) {
    return text
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/_(.*?)_/g, '<em>$1</em>')
        .replace(/\n/g, '<br/>');
}

const AIChatbot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { role: 'bot', text: 'Ask about experience, projects, skills, education, or coding stats.' }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);
    const leetcode = useCodingStats('leetcode', handles.leetcode);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (trimmed) ask(trimmed);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = ['skills', 'projects', 'experience', 'why hire'];

    // Shared by the input box and the quick-question chips so both paths get
    // the live stats and the same typing delay.
    const ask = (text) => {
        setInput('');
        setMessages((prev) => [...prev, { role: 'user', text }]);
        setIsTyping(true);
        setTimeout(() => {
            setMessages((prev) => [...prev, { role: 'bot', text: findResponse(text, { leetcode: leetcode.data }) }]);
            setIsTyping(false);
        }, 550);
    };

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-6 left-6 z-50 mono text-[11px] font-bold uppercase tracking-[0.1em] px-4 py-3 border transition-colors flex items-center gap-2 ${isOpen
                    ? 'bg-panel border-line-bright text-ink-mute hover:text-ink-bright'
                    : 'bg-panel border-signal/40 text-signal hover:bg-signal hover:text-bg'
                    }`}
                aria-label="Query assistant"
            >
                {isOpen ? <X size={14} /> : <MessageCircle size={14} />}
                {isOpen ? 'close' : 'query'}
            </button>

            {isOpen && (
                <div className="fixed bottom-20 left-6 right-6 sm:right-auto z-50 sm:w-[400px] max-h-[520px] panel flex flex-col overflow-hidden">
                    <div className="panel-head shrink-0">
                        <span className="dot dot-live" />
                        <span>assistant</span>
                        <span className="ml-auto text-ink-dim normal-case tracking-normal">rule-based · offline</span>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3.5 min-h-[240px] max-h-[320px]">
                        {messages.map((msg, i) => (
                            <div key={i} className="mono text-[11px] leading-relaxed">
                                {msg.role === 'user' ? (
                                    <p className="text-ink-bright">
                                        <span className="text-signal">›</span> {msg.text}
                                    </p>
                                ) : (
                                    <div
                                        className="text-ink border-l border-line pl-3 ml-1"
                                        dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                                    />
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <p className="mono text-[11px] text-ink-dim border-l border-line pl-3 ml-1">
                                <span className="typing-cursor" />
                            </p>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length <= 1 && (
                        <div className="px-4 pb-3 flex flex-wrap gap-1.5 shrink-0">
                            {quickQuestions.map((q) => (
                                <button
                                    key={q}
                                    onClick={() => ask(q)}
                                    className="mono text-[10px] px-2 py-1 border border-line bg-panel-2 text-ink-mute hover:text-signal hover:border-signal/40 transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-line p-2.5 flex gap-2 shrink-0">
                        <span className="mono text-xs text-signal self-center pl-1.5">›</span>
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="ask about pavan"
                            className="flex-1 mono text-[11px] bg-transparent text-ink-bright placeholder-ink-dim focus:outline-none min-w-0"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="mono text-[10px] font-bold uppercase px-2.5 py-1.5 border border-line text-ink-mute hover:text-signal hover:border-signal/40 disabled:opacity-40 disabled:hover:text-ink-mute disabled:hover:border-line transition-colors"
                        >
                            <Send size={12} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
