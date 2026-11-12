# Job analysis — Design Engineer (Artemis)

> **Independent Speculative Concept — Not Affiliated with Artemis.**
> Source: public job posting, read November 12, 2026 — https://ats.rippling.com/mona-lee-inc/jobs/2fe59211-e230-4b23-b6ef-91d70781755a
> The posting lists the role as **Design Engineer**, Research & Development, **Remote (United States)**. Compensation, employment type and years of experience are **not stated**.

## 1. What the role is (verified, paraphrased)

The posting describes a hands-on design engineer who makes the design system and frontend code easy for **people and AI** to use. It names four responsibilities:

| # | Responsibility (posting heading) | What it means in practice |
| --- | --- | --- |
| R1 | **Own the design system** | Components, tokens, APIs and accessibility, kept in sync across **Figma, Storybook and code**. |
| R2 | **Make it readable by AI** | Docs, examples and structure that help people and AI tools build on-brand. |
| R3 | **Build the path to production** | Starters, reference flows and quality checks that take an AI prototype to a shipped feature. |
| R4 | **Design and build products** | Ship real views and workflows, then turn the best into reusable patterns. |

## 2. Qualifications (verified, short quotes)

| # | Qualification |
| --- | --- |
| Q1 | “Shipped component-based frontends and design systems” |
| Q2 | “Fluent in React, TypeScript, Tailwind, shadcn and Storybook” |
| Q3 | Competent at leading user feedback sessions |
| Q4 | “Strong HTML, CSS, accessibility, design tokens and frontend testing” |
| Q5 | “Uses AI coding and prototyping tools in real product work” |

**Nice to have (N1):** structured context, component metadata, code generation or AI evals.

**Profile notes (verified, paraphrased):** strong frontend craft and design judgment; practical and curious about AI and teaches what works; comfortable on a small team with moving priorities; passion for testing concepts through direct user feedback; takes initiative and leads projects.

**How to apply (verified):** the posting asks candidates to send “something you designed and built.”

## 3. Breakdown by skill area

| Area | Requirements |
| --- | --- |
| Design skills | Design judgment; design tokens; leading user feedback sessions; testing concepts with users |
| Engineering skills | Component-based frontends; React; TypeScript; Tailwind; HTML; CSS; accessibility; frontend testing |
| Tools named | Figma, Storybook, React, TypeScript, Tailwind, shadcn, AI coding/prototyping tools |
| Design-system duties | Own components, tokens, APIs, accessibility; keep Figma ↔ Storybook ↔ code in sync; reusable patterns |
| Figma-to-code | Only “kept in sync across Figma, Storybook and code” is stated. No specific process or plugin is named. |
| Storybook | Mentioned twice (sync responsibility; fluency) |
| AI-readable docs | Explicit responsibility (R2); quality checks for AI prototypes (R3); structured context and component metadata (N1) |
| Collaboration | Small team; teach what works; lead projects; run feedback sessions; build systems others create with |

## 4. A note on shadcn

The posting lists **shadcn** fluency. This project was intentionally built **without** shadcn/ui or any component library (a constraint of this portfolio exercise) to show first-principles component design. In an interview, the honest framing is:

- shadcn/ui is a copy-in source pattern built on Radix primitives and Tailwind. The skills it requires (Tailwind theming with CSS variables, accessible primitives, variants, composition) are the same skills this codebase demonstrates from scratch.
- My résumé lists shadcn/ui in production work, which covers direct tool experience.
- This repo therefore shows the *underlying* skill; it does not show shadcn usage itself. The skills matrix marks this as **partially demonstrated**.

## 5. What this means for the project

| Requirement | Project response |
| --- | --- |
| R1 Own the design system | Token pipeline, 25+ custom components, Storybook, tests, lint rules |
| R2 Readable by AI | `AGENTS.md`, `design-system.manifest.json`, JSDoc on props, Storybook docs |
| R3 Path to production | `npm run check` quality gate, token drift check, ESLint import rule, tests, Vercel config |
| R4 Design and build products | A working product with a full core journey, then patterns extracted (`HealthBadge`, `UpdateComposer`) |
| Q3 / user feedback | **Not demonstrated.** No users were interviewed. A research plan is included in the case study. |

See `docs/skills-matrix.md` for the evidence-level audit.
