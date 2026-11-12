# Groundwork Design System

> **Independent Speculative Concept — Not Affiliated with Artemis.**
> Built from scratch: custom React + TypeScript components styled with Tailwind CSS utilities. **No UI component library or kit is used.**

Live reference: https://groundwork-concept.vercel.app/storybook/ (or `npm run storybook` → http://localhost:6006)
Machine-readable inventory: [`design-system.manifest.json`](../design-system.manifest.json)
Rules for AI agents: [`AGENTS.md`](../AGENTS.md)

---

## 1. Principles

1. **Status in words, not color alone.** Tone + icon + text, always.
2. **Calm surfaces, one accent.** Warm paper neutrals for all-day use. `ember` is for focus, progress and brand moments only.
3. **States are part of the component.** Hover, focus-visible, active, disabled, loading, invalid and empty are designed and built.
4. **Keyboard first.** Each interactive component follows its WAI-ARIA Authoring Practices pattern.
5. **Tokens are data.** One JSON source; everything else is generated or derived from it.

## 2. Foundations (tokens)

Source: `src/design-system/tokens/tokens.json` (W3C Design Tokens Community Group draft format).
Generated: `tokens.css` (Tailwind v4 `@theme`) and `tokens.ts` (typed object). Regenerate with `npm run tokens`.

### Color

| Token | Value | Use | Contrast |
| --- | --- | --- | --- |
| `paper.base` | #F6F4EF | App canvas | — |
| `paper.raised` | #FFFFFF | Cards, popovers | — |
| `paper.sunken` | #EFECE5 | Wells, tracks, table header | — |
| `paper.inverse` | #1C1B19 | Primary button, tooltip, toast | — |
| `ink.primary` | #1C1B19 | Body, headings | 15.7:1 on paper.base |
| `ink.secondary` | #57534C | Supporting text | 7.0:1 on paper.base |
| `ink.tertiary` | #6B665D | Metadata | 5.2:1 on paper.base |
| `ink.disabled` | #A8A398 | Disabled text only | (exempt) |
| `line.subtle / default` | #E7E3DA / #D9D4C8 | Dividers, card borders | decorative |
| `line.strong` | #8F887A | Input borders | 3.5:1 on raised (WCAG 1.4.11) |
| `ember.600` | #B84E1A | Links, accent text, focus ring | 5.1:1 on raised |
| `ember.400` | #E8743B | Decorative only | not for text |
| `success/warning/danger/info.fg` | #23633F / #865000 / #A3261B / #2C4F8C | Status text | ≥ 5.8:1 on their `bg` |

Ratios are computed from `tokens.json` with the WCAG relative-luminance formula by `npm run tokens:contrast`, which is part of `npm run check` and fails if any pair drops below AA. Tailwind’s default palette is **reset**, so only these colors exist as utilities.

### Typography

| Family | Token | Use |
| --- | --- | --- |
| Instrument Sans | `font-sans` | All UI |
| Instrument Serif | `font-serif` | Editorial moments only (presentation page, homeowner stage names, page-level empty states) |
| JetBrains Mono | `font-mono` | IDs, code |

Scale (size / line height): `2xs` 11/16 · `xs` 12/16 · `sm` 13/20 · `base` 14/22 · `md` 16/24 · `lg` 18/26 · `xl` 22/30 · `2xl` 28/36 · `3xl` 40/46 · `4xl` 56/60 · `5xl` 76/76.
Dense UI uses `sm`/`base`; inputs switch to 16px on touch devices to prevent iOS zoom.

### Spacing, radius, shadow, motion, breakpoints

