# CV recommendations for the Artemis Design Engineer role

> Based on your current résumé (`GayaneResume.pdf`, dated Oct 2026 on your Desktop). I only reuse facts already on it. Placeholders are in [brackets]. Nothing here invents experience.

## 1. Professional positioning

**Headline (suggested):**
> Product Designer & Design Engineer — design systems in Figma and code (React, TypeScript, Tailwind, Storybook)

**Summary (suggested rewrite, 3 lines):**
> UI/UX and product designer with 10+ years designing web and mobile products — multi-role platforms, dashboards and data-heavy workflows. I build design systems in Figma and in code and implement production UI in React, Next.js and TypeScript. I use AI coding tools (Claude Code, Copilot) daily to move from prototype to working, accessible UI.

Why: the posting is titled *Design Engineer*. Lead with the overlap (design systems + code), keep “Product Designer” for range.

## 2. Skills to move to the top

Order by what the posting names, and only list what you can defend in an interview:

1. **Design systems & tokens:** Figma, design tokens, component libraries, Storybook *(new from Groundwork — add only after you can run and explain it)*
2. **Frontend:** React, TypeScript, Tailwind CSS, shadcn/ui, HTML, CSS, Next.js, React Native
3. **Accessibility:** WCAG 2.2 AA, ARIA patterns, keyboard support, axe
4. **Testing & quality:** Vitest, Testing Library *(from Groundwork)*
5. **AI-assisted development:** Claude Code, GitHub Copilot, ChatGPT; AGENTS.md / structured context for AI agents
6. **Product & UX:** product design, information architecture, user flows, prototyping, complex workflows

## 3. Add a “Selected project” section

> **Groundwork — independent design-engineering concept** · https://github.com/Gayanekh/groundwork · https://groundwork-tau-lemon.vercel.app
> *Independent speculative concept, not affiliated with Artemis.*
> - Designed and built a post-sale project-operations prototype in React 19, TypeScript and Tailwind CSS v4, with a complete core workflow (triage → unblock → advance → homeowner update).
> - Created a design system from scratch: DTCG token pipeline generating the Tailwind theme, 25+ accessible components, Storybook documentation, and a build that fails on token drift or contrast below WCAG AA.
> - Wrote AI-readable documentation (AGENTS.md + component manifest) and quality gates (type check, lint rules, 32 tests); 0 axe violations across all screens.

Keep numbers that are **true and checkable** (component count, test count, axe result). Do not add usage or business metrics — there are none.

## 4. Strengthen existing bullets (wording only, same facts)

**ZEMA — Senior UI/UX Designer**
- Lead with: “Built and maintained reusable design-system components in Figma and code (Tailwind CSS, NativeWind, shadcn/ui) for web and mobile.”
- Then: “Contributed production UI in React, React Native, Next.js and TypeScript…”
- Keep the AI-workflow bullet; it maps directly to the posting.
- If true, add specifics you can defend: number of components, whether you used Storybook, tokens, or tests. If not true, leave it out.

**Ogma Inc. — UI/UX Designer**
- Emphasize “dashboards, admin tools, data tables, forms and workflows for information-dense business products” — closest to an ops product.

## 5. Things to avoid

- Don’t list Storybook, Vitest or AGENTS.md as *work* experience. They belong under the Groundwork project unless you used them at a job.
- Don’t imply Artemis was involved in Groundwork.
- Don’t claim user research for Groundwork; you can say “designed against documented assumptions; validation plan included.”

## 6. Gaps to prepare for in the interview

| Posting item | Honest answer |
| --- | --- |
| Leading user feedback sessions | Describe any design reviews or client sessions you led at ZEMA/Ogma (only if true), plus Groundwork’s validation plan. |
| shadcn | You used shadcn/ui at ZEMA (on résumé). Groundwork shows the same primitives built from scratch. |
| Figma ↔ Storybook ↔ code sync | Explain the token-naming mapping and what you’d build first (Figma variables from `tokens.json`). |

## 7. Header placeholders

`[Your Name] · Fullerton, CA · Authorized to work in the U.S. · [Email] · [Phone] · [LinkedIn] · [Portfolio URL]`
