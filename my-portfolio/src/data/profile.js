// Single source of truth for everything on the site.
// Edit this file to update content -- components read from it.

export const RESUME_PATH = '/Muttavarapu_Pavan_Aditya_Resume.pdf';

export const profile = {
    name: 'Muttavarapu Pavan Aditya',
    shortName: 'Pavan Aditya',
    location: 'Bengaluru, India',
    roles: [
        'Software Engineer',
        'Backend & Distributed Systems',
        'AI / ML Engineer',
        'Problem Solver',
    ],
    tagline:
        'CS undergrad building backend systems that hold up under load and AI pipelines that are actually measured, not vibed.',
    // Shown as the pill above the hero headline -- the first thing a recruiter reads.
    status: 'Incoming Software Engineer Intern @ Eli Lilly',
};

// Usernames drive the live stats. Leave a handle as an empty string to hide
// that card entirely -- nothing breaks, the card just does not render.
export const handles = {
    github: 'pavanaditya123',
    leetcode: 'Pavan200053',
    codeforces: '',        // <-- add your Codeforces handle
    geeksforgeeks: '',     // <-- add your GeeksforGeeks username
};

export const contact = {
    email: 'pavanadi88@gmail.com',
    phone: '+91-6304702569',
    phoneHref: 'tel:+916304702569',
};

export const links = {
    github: `https://github.com/${handles.github}`,
    linkedin: 'https://linkedin.com/in/pavan-aditya-75a8b8286',
    leetcode: `https://leetcode.com/u/${handles.leetcode}/`,
    codeforces: handles.codeforces ? `https://codeforces.com/profile/${handles.codeforces}` : '',
    geeksforgeeks: handles.geeksforgeeks
        ? `https://auth.geeksforgeeks.org/user/${handles.geeksforgeeks}`
        : '',
};

export const education = {
    school: 'Manipal Institute of Technology',
    degree: 'B.Tech. in Computer Science and Engineering (AI/ML)',
    cgpa: '8.66 / 10.0',
    location: 'Bengaluru, India',
    period: 'Expected 2027',
};

export const experience = [
    {
        company: 'Eli Lilly and Company',
        role: 'Software Engineer Intern',
        location: 'Bengaluru, India (Onsite)',
        period: 'Upcoming',
        upcoming: true,
        points: [
            'Joining Eli Lilly as a Software Engineer Intern.',
        ],
        stack: [],
    },
    {
        company: 'Handshake AI',
        team: 'Project Dynamo',
        role: 'Software Engineer (Contract)',
        location: 'Remote',
        period: 'Jul 2026 - Present',
        current: true,
        points: [
            'Designed benchmark tasks that measure whether AI coding agents can isolate root causes, planting interacting defects across data processing, numerical computation, scheduling, and dependency handling; frontier agents averaged 0.2/1.0.',
            'The agents often produced fixes that looked correct but failed on edge cases, so wrote pytest checks against reference implementations, including numerical checks down to 1e-5.',
            'A dependency graph with 5 million events became a CI bottleneck, so reworked its generation while preserving topological order and preventing cycles.',
        ],
        stack: ['Python', 'pytest', 'CI/CD', 'Graph Algorithms'],
    },
    {
        company: 'Swarmlens',
        role: 'AI & DevOps Engineer Intern',
        location: 'Kochi, India (Remote)',
        period: 'Feb 2026 - May 2026',
        points: [
            'Built a meeting-processing application in Python and WhisperX that turned recorded calls into speaker-attributed transcripts, action items, and decisions.',
            'The first pipeline handled extraction and verification together, so split it into 4 specialized components, reducing the measured hallucination rate by approximately 55%.',
            'As the application moved behind a frontend, configured NGINX for routing and reduced average API response time from 420 ms to 300 ms; added KPI dashboards to monitor regressions.',
        ],
        stack: ['Python', 'WhisperX', 'NGINX', 'DevOps'],
    },
];