- **Spacing:** 4px unit (`--spacing: 0.25rem`), so `p-4` = 16px. Common rhythm: 4 / 8 / 12 / 16 / 24 / 32 / 40.
- **Radius:** `xs` 4 · `sm` 6 (inputs) · `md` 8 (buttons, menus) · `lg` 12 (cards, dialogs) · `xl` 16.
- **Shadow:** `xs` resting buttons · `sm` cards · `md` popovers · `lg` dialogs/toasts. Warm-tinted (ink-based) shadows.
- **Motion:** `duration-fast` 120ms (hover/press) · `duration-base` 180ms (popovers, tab indicator) · `duration-slow` 280ms (dialogs, toasts). Easing `ease-standard`, `ease-out` (entrances), `ease-in` (exits). Animations shrink to 1ms under `prefers-reduced-motion`.
- **Breakpoints:** `sm` 640 · `md` 768 (table ↔ cards) · `lg` 1024 (persistent sidebar) · `xl` 1280 (side rails) · `2xl` 1536.

### Grid and layout

- App content max width 88rem (1408px), 16px gutters on phones, 32px from `sm`.
- Detail pages use a `minmax(0,1fr) + 20–22rem` rail from `xl`.
- Presentation page uses a `14rem + 1fr` editorial grid from `lg`.

## 3. Components

All exported from `@/design-system`. Every component has typed props with JSDoc.

| Component | Variants / sizes | States | A11y pattern | Stories | Tests |
| --- | --- | --- | --- | --- | --- |
| Button | primary, accent, secondary, ghost, danger · sm/md/lg | hover, focus, active, disabled, loading | native button, `aria-busy` | ✓ | ✓ |
| IconButton | ghost, secondary · sm/md | hover, focus, disabled, expanded | required `aria-label` | ✓ | — |
| Spinner | size | — | `role=status` when labelled | via Button | — |
| Field | required, optional, hideLabel | error, hint | label/description wiring | ✓ | ✓ |
| Input / Textarea | sm/md, leading/trailing | hover, focus, invalid, disabled | native | ✓ | ✓ |
| Select | sm/md, prefix, option description/icon | open, active option, disabled option, invalid, disabled | select-only combobox | ✓ | ✓ |
| Checkbox | strikeWhenChecked, description | checked, hover, focus, disabled | native checkbox | ✓ | — |
| Switch | description | on/off, disabled | `role=switch` | ✓ | ✓ |
| SegmentedControl | sm/md, counts | selected, hover, focus | radiogroup | ✓ | ✓ |
| Menu (+Item, Separator, Label) | placement, item tone, hint | focus, disabled item | menu button | ✓ | — |
| Dialog | sm/md/lg · center / left drawer / bare · auto bottom sheet | enter/exit | modal dialog, focus trap | ✓ | ✓ |
| Tabs (+TabList, Tab, TabPanel) | count | selected, disabled | tabs, roving tabindex | ✓ | ✓ |
| Tooltip | placement, delay | hover, focus, Esc | `role=tooltip`, describedby | ✓ | — |
| Badge / StatusDot | 6 tones · sm/md · dot/icon | — | text label | ✓ | — |
| Card / CardHeader | padding, interactive, heading level | hover (interactive) | section + heading | ✓ | — |
| Table (+Container, THead, TBody, TRow, TH, TD) | sortable, align | hover row, selected row, sorted | native table, `aria-sort`, scroll region | ✓ | — |
| Toast (Provider + useToast) | success, info, danger · action | pause on hover/focus | `aria-live` | ✓ | — |
| Avatar | xs/sm/md, decorative | — | `role=img` | ✓ | — |
| Stepper | full / compact | complete, current, blocked, upcoming | ordered list, `aria-current=step` | ✓ | — |
| Alert | info, success, warning, danger · action | — | note / alert | ✓ | — |
| EmptyState | quiet / page | — | — | ✓ | — |
| Skeleton | any shape | shimmer | hidden from AT | ✓ | — |
| ProgressBar | ink, accent, success | — | `role=progressbar` | ✓ | — |
| Kbd | — | — | `<kbd>` | ✓ | — |

Product patterns (in `src/app/features`, not in the design system because they know the domain): `HealthBadge`, `ProjectStepper`, `UpdateComposer`, `NewProjectDialog`, `AddBlockerDialog`, `ResolveBlockerDialog`, `AdvanceStageDialog`.

### Shared infrastructure (`src/design-system/lib`)

