# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
yarn dev              # Start development server
yarn build            # Build for production (static export to /out)
yarn test             # Run tests
yarn test:coverage    # Run tests with coverage
yarn eslint:check     # Check linting
yarn eslint:fix       # Auto-fix lint issues
yarn prettier:check   # Check formatting
yarn prettier:fix     # Auto-fix formatting
```

Run a single test file: `yarn test components/hero/Hero.test.tsx`

**Package manager**: Yarn 4.9.2 (use `yarn`, not `npm`). Node version pinned in `.nvmrc` (20.11.0).

## Stack & Dependencies

- **Next.js 16** (Pages Router) + **React 19** + **TypeScript 5.9**
- **next-seo 6** — SEO meta/OpenGraph
- **dayjs 1.11** — date formatting utilities (role durations)
- **Sass** — SASS modules per component + global variables/theme
- **Hanken Grotesk** via `next/font/google` (self-hosted at build), applied in `_app.tsx`

No animation library: the redesign removed framer-motion deliberately.

## Architecture

**Build output**: Static HTML via `output: 'export'` in `next.config.js` → `/out/`. No server runtime, no API routes. `images.unoptimized: true` since there's no image optimization server.

**Single quiet page**: As of the "business card" redesign, `pages/index.tsx` is one short recruiter-friendly page rendered top to bottom: `Hero` (photo, name, title, location, one-sentence lead) → `Now` (two narrative paragraphs + contact links row) → `Experience` (collapsible `<details>` rows) → `Projects` (featured cards + compact list) → `Stack` (four text rows). There is no navigation menu and no section anchors — the page is short by design. Only `index.tsx`, `404.tsx`, `_app.tsx`, `_document.tsx` exist under `/pages/`.

**Design intent** (do not regress): the page is deliberately quiet. No GitHub activity widgets, no animated counters, no skill percentage bars, no tag clouds, no age/birthDate anywhere. Numbers on the page must be about work (years, coverage %, scale), never vanity metrics. One accent color (amber `--highlight-color`), used sparingly: badges, link hovers.

**Data**: `DataProvider` (`utils/DataProvider.tsx`) wraps the app in `_app.tsx`; reads `/public/data.json` at build time, exposed via `useSiteData()`. Types are inferred from the JSON itself (`typeof data`).

**Email obfuscation**: the address never appears as plain text in HTML, JSON, or the static export. `data.json` stores it as reversed `[user, domain]` parts (`emailParts`); `utils/email.ts` (`buildEmail`) assembles it in the browser on click. `PrintResume` assembles it in a `useEffect` so it stays out of the prerendered markup. Keep it that way.

**vCard**: `utils/vcard.ts` (`downloadVCard`) builds a .vcf on the client (name, title, email, links, photo from `/public/avatar-vcard.jpg`) — the "Save contact" button in `Now`.

**Resume**: "Resume (PDF)" triggers `window.print()`; `PrintResume` is the hidden print-only layout (`@media print` shows it, hides `main`/`footer`/theme toggle).

**Theming**: `ThemeProvider` (`utils/ThemeProvider.tsx`) manages a dark/light toggle, persisted via `data-theme` attribute on `<html>` and `localStorage`; an inline script in `_document.tsx` stamps `data-theme` before hydration (no flash). Both palettes are CSS custom properties in `/styles/theme.css` (`:root` = dark defaults, `[data-theme='light']` = overrides). Container width: `640px`.

**SEO / sharing**: `_document.tsx` embeds JSON-LD `Person` (name, title, links, `knowsAbout` from stack). `pages/index.tsx` sets OpenGraph with `/public/og-image.png` (1200×630: photo + name + title) — regenerate it if the name/title/photo changes.

**Components** (`/components/`): Feature-based directories, barrel-exported from `components/index.ts`. Each folder has: `Component.tsx`, `Component.test.tsx`, `styles.module.sass`, `index.ts`, optionally `utils.tsx` (+ test).

**Styling**: SASS modules per component; global theme in `/styles/theme.css`; global reset + shared classes (`.textLink`, `.sectionLabel`, `.skipLink`, `.page404`, print rules) in `/styles/globals.sass`; breakpoint variable in `/styles/variables.sass` (mobile: 768px).

## Component Inventory

| Component     | Purpose                                                                                                                                                                                                                       |
| ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Hero`        | Photo (80px), name, title, location/timezone, one-sentence lead                                                                                                                                                               |
| `Now`         | Narrative bio paragraphs (with `**bold**` markers via `renderBold`), contact links row, email reveal + copy, Resume (print), Save contact (vCard)                                                                             |
| `Experience`  | Collapsible `<details>` role rows: role · org description (no company names — intentional), Contract/Part-time badges, years + computed duration, bullets, stack line; first role open by default; static "Earlier roles" row |
| `Projects`    | Featured cards (favicon icons from `/public/images/icons/`, wide cards for CubeSat/observatory, sub-project pills) + compact list rows + "More on GitHub"                                                                     |
| `Stack`       | Four text rows (Leadership / Engineering / Platform / AI), no percentages                                                                                                                                                     |
| `ThemeToggle` | Fixed sun/moon button, top-right corner                                                                                                                                                                                       |
| `Footer`      | "Say hi" (mailto), copyright, open-source link                                                                                                                                                                                |
| `PrintResume` | Hidden print-only resume layout (`aria-hidden`)                                                                                                                                                                               |
| `StarField`   | Canvas starfield — **404 page only** (easter egg), not on the main page                                                                                                                                                       |
| `Icon`        | SVG icon switch (github, telegram, linkedin, web, social, left, right, sun, moon)                                                                                                                                             |

