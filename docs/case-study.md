# Groundwork — the quiet months between *signed* and *switched on*

**Product design + design engineering case study**

> **Independent Speculative Concept — Not Affiliated with Artemis.**
> An independent speculative product concept exploring how Product Design and Design Engineering come together to create thoughtful, functional digital experiences. It was not commissioned by, reviewed by, or built with Artemis. All people, companies, addresses and numbers in the prototype are fictional. No user research was conducted; assumptions are labeled.

| | |
| --- | --- |
| **Role** | Product design, UX, visual design, design system, frontend engineering — [Your Name] |
| **Type** | Independent, self-initiated |
| **Stack** | React 19 · TypeScript (strict) · Tailwind CSS v4 · Vite · Storybook 9 · Vitest |
| **Deliverables** | Working prototype · design system (25+ components) · Storybook · AGENTS.md + component manifest · docs |
| **Live** | [Prototype](https://groundwork-concept.vercel.app) · [Repository](https://github.com/Gayanekh/groundwork) · Storybook: run `npm run storybook` locally |

---

## 1. Overview

Groundwork is a concept tool for the **project coordinators** who move a residential solar or roofing project from signed contract to *permission to operate* (PTO), and for the **homeowners** waiting on them. It ranks the projects that need attention, explains every flag in words, enforces stage rules, and turns project status into plain-language homeowner updates.

## 2. Disclaimer

Independent speculative concept. Not affiliated with Artemis. Research used only public web pages. Nothing here describes Artemis’s actual product, data, users or plans.

## 3. Context

I prepared this project while exploring a Design Engineer role at Artemis, a company whose public site presents software for solar and roofing teams. The job posting asks for someone who owns a design system across **Figma, Storybook and code**, makes it **readable by AI**, builds **quality checks** on the path to production, and **ships real workflows**. I wanted a portfolio piece that shows all four, in a related domain, without redesigning anyone’s product.

## 4. Research (public sources only)

Full notes with sources: [`company-research.md`](company-research.md), [`job-analysis.md`](job-analysis.md).

| Finding | Label |
| --- | --- |
| The public site names four audiences: Designers, Sales, Operations, Owners. | Verified |
| Operations is described as tracking projects “from sale to PTO.” | Verified |
| Most public detail is about design and selling; the post-sale journey gets less explanation. | Observation |
| After signing, most time is spent waiting on outside parties; homeowners can’t see progress. | Interpretation |
| Coordinators lack a ranked view of what needs them today. | **Assumption — needs validation** |

## 5. Problem statement

> How might we help a coordinator see which projects need them today, move projects forward safely, and keep each homeowner informed in words they understand?

## 6. Target audience

**Primary — Project coordinator** *(assumption-based profile)*: manages dozens of active projects; mostly at a desk, sometimes on a phone in the field; judged on cycle time and customer satisfaction.

**Secondary — Homeowner** *(receives output)*: signed weeks ago; doesn’t know “AHJ” or “interconnection”; wants to know where things are, what is next, and whether they must do anything.

## 7. User needs

1. See what needs me **today**, most urgent first.
2. Understand **why** something is flagged.
3. Know **when** a project is allowed to move on.
4. Record **what** is in the way and **who** we are waiting on.
5. Update the homeowner **quickly** and **clearly**.
6. Find any project in seconds.

## 8. Product strategy

Four principles, each with a feature behind it:

| Principle | Feature |
| --- | --- |
| **Rank, don’t list** | *Today* is a ranked attention queue, not a chart dashboard |
| **Status in words** | Health engine returns reasons; badges use icon + text |
| **Guardrails, not warnings** | Required checklist + blocker guard; disabled button explains itself |
| **Translate for the homeowner** | Every stage has a homeowner name and explanation; plain-language check |

MVP scope and what was left out: [`product-strategy.md`](product-strategy.md#8-mvp-scope).

## 9. UX approach

- **Derive, don’t store.** Health, ranking and “days in stage” are computed from facts, so they never go stale.
- **One decision per surface.** The detail page leads with the stepper, then *why it is flagged*, then the checklist that unlocks the next step.
- **Reversible by default.** Resolving a blocker shows a toast with **Undo**.
- **Do the next obvious thing for the user.** Advancing a stage offers to notify the homeowner in the same dialog — the moment they most want to hear from you.
- **URL as state.** Filters and tabs live in the query string, so the Today tiles deep-link into filtered lists and views are shareable.

## 10. Information architecture

```
/                       Presentation (this story)
/app                    Today ─ ranked queue · summary tiles · team activity
/app/projects           Projects ─ search · stage · owner · health · sort
/app/projects/:id       Project
                          ├ Overview  (checklist → advance · homeowner card · “homeowner sees this as”)
                          ├ Blockers  (open · resolve · resolved history)
                          ├ Homeowner updates (composer · preview · history)
                          └ Activity  (timeline)
```

Navigation is two items deep on purpose: coordinators live in **Today** and **Projects**; everything else is inside a project.

## 11. User journeys

**Core journey — unblock and advance** (built and tested end to end):

1. *Today* ranks Maria Delgado first: **Blocked 6d**, 5 days over the 21-day permitting target, homeowner not updated in 9 days.
2. The project page explains the same reasons in an alert above the tabs.
3. The structural letter arrives → **Resolve** → note → toast with Undo. Health changes from *Blocked* to *At risk*.
4. The last required item is checked → “**Move to Installation**” unlocks; its helper text changes from the reason to “Ready to move to Installation.”
5. Confirm dialog with “Tell Maria about the progress” pre-checked → stage moves, a plain-language update is recorded (simulated), health becomes *On track*, Today’s badge count drops.

**Supporting journeys:** proactive homeowner update (composer), find & filter (Projects), intake (New project form).

## 12. Wireframing decisions

I sketched three home-screen options before building:

| Option | Why rejected / chosen |
| --- | --- |
| KPI dashboard with charts | Answers “how are we doing?” not “what do I do now?”; invites invented metrics. **Rejected.** |
| Kanban board by stage | Good overview, but stalled cards look like healthy ones and boards are hard on phones. **Rejected for MVP.** |
| Ranked queue + four tiles | Directly answers the coordinator’s first question; works on phones. **Chosen.** |

On the detail page, the checklist sits beside the homeowner card so the coordinator always sees the two audiences together.

## 13. Visual direction

- **Warm paper, quiet ink, one ember accent.** Ops tools are open all day; a warm off-white canvas is easier on the eyes than pure white. Color is kept for meaning.
- **Two voices in type.** Instrument Sans for work; Instrument Serif only where the product speaks *to people* (homeowner stage names, the case study).
- **Editorial, not decorative.** No gradients or glass. Depth comes from borders and warm, low shadows.
- **Original identity.** Logo: a horizon line with a rising path. No Artemis colors, fonts or assets are used.

## 14. Design system

25+ components built from scratch, one token file as the source of truth. Details: [`design-system.md`](design-system.md).

- `tokens.json` (DTCG) → `tokens.css` (Tailwind `@theme`) + `tokens.ts`.
- Tailwind’s default palette is **disabled**, so off-system colors can’t be used by accident.
- `npm run tokens:check` fails the build if generated tokens drift; `npm run tokens:contrast` fails if any text pair drops below WCAG AA.

## 15. Important components

| Component | Design-engineering detail |
| --- | --- |
| **Select** | Full select-only combobox: arrows, Home/End, type-ahead, disabled options skipped, portaled list that flips near the viewport edge. |
| **Dialog** | Focus trap + restore, Esc, scroll lock without layout shift, exit animations, **becomes a bottom sheet on phones** automatically. |
| **Field** | Context wires `id`, `aria-describedby`, `aria-invalid`, `required` into any control inside it — app code can’t forget. |
| **Stepper** | Ordered list with screen-reader status text; horizontal, vertical, and compact variants. |
| **Toast** | `aria-live`, pause on hover/focus, single action (Undo). |
| **UpdateComposer** *(product)* | Draft from state → jargon check with one-click fixes → live SMS/email preview → simulated send. |

## 16. Key product screens

- **Today** — greeting, four deep-linking tiles, ranked queue with reasons and compact stepper, team activity.
- **Projects** — search (`/` shortcut), stage/owner selects with counts, health segmented control with counts, sortable table (≥768px) or cards (<768px), empty state with “Clear filters.”
- **Project** — stepper, reasons alert, tabs for checklist, blockers, homeowner updates and activity.
- **New project** — grouped fieldsets, channel-dependent requirements, inline errors, error summary, focus to first invalid field.

*(Add screenshots: `[screenshot: today-desktop.png]`, `[screenshot: project-mobile.png]`, `[screenshot: composer.png]`, `[screenshot: storybook-select.png]`.)*

## 17. Interaction examples

- **Disabled with a reason:** “Complete 1 more required checklist item first.” → check it → “Ready to move to Installation.” and the button enables.
- **Plain-language check:** “the AHJ approved your plan set” → flags *AHJ* and *plan set* → **Replace** → “the city permit office approved your system plans.”
- **Undo:** resolve a blocker → toast → Undo reopens it and removes the activity entry.
- **Deep links:** “Blocked 3” tile → `/app/projects?health=blocked&owner=me`.

## 18. Responsive behavior

Tested at **390, 768, 1024, 1440 and 1920px** with no horizontal page overflow on any route.

| Width | Behavior |
| --- | --- |
| < 640 | Dialogs → bottom sheets; stepper → one-line “Stage 4 of 7” summary; stacked actions |
| < 768 | Projects table → cards |
| < 1024 | Sidebar → top bar + drawer |
| ≥ 1280 | Detail pages gain a side rail |
| Touch | `pointer-coarse` raises targets to 44px; inputs use 16px text |

## 19. Accessibility

- axe-core 4.14 (WCAG 2.0/2.1/2.2 A & AA + best practices): **0 violations** on every app route and the presentation page after fixes. The first run found three issues — a notice outside landmarks, an invalid `<dl>` structure, and skipped heading levels — all fixed.
- Keyboard: every control works without a mouse; verified Tab order in dialogs, arrow keys in Tabs/Select/SegmentedControl, Esc on overlays, `/` to search.
- Visible `:focus-visible` ring using `ember.600` (≥ 3:1).
- Status never relies on color; motion respects `prefers-reduced-motion`.
- **Not done:** testing with real screen-reader users. I checked semantics programmatically, not with NVDA/VoiceOver sessions.

## 20. Technical architecture

`site → app → design-system → tokens`, enforced by ESLint. Pure domain layer (`health.ts`, `plainLanguage.ts`, `stages.ts`), a single reducer for all transitions (guards included), and a provider that persists to `localStorage`. Details: [`technical-architecture.md`](technical-architecture.md).

## 21. Frontend implementation

- Three runtime dependencies: `react`, `react-dom`, `lucide-react`.
- Hand-written: router (~70 lines), floating positioning, focus trap, presence animations, class joiner.
- 32 automated tests: health rules, plain-language check, validation, reducer guards, and keyboard/ARIA behavior of Button, Field, Select, Tabs, Dialog, Switch and SegmentedControl.
- Quality gate: `npm run check` = token drift + contrast + UI-dependency audit + types + lint + tests + build.

## 22. Design engineering decisions

| Decision | Reason |
| --- | --- |
| Tokens in DTCG JSON, generated into CSS | One source for code, Storybook and a future Figma library |
| Reset Tailwind’s default theme | Makes off-system styling impossible, not just discouraged |
| `className` is for layout only | Avoids needing `tailwind-merge`; variants carry visual changes |
| `Field` context instead of prop drilling | Accessibility by construction |
| Rules in the reducer *and* the UI | The UI explains; the domain enforces |
| Health derived, not stored | Never stale; unit-testable |
| AGENTS.md + manifest | AI tools (and new teammates) get rules, inventory and patterns in one place |

## 23. Challenges and trade-offs

- **No component library** meant writing combobox, menu and dialog behavior by hand. It took longer, but it shows the underlying skills; in a team setting I would weigh this against shadcn/Radix (which the job lists and my résumé covers).
- **No backend**: a reducer plus `localStorage` keeps the demo honest and fast. Sending is visibly labeled as simulated.
- **No real users**: I designed against labeled assumptions. The biggest risk is that the health rules don’t match how coordinators actually triage.
- **Light theme only**: I spent the time on workflows and accessibility first.
- **No Figma file**: the mapping is documented, not implemented.

## 24. What I would validate first

1. Do coordinators triage by *blocked → over target → homeowner silence*, or something else?
2. Are the blocker categories the right ones?
3. Do homeowners understand the drafted messages better than typical status emails?

## 25. Future improvements

- Build the Figma library from `tokens.json` and keep names identical to component props.
- Visual regression + axe checks for every Storybook story in CI.
- Dark theme by redefining color variables.
- Homeowner-facing status page using the same stage language.
- Configurable stages and targets per installer and region.
- Real messaging with delivery status, behind a feature flag.

---

*Independent Speculative Concept — Not Affiliated with Artemis. Built by [Your Name].*