| Utility | Purpose |
| --- | --- |
| `cx()` | Class joiner (no clsx). |
| `useControllableState` | Controlled/uncontrolled props in one hook. |
| `useFloating` | Fixed positioning with flip + viewport shift (no Floating UI). |
| `useOutsidePointer` | Close popovers on outside pointerdown. |
| `useFocusTrap` | Trap Tab focus; restore focus on close. |
| `usePresence` | Keep overlays mounted for exit animations; respects reduced motion. |
| `useScrollLock` | Lock body scroll without layout shift. |
| `useMediaQuery` | Responsive behavior in JS (e.g. Dialog → sheet). |
| `Portal` | Render overlays into `document.body`. |

## 4. Usage rules

- Import only from `@/design-system` (ESLint enforced in app code).
- `className` on components is for layout only. Need a new look? Add a variant.
- One `primary` button per view region. Put the primary action last in dialog footers.
- Disabled buttons need a visible reason linked with `aria-describedby`.
- Forms: validate on submit, then live; focus the first invalid field; show a summary `role="alert"`.
- Use `Toast` for feedback after an action (with Undo when reversible). Use `Alert` for persistent, region-specific information.
- Empty states always say why and offer the next step.

## 5. Naming conventions

| Thing | Convention | Example |
| --- | --- | --- |
| Tokens | `group.role[.scale]` in JSON → `--group-role` CSS var → `utility-group-role` | `color.ink.secondary` → `text-ink-secondary` |
| Components | PascalCase, one folder each | `components/SegmentedControl/SegmentedControl.tsx` |
| Compound parts | Prefix with parent | `TabList`, `TabPanel`, `MenuItem` |
| Props | `variant`, `size`, `tone` for visual axes; `on<Event>` for callbacks; `default<Value>` for uncontrolled | `tone="danger"`, `onChange`, `defaultValue` |
| Stories | `Components/<Group>`; one story per state group | `Components/Form controls → Select` |

## 6. Figma ↔ code mapping

**Status:** a Figma plugin in [`figma-plugin/`](../figma-plugin/README.md) builds the library below from `tokens.json`. It type-checks against Figma's official API types but **has not been run inside Figma yet**, so no Figma file exists until you run it. The mapping:

| Code | Figma equivalent (created by the plugin) |
| --- | --- |
| `tokens.json` → `color.*` | Variable collection **Color** (modes: Light; Dark later) |
| `text.*`, `font.*` | Text styles named `text/base`, `text/sm`… |
| `radius.*`, `spacing.unit` | Variable collection **Dimension** (number variables) |
| `shadow.*` | Effect styles `shadow/sm`… |
| Component props `variant`, `size`, `tone` | Component properties with the **same names and values** |
| Boolean props (`loading`, `disabled`, `dot`) | Boolean component properties |
| `leadingIcon`, `icon` | Instance-swap properties |
| Storybook story names | Figma page/section names |

Keeping names identical is the main sync mechanism. Because tokens are already in DTCG JSON, a token plugin or a small script using the Figma Variables REST API could import them. That workflow is **not implemented or tested** here; it is the first next step listed in the case study.

## 7. Dependency audit (performed)

`package.json` was inspected on November 12, 2026.

| Package | Type | UI-related? | Verdict |
| --- | --- | --- | --- |
| react, react-dom | runtime | framework | allowed |
| lucide-react | runtime | individual SVG icons | allowed (icons only, no components) |
| tailwindcss, @tailwindcss/vite | dev | utility CSS engine | allowed (styling utility only) |
| storybook, @storybook/react-vite, @storybook/addon-docs, @storybook/addon-a11y | dev | documentation tooling | allowed (not shipped to users) |
| vite, @vitejs/plugin-react, typescript, eslint, typescript-eslint, eslint plugins, globals, vitest, jsdom, @testing-library/* , @types/* | dev | build/test | allowed |

**Prohibited libraries present:** none. Verified by searching `package.json` and `node_modules` for shadcn, @radix-ui, @mui, @chakra-ui, antd, daisyui, bootstrap and @headlessui (see `npm run audit:ui`).
