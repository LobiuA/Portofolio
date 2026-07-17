# Design Doc — Full Layout Redesign "Signal Minimal × Lucas"

**Date:** 2026-07-18
**Status:** Draft — awaiting Jidan's review
**Branch:** `layout-redesign` (new, off `signal-minimal-redesign` or `main` — decided at plan time)
**Reference:** https://www.lucas-aufrere.com/

---

## 1. Context & goal

The Signal Minimal retheme (branch `signal-minimal-redesign`, complete) changed colors, typography, borders, and motion, but deliberately kept the old "Broadcast Brutalism" layout structure. Jidan expects a **full structural redesign** — new section architecture, new hero, new composition — not a retheme.

Reference: Lucas Aufrère's portfolio. A ~7-section, single-column, typography-driven layout with a large auto-sliding work image, an accordion for services, and an overlay menu. Jidan approved this direction and the mapping below.

This doc covers **layout & section architecture only**. Colors, typography (Geist), tokens, Lenis, and content stay as they are.

---

## 2. Locked decisions

| Decision | Choice | Notes |
|---|---|---|
| Section count | **~7 sections** (condensed from 12) | Mapping in §3 |
| Intro | **Word-by-word fade** ("TRI" → "TRI MUHAMMAD" → "TRI MUHAMMAD JIDAN", 400ms apart, then overlay fades) | New `WordIntro` replaces `NameIntro` |
| Work display | **Large slider** (~70vw, auto-crossfade 5s, click → lightbox) | Replaces card grid |
| Navigation | **Overlay menu** (topbar: name left, "menu" right → full-screen overlay with large links) | Replaces sticky nav |
| Typography | **Geist only** | No serif; consistent with retheme |
| Animation | **CSS + IntersectionObserver only. No GSAP.** | Word-by-word effect via `WordReveal` (§6), not SplitText |

---

## 3. Page architecture

Single page. Section order in `app/page.tsx`:

```
WordIntro (client)  →  TopBar + OverlayMenu (client)  →  01..07  →  SiteFooter
```

