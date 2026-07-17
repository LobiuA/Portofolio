# Design: "Signal Minimal" Redesign (from Broadcast Brutalism)

**Date:** 2026-07-17
**Project:** portfolio-jidan (Tri Muhammad Jidan — broadcast portfolio)
**Supersedes:** `2026-06-20-broadcast-brutalism-redesign-design.md` (current live theme)
**Trigger:** User feedback — current Broadcast Brutalism/Signal Dark look "terlalu berat" (too heavy): thick borders, tally colors (red/amber), condensed+mono type, heavy GSAP motion.

---

## Overview

Retheme the existing Next.js 16 portfolio from **"Broadcast Brutalism"** to **"Signal Minimal"** —
same dark-mode foundation, but stripped to typography, whitespace, and thin dividers. No accent
color, no tally lights, minimal motion. The broadcast identity survives only in one trait: sharp
(zero-radius) corners — everything else that made it feel like a vMix/ATEM switcher panel is
removed.

The redesign is **token + component scoped**: `app/globals.css` tokens and base rules are rewritten
from scratch; each `components/*Section.tsx` keeps its existing grid/layout structure but has
broadcast-only markup (tally dots, cam-corner brackets, ON-AIR/STANDBY badges, thick boxed borders)
removed and GSAP-driven scroll choreography replaced with CSS transitions or deleted outright.
Content (`lib/content.ts` / `content/*.json`) is untouched.

## Decisions (locked with user, via terminal + visual companion)

| Decision | Choice |
|---|---|
| Scope | Full retheme — all sections, nav, footer; content unchanged |
| Visual direction | **Dark minimal** — keep dark background, drop tally colors |
| Accent color | **None** — pure black/gray/off-white; color only in hover states |
| Corners & density | **Sharp + Airy** — zero-radius corners kept (broadcast identity), thick boxed borders replaced with thin 1px divider lines, spacing loosened significantly |
| Typography | **Geist** (single family, headings + body) — Barlow Condensed + JetBrains Mono removed entirely |
| Motion | **Minimal motion** — GSAP scroll choreography removed/simplified; IntersectionObserver reveal (already in `PortfolioChrome.tsx`) reused as-is |
| Section pruning | **Graphics section merged into Skills** (as inline visual examples, not a standalone section); no other sections removed |
| Execution approach | **Rewrite scoped** — `globals.css` fully rewritten; `*Section.tsx` files edited (not rewritten from scratch) to strip broadcast-only markup and swap GSAP effects for CSS transitions |

## Fidelity

MEDIUM — token values (colors, spacing scale, radius=0) are exact per this doc. Component-level
markup changes (which elements to strip) are guided by the principle "keep layout structure, remove
broadcast-only decoration" rather than pixel-exact mockups — the visual companion mockups
(`.superpowers/brainstorm/9958-1784272402/content/`) set the tone, not exact pixel specs.

---

## Architecture

Unchanged structural principles (do not touch):
- Content/data lives **only** in `lib/content.ts` + `content/*.json`. Section components stay
  structural shells. No hardcoded copy in JSX.
- One Lenis instance (`SmoothScrollProvider`), one client context (`PortfolioChrome`).
- Styling = hand-written CSS in `app/globals.css` keyed off `:root` tokens. Tailwind v4 stays
  imported but unused for the look.
- Reveal-on-scroll stays on the existing plain `IntersectionObserver` in `PortfolioChrome.tsx`
  (`[data-reveal]` → `.in`) — this mechanism is kept as-is, not GSAP-driven.

What changes:
- `:root` tokens → Signal Minimal (below). No `--live`/`--amber` tokens; no `[data-theme="light"]`
  block (theme stays dark-only, unchanged from current).
- Fonts in `layout.tsx` → Geist only (`next/font/google`), replacing Barlow Condensed + JetBrains
  Mono. No separate mono font for labels/numbers.
- `GraphicsSection.tsx` content folded into `SkillsSection.tsx` as an inline visual sub-block;
  `GraphicsSection.tsx` removed, its import/render call removed from `page.tsx`. `graphics.json`
  data still consumed, just by `SkillsSection` instead.
- Broadcast-only decorative markup removed from every `*Section.tsx`: tally dots, cam-corner
  brackets (`.cam-corner`), ON-AIR/STANDBY/COMPLETE badges styled as boxed pills, thick multi-side
  borders on cards/containers. Replaced with thin single-line dividers or plain spacing where a
  separator is still needed.
