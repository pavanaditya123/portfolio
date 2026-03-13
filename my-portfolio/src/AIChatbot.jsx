import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

const KNOWLEDGE = {
    name: "Pavan Aditya",
    fullName: "Muttavarapu Pavan Aditya",
    role: "Full-Stack Developer & AI Engineer",
    email: "Pavanadi88@gmail.com",
    phone: "+91-6304702569",
    location: "Bangalore, India",
    university: "Manipal Institute of Technology",
    degree: "B.Tech in Computer Science & Engineering (AI/ML)",
    cgpa: "8.66",
    graduationYear: "2023-2027",
    linkedin: "https://linkedin.com/in/pavan-aditya-75a8b8286",
    leetcode: "https://leetcode.com/u/Pavan200053/",
    leetcodeProblems: "500+",
    internship: "AI Engineer Intern at Swarmlens (Feb 2026 – Present)",
    skills: {
        languages: ["Python", "C++", "Java", "JavaScript", "C"],
        ml: ["Scikit-Learn", "Perceptron", "Tokenization", "Regex", "N-grams"],
        web: ["React", "Redux", "Node.js", "Express.js", "Tailwind CSS", "HTML5", "CSS"],
        databases: ["MongoDB", "MySQL"],
        tools: ["Git", "Inngest", "Stream SDK", "OpenAI API", "AWS (EC2, SES)"]
    },
    projects: [
        {
            name: "Dev Tinder",
            desc: "Full-stack developer networking platform with profile discovery, connection requests, 15+ REST APIs, JWT auth, and AWS deployment. Reduced feed API response time by 30%.",
            tech: "Node.js, Express, React, Redux, MongoDB, AWS"
        },
        {
            name: "Live Coding & Interview Platform",
            desc: "Real-time coding and interview platform with shared code editor, video calls (<150ms delay), and AI helper that tests code with 10+ test cases.",
            tech: "React, Node.js, Express, Stream Video SDK, Inngest, AI"
        }
    ],
    achievements: [
        "Solved 500+ problems on LeetCode (Rating: 1585)",
        "Designed AI Meeting Intelligence System with 95% accuracy",
        "Ranked 10th college-wide in DSA on GeeksforGeeks"
    ],
    certifications: ["Python Programming (Coursera)", "MERN Stack (Namaste Dev)", "DSA (TakeUForward)", "Interview Prep (Meta Coursera)", "OOP (Coursera)"]
};