export const projects = [
    {
        title: 'Streaming Platform Backend',
        repo: 'streaming_backend_netflix',
        stack: ['Node.js', 'Kafka', 'Redis', 'PostgreSQL', 'Microservices'],
        accent: 'indigo',
        points: [
            'Started with a monolithic streaming backend, then split it into 6 services when playback, watch-history, notifications, subscriptions, and related workloads became difficult to scale independently.',
            'The services became tightly coupled through synchronous calls, so introduced Kafka for asynchronous event processing and Saga orchestration for failures across subscription and billing workflows.',
            'Read-heavy endpoints remained slow after the split, so cached high-frequency paths in Redis and reduced response time from 1.2 s to under 150 ms; also built a recommendation service supporting 20+ natural-language search intents with responses under 2 s.',
        ],
        metrics: [
            { label: 'Response time', value: '1.2s -> 150ms' },
            { label: 'Services', value: '6' },
        ],
    },
    {
        title: 'AI Talent Intelligence & Live Interview Platform',
        repo: 'Interview_platform',
        stack: ['Python', 'FastAPI', 'Oracle 26ai', 'WebRTC'],
        accent: 'cyan',
        points: [
            'Defined data models for candidates, jobs, applications, and ATS reports, then built resume-processing pipelines that extracted 10+ attributes into Oracle 26ai; added Text-to-SQL support for 20+ query patterns.',
            'Recommendations varied between runs, so built a benchmarking harness to compare outputs and used the failures to refine the pipeline, improving run-to-run consistency by approximately 25%.',
            'Built a real-time interview workspace with Monaco Editor and WebRTC for collaborative coding, video, and screen sharing, with approximately 1.8 s end-to-end voice latency; automated post-interview reports in under 3 s, reducing manual feedback effort by approximately 70%.',
        ],
        metrics: [
            { label: 'Voice latency', value: '~1.8s' },
            { label: 'Manual effort', value: '-70%' },
        ],
    },
    {
        title: 'Enterprise Knowledge Retrieval Platform',
        repo: 'document-search',
        stack: ['Python', 'FastAPI', 'Qdrant', 'RAGAS'],
        accent: 'purple',
        points: [
            'Started with the problem of making enterprise documents searchable across different file types, then built an ingestion pipeline supporting 5 formats, paragraph-based chunking, Jina embeddings, and Qdrant vector search.',
            'Retrieval quality could not be judged reliably from individual responses, so built a 21-sample evaluation pipeline using RAGAS, achieving 95% Faithfulness while measuring Answer Relevancy, Context Precision, Context Recall, and Answer Correctness.',
            'Added semantic reranking and history-aware query planning when basic retrieval was insufficient, and built a Streamlit dashboard that captured contexts, tool calls, and responses to trace failures and compare evaluation results.',
        ],
        metrics: [
            { label: 'Faithfulness', value: '95%' },
            { label: 'Formats', value: '5' },
        ],
    },
];

export const skills = [
    {
        title: 'Languages',
        icon: 'code',
        color: 'indigo',
        items: ['Python', 'C++', 'Java', 'JavaScript', 'TypeScript', 'SQL', 'Bash'],
    },
    {
        title: 'Backend & Distributed Systems',
        icon: 'server',
        color: 'cyan',
        items: [
            'FastAPI', 'Node.js', 'Express.js', 'REST', 'WebSockets',
            'WebRTC', 'Kafka', 'Redis', 'Microservices', 'Saga',
        ],
    },
    {
        title: 'AI / ML',
        icon: 'brain',
        color: 'purple',
        items: [
            'LangChain', 'RAG', 'RAGAS', 'Qdrant', 'WhisperX',
            'Text-to-SQL', 'OpenAI API', 'Gemini API',
        ],
    },
    {
        title: 'Infrastructure & Tools',
        icon: 'settings',
        color: 'emerald',
        items: ['Docker', 'NGINX', 'Git', 'pytest', 'CI/CD'],
    },
    {
        title: 'Databases',
        icon: 'database',
        color: 'amber',
        items: ['PostgreSQL', 'MySQL', 'MongoDB', 'Neo4j', 'Oracle 26ai'],
    },
];

export const achievements = [
    {
        text: 'Solved 600+ LeetCode problems, with a live problem count and difficulty breakdown shown below.',
        highlight: '600+',
        link: links.leetcode,
    },
    {
        text: 'Ranked among the top 10 students college-wide in Data Structures and Algorithms on GeeksforGeeks.',
        highlight: 'top 10',
        link: links.geeksforgeeks,
    },
    {
        text: 'Cut measured hallucination rate by approximately 55% on a production meeting-intelligence pipeline at Swarmlens.',
        highlight: '55%',
    },
];

export const certifications = [
    { title: 'Interview Preparation', issuer: 'Meta' },
    { title: 'Advanced Backend', issuer: 'Namaste Dev' },
    { title: 'Data Structures & Algorithms', issuer: 'takeUforward (Raj Vikramaditya)' },
    { title: 'Introduction to Programming with Python and Java', issuer: 'University of Pennsylvania' },
];
