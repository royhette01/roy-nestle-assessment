# Pet name finder

React + TypeScript UI for browsing pet names by gender, first letter, category groups (from the assessment payload), and free-text search. Layout follows the provided reference: cover hero, filter strip, A–Z rail, virtualised list, and a detail panel with HTML definitions, tag line, and related picks.

## Setup

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://localhost:5173`).

## Scripts

| Command | Purpose |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Typecheck + production bundle |
| `npm run preview` | Serve `dist/` |
| `npm test` | Vitest (filtering / sorting logic) |
| `npm run build:data` | Merges `public/data/names.part*.json` into `names.json` when you split a huge export |

## Full names export from the API

The repo ships a **small** `public/data/names.json` so the app runs out of the box. For the real assessment dataset, save the API response (shape `{ "data": [ … ] }`) and run:

```bash
node scripts/import-full-names.mjs /path/to/names.json
```

Alternatively, split large exports into `public/data/names.part1.json`, `names.part2.json`, … (each file either `[…]` or `{ "data": […] }`), then run `npm run build:data`.

`letters.json` and `categories.json` already match the brief; replace them too if your links return newer copies.

## Architecture

- **Data:** `useExplorerData` loads three JSON files from `/public/data` in parallel.
- **Filtering:** `filterNames` in `src/lib/filterNames.ts` applies gender, optional first letter, OR semantics on selected category IDs, and substring search. Covered by Vitest.
- **Performance:** the name column uses `@tanstack/react-virtual` so long lists stay light.
- **Definitions:** CMS HTML is rendered in the detail card; `absolutizeDefinitionHtml` prefixes relative Purina paths with `https://www.purina.co.uk` so links work off-site.
- **Related names:** `relatedNames` ranks others by shared category IDs, with a small boost for the same first letter.
- **Resilience:** `ErrorBoundary` catches render errors and offers a reload.

## Assumptions

- Category filters from different groups **combine with OR**: a name shows if it has **any** of the selected category IDs. Chips map one-to-one with the last choice per filter group dropdown.
- Names with **no gender** array are treated as matching every gender filter (matches odd rows like “Marley” in the full feed).
- Tablet/desktop layout collapses to a single column below `1024px` per the brief; mobile is usable but optimised for tablet+ as requested.
- Styling is inspired by the mock (off-white, red accent, serif hero) with small intentional asymmetry (photo radii, slight title rotation, paper noise) so it feels editorial rather than template-like.

## Git

Use normal feature commits; this folder is ready to push as the assessment repository.
