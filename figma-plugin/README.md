# Groundwork → Figma plugin

Builds the Figma side of the Groundwork design system from the **same `tokens.json` the code uses**, so names and values match by construction.

> **Independent Speculative Concept — Not Affiliated with Artemis.**

## What it creates

| In Figma | From | Matches in code |
| --- | --- | --- |
| Variable collection **Groundwork / Color** (mode: Light) — `paper/base`, `ink/secondary`, `danger/fg`… | `tokens.json → color` | `bg-paper-base`, `text-ink-secondary`… (code syntax set to `var(--color-…)`) |
| Variable collection **Groundwork / Dimension** — `radius/*`, `spacing/unit`, `text/*/size`, `text/*/line-height` | `radius`, `spacing`, `text` | `rounded-md`, `--spacing`, `text-base`… |
| Text styles `text/2xs` … `text/5xl` | `text`, `font` | `text-*` utilities |
| Effect styles `shadow/xs` … `shadow/lg` | `shadow` | `shadow-*` utilities |
| Page **Foundations** | swatches bound to variables, type scale, shadows | Storybook → Foundations/Tokens |
| Page **Components** → **Button** (`variant` × `size` × `state`, text property `label`) | | `<Button variant size disabled>` |
| **Badge** (`tone` × `size`, text `label`, boolean `dot`) | | `<Badge tone size dot>` |
| **Input** (`state` = default / focus / invalid / disabled, text `label`, `hint`) | | `<Field label hint error><Input/></Field>` |

All fills, strokes and corner radii are **bound to variables**, so changing a variable in Figma updates every component, the same way changing `tokens.json` updates the code.

## How to run it (Figma desktop app, about 2 minutes)

1. Open the **Figma desktop app** (plugins in development can’t be imported in the browser).
2. Create a new design file, for example “Groundwork Design System”.
3. Menu → **Plugins → Development → Import plugin from manifest…**
4. Choose `figma-plugin/manifest.json` from this repository.
5. Menu → **Plugins → Development → Groundwork Design System** to run it.
6. When it finishes, a message shows how many variables, styles and component sets it made.

Running it again replaces what it made before. It removes, by name, the **Groundwork /** variable collections, the `text/*` and `shadow/*` styles, and the **Foundations** and **Components** pages. Use a dedicated file.

**Fonts:** Instrument Sans is a Google Font and is normally available in Figma. If it isn’t, the plugin falls back to Inter and tells you.

**Network:** the plugin makes no network requests (`allowedDomains: none`).

## Keeping it in sync

```bash
npm run figma:build   # rebuild code.js after changing tokens.json or src/plugin.js
npm run figma:check   # type-check against Figma's API types + fail if code.js is stale (part of npm run check)
```

`code.js` is generated: `GW_TOKENS` (from `tokens.json`) + `src/plugin.js`. Don’t edit it by hand.

## What was verified, and what wasn’t

- ✅ `src/plugin.js` type-checks in strict mode against `@figma/plugin-typings` 1.142 (Figma’s official API types).
- ✅ `code.js` is valid JavaScript and stays in sync with `tokens.json` (`figma:check` in CI).
- ⚠️ It was **not run inside Figma** while building this project (no Figma access in that environment). Run it once, take screenshots, and fix anything Figma reports before citing it as evidence.
