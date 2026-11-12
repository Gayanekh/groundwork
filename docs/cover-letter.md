# Cover letter — Design Engineer, Artemis

> Draft. Replace bracketed placeholders. Facts about my background come from my résumé; nothing else is assumed. Read it aloud once and change any sentence that doesn’t sound like you.

---

[Your Name]
Fullerton, CA · [Email] · [Phone] · [LinkedIn URL] · [Portfolio URL]

[Date]

Hiring Team
Artemis (Mona Lee Inc.)

Dear Artemis team,

Your Design Engineer posting asks candidates to “send something you designed and built.” So I built something: **Groundwork**, an independent concept for the people who move a home-energy project from signed contract to permission to operate. It is not affiliated with Artemis and does not redesign your product. I chose the post-sale problem because your site names Operations and the journey “from sale to PTO,” and it let me show the four things your posting asks for in one working piece.

**Own the design system.** Groundwork has its own system: one token file in DTCG format that generates the Tailwind theme, more than 25 React + TypeScript components built from scratch with full keyboard and ARIA support, and a Storybook that renders from the same code. The build fails if tokens drift, and a contrast script fails it if any text pair drops below WCAG AA. Automated axe checks found zero violations on every screen.

**Make it readable by AI.** The repo includes an `AGENTS.md` with rules, a component cheat sheet and reference patterns, and a machine-readable component manifest. I built the project with an AI coding agent, using those files as the contract. That is also how I work day to day: at ZEMA I used Claude, Claude Code, ChatGPT and GitHub Copilot to explore UI options, draft specs and acceptance criteria, and generate and debug React and React Native components.

**Path to production.** A single `npm run check` runs the token, contrast and dependency audits, type checks, lint (including a rule that keeps app code on the design system’s public API), tests and the production build.

**Design and build products.** The prototype has a complete core workflow: a ranked “needs attention” queue, a project page whose stage checklist unlocks the next step, blockers with undo, and a homeowner update composer that drafts plain-language messages and flags jargon before sending.

This builds on more than ten years designing web and mobile products. Most recently, at ZEMA, I designed a multi-role medical-tourism platform end to end, built and maintained design-system components in Figma and in code (Tailwind CSS, NativeWind, shadcn/ui), and contributed production UI in React, React Native, Next.js and TypeScript. Before that, at Ogma Inc., I spent nine years designing dashboards, admin tools, data tables and complex workflows for information-dense products.

I want to be honest about one gap: I have not yet run user feedback sessions for Groundwork. The case study includes the plan I would run first, and leading those sessions is part of the role I’m excited to grow into with your team.

I live in Fullerton, CA, and I’m authorized to work in the U.S. I would love to walk you through Groundwork, the trade-offs I made, and how I would approach your design system.

Thank you for your time,

[Your Name]

Links: Prototype — https://groundwork-concept.vercel.app · Case study — https://github.com/Gayanekh/groundwork/blob/main/docs/case-study.md · Code — https://github.com/Gayanekh/groundwork
