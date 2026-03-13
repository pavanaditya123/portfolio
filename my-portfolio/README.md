# Personal Portfolio

My developer portfolio built with **React**, **Vite**, and **Tailwind CSS v4**. Features a dark premium UI, smooth animations, and an integrated AI assistant chatbot.

**Live:** https://pavanaditya.vercel.app/

---

## Tech Stack

- **Frontend:** React 19, Vite 8
- **Styling:** Tailwind CSS v4, custom CSS animations
- **Icons:** Lucide React
- **Build:** Vite + PostCSS

## Features

- Typing animation on hero subtitle
- Animated stat counters (scroll-triggered)
- Gradient text with shimmer effect
- Fully responsive + mobile hamburger menu
- AI chatbot that answers questions about me
- Scroll-triggered section reveal animations
- Scroll spy active navigation
- Back-to-top button
- SEO meta tags + Open Graph

## Project Structure

```
src/
├── App.jsx
├── AIChatbot.jsx
├── main.jsx
├── index.css
│
├── hooks/
│   └── useCounter.js
│
└── components/
    ├── ui/
    │   └── index.jsx
    ├── Navbar.jsx
    ├── Hero.jsx
    ├── StatsBar.jsx
    ├── About.jsx
    ├── Experience.jsx
    ├── Projects.jsx
    ├── Skills.jsx
    ├── Achievements.jsx
    └── Contact.jsx
```

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      App.jsx                            │
│  - Scroll spy (tracks active section)                   │
│  - IntersectionObserver (scroll reveal)                 │
│  - Composes all section components                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────┐  ┌──────────────────────────────────────┐ │
│  │ Navbar   │  │              <main>                  │ │
│  │ (fixed)  │  │  Hero → About → Experience →         │ │
│  │          │  │  Projects → Skills → Achievements →  │ │
│  │          │  │  Contact                             │ │
│  └──────────┘  └──────────────────────────────────────┘ │
│                                                         │
│  ┌──────────┐  ┌──────────────┐                         │
│  │ BackToTop│  │  AIChatbot   │  (floating, fixed pos)  │
│  │ (fixed)  │  │  (fixed)     │                         │
│  └──────────┘  └──────────────┘                         │
└─────────────────────────────────────────────────────────┘
```

### AI Chatbot

The chatbot uses a local knowledge base with no API calls or backend. It pattern-matches user questions and returns pre-written responses about my skills, projects, experience, etc. Keeps it fast and deployable as a static site.

### Scroll Animations

Used the Intersection Observer API in two places:

1. **Section reveals** — sections start hidden with `translateY(40px)` and transition to visible when 10% enters the viewport
2. **Stat counters** — numbers animate from 0 to target when the stats bar is 50% visible, at ~60fps

### Component Design

One component per section. Shared pieces like `SectionHeader`, `SkillCategory`, `AchievementCard` live in `components/ui/index.jsx`.

## Getting Started

```bash
git clone https://github.com/YOUR_USERNAME/portfolio.git
cd portfolio
npm install
npm run dev
```

## Customization

| What to change | Where |
|---|---|
| Name, bio, education | `About.jsx` |
| Work experience | `Experience.jsx` |
| Projects | `Projects.jsx` |
| Skills list | `Skills.jsx` |
| Achievements & certs | `Achievements.jsx` |
| Contact info | `Contact.jsx`, `Hero.jsx` |
| Chatbot knowledge | `AIChatbot.jsx` |
| Colors & animations | `index.css` |

## License

MIT
