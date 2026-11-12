# Groundwork

**Post-sale project operations for home-energy installers — a product design + design engineering concept.**

**Live prototype:** https://groundwork-tau-lemon.vercel.app · **Case study:** [docs/case-study.md](docs/case-study.md)

> **Independent Speculative Concept — Not Affiliated with Artemis.**
> An independent speculative product concept exploring how Product Design and Design Engineering come together to create thoughtful, functional digital experiences. It was not commissioned by or built with Artemis. All people, companies, addresses and numbers are fictional and illustrative. Messages and actions in the prototype are simulated.

Groundwork helps a project coordinator see which projects need them today, move each project safely from signed contract to permission to operate (PTO), and keep homeowners informed in plain language.

## What’s inside

| | |
| --- | --- |
| **Working prototype** | Today queue, Projects list, Project detail (checklist, blockers, homeowner updates, activity), New project form |
| **Design system** | 25+ components built from scratch in React + TypeScript + Tailwind CSS — no UI kits |
| **Token pipeline** | `tokens.json` (DTCG) → Tailwind v4 theme + typed TS, with drift and contrast checks |
| **Storybook** | Foundations, every component and state, product patterns, axe a11y panel |
| **AI-readable docs** | [`AGENTS.md`](AGENTS.md), [`design-system.manifest.json`](design-system.manifest.json) |
| **Case study & research** | [`docs/`](docs) |

## Quick start

Requirements: Node.js 20+ (tested with Node 24) and npm.

```bash
npm install
npm run dev
```

Open http://localhost:5173. The portfolio page is at `/`, the app at `/app`.

Tip: add `?latency=0` to skip the simulated loading delay. Use the workspace menu → **Reset demo data** to restore the starting state.

## Commands

| Command | What it does |
| --- | --- |
| `npm run dev` | Generate tokens, start Vite dev server |
| `npm run storybook` | Storybook at http://localhost:6006 |
| `npm run build` | Token check → type check → production build into `dist/` |
| `npm run preview` | Serve the production build |
| `npm run typecheck` | `tsc -b` (strict) |
| `npm run lint` | ESLint (includes design-system import rule) |
| `npm test` | Vitest unit + component tests |
| `npm run tokens` | Regenerate `tokens.css` / `tokens.ts` from `tokens.json` |
| `npm run tokens:check` | Fail if generated tokens are stale |
| `npm run tokens:contrast` | Fail if any text/background token pair is below WCAG AA |
| `npm run audit:ui` | Fail if any prebuilt UI library is installed |
| `npm run build-storybook` | Static Storybook into `storybook-static/` |
| `npm run check` | Everything above that CI should run |

## Deploying to Vercel

1. Push this folder to a Git repository (GitHub, GitLab or Bitbucket).
2. In Vercel, **Add New → Project** and import the repository.
3. Vercel reads `vercel.json`: framework Vite, build `npm run build`, output `dist`, SPA rewrites.
4. Deploy. **No environment variables are needed.** The project has no API keys or secrets.

Storybook (optional): create a second Vercel project from the same repo with build command `npm run build-storybook` and output directory `storybook-static`.

## Environment variables

None. If a backend is added later, document variables in `.env.example` and never commit `.env`.

## Project structure

```
src/
  design-system/   tokens, components, hooks — product-agnostic
  app/             domain rules, state, pages, product features
  site/            portfolio presentation page
docs/              research, strategy, design system, architecture, case study, application materials
scripts/           token build, contrast check, UI dependency audit
```

See [`docs/technical-architecture.md`](docs/technical-architecture.md).

## Documentation

- [Company research](docs/company-research.md)
- [Job analysis](docs/job-analysis.md)
- [Product strategy](docs/product-strategy.md)
- [Design system](docs/design-system.md)
- [Technical architecture](docs/technical-architecture.md)
- [Case study](docs/case-study.md)
- [Skills matrix & requirements audit](docs/skills-matrix.md)
- [Cover letter (draft)](docs/cover-letter.md)
- [CV recommendations](docs/resume-guide.md)

## Credits

Designed and built by [Your Name]. Icons: [Lucide](https://lucide.dev) (ISC license). Fonts: Instrument Sans, Instrument Serif, JetBrains Mono via Google Fonts (SIL Open Font License).
