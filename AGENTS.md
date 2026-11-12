# AGENTS.md — Groundwork

Instructions for AI coding agents (Claude Code, Cursor, Copilot, Codex, etc.) and for people new to this repo.
Read this file before you change anything. It is short on purpose.

> **Independent Speculative Concept — Not Affiliated with Artemis.** Never add copy, logos or claims that suggest otherwise.

## 1. What this is

Groundwork is a React + TypeScript + Tailwind CSS v4 prototype of a post-sale project-operations tool for home-energy installers.
There is **no backend**. State lives in a reducer and is persisted to `localStorage`. All people, companies and data are fictional.

## 2. Commands

| Task | Command |
| --- | --- |
| Install | `npm install` |
| Dev server | `npm run dev` (http://localhost:5173) |
| Regenerate tokens | `npm run tokens` |
| Type check | `npm run typecheck` |
| Lint | `npm run lint` |
| Unit + component tests | `npm test` |
| Storybook | `npm run storybook` (http://localhost:6006) · live: https://groundwork-concept.vercel.app/storybook/ |
| Figma plugin | `npm run figma:build` / `npm run figma:check` (see `figma-plugin/README.md`) |
| Everything CI runs | `npm run check` |

Run `npm run check` before you say a change is done. It must pass.

## 3. Architecture map

```
src/
  design-system/          ← reusable UI, no product knowledge
    tokens/tokens.json    ← SOURCE OF TRUTH for every visual value
    tokens/tokens.css|ts  ← GENERATED. Never edit by hand.
    lib/                  ← cx(), hooks (useFloating, useFocusTrap, usePresence…), Portal
    components/<Name>/    ← one folder per component (+ stories, tests)
    index.ts              ← the ONLY public API
  app/
    domain/               ← pure TS: types, stage rules, health engine, plain-language check
    state/                ← reducer + ProjectsProvider (localStorage)
    data/seed.ts          ← fictional demo data
    features/             ← product components (dialogs, composer)
    pages/                ← route screens
    layout/               ← AppShell, Logo
    router.tsx            ← tiny History API router
  site/PresentationPage.tsx ← portfolio page at "/"
```

Dependency direction: `site → app → design-system → tokens`. The design system must never import from `app/`.

## 4. Hard rules

1. **No UI libraries.** Do not install shadcn/ui, Radix, MUI, Chakra, Ant, DaisyUI, Headless UI, Bootstrap or any component kit. Build it in `src/design-system/components/`.
2. **Import UI only from `@/design-system`.** Deep imports like `@/design-system/components/Button/Button` fail lint in app code.
3. **Tokens only.** Use token utilities: `bg-paper-raised`, `text-ink-secondary`, `border-line-default`, `text-danger-fg`, `rounded-md`, `shadow-sm`. Tailwind's default palette is disabled, so `bg-blue-500` or `text-gray-600` generate **no CSS**. No hex values in components. No arbitrary colors like `bg-[#fff]`.
4. **To change a color, size, radius, shadow or duration:** edit `tokens.json` → `npm run tokens`. The build fails (`tokens:check`) if generated files are stale.
5. **`className` on a component is for layout only** (margin, width, flex/grid placement). Do not override its colors or typography; add a variant instead.
6. **No color-only meaning.** Status = icon + text + tone. Use `HealthBadge` / `Badge` with a label.
7. **Every interactive element is keyboard-operable** with a visible focus ring (global `:focus-visible` style; don't remove outlines).
8. **Every input has a label.** Wrap controls in `<Field label=…>` or pass `aria-label`. Icon-only buttons use `IconButton` (its `aria-label` is required by type).
9. **Never claim simulated things are real.** Sending messages is simulated; keep the "Simulated" copy.
10. **Fictional data only.** Phones `(xxx) 555-01xx`, emails `@example.com`, fictional names and companies.

## 5. Component cheat sheet

Full inventory with props: `design-system.manifest.json`. Live examples: Storybook.

| Need | Use | Not |
| --- | --- | --- |
| Action | `Button` (`primary` once per region; `secondary` default; `ghost` low-emphasis; `danger` destructive) | styled `<div onClick>` |
| Link that looks like a button | `<Link className={buttonStyles({variant:'primary'})}>` | `<Button onClick={navigate}>` |
| Icon-only action | `IconButton` + `Tooltip` | `Button` with no text |
| Text entry | `Field` + `Input` / `Textarea` | bare `<input>` |
| Pick one of many (>5 or long labels) | `Select` | native `<select>` styled ad hoc |
| Pick one of 2–5 short options | `SegmentedControl` | Tabs |
| Switch content views | `Tabs` | SegmentedControl |
| Setting that applies immediately | `Switch` | Checkbox |
| Form choice / checklist | `Checkbox` | Switch |
| Row actions | `Menu` + `MenuItem` | custom popover |
| Confirm / short form | `Dialog` (sheet on phones automatically) | `window.confirm` |
| Feedback after an action | `useToast()` (add `action: Undo` when reversible) | `alert()` |
| Persistent inline message | `Alert` | Toast |
| Nothing to show | `EmptyState` (say why + next step) | blank space |
| Loading | `Skeleton` shaped like the content, `aria-busy` on region | spinner on whole page |
| Ordered progress | `Stepper` | custom dots |

## 6. Patterns to copy

- **Form validation:** validate on submit; after the first attempt, re-validate live; focus the first `[aria-invalid="true"]`; summary `role="alert"` at the top. See `src/app/features/NewProjectDialog.tsx`.
- **Disabled with a reason:** never leave a disabled button unexplained — render the reason as visible text linked by `aria-describedby`. See `ChecklistCard` in `ProjectDetailPage.tsx`.
- **Derived state:** never store health/status; compute it from data with a pure, tested function (`src/app/domain/health.ts`).
- **Domain guards:** enforce rules in the reducer too, not only by disabling buttons (`advanceStage` in `projectsReducer.ts`).
- **URL as state:** filters/tabs live in the query string (`ProjectsPage.tsx`) so views are shareable.

## 7. Adding a component (checklist)

1. `src/design-system/components/<Name>/<Name>.tsx` — typed props with JSDoc on every prop, `forwardRef` if it wraps a native element.
2. All states: default, hover, `focus-visible`, active, disabled, plus loading/invalid/empty where relevant.
3. Follow the WAI-ARIA Authoring Practices pattern for its role.
4. Export from `src/design-system/index.ts`.
5. Stories in `<Name>.stories.tsx` (variants, sizes, states, usage pattern).
6. A behavior test for keyboard and ARIA in `components.test.tsx` (or its own `*.test.tsx`).
7. Add an entry to `design-system.manifest.json` and `docs/design-system.md`.
8. `npm run check`.

## 8. Writing style in the UI

American English. Short, plain sentences. Sentence case for labels and buttons ("Move to Installation", not "MOVE TO INSTALLATION"). Buttons say what happens ("Send text", not "Submit"). Error messages say how to fix ("Use a 5-digit ZIP code, like 92831."). Homeowner-facing text must pass the plain-language check (`findJargon()` returns `[]`).
