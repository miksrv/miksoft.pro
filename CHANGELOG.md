# Changelog

## 3.0.1

### Content

- Experience: leadership, backend and AI-tooling highlights for the current role; the overlapping contract is labeled as a transition engagement; 20+ years
- Projects: observatory card expanded (FITS pipeline, API, INDI roof driver), UI Kit and portfolio template featured, Moon widget and AI Telegram bots added
- Stack: AI row rewritten around Claude Code, agentic workflows and MCP servers

### UI

- Container widened from 640px to 720px
- Stretched `↗` glyphs in Projects replaced with an SVG external-link arrow

### SEO and performance

- Section labels are now `h2` headings
- Added canonical URL, `og:url`, `og:type: profile`, image alt, Twitter large card; fixed deduplicated `theme-color` metas (dark + light)
- JSON-LD `knowsAbout` is an array; added `description`
- Avatar resized (78 KB → 8 KB), 404 astronaut converted to WebP (225 KB → 30 KB)
- Cleaned up `robots.txt`, `sitemap.xml` (`lastmod`) and `site.webmanifest`
- Added `public/.htaccess`: custom 404 page, long-term caching for hashed assets, gzip
- Removed the production `reportWebVitals` console logging

### Dependencies

- Next.js 16.4.5, React 19.3.1 and minor/patch updates of dev tooling

## 3.0.0

### Major Changes

- Moved the site to its own repository ([miksrv/miksoft.pro](https://github.com/miksrv/miksoft.pro)); the previous template stays in [miksrv/developer-portfolio-website](https://github.com/miksrv/developer-portfolio-website)
- Redesigned as a short "business card" page: `Hero` → `Now` → `Experience` → `Projects` → `Stack`
- Removed the header menu, GitHub activity widgets, stats counters, skill bars, tag cloud and framer-motion
- Added collapsible experience rows with computed role durations
- Added featured project cards with icons and a compact project list
- Added email obfuscation, copy-to-clipboard, printable resume and vCard download
- Added Hanken Grotesk font, pre-hydration theme script, JSON-LD `Person` and a new OpenGraph image
- Replaced snapshot tests with assertions against `data.json`

Earlier history (v1.x – v2.x) is in the [previous repository](https://github.com/miksrv/developer-portfolio-website/blob/main/CHANGELOG.md).
