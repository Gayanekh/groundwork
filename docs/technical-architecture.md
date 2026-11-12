# Technical architecture — Groundwork

> **Independent Speculative Concept — Not Affiliated with Artemis.**

## 1. Stack and why

| Choice | Version | Why |
| --- | --- | --- |
| React | 19.1 | Component model; `useId`, `useSyncExternalStore`; ref as prop |
| TypeScript | 5.8 (strict) | Typed component APIs are documentation that cannot go stale |
| Vite | 6.3 | Fast dev server; same config reused by Storybook and Vitest |
| Tailwind CSS | 4.1 | Utility styling bound to tokens through `@theme`; no runtime CSS-in-JS |
| lucide-react | 0.511 | Individual SVG icons only (not a component system) |
| Storybook | 9.0 | Component workshop + docs + axe accessibility panel |
| Vitest + Testing Library | 3.2 / 16.3 | Unit tests for domain rules; behavior tests for components |
| ESLint + typescript-eslint | 9 / 8 | Includes a custom design-system import rule |

**Not used, on purpose:** UI component libraries (shadcn/ui, Radix, MUI, Chakra, Ant, DaisyUI, Headless UI), routing libraries, state libraries, `clsx`, `tailwind-merge`, Floating UI. Each was replaced by a small, readable implementation because the prototype’s needs are small. The runtime has **three** dependencies: `react`, `react-dom`, `lucide-react`.

## 2. Folder structure

```
groundwork/
├─ AGENTS.md                      rules for AI agents and new contributors
├─ design-system.manifest.json    machine-readable component metadata
├─ scripts/build-tokens.mjs       token pipeline (generate + --check)
├─ .storybook/                    Storybook config (reuses vite.config.ts)
├─ docs/                          research, strategy, system, case study…
└─ src/
   ├─ design-system/              product-agnostic UI
   │  ├─ tokens/                  tokens.json (source) → tokens.css / tokens.ts (generated)
   │  ├─ lib/                     cx, hooks, Portal
   │  ├─ components/<Name>/       component + stories (+ tests)
   │  └─ index.ts                 public API (the only import path)
   ├─ app/
   │  ├─ domain/                  pure TS business rules (tested)
   │  ├─ state/                   reducer + provider + persistence
   │  ├─ data/seed.ts             fictional demo data
   │  ├─ features/                product components
   │  ├─ pages/                   route screens
   │  ├─ layout/                  AppShell, Logo
   │  └─ router.tsx               History API router
   ├─ site/PresentationPage.tsx   portfolio page at "/"
   └─ styles/index.css            Tailwind import, tokens, base layer, motion
```

**Dependency rule:** `site → app → design-system → tokens`. The design system never imports product code. ESLint blocks deep imports into the design system from app code.

## 3. Token pipeline

```
tokens.json (DTCG)  ──node scripts/build-tokens.mjs──►  tokens.css  (@theme for Tailwind v4)
                                                     └► tokens.ts   (typed object for JS, Storybook)
```

- `@theme` resets Tailwind’s defaults (`--color-*: initial`, etc.). Only Groundwork tokens become utilities.
- `npm run build` runs `tokens:check` first. If someone edits `tokens.json` without regenerating, **the build fails**.
- Contrast ratios for text tokens were computed with the WCAG formula and recorded in token descriptions.

## 4. Routing

`src/app/router.tsx` (~70 lines): `useSyncExternalStore` over `history`, `navigate()`, `<Link>` (respects modifier-click), and `matchPath()` with params.

| Route | Screen |
| --- | --- |
| `/` | Portfolio presentation page |
| `/app` | Today (ranked attention queue) |
| `/app/projects` | Projects list (`?q&stage&health&owner&sort&dir`) |
| `/app/projects/:id` | Project detail (`?tab=blockers|updates|activity`) |
| anything else | Not found |

On route change the shell resets scroll and moves focus to `<main>` so screen-reader users hear the new page. `vercel.json` rewrites all paths to `index.html`.

## 5. State

- `projectsReducer` (pure) holds every transition: toggle checklist, advance stage, add/resolve/reopen blocker, send update, create project, reset.
- Business rules live in `domain/` and are **also enforced in the reducer** (e.g. `advanceStage` is a no-op when `advanceBlockedReason()` returns a reason).
- **Derived, never stored:** health, ranking score, days in stage, days since update.
- `ProjectsProvider` persists to `localStorage` under `groundwork.projects.v1` (wrapped in try/catch; falls back to seed data).
- Each action maps 1:1 to a future API mutation, so a backend could replace the reducer without UI changes.

### Simulated behavior (clearly labeled in UI and code)

| What | How |
| --- | --- |
| Initial load latency | 450 ms timer to exercise skeletons. Skip with `?latency=0`. |
| Sending SMS/email | 700 ms timer, then recorded locally. **Nothing is delivered.** |
| Data | Fictional seed (`src/app/data/seed.ts`). |

## 6. Accessibility architecture

- Every overlay is portaled; dialogs trap focus, restore it, close on Esc, and set `aria-modal`, `aria-labelledby`, `aria-describedby`.
- WAI-ARIA patterns implemented by hand: combobox/listbox (Select), menu button (Menu), tabs, radiogroup (SegmentedControl), switch, dialog, tooltip.
- `Field` provides label/description/invalid wiring through context so app code cannot forget it.
- `prefers-reduced-motion` shortens all animations and transitions.
- `pointer-coarse:` variants increase touch targets to 44px.

## 7. Quality gates

| Command | What it checks |
| --- | --- |
| `npm run tokens:check` | Generated token files match `tokens.json` |
| `npm run typecheck` | `tsc -b`, strict mode |
| `npm run lint` | ESLint, React hooks rules, design-system import rule |
| `npm test` | Domain rules, reducer guards, component keyboard/ARIA behavior |
| `npm run build` | tokens:check + typecheck + Vite production build |
| `npm run build-storybook` | All stories compile |
| `npm run check` | All of the above except Storybook |

## 8. Running and deploying

```bash
npm install
npm run dev            # http://localhost:5173
npm run storybook      # http://localhost:6006
npm run check          # full quality gate
npm run build && npm run preview
```

**Vercel:** import the repository; `vercel.json` sets the Vite framework, `npm run build`, output `dist`, and SPA rewrites. No environment variables are required. No API keys or secrets exist in this project.

To deploy Storybook alongside, run `npm run build-storybook` and host `storybook-static/` as a second Vercel project (or any static host).

## 9. Known limitations

- Single light theme (tokens are structured to add a dark mode by redefining CSS variables).
- No backend, auth or real messaging.
- The floating-position hook handles flip and horizontal shift, not every edge case a library like Floating UI covers.
- Tests cover domain logic and key component behavior. There are no end-to-end or visual regression tests yet.