- GSAP scroll-driven effects removed or simplified to CSS `transition`/`@keyframes` triggered by
  the existing IntersectionObserver reveal class, per component:
  - `MarqueeTicker.tsx` — becomes a static/simple CSS `animation: scroll` marquee (no GSAP ticker
    dependency), or is removed if it reads as a broadcast-ticker cliché post-redesign (decide during
    implementation, default: keep as simple CSS marquee).
  - `NameIntro.tsx` — glitch/shake effect removed; simple fade/scale-in via CSS transition.
  - `AboutPortrait.tsx` — GSAP parallax scrub removed; portrait is static or CSS-transition on
    reveal only.
  - `CountUp.tsx` — GSAP scroll-scrub removed; count animates once on viewport entry (CSS or a
    minimal JS interval, no scroll-linked scrub).
  - `HeroMetrics.tsx` — GSAP entrance animation replaced with CSS transition tied to reveal class.
  - `WorkSection.tsx` — GSAP scale/fade entrance replaced with CSS transition tied to reveal class.
  - `TestimonialCarousel.tsx` — GSAP-driven transitions replaced with CSS transition/opacity
    crossfade.
  - `SmoothScrollProvider.tsx` — GSAP ticker driving Lenis is evaluated during implementation:
    keep only if Lenis needs it for RAF sync, otherwise drop GSAP from this file too.
  - **Net effect**: if every file above drops its GSAP usage, the `gsap` package dependency is
    removed from `package.json` entirely. This is the expected outcome, not just a possibility —
    implementation should attempt full removal and only keep `gsap` if one component genuinely
    can't be done in plain CSS/JS.
- `ShowreelSection.tsx` and `NameIntro.tsx` auto-rotate/intro behavior is kept functionally
  (same triggers, same content) but restyled to match Signal Minimal (thin dividers instead of
  cam-corner brackets, no tally-dot badge).

---

## Design Tokens (Signal Minimal)

```
--bg:        #0A0A0A   (near-black, same base as before)
--bg-2:      #141414   (slightly lifted surface, e.g. hover state)
--ink:       #F2F0EB   (off-white, same as before)
--ink-2:     #999992   (secondary text / meta labels)
--ink-3:     #666660   (tertiary text, tags, disabled)
--line:      #2A2A28   (thin divider — replaces both --line and --line-2)
--r-sm/md/lg: 0        (zero rounded corners everywhere — unchanged from Broadcast Brutalism)
```

Removed entirely: `--live` (tally red), `--amber` (tally amber), `--gray-dark`, `--dim`
(COMPLETE-state tokens tied to broadcast badges).

Fonts:
```
--font-sans: 'Geist', system-ui, sans-serif   (headings + body, weights 400/500/600/700)
```
Loaded via `next/font/google` in `layout.tsx`, replacing Barlow Condensed + JetBrains Mono. No
`--font-display` / `--font-mono` split — one family for everything.

Borders: thin 1px `--line` dividers only, used sparingly (section boundaries, table-like rows).
No boxed/multi-side borders on cards. No box-shadows on containers (unchanged rule from CLAUDE.md).

Spacing: existing spacing scale (if one exists in `globals.css`) is loosened — larger gaps between
elements, more padding inside sections — exact multiplier decided during implementation by
visually comparing against current values (target: noticeably "airier" than Sharp+Tight mockup,
per the accepted Sharp+Airy option).

---

## Section-by-section notes

- **Hero** — "Vision Mixer Strip" 3-column grid layout is kept (structure), but cam-corner
  brackets, tally-dot live badge, and thick bottom border are removed/restyled to Signal Minimal
  treatment (thin divider, no colored badge).
- **Showreel** — auto-rotating slideshow logic unchanged; `cam-corner`, `tally-dot`, boxed
  `showreel-badge` restyled without color/thick border.
- **About** — parallax portrait effect removed (see Motion above); layout grid kept.
- **Skills** — absorbs Graphics section content as an inline sub-block (see Architecture above).
- **Experience, Work, Freelance, Ledger, Contact, Footer** — layout/grid structure kept; broadcast
  decorative markup (boxed borders, badges) stripped per the general rule above.
- **Nav** — sticky bus-bar header kept structurally; visual treatment (border weight, spacing)
  updated to match thin-divider system.
- **Lightbox** — unchanged functionally; border/background restyled to match new tokens.

---

## Non-goals (explicitly out of scope)

- No light mode / theme toggle (still locked dark-only, unchanged from current).
- No new sections added.
- No content/copy changes — `lib/content.ts` and `content/*.json` are not touched.
- No changes to Lenis smooth-scroll behavior or the `PortfolioChrome` IntersectionObserver reveal
  mechanism itself (only what CSS class it triggers may change per component).
- No accent/brand color introduced anywhere (not even a muted one) — pure grayscale + off-white.

---

## Open questions for implementation (not blocking spec approval)

- Exact spacing-scale multiplier for "airy" — implementer eyeballs against current values, no
  fixed target ratio locked here.
- Whether `MarqueeTicker.tsx` is kept (simplified) or removed entirely — default to keeping as a
  simple CSS marquee unless it visually clashes with the minimal direction once built.
- Whether `SmoothScrollProvider.tsx` can drop its GSAP ticker dependency — resolve during
  implementation; not a design-level decision.

---

## References

- Visual companion mockups (tone reference, not pixel spec):
  `.superpowers/brainstorm/9958-1784272402/content/corners-density.html`,
  `.superpowers/brainstorm/9958-1784272402/content/font-choice.html`
- Prior theme spec (being superseded): `2026-06-20-broadcast-brutalism-redesign-design.md`
- Redesign playbook: `docs/ganti-tema.md` (Level 3 flow: Brainstorm → Spec → Plan → Execute → Review → Merge)