function findResponse(input) {
    const q = input.toLowerCase().trim();

    if (/^(hi|hello|hey|yo|sup|hola|greetings)/.test(q)) {
        return `Hey there! I'm Pavan's AI assistant. I can tell you about his skills, projects, experience, education, or anything else. What would you like to know?`;
    }

    if (/what.*(your|his) name|who (are you|is (he|pavan))/.test(q)) {
        return `He's **${KNOWLEDGE.fullName}** — a ${KNOWLEDGE.role} currently studying at ${KNOWLEDGE.university}. He's seeking a Software Development internship!`;
    }

    if (/contact|email|phone|reach|hire|connect/.test(q)) {
        return `Email: ${KNOWLEDGE.email}\nPhone: ${KNOWLEDGE.phone}\nLinkedIn: ${KNOWLEDGE.linkedin}\n\nHe's actively looking for internship roles — feel free to reach out!`;
    }

    if (/education|college|university|degree|cgpa|gpa|study|student|academic/.test(q)) {
        return `**${KNOWLEDGE.university}**\n${KNOWLEDGE.degree}\nCGPA: **${KNOWLEDGE.cgpa}**\n${KNOWLEDGE.graduationYear}\n${KNOWLEDGE.location}`;
    }

    if (/skill|tech|stack|language|framework|tool|what.*(know|use|work with)/.test(q)) {
        return `**Languages:** ${KNOWLEDGE.skills.languages.join(', ')}\n\n**Web Dev:** ${KNOWLEDGE.skills.web.join(', ')}\n\n**ML/NLP:** ${KNOWLEDGE.skills.ml.join(', ')}\n\n**Databases & Tools:** ${KNOWLEDGE.skills.databases.join(', ')}, ${KNOWLEDGE.skills.tools.join(', ')}`;
    }

    if (/experience|intern|work|job|company|swarmlens|current/.test(q)) {
        return `**${KNOWLEDGE.internship}** (Remote)\n\n• Building Agentic RAG systems for complex task automation\n• Implementing RAG pipelines with LLMs for real-time data\n• Working with the engineering team to ship AI products`;
    }

    if (/project|built|build|portfolio|dev tinder|coding.*interview|what.*(made|create)/.test(q)) {
        let resp = "**Featured Projects:**\n\n";
        KNOWLEDGE.projects.forEach((p, i) => {
            resp += `**${i + 1}. ${p.name}**\n${p.desc}\n_Tech: ${p.tech}_\n\n`;
        });
        return resp;
    }

    if (/leetcode|dsa|algorithm|data structure|competitive|problem|coding/.test(q)) {
        return `Pavan has solved **${KNOWLEDGE.leetcodeProblems} problems** on LeetCode with a rating of **1585**!\n\nHe also ranked **10th college-wide** in DSA on GeeksforGeeks.\n\nLeetCode: ${KNOWLEDGE.leetcode}`;
    }

    if (/achievement|accomplishment|award|win|rank/.test(q)) {
        let resp = "**Key Achievements:**\n\n";
        KNOWLEDGE.achievements.forEach(a => { resp += `• ${a}\n`; });
        return resp;
    }

    if (/certification|certificate|course|learn/.test(q)) {
        let resp = "**Certifications:**\n\n";
        KNOWLEDGE.certifications.forEach(c => { resp += `• ${c}\n`; });
        return resp;
    }

    if (/ai|artificial|machine learning|llm|rag|agentic|nlp|model/.test(q)) {
        return `Pavan is deeply focused on **AI/LLM integrations**:\n\n• Currently building **Agentic RAG** systems at Swarmlens\n• Built an AI Meeting Intelligence System with **95% accuracy**\n• Experience with OpenAI API, tokenization, embeddings, and NLP\n• His goal is to integrate AI into everyday web tools`;
    }

    if (/resume|cv|download/.test(q)) {
        return `You can view a printable version of Pavan's resume by clicking the **"Resume"** button on the homepage. It opens a print-ready version of this portfolio!`;
    }

    if (/where|location|city|based/.test(q)) {
        return `Pavan is based in **${KNOWLEDGE.location}**, studying at ${KNOWLEDGE.university}. He's open to **remote** and **on-site** opportunities!`;
    }

    if (/why.*hire|strength|what makes|stand out|unique|special/.test(q)) {
        return `**Why Pavan stands out:**\n\n• Full-stack MERN + AI/LLM — rare combo for a student\n• Real internship experience building production AI systems\n• 500+ LeetCode problems — strong DSA fundamentals\n• Ships end-to-end: frontend, backend, APIs, deployment (AWS)\n• Passionate about making AI practical and useful`;
    }

    if (/thank|thanks|great|awesome|cool|nice/.test(q)) {
        return `You're welcome! If you'd like to connect with Pavan, reach out at **${KNOWLEDGE.email}**. Have a great day!`;
    }

    return `Great question! I know all about Pavan's **skills, projects, experience, education, achievements, and certifications**. Try asking:\n\n• "What are his skills?"\n• "Tell me about his projects"\n• "What's his experience?"\n• "Why should I hire him?"`;
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
        { role: 'bot', text: "Hi! I'm Pavan's AI assistant. Ask me anything about his skills, projects, experience, or education!" }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen && inputRef.current) inputRef.current.focus();
    }, [isOpen]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (!trimmed) return;

        setMessages(prev => [...prev, { role: 'user', text: trimmed }]);
        setInput('');
        setIsTyping(true);

        setTimeout(() => {
            const response = findResponse(trimmed);
            setMessages(prev => [...prev, { role: 'bot', text: response }]);
            setIsTyping(false);
        }, 600 + Math.random() * 800);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    const quickQuestions = ["What are his skills?", "Tell me about projects", "Why hire Pavan?"];

    return (
        <>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`fixed bottom-8 right-8 z-50 p-4 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 ${isOpen
                    ? 'bg-slate-800 hover:bg-slate-700 text-slate-300'
                    : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_30px_rgba(99,102,241,0.4)]'
                    }`}
                aria-label="Chat with AI assistant"
            >
                {isOpen ? <X size={24} /> : <MessageCircle size={24} />}
            </button>

            {isOpen && (
                <div className="chatbot-container fixed bottom-24 right-8 z-50 w-[380px] max-h-[520px] bg-slate-950 border border-slate-800 rounded-2xl shadow-2xl shadow-indigo-500/10 flex flex-col overflow-hidden">
                    <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border-b border-slate-800 px-5 py-4 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 flex items-center justify-center">
                            <Bot size={20} className="text-white" />
                        </div>
                        <div>
                            <h4 className="text-white font-bold text-sm">Pavan's AI Assistant</h4>
                            <div className="flex items-center gap-1.5">
                                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></span>
                                <span className="text-emerald-400 text-xs">Online</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[250px] max-h-[340px]">
                        {messages.map((msg, i) => (
                            <div key={i} className={`chat-message flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${msg.role === 'user'
                                    ? 'bg-indigo-500/20 text-indigo-400'
                                    : 'bg-purple-500/20 text-purple-400'
                                    }`}>
                                    {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                                </div>
                                <div className={`max-w-[280px] px-4 py-3 rounded-2xl text-sm leading-relaxed ${msg.role === 'user'
                                    ? 'bg-indigo-600 text-white rounded-tr-sm'
                                    : 'bg-slate-900 text-slate-300 border border-slate-800 rounded-tl-sm'
                                    }`}
                                    dangerouslySetInnerHTML={{ __html: formatMessage(msg.text) }}
                                />
                            </div>
                        ))}
                        {isTyping && (
                            <div className="flex gap-2.5">
                                <div className="w-7 h-7 rounded-full bg-purple-500/20 text-purple-400 flex items-center justify-center flex-shrink-0">
                                    <Bot size={14} />
                                </div>
                                <div className="bg-slate-900 border border-slate-800 px-4 py-3 rounded-2xl rounded-tl-sm">
                                    <div className="flex space-x-1.5">
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                                        <div className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {messages.length <= 1 && (
                        <div className="px-4 pb-2 flex flex-wrap gap-2">
                            {quickQuestions.map(q => (
                                <button
                                    key={q}
                                    onClick={() => { setInput(q); setTimeout(() => { setInput(''); setMessages(prev => [...prev, { role: 'user', text: q }]); setIsTyping(true); setTimeout(() => { setMessages(prev => [...prev, { role: 'bot', text: findResponse(q) }]); setIsTyping(false); }, 700); }, 100); }}
                                    className="text-xs px-3 py-1.5 bg-slate-900 border border-slate-700 text-slate-400 rounded-full hover:bg-slate-800 hover:text-white transition-colors"
                                >
                                    {q}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="border-t border-slate-800 p-3 flex gap-2">
                        <input
                            ref={inputRef}
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Ask about Pavan..."
                            className="flex-1 bg-slate-900 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition-colors"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!input.trim()}
                            className="p-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-800 disabled:text-slate-600 text-white rounded-xl transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default AIChatbot;