## Special Cases

- **No company names in experience** — deliberate anonymity; roles carry an industry description ("US enterprise software company") instead. Don't add names.
- `Experience` `<details>` open state is controlled via a `Set<number>` synced in `onToggle` (index 0 open initially).
- Role durations are computed at render with `formatPeriod` (`utils/date.ts`) from `MM/DD/YYYY` period strings.
- `_app.tsx` — loads Yandex.Metrika analytics only when `NODE_ENV === 'production'`; hides `PrintResume`/`Footer` on 404.
- `tests/jest.setup.tsx` mocks `next/image` (static imports become `static-import.png`) and `next/link`.

## data.json Structure

```
biography       — name, title, location, timezone, availableForWork, lead, now[] (paragraphs, **bold** markers)
emailParts      — [user, domain], each reversed (see Email obfuscation above)
contactLinks[]  — icon, label, link (GitHub, LinkedIn, Telegram)
experience[]    — role, org, badge?, period[start, end?], bullets[], stack[]
earlierRoles    — label, period (single collapsed row)
projects        — featured[{ title, icon, link, wide?, description, stack, parts?[] }], more[{ title, icon?, link, description }]
stack[]         — group, items (comma-separated string)
seo             — title, description
```

Project `icon` values: `/images/icons/*.png|svg` render as images; `"telegram"` renders the Telegram icon; absent → GitHub icon.

## Code Conventions

- **Prettier**: 4-space indent, single quotes, 120 char line width, trailing commas off, one JSX attribute per line
- **Path alias**: `@/` maps to the project root
- **Tests**: RTL + Jest; components that use `useSiteData()` must be wrapped in `DataProvider`; assertions against `data.json` values, no snapshots
- Coverage collected from `/components/` only (excludes `.d.ts`, `.test.tsx`, `index.ts`, `types.ts`, `constants.ts`)
- ESLint: `simple-import-sort`, `react`, `react-hooks`, `jest`, `prettier`
- CI (`.github/workflows/checks.yml`) runs ESLint check, Prettier check, then a cached production build on every PR/push to `main`
- Deploy (`.github/workflows/deploy.yml`) builds on push to `main` (or manual run) and mirrors `/out` to FTP via lftp (secrets: `FTP_HOSTNAME`, `FTP_USERNAME`, `FTP_PASSWORD`); SonarCloud (`sonarcloud.yml`) runs tests with coverage (secret: `SONAR_TOKEN`)
- The previous portfolio template lives in `miksrv/developer-portfolio-website` — this repo is the live site only
