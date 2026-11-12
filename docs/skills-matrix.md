# Skills-to-requirements matrix and final audit

> **Independent Speculative Concept — Not Affiliated with Artemis.**
> Requirements are taken from the public job posting (see `job-analysis.md`). A requirement is marked **Fully** only when working evidence exists in this repository and was run. Documentation alone never counts.

Legend: **Fully** = implemented and verified · **Partially** = some working evidence, with a stated gap · **Not** = not demonstrated by this project.

## A. Responsibilities

| Job requirement | Relevant skill | Project evidence | Location | Status |
| --- | --- | --- | --- | --- |
| R1 Own the design system — components | Component architecture | 25+ custom components with typed props, variants, sizes and states; public API barrel | `src/design-system/components/*`, `src/design-system/index.ts` | **Fully** |
| R1 — tokens | Design tokens | DTCG `tokens.json` → generated Tailwind theme + TS; drift check fails the build; contrast check | `tokens/`, `scripts/build-tokens.mjs`, `scripts/contrast.mjs` | **Fully** |
| R1 — APIs | API design | Consistent `variant/size/tone`, controlled + uncontrolled (`useControllableState`), compound components, `forwardRef` | components, `lib/hooks.ts` | **Fully** |
| R1 — accessibility | A11y engineering | WAI-ARIA patterns by hand; axe 0 violations on all routes; keyboard tests | components, `components.test.tsx` | **Fully** (no screen-reader user testing) |
| R1 — in sync across Figma, Storybook, code | Design-to-code | Code ↔ Storybook: stories render from the same components and generated tokens. Storybook is public at https://groundwork-concept.vercel.app/storybook/. Figma: [library](https://www.figma.com/design/56o8GWt9D6Ko6WLTQEbOJi) generated from `tokens.json` — 76 variables, 29 styles, Button/Badge/Input with prop names identical to code, bindings audited. 23 components and Code Connect not yet in Figma | `.storybook/`, Figma file, `docs/design-system.md#6` | **Partially** (foundations full; 3 of 26 components) |
| R2 Make it readable by AI | AI-readable docs | `AGENTS.md` (rules, cheat sheet, patterns, checklist), `design-system.manifest.json` (component metadata), JSDoc on props, Storybook docs | repo root, `src/design-system/Introduction.mdx` | **Fully** (not evaluated with an AI eval) |
| R3 Path to production — quality checks | Tooling | `npm run check`: token drift, contrast, UI-dependency audit, types, lint (incl. import rule), tests, build | `package.json`, `scripts/`, `eslint.config.js` | **Fully** |
| R3 — starters / reference flows | Reference patterns | Documented reference patterns (validation, disabled-with-reason, URL state, domain guards) in AGENTS.md; no CLI starter template | `AGENTS.md §6` | **Partially** |
| R4 Design and build products | Product design + frontend | Working app with complete core journey, tested in browser end to end | `src/app/*` | **Fully** |
| R4 — turn the best into reusable patterns | Pattern extraction | `HealthBadge`, `ProjectStepper`, `UpdateComposer` extracted and documented in Storybook | `src/app/features/*`, `ProductPatterns.stories.tsx` | **Fully** |

## B. Qualifications

| Job requirement | Relevant skill | Project evidence | Location | Status |
| --- | --- | --- | --- | --- |
| Q1 Shipped component-based frontends and design systems | Shipping | This project is component-based and deploy-ready (Vercel config). “Shipped” to real users is evidenced by the résumé, not by this repo | `vercel.json`, résumé | **Partially** (not deployed yet) |
| Q2 React | React | React 19, hooks, context, portals, `useSyncExternalStore` | `src/` | **Fully** |
| Q2 TypeScript | TypeScript | Strict mode, generic components (`Select<V>`, `SegmentedControl<V>`), discriminated-union actions | `tsconfig.app.json`, reducer | **Fully** |
| Q2 Tailwind | Tailwind v4 | `@theme` tokens, theme reset, custom utilities, `pointer-coarse`/`aria-*` variants | `styles/index.css`, `tokens.css` | **Fully** |
| Q2 shadcn | shadcn/ui | Intentionally **not used** (portfolio constraint). The same patterns (Tailwind + accessible primitives + variants) are built from scratch. Prior shadcn/ui production use is on the résumé | `docs/job-analysis.md §4` | **Partially** |
| Q2 Storybook | Storybook | 27 stories + 8 docs pages, public at https://groundwork-concept.vercel.app/storybook/ (deployed with the site, verified rendering); a11y addon; autodocs from TS types | `.storybook/`, `*.stories.tsx` | **Fully** |
| Q3 Leading user feedback sessions | Research facilitation | No sessions run. A validation plan is written | `product-strategy.md §10` | **Not** |
| Q4 HTML, CSS | Semantics + styling | Semantic landmarks, native table/form elements, `dl`, `ol`; CSS animations, reduced motion | across `src/` | **Fully** |
| Q4 Accessibility | WCAG | axe 0 violations; contrast script; keyboard tests | see above | **Fully** |
| Q4 Design tokens | Tokens | see R1 | | **Fully** |
| Q4 Frontend testing | Testing | 32 Vitest + Testing Library tests (domain, reducer, component behavior). No e2e or visual regression | `src/**/*.test.ts(x)` | **Partially** |
| Q5 Uses AI coding tools in real product work | AI workflow | This project was built with an AI coding agent under my direction, with AGENTS.md as the contract. Real product use is on the résumé | `AGENTS.md`, résumé | **Partially** (process, not an artifact) |
| N1 Structured context, component metadata | AI context | `design-system.manifest.json` + AGENTS.md | repo root | **Fully** |
| N1 Code generation / AI evals | Codegen, evals | Token code generation exists; no AI eval suite | `scripts/build-tokens.mjs` | **Partially** |

## C. Focus areas (requested audit)

| # | Area | Evidence | Status |
| --- | --- | --- | --- |
| 1 | Figma-to-code consistency | Figma library built from `tokens.json`; same names and values; component bindings audited against code | **Fully** for foundations · **Partially** for components (3 of 26) |
| 2 | Design tokens | Generated, enforced, contrast-checked | **Fully** |
| 3 | Reusable components | 25+, public API, lint-enforced | **Fully** |
| 4 | Storybook & component docs | Public; all 27 stories render without errors (checked one by one) | **Fully** |
| 5 | AI-readable documentation | AGENTS.md + manifest + JSDoc | **Fully** |
| 6 | Real product workflows | Core journey + 3 supporting journeys, browser-tested | **Fully** |
| 7 | Frontend implementation quality | Strict TS, lint clean, tests pass, prod build passes | **Fully** |
| 8 | Responsive behavior | 390/768/1024/1440/1920 checked, no overflow | **Fully** |
| 9 | Accessibility | axe 0 violations, keyboard verified; no AT user testing | **Fully** (with stated limit) |
| 10 | Code quality & maintainability | Layered architecture, pure domain, reducer guards, docs | **Fully** |

## D. Remaining gaps and what would close them

| Gap | Next step |
| --- | --- |
| Figma covers 3 of 26 components | Add Checkbox, Select, Tabs, Dialog next; add Code Connect mappings |
| No user feedback sessions | Kit ready in `docs/feedback-sessions.md`; run 3 sessions and fill in the case-study section |
| ~~Not deployed~~ | Done: app and Storybook on Vercel |
| No e2e / visual tests | Playwright for the core journey; Storybook test-runner with axe per story |
| shadcn not shown | Optional branch re-implementing two components on shadcn/ui to compare |
