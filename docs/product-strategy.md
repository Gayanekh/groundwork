# Product strategy — Groundwork

> **Independent Speculative Concept — Not Affiliated with Artemis.**
> An independent speculative product concept exploring how Product Design and Design Engineering come together to create thoughtful, functional digital experiences.
> All people, companies, addresses and numbers are fictional and illustrative. No user research was conducted; profiles below are **assumption-based** and labeled as such.

## 1. Why this direction

Research (see `company-research.md`) showed a public product story focused on **design and sales**, while the company also names **Operations** and the outcome “from sale to PTO.” The job posting asks for someone who can **design and build real workflows** and **own a design system**.

I chose the post-sale coordination problem because it:

1. **Is adjacent, not a copy.** It sits next to the domain without redesigning any existing Artemis screen or feature.
2. **Has real workflow depth.** Stages, rules, blockers, people outside the company, and a second audience (the homeowner). That lets me show product thinking, not just visuals.
3. **Exercises the whole design-engineering stack.** Dense data UI (tables, filters), forms with validation, dialogs, tabs, menus, toasts, empty/loading states, responsive behavior and accessibility all have a real reason to exist.
4. **Has a clear, testable core journey** that can be built end to end in a prototype.

Alternatives considered and rejected:

| Idea | Why not |
| --- | --- |
| Proposal / design tool | Too close to Artemis’s core product; would read as a redesign. |
| Analytics dashboard for owners | Mostly charts; weak workflows; invites invented metrics. |
| Homeowner-only app | Interesting, but less design-system and data-UI depth. Kept as a future extension. |

## 2. Problem statement

After a home-energy contract is signed, a project passes through survey, design, permitting, installation, inspection and utility approval. Much of that time is spent **waiting on others**: city permit offices, utilities, lenders and suppliers.

**[Assumption]** Coordinators track many projects across spreadsheets, inboxes and memory. Stalled projects hide among healthy ones. Rules about when a project can move forward are informal. Homeowners hear little and receive jargon when they do.

> **How might we** help a coordinator see which projects need them today, move projects forward safely, and keep each homeowner informed in words they understand?

## 3. Target users (assumption-based profiles)

These are **not research personas**. They are working hypotheses to design against and later validate.

### Project coordinator — primary user
- Owns 20–60 active projects (assumption).
- Works at a desk most of the day; checks status from a phone in the field.
- Needs: know what is stuck and why; know what to do next; avoid mistakes (moving a project too early); keep homeowners calm with minimal effort.
- Frustrations (assumed): chasing status, rewriting the same update, being called by anxious homeowners.

### Homeowner — secondary audience (receives output)
- Signed a contract weeks ago; does not know industry terms.
- Needs: to know where things are, what happens next, how long it usually takes, and whether they must do anything.

## 4. User needs → product response

| Need | Response | Feature |
| --- | --- | --- |
| See what needs me today | Ranked queue, not a chart dashboard | Today page |
| Understand why a project is flagged | Health with written reasons | Health engine + `HealthBadge` + Alert |
| Know when a project can move on | Required checklist + blocker guard, with the reason shown | Stage checklist, `advanceBlockedReason` |
| Record what is in the way | Structured blockers (category, waiting on) | Add / resolve blocker dialogs, Undo |
| Tell the homeowner, quickly and clearly | Drafted message from stage, jargon check, live preview | Update composer |
| Find any project | Search + filters in the URL | Projects page |
| Start tracking a new signed contract | Validated form | New project dialog |

## 5. Core use cases

1. **Morning triage** — open Today, work down the ranked list.
2. **Unblock and advance** — resolve a blocker, finish the checklist, move to the next stage, notify the homeowner in the same step.
3. **Proactive update** — send a homeowner update when they have not heard from the team in a week.
4. **Find and filter** — answer “which permits are over target for Marcus?” from the Projects page.
5. **Intake** — create a project from a signed contract.

## 6. Primary user journey

```
Today ──► Project (stuck in Permitting, blocked 6d)
            │
            ├─► Blockers tab ─► Resolve (note) ─► toast + Undo
            │
            ├─► Overview ─► check last required item ─► "Move to Installation" unlocks
            │                                  │
            │                                  └─► Confirm dialog ─► ☑ notify homeowner
            │
            └─► Health returns to On track; Today queue shrinks
```

## 7. Differentiation (product ideas, not claims about the market)

- **Rank, don’t list.** The home screen answers “what needs me?” instead of showing totals.
- **Status in words.** Every flag carries its reason.
- **Guardrails over warnings.** Rules are enforced in the domain layer and explained in the UI.
- **Two vocabularies.** Every stage has an ops name *and* a homeowner name + explanation; a plain-language check protects outgoing messages.

## 8. MVP scope

**In:** Today queue; Projects list with search, filters, sorting, table/cards; project detail with stepper, checklist, blockers, homeowner updates, activity; new project form; local persistence; reset demo data; presentation page.

**Out (deliberately):** authentication, roles and permissions, real messaging, file uploads, integrations, notifications, configurable stages/SLAs, homeowner-facing portal, dark theme, analytics.

## 9. Success signals to test (hypotheses, not results)

No results are claimed. If this were built for real, I would test:

- Time for a coordinator to identify the three most urgent projects.
- Share of stage moves accompanied by a homeowner update.
- Homeowner comprehension of drafted messages (5-second test).
- Inbound “where is my project?” calls per active project.

## 10. Validation plan (not yet done)

1. Five 45-minute interviews with operations coordinators at residential installers.
2. Card sort of blocker categories.
3. Moderated usability test of the core journey on the prototype (desktop + phone).
4. Homeowner comprehension test of drafted messages vs. jargon versions.