| # | Component (new) | Content source (`lib/content.ts`) | Layout |
|---|---|---|---|
| 01 | `Hero01` | `siteData.hero` | Full viewport. Name large, bottom-left. Role + location top-right (below topbar). One hairline divider. Small scroll hint. No mixer strip, no CAM card, no timecode. |
| 02 | `Manifesto02` | `siteData.about` + `siteData.proof` | Big statement: first paragraph of `about.body` rendered via `WordReveal`. Below, 2-col grid: left = headshot (`about.portrait`, `about.portraitBlur`), right = short bio (rest of `about.body`) + 4 stats (`proof.stats`) as hairline rows. |
| 03 | `WorkSlider03` | `siteData.work` | Heading "SELECTED WORK". One large image ~70vw centered, auto-crossfade every 5s, pause on hover. Event name + year below. Small prev/next arrows. Click opens existing `Lightbox` via `openLightbox(event)`. Filter chips removed from this section. If only 1 event → static, no controls. |
| 04 | `Capabilities04` | `siteData.skills` + `siteData.experience` | Accordion, one item per `skills.groups` entry. Click header → expand (`grid-template-rows 0fr→1fr`). Expanded panel lists that group's skills + related `experience` entries. First item open by default. |
| 05 | `Freelance05` | `siteData.freelance` + `siteData.ledger` | 2-col grid of client cards (`freelance.clients`, cover + name; click → lightbox). Below: testimonial (`freelance.testimonial`) as large quote. Below: ledger (`ledger.entries`) as minimal hairline rows. |
| 06 | `Showreel06` | `siteData.showreel` | Single full-width 16:9 video block, small heading above. Uses existing media keys (`mediaVideo`/`mediaPoster`). |
| 07 | `Contact07` | `siteData.contact` | Big CTA line (from `contact.heading`) via `WordReveal`. Email as large link. Socials as hairline row. |
| — | `SiteFooter` | `siteData.footer` | Watermark name (large, low-opacity), small nav links, copyright. Not a giant CTA (that's §07). |

### Removed components
`HeroSection`, `AboutSection`, `SkillsSection`, `ExperienceSection`, `ProofStrip`, `WorkSection`, `FreelanceSection`, `LedgerSection`, `ContactSection`, `ShowreelSection` (current versions), `Nav`, `NameIntro`.

### New components
`WordIntro`, `TopBar`, `OverlayMenu`, `Hero01`, `Manifesto02`, `WorkSlider03`, `Capabilities04`, `Freelance05`, `Showreel06`, `Contact07`, `SiteFooter`, `WordReveal`.

Server components by default. Client components only where state/interaction is required: `WordIntro`, `TopBar`+`OverlayMenu`, `WorkSlider03`, `Capabilities04`, `WordReveal`. `PortfolioChrome` (existing client) stays for reveal + lightbox.

### Unchanged
`lib/content.ts`, `content/*.json`, `galleryData`, `components/Lightbox.tsx`, `components/PortfolioChrome.tsx` (reveal + lightbox context), `components/SmoothScrollProvider.tsx` (Lenis), Signal Minimal tokens, Geist, 1px `--line` hairlines, `--r-sm: 0`, `prefers-reduced-motion` handling, `scripts/gen-blur.mjs`, `lib/blur.json`.

---

## 4. Navigation

- `TopBar`: fixed top, transparent → `--bg` with bottom hairline after scroll > 40px. Left: "JIDAN". Right: "menu" (text button).
- `OverlayMenu`: full-screen overlay, `--bg` at 98% opacity. Links: Work, About, Capabilities, Freelance, Showreel, Contact — large, fade in with 60ms stagger. Close via "×" top-right, `Esc`, or link click. Anchor scrolls use Lenis (`lenis.scrollTo`) when available, else native `scrollIntoView({ behavior: 'smooth' })`.
- Focus is trapped inside the overlay while open; `aria-expanded` on the trigger; `role="dialog" aria-modal="true"` on the overlay.

## 5. Intro

`WordIntro`:
- Deterministic initial state (no `Math.random()` in `useState` initializer — SSR hydration rule learned in `62cf460`).
- Three words appear sequentially: opacity 0→1 + translateY 12px→0, 400ms apart.
- After the third word + 600ms hold, the overlay fades out (opacity, 500ms) and calls `onDone`.
- `prefers-reduced-motion`: skip immediately, render nothing, call `onDone` on mount.
- The glitch-cut white flash from the old intro is removed.

## 6. Word-by-word reveal (SplitText replacement)

No GSAP. `WordReveal` component:
- Splits text with `Intl.Segmenter('id', { granularity: 'word' })`, falling back to `text.split(/\s+/)`.
- Wraps each word in an inline-block `<span>` with per-word `transition-delay` (index × 40ms).
- An IntersectionObserver (threshold 0.3, `once`) adds `.in` → CSS transitions each word opacity 0→1, translateY 0.5em→0, 0.6s ease.
- `prefers-reduced-motion`: all words visible immediately, no transition.

Used in `Manifesto02` (statement) and `Contact07` (CTA). Plain `[data-reveal]` (existing) is used elsewhere.

## 7. Motion summary (all CSS/IO, GPU-friendly transforms)

| Effect | Implementation |
|---|---|
| Section reveal | Existing `[data-reveal] → .in` (translateY 24px + opacity, 0.8s) in `PortfolioChrome` |
| Word reveal | `WordReveal` (§6) |
| Slider | Crossfade via opacity 1s; auto-advance `setInterval` 5s; pause on hover; disabled under reduced-motion |
| Accordion | `grid-template-rows 0fr→1fr` transition |
| Overlay menu | Opacity + per-link translateY stagger 60ms |
| Intro | §5 |

All respect `prefers-reduced-motion`.

## 8. Styling

- All new styles in `app/globals.css`, matching the Signal Minimal system: `--bg`, `--ink`, `--line`, Geist, 1px hairlines, `--r-sm: 0`, no container box-shadows.
- Class prefix per section (`.h01-*`, `.m02-*`, …) or semantic names — final naming decided in the plan; the rule is: hand-written CSS, no Tailwind utilities, consistent with the existing file.
- Old section CSS (`.vmix-*`, `.block`, `.wrap` usage for removed sections) is pruned in the same pass. `docs/architecture.md` and `CLAUDE.md` are updated to match.

## 9. Error handling & edge cases

- Slider with 1 event → static image, no controls, no interval.
- `skills.groups` empty → `Capabilities04` renders heading only.
- `freelance.clients` empty → section skips grid, still shows testimonial + ledger if present.
- Lightbox unchanged: `openLightbox(event)` from `PortfolioChrome`; works from slider and freelance cards.
- `Intl.Segmenter` missing (old browsers) → regex fallback.
- All intro/slider timers cleaned up on unmount.

## 10. Testing

- **Gate:** `npm run build` must pass (type + lint + compile).
- **Self-check (`scripts/check-layout.mjs`, run manually, no framework):** asserts `app/page.tsx` references the 7 new section components in order and no removed components.
- **Manual Playwright verification (in the plan):**
  - Tokens still Signal Minimal (`--live`/`--amber` unset, Geist, `--line #2a2a28`)
  - 7 sections render in the correct order
  - Intro plays (words appear sequentially) and is skipped under reduced-motion
  - Slider advances; click opens lightbox
  - Accordion expands/collapses
  - Overlay menu opens, traps focus, closes on Esc, and anchor-scrolls
  - Freelance card click opens lightbox

## 11. Non-goals

- No content/copy changes (`lib/content.ts`, `content/*.json` untouched).
- No light/dark mode toggle, no accent color, no serif.
- No GSAP or new animation libraries.
- No new pages or routes; single page only.
- No changes to `Lightbox`, `SmoothScrollProvider`, blur generation, or the `/admin` CMS.
- Filter chips for Work are removed from the page (not relocated). If filtering is wanted later, it becomes a separate enhancement.
