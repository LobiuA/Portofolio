# Design: "Broadcast Brutalism" Full Redesign

**Date:** 2026-06-20
**Project:** portfolio-jidan (Tri Muhammad Jidan — broadcast portfolio)
**Source design:** `C:\Users\Desktop\Broadcast Brutalism Portofolio\design_handoff_broadcast_brutalism\` (README.md + 2 HTML references)

---

## Overview

Full redesign of the existing Next.js 16 portfolio into the **"Broadcast Brutalism"** look —
inspired by vMix/ATEM production-switcher control panels. Hard borders, zero rounded corners,
tally-light colors (red = ON AIR, amber = STANDBY), condensed display + monospace typography.

The design is **token-driven**: the entire look lives in CSS custom properties in
`app/globals.css`. Retheming is mostly retokenizing `:root` + swapping fonts, then rebuilding
each section's markup. Real site content stays in `lib/content.ts` / `content/*.json` — only the
presentation changes.

## Decisions (locked with user)

| Decision | Choice |
|---|---|
| Scope | **Full redesign** — all 8 sections + nav + footer |
| Color tone | **Signal Dark** (`#0A0A0A` / `#F2F0EB` / red `#E8332C` / amber `#F0A500`) |
| Hero layout | **Vision Mixer Strip** (3-column grid, full-bleed) |
| Theme toggle + accent picker | **Removed** — Signal Dark locked |
| Content | **Keep existing real content** (Toronto/Bangkok events, real stats, galleries); restyle only |
| Integration approach | **A — Retokenize globally, then rebuild section-by-section** (site stays runnable throughout) |

## Fidelity

HIGH — use exact hex/px/timing values from the source README where given. Sections not specified
in the README (About, Skills, Experience, Freelance, Ledger, Contact) follow the same token system.

---

## Architecture

Unchanged structural principles from the existing codebase:
- Content/data lives **only** in `lib/content.ts` + `content/*.json`. Section components stay
  structural shells. No hardcoded copy in JSX.
- One Lenis instance (`SmoothScrollProvider`), one client context (`PortfolioChrome`).
- Styling = hand-written CSS in `app/globals.css` keyed off `:root` tokens. Tailwind v4 is imported
  but not used for the look. **Match existing CSS conventions; do not reach for Tailwind utilities.**

What changes:
- `:root` tokens → Signal Dark. `[data-theme="light"]` block deleted.
- Fonts in `layout.tsx` → Barlow Condensed + JetBrains Mono.
- Theme/accent picker logic removed from `Nav` + `PortfolioChrome` (+ its localStorage keys).
- Each `*Section.tsx` markup rebuilt to the Broadcast Brutalism treatment.

---

## Design Tokens (Signal Dark)

```
--bg:        #0A0A0A   (near-black, warm)
--ink:       #F2F0EB   (warm white)
--live:      #E8332C   (tally red / ON AIR)
--amber:     #F0A500   (STANDBY / section labels)
--line:      #252522   (subtle dividers)
--line-2:    #1E1E1C   (grid dividers)
--ink-2:     #5A5854   (secondary text / meta labels)
--ink-3:     #666660   (tags, disabled)
--gray-dark: #3A3836   (COMPLETE state border)
--dim:       #555550   (COMPLETE state foreground)
--r-sm/md/lg: 0        (zero rounded corners everywhere)
```

Fonts:
```
--font-display: 'Barlow Condensed', sans-serif   (weight 700 / 900)
--font-mono:    'JetBrains Mono', monospace       (weight 400 / 500 / 700)
--font-body:    JetBrains Mono (body text)
```
Loaded via `next/font/google` in `layout.tsx` (replacing Space Grotesk / Hanken / Space Mono).

Borders: hero bottom 3px, bus bar 2px, ON AIR badge 2px red, STANDBY 2px amber, COMPLETE 1px
`#3A3836`, grid dividers 1px. **No box-shadows on containers — borders only** (glows on tally
indicators are allowed via animation).

---

## Components / Sections

### Nav (`components/Nav.tsx`)
Bus-label-bar style: JetBrains Mono 700, 12px, letter-spacing 0.08em, hard bottom border.
Keep nav links + "Hire me" CTA. **Remove** theme toggle + accent picker controls.

### Footer (`components/Footer.tsx`)
Status strip: `border-top: 3px solid #F2F0EB`. Left = `TMJ / BROADCAST PORTFOLIO ·
portofoliotmj.vercel.app`. Right = `● SIG: LIVE` (red, tally-pulse dot).

### 1. Hero — Vision Mixer Strip (`components/HeroSection.tsx`)
Full-bleed (100vw, no max-width), CSS Grid 3 columns. Data from `content/hero.json`.

- **Bus label bar** (top): `INPUT 01 / CAM 01` | `● PROGRAM BUS · TMJ / BROADCAST PORTFOLIO` | `ON AIR`
- **Left col — Camera Input** (`200px`): headshot photo in a diagonal-striped frame; absolute
  scanline (3.8s), 4 corner brackets (staggered draw), live timecode `HH:MM:SS:FF` counting at
  25fps from `00:14:22:08`; bottom label `● CAM 01 ... PGM`.
- **Center col — Title** (`1fr`): role kicker (`BROADCAST & LIVESTREAM OPERATOR`) → big title
  `TRI MUHAMMAD` / `JIDAN` (Barlow 900, 76px, lh 0.88) → red subtitle `LIVE ESPORTS BROADCAST` →
  lede (existing `hero.lede`) → tag row from `hero.marquee` → CTA buttons from `hero.cta`
  (View event work / Get in touch).
- **Right col — Metrics** (`172px`): header `METRICS`; three blocks from `hero.stats`:
  **5+** Years in production · **30+** Events crewed · **4** Int'l stages.
- **Ticker strip** (below body): event names (left) + `● ON AIR` (right, tally-pulse).

> Note: uses real stats (5+/30+/4), NOT the README's sample 100%/$700+/12+.

### 2. About (`components/AboutSection.tsx`)
"STUDIO INFO" panel — mono grid, hard borders, amber section label. Content from `content/about.json`.

### 3. Skills (`components/SkillsSection.tsx`)
Skill meters restyled as audio-console **VU/level meters** (stepped/segmented bars, mono labels).
Keep the existing skill-meter fill behavior from `PortfolioChrome`. Content from `content/skills.json`.

### 4. Experience (`components/ExperienceSection.tsx`)
**Rundown list** (timeline). Each entry = a row with mono meta. The `active: true` entry gets an
`ON AIR` badge (red, tally-pulse); past roles render `COMPLETE` (dimmed). Content from
`content/experience.json`.

### 5. Work → Events (`components/WorkSection.tsx`)
Event cards with state badges:
- **ON AIR** — entries flagged `live: true` (e.g. `★ Int'l`): white 2px border, red animated badge + dot.
- **STANDBY** — current/upcoming non-live highlights: amber 2px badge.
- **COMPLETE** — older events: dimmed (`#252522` border, `#555550` text), 1px badge.

Card = header row (title + badge) over a meta grid (role / game / location / year). **Keep** the
existing game/role filters and the Lightbox gallery (`usePortfolio().openLightbox`). Content from
`content/work.json`.

### 6. Freelance (`components/FreelanceSection.tsx`) & 7. Ledger (`components/LedgerSection.tsx`)
Restyle to the token system: zero radius, hard borders replacing shadows, JetBrains Mono labels,
Barlow Condensed headings. No structural rework beyond what the brutalist treatment requires.
Content from `content/freelance.json` / `content/ledger.json`.

### 8. Contact (`components/ContactSection.tsx`)
"SIGNAL OUT" panel — mono, hard borders, leads into the footer status strip. Content from
`content/contact.json`.

---

## Animations (CSS `@keyframes`, from README)

- `tally-pulse` (1.4s) — red dot glow blink → all red indicator dots.
- `badge-glow` (1.4s) — ON AIR badge border pulse.
- `scanline` (3.8s linear) — camera scan-line sweep.
- `corner-draw` (0.35s, staggered 0.60/0.68/0.76/0.84s) — corner brackets draw in.
- `enter-up` / `enter-fade` — staggered page-load entrance (per README sequence table).
- **Live timecode** — JS `setInterval(40ms)`, start `00:14:22:08`, count up at 25fps.

All motion respects `prefers-reduced-motion` (existing guard in `PortfolioChrome` +
`SmoothScrollProvider` + CSS). Animate GPU-friendly transforms/opacity only.

---

## Rollout (Approach A — phased, site runnable throughout)

1. **Foundation** — retokenize `:root` to Signal Dark, swap fonts in `layout.tsx`, set radius 0,
   delete `[data-theme="light"]`. Whole site instantly shifts to the dark brutalist base.
2. **Cleanup** — remove theme toggle + accent picker from `Nav` + `PortfolioChrome` (+ localStorage).
3. **Hero** — rebuild `HeroSection` as the Vision Mixer Strip (+ timecode JS, hero animations).
4. **Events** — rebuild `WorkSection` cards (ON AIR/STANDBY/COMPLETE); keep filters + Lightbox.
5. **Remaining sections** — About, Skills, Experience, Freelance, Ledger, Contact, Nav, Footer.
6. **Polish** — entrance-animation sequence, responsive behavior, `npm run build` gate.

Each phase ends green with `npm run build` (the type/lint gate).

---

## Out of Scope (YAGNI)

- Light mode / multiple color tones (Stadium Night, Phosphor Amber, Tactical Slate) — Signal Dark only.
- New content or copy — existing data is authoritative.
- Replacing Lenis/GSAP/IntersectionObserver plumbing — reused as-is.
- README's sample event/metric data — illustrative only; real content wins.

## Success Criteria

- All 8 sections + nav + footer render in Signal Dark with zero rounded corners and no card shadows.
- Hero is the full-bleed Vision Mixer Strip with working live timecode + entrance animations.
- Events show correct ON AIR / STANDBY / COMPLETE states; filters + Lightbox still work.
- Theme toggle + accent picker are gone; no dead localStorage logic remains.
- `npm run build` passes (type + lint). `prefers-reduced-motion` honored.
