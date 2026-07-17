# Signal Minimal Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Retheme portfolio-jidan from "Broadcast Brutalism" (hard borders, tally red/amber, condensed+mono type, heavy GSAP motion) to "Signal Minimal" — same dark foundation, stripped to typography, whitespace, and thin 1px dividers; no accent color, no tally decoration, minimal motion.

**Architecture:** Token + component scoped. `app/globals.css` `:root` tokens and base rules rewritten from scratch; each `components/*Section.tsx` keeps its existing grid/layout structure but has broadcast-only markup (tally dots, cam-corner brackets, ON-AIR/STANDBY/COMPLETE badges, thick boxed borders) removed and GSAP scroll choreography replaced with CSS transitions or the existing IntersectionObserver reveal. Content (`lib/content.ts` / `content/*.json`) is untouched. Spec: `docs/superpowers/specs/2026-07-17-minimal-clean-redesign-design.md`.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · hand-written CSS in `app/globals.css` (Tailwind v4 imported but unused for the look) · Lenis smooth scroll · GSAP (removal candidate — expected fully removed by Task 15) · Vercel.

## Global Constraints

Every task's requirements implicitly include this section.

- **Next.js 16 breaking changes (AGENTS.md):** this is NOT the Next.js you know. Check `node_modules/next/dist/docs/` before writing any Next.js code. Heed deprecation notices.
- **Build gate (CLAUDE.md):** run `npm run build` before declaring any change done — it is also the type/lint gate. Then visually verify at `npm run dev` → http://localhost:3000 before committing.
- **Zero rounded corners on rectangles** (`--r-sm/md/lg: 0`); dots/badges may keep `50%` only where they are actual circles (cursor-glow). **No box-shadows on containers** (glows only on the retinted cursor-glow, never on tally/badge indicators — those are deleted entirely).
- **Respect `prefers-reduced-motion`** per component; the Hero-region reduced-motion block is edited surgically across Tasks 3/7/8/9/12 (see callout below).
- **Signal Minimal token contract (locked, verbatim from spec):**
  ```
  --bg: #0A0A0A   --bg-2: #141414   --ink: #F2F0EB
  --ink-2: #999992   --ink-3: #666660   --line: #2A2A28
  --r-sm/md/lg: 0
  --font-sans: var(--font-geist), 'Geist', system-ui, sans-serif
  ```
  Layout tokens kept unchanged: `--nav-h: 56px; --cam-w: 350px; --metrics-w: 250px; --hero-shift: 80px; --maxw: 1240px; --gut: clamp(20px,5vw,80px); --ease: cubic-bezier(.22,.61,.36,1)`.
  **Removed entirely:** `--live --amber --accent --accent-ink --gray-dark --dim --surface --surface-2 --grid --shadow --line-2 --font-display --font-body --font-mono` (and the `--font-barlow`/`--font-jetbrains` variable consts go when `layout.tsx` swaps to Geist). No task may re-introduce any of these.
- **Font:** Geist only (single family, headings + body, weights 400/500/600/700), loaded via `next/font/google` in `layout.tsx`. No `--font-display`/`--font-mono` split.
- **Borders:** thin 1px `--line` dividers only, used sparingly. No boxed/multi-side borders on cards. Hover states brighten `--line` → `--ink` / `--ink-2` only.
- **Motion:** the IntersectionObserver reveal in `PortfolioChrome.tsx` (`[data-reveal]` → `.in`) is the canonical reveal mechanism — kept as-is, never GSAP-driven. GSAP removed/simplified per component; net expected effect = `gsap` package dropped from `package.json` (gated grep in Task 15).
- **Non-goals (verbatim from spec — do NOT do these):** no light mode / theme toggle (dark-only); no new sections; no content/copy changes (`lib/content.ts` + `content/*.json` untouched); no changes to Lenis behavior or the reveal mechanism itself; no accent/brand color anywhere (pure grayscale + off-white).

> **Cross-task callout — the reduced-motion block.** The original file has two `@media (prefers-reduced-motion: reduce)` blocks: **Block A** (Hero region ~line 422) and **Block B** (trailing, ~line 932, references `.tally`/`.lb-tally .dot`/`.foot-sig .tally`). Task 1 deletes Block B entirely. Block A is edited **surgically** by later tasks — each makes ONE line change so they compose regardless of order:
> - Task 3: delete the `.scanline`, `.cam-corner`, `.bus-onair`, `.tally-dot` lines.
> - Task 7: delete the `.tl-onair .tl-badge` line.
> - Task 8: delete the `.ev-onair .ev-state-badge` line (class deleted in that task).
> - Task 9: ADD `.test-card { transition: none; }` (Block B is gone by then).
> - Task 12: append `, .marquee-track` to the hero-classes comma-list line.
> Do NOT paste a full "after" block for Block A from any single task — apply only that task's one-line change.

---

## File Structure

**Rewrite in place (token/base/section CSS):**
- `app/globals.css` — `:root` block, base/reset, shared type (`.kicker`, `.section-head`, `section.block`), cursor-glow, selection/scrollbar/focus/skip-link, keyframes, and every section's CSS block (each touched in its owning task).

**Modify:**
- `app/layout.tsx` — font swap (Barlow Condensed + JetBrains Mono → Geist).
- `app/page.tsx` — drop `GraphicsSection` import + render call (Task 6).
- `package.json` + `package-lock.json` — drop `gsap` (Task 15, grep-gated).
- `components/Nav.tsx`, `HeroSection.tsx`, `ShowreelSection.tsx`, `AboutPortrait.tsx`, `AboutCopy.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, `WorkSection.tsx`, `FreelanceSection.tsx`, `TestimonialCarousel.tsx`, `Footer.tsx`, `Lightbox.tsx`, `MarqueeTicker.tsx`, `HeroMetrics.tsx`, `CountUp.tsx`, `NameIntro.tsx`, `SmoothScrollProvider.tsx` — per their tasks.

**Delete:**
- `components/GraphicsSection.tsx` (Task 6 — merged into SkillsSection).

> Line numbers cited below are from the pre-redesign file. Earlier tasks shift later line numbers — **match by the before/after code blocks and selector names, not by line number.**

---

### Task 1: Foundation — token contract, Geist font, base/reset/keyframes rewrite

**Files:**
- Modify: `app/layout.tsx:1-17,60-65` (font import/consts + `<html className>`)
- Modify: `app/globals.css:9-40` (`:root` token block)
- Modify: `app/globals.css:47-69` (body font-family + delete `body::before` production-grid rule)
- Modify: `app/globals.css:74-92` (`.kicker` rewrite, delete `.kicker::before` tally dot)
- Modify: `app/globals.css:94-110` (`.section-head` font + airier spacing)
- Modify: `app/globals.css:112-119` (`section.block` divider → `--line` only, airier padding)
- Modify: `app/globals.css:836-844` (`.cursor-glow` retint)
- Modify: `app/globals.css:852-864` (selection / scrollbar / focus-visible / skip-link)
- Modify: `app/globals.css:919-937` (keyframes block — delete broadcast keyframes + delete trailing reduced-motion **Block B**; add `fade-scale`)

**Interfaces:**
- Consumes: None — this task defines the token contract.
- Produces: `--bg --bg-2 --ink --ink-2 --ink-3 --line --r-sm/md/lg --font-sans --nav-h --maxw --gut --ease` (plus unchanged `--cam-w --metrics-w --hero-shift`) for every later task. Also produces `--font-geist` (from `next/font/google` Geist, wired into `--font-sans`), keyframe `fade-scale` (new, alongside kept `enter-up`/`enter-fade`), and confirms `[data-reveal]`/`.in` (at `app/globals.css:816-834` — already colorless transform/opacity only, left as-is).

- [ ] **Step 1: Swap fonts in `app/layout.tsx`**

Before (lines 1-17):
```tsx
import type { Metadata, Viewport } from 'next'
import { Barlow_Condensed, JetBrains_Mono } from 'next/font/google'
import './globals.css'

const barlow = Barlow_Condensed({
  variable: '--font-barlow',
  subsets: ['latin'],
  weight: ['700', '900'],
  display: 'swap',
})

const jetbrains = JetBrains_Mono({
  variable: '--font-jetbrains',
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  display: 'swap',
})
```

After:
```tsx
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'

const geist = Geist({
  variable: '--font-geist',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
})
```

Before (line 63, inside `<html>`):
```tsx
      className={`${barlow.variable} ${jetbrains.variable}`}
```

After:
```tsx
      className={geist.variable}
```

- [ ] **Step 2: Replace the `:root` token block in `app/globals.css`**

Before (lines 9-40):
```css
:root {
  --bg: #0A0A0A;
  --bg-2: #0E0E0D;
  --surface: #121210;
  --surface-2: #16160F;
  --ink: #F2F0EB;
  --ink-2: #5A5854;
  --ink-3: #666660;
  --live: #E8332C;     /* tally red / ON AIR */
  --amber: #F0A500;    /* STANDBY / section labels */
  --accent: #F0A500;   /* legacy alias → amber */
  --accent-ink: #0A0A0A;
  --gray-dark: #3A3836;
  --dim: #555550;
  --line: #252522;
  --line-2: #1E1E1C;
  --grid: rgba(242,240,235,.022);
  --shadow: none;

  --font-display: var(--font-barlow), 'Barlow Condensed', system-ui, sans-serif;
  --font-body: var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace;
  --font-mono: var(--font-jetbrains), 'JetBrains Mono', ui-monospace, monospace;

  --nav-h: 56px;
  --cam-w: 350px;
  --metrics-w: 250px;
  --hero-shift: 80px;
  --maxw: 1240px;
  --gut: clamp(20px, 5vw, 80px);
  --r-sm: 0; --r-md: 0; --r-lg: 0;
  --ease: cubic-bezier(.22,.61,.36,1);
}
```

After:
```css
:root {
  --bg: #0A0A0A;
  --bg-2: #141414;
  --ink: #F2F0EB;
  --ink-2: #999992;
  --ink-3: #666660;
  --line: #2A2A28;

  --r-sm: 0; --r-md: 0; --r-lg: 0;

  --font-sans: var(--font-geist), 'Geist', system-ui, sans-serif;

  --nav-h: 56px;
  --cam-w: 350px; /* hero camera (headshot) column width */
  --metrics-w: 250px; /* hero metrics column width */
  --hero-shift: 80px; /* empty space on the left of the hero (detaches the photo box) */
  --maxw: 1240px;
  --gut: clamp(20px, 5vw, 80px);
  --ease: cubic-bezier(.22,.61,.36,1);
}
```

- [ ] **Step 3: Body font + delete the production-grid background rule**

Before (lines 47-69):
```css
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-body);
  font-size: 18px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background .5s var(--ease), color .5s var(--ease);
}

/* subtle production grid on the page background */
body::before {
  content: "";
  position: fixed;
  inset: 0;
  background-image:
    linear-gradient(var(--grid) 1px, transparent 1px),
    linear-gradient(90deg, var(--grid) 1px, transparent 1px);
  background-size: 64px 64px;
  pointer-events: none;
  z-index: 0;
}
```

After:
```css
body {
  background: var(--bg);
  color: var(--ink);
  font-family: var(--font-sans);
  font-size: 18px;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  overflow-x: hidden;
  transition: background .5s var(--ease), color .5s var(--ease);
}
```

- [ ] **Step 4: Rewrite `.kicker`, drop its tally-dot `::before`**

Before (lines 74-92):
```css
.wrap { max-width: var(--maxw); margin: 0 auto; padding-inline: var(--gut); position: relative; z-index: 1; }

/* ---------- shared type ---------- */
.kicker {
  font-family: var(--font-mono);
  font-size: 13px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--accent);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
.kicker::before {
  content: "";
  width: 8px; height: 8px; border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--accent) 22%, transparent);
}
```

After:
```css
.wrap { max-width: var(--maxw); margin: 0 auto; padding-inline: var(--gut); position: relative; z-index: 1; }

/* ---------- shared type ---------- */
.kicker {
  font-family: var(--font-sans);
  font-weight: 600;
  font-size: 13px;
  letter-spacing: .22em;
  text-transform: uppercase;
  color: var(--ink-2);
  display: inline-flex;
  align-items: center;
  gap: 10px;
}
```

- [ ] **Step 5: `.section-head` — Geist font, airier spacing**

Before (lines 94-110):
```css
.section-head { margin-bottom: clamp(28px, 3.5vw, 48px); max-width: 760px; }
.section-head h2 {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.04;
  letter-spacing: -.02em;
  margin-top: 18px;
  text-wrap: balance;
}
.section-head p {
  color: var(--ink-2);
  margin-top: 18px;
  font-size: clamp(17px, 2vw, 20px);
  max-width: 60ch;
  text-wrap: pretty;
}
```

After:
```css
.section-head { margin-bottom: clamp(36px, 4.5vw, 64px); max-width: 760px; }
.section-head h2 {
  font-family: var(--font-sans);
  font-weight: 700;
  font-size: clamp(34px, 5vw, 60px);
  line-height: 1.04;
  letter-spacing: -.02em;
  margin-top: 22px;
  text-wrap: balance;
}
.section-head p {
  color: var(--ink-2);
  margin-top: 20px;
  font-size: clamp(17px, 2vw, 20px);
  max-width: 60ch;
  text-wrap: pretty;
}
```

- [ ] **Step 6: `section.block` — 1px `--line` divider only, airier block padding**

Before (lines 112-119):
```css
section.block { padding-block: clamp(56px, 7.5vw, 108px); position: relative; }
section.block::after {
  content: ""; display: block; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 60%; height: 1px; background: linear-gradient(90deg, transparent, var(--line-2), transparent);
}
section.block--tight { padding-block: clamp(36px, 4.5vw, 64px); }
section.block--hero { padding-block: 0; }
section.block--hero::after { display: none; }
```

After:
```css
section.block { padding-block: clamp(72px, 9vw, 140px); position: relative; }
section.block::after {
  content: ""; display: block; position: absolute; bottom: 0; left: 50%; transform: translateX(-50%);
  width: 60%; height: 1px; background: linear-gradient(90deg, transparent, var(--line), transparent);
}
section.block--tight { padding-block: clamp(44px, 5.5vw, 80px); }
section.block--hero { padding-block: 0; }
section.block--hero::after { display: none; }
```

- [ ] **Step 7: Retint `.cursor-glow`**

Before (lines 836-844):
```css
/* custom cursor glow */
.cursor-glow {
  position: fixed; top: 0; left: 0; width: 380px; height: 380px; pointer-events: none; z-index: 0;
  border-radius: 50%; transform: translate(-50%,-50%);
  background: radial-gradient(circle, color-mix(in srgb, var(--live) 12%, transparent), transparent 65%);
  opacity: 0; transition: opacity .6s; mix-blend-mode: screen;
}
@media (hover: hover){ .cursor-glow.on { opacity: 1; } }
@media (max-width: 880px){ .cursor-glow{ display:none; } }
```

After:
```css
/* custom cursor glow */
.cursor-glow {
  position: fixed; top: 0; left: 0; width: 380px; height: 380px; pointer-events: none; z-index: 0;
  border-radius: 50%; transform: translate(-50%,-50%);
  background: radial-gradient(circle, color-mix(in srgb, var(--ink) 8%, transparent), transparent 65%);
  opacity: 0; transition: opacity .6s; mix-blend-mode: screen;
}
@media (hover: hover){ .cursor-glow.on { opacity: 1; } }
@media (max-width: 880px){ .cursor-glow{ display:none; } }
```

- [ ] **Step 8: Selection / scrollbar / focus-visible / skip-link → grayscale tokens**

Before (lines 852-864):
```css
/* ---------- Selection & scrollbar ---------- */
::selection { background: var(--amber); color: var(--bg); }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--surface-2); border-radius: 0; border: 2px solid var(--bg); }
::-webkit-scrollbar-thumb:hover { background: var(--amber); }

/* ---------- Keyboard focus ---------- */
:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; border-radius: 2px; }

/* ---------- Skip link (a11y) ---------- */
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.skip-link:focus { position:fixed; top:16px; left:16px; z-index:200; width:auto; height:auto; clip:auto; margin:0; padding:10px 16px; background:var(--accent); color:var(--accent-ink); font-family:var(--font-mono); font-size:13px; border-radius:0; }
```

After:
```css
/* ---------- Selection & scrollbar ---------- */
::selection { background: var(--ink-2); color: var(--bg); }
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: var(--bg-2); border-radius: 0; border: 1px solid var(--bg); }
::-webkit-scrollbar-thumb:hover { background: var(--ink-3); }

/* ---------- Keyboard focus ---------- */
:focus-visible { outline: 2px solid var(--ink); outline-offset: 3px; border-radius: 0; }

/* ---------- Skip link (a11y) ---------- */
.sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0,0,0,0); white-space:nowrap; border:0; }
.skip-link:focus { position:fixed; top:16px; left:16px; z-index:200; width:auto; height:auto; clip:auto; margin:0; padding:10px 16px; background:var(--ink); color:var(--bg); font-family:var(--font-sans); font-size:13px; border-radius:0; }
```

- [ ] **Step 9: Keyframes — delete broadcast keyframes, keep reveal ones, add `fade-scale`, delete trailing reduced-motion Block B**

Before (lines 919-937):
```css
/* ---------- Step 4: Brutalist keyframes ---------- */
@keyframes tally-pulse {
  0%,100% { opacity:1; box-shadow:0 0 10px rgba(232,51,44,.9), 0 0 22px rgba(232,51,44,.35); }
  50%     { opacity:.08; box-shadow:none; }
}
@keyframes badge-glow {
  0%,100% { box-shadow:0 0 8px rgba(232,51,44,.45), inset 0 0 6px rgba(232,51,44,.08); }
  50%     { box-shadow:none; }
}
@keyframes scanline { from { top:-6px; } to { top:105%; } }
@keyframes corner-draw { from { width:0; height:0; } to { width:22px; height:22px; } }
@keyframes enter-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes enter-fade { from { opacity:0; } to { opacity:1; } }
@media (prefers-reduced-motion: reduce) {
  .tally, .frame-tag .dot, [class*="tally"] { animation: none !important; }
  .lightbox.open { animation: none; }
  .lb-tally .dot { animation: none; }
  .foot-sig .tally { animation: none; }
}
```

After:
```css
/* ---------- Reveal keyframes ---------- */
@keyframes enter-up { from { opacity:0; transform:translateY(18px); } to { opacity:1; transform:translateY(0); } }
@keyframes enter-fade { from { opacity:0; } to { opacity:1; } }
@keyframes fade-scale { from { opacity:0; transform:scale(.96); } to { opacity:1; transform:scale(1); } }
```

(The trailing reduced-motion block above — **Block B** — is dropped entirely here. The Hero-region **Block A** (~line 422) is left untouched; Tasks 3/7/8/9/12 edit it surgically per the callout in Global Constraints. The global `[data-reveal]` reduced-motion guard at `app/globals.css:834` already covers the reveal system.)

- [ ] **Step 10: Verify and commit**

Run: `npm run build`
Expected: build passes with no type/lint errors. (Other sections' CSS still reference now-deleted tokens/keyframes like `--live`, `--amber`, `--surface`, `tally-pulse` — harmless at the CSS level, browsers ignore unresolved custom properties/animation names; cleaned up in their own per-section tasks.)

Then manually check at `npm run dev` → http://localhost:3000: Geist loads everywhere, no crash from missing tokens, kicker labels have no colored dot, section dividers are hairline gray not amber/red, cursor glow is neutral gray not red.

```bash
git add app/layout.tsx app/globals.css
git commit -m "foundation: Signal Minimal token contract, Geist font, base/reset/keyframes rewrite"
```

---

### Task 2: Nav — remove broadcast decoration, flatten borders/buttons

**Files:**
- Modify: `components/Nav.tsx:32-39`
- Modify: `app/globals.css:124-172`

**Interfaces:**
- Consumes: `--line`, `--ink`, `--ink-2`, `--bg`, `--font-sans`, `--ease`, `--gut` (all from Task 1's contract; `--live`/`--accent`/`--surface`/`--font-mono` no longer referenced).
- Produces: None — leaf task. `.nav-links a.active`, `.btn-primary`, `.btn-ghost` class names unchanged; `.btn-primary` is now `background: var(--ink); color: var(--bg); border: 1px solid var(--ink); :hover { background: var(--ink-2) }` — this is the canonical primary-button treatment. Task 11's `.cform-btn` matches it exactly (verified consistent during plan self-review).

- [ ] **Step 1: Remove tally dot from Nav.tsx brand**

```tsx
// components/Nav.tsx:32-39 — before
      <a className="brand" href="#top">
        <span className="tally" />
        <span>
          {siteData.brand.tag}
          <b>/</b>
          {siteData.brand.label}
        </span>
      </a>

// after
      <a className="brand" href="#top">
        <span>
          {siteData.brand.tag}
          <b>/</b>
          {siteData.brand.label}
        </span>
      </a>
```

- [ ] **Step 2: Flatten `.nav` border and drop mono font from brand**

```css
/* app/globals.css:124-143 — before */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px var(--gut);
  transition: background .4s var(--ease);
  border-bottom: 2px solid var(--ink);
}
.nav.scrolled {
  background: color-mix(in srgb, var(--bg) 90%, transparent);
  backdrop-filter: blur(14px) saturate(1.4);
  padding-block: 12px;
}
.brand { display: flex; align-items: center; gap: 12px; font-family: var(--font-mono); font-size: 14px; letter-spacing: .02em; }
.brand .tally {
  width: 11px; height: 11px; border-radius: 50%;
  background: var(--live);
  box-shadow: 0 0 0 4px color-mix(in srgb, var(--live) 25%, transparent);
  animation: tally-pulse 1.4s ease-in-out infinite;
}
.brand b { font-family: var(--font-mono); font-weight: 700; letter-spacing: .02em; }

/* after */
.nav {
  position: fixed; top: 0; left: 0; right: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 16px var(--gut);
  transition: background .4s var(--ease);
  border-bottom: 1px solid var(--line);
}
.nav.scrolled {
  background: color-mix(in srgb, var(--bg) 90%, transparent);
  backdrop-filter: blur(14px) saturate(1.4);
  padding-block: 12px;
}
.brand { display: flex; align-items: center; gap: 12px; font-family: var(--font-sans); font-size: 14px; letter-spacing: .02em; }
.brand b { font-family: var(--font-sans); font-weight: 700; letter-spacing: .02em; }
```

- [ ] **Step 3: Replace `.active` dot indicator with text-color + underline state**

```css
/* app/globals.css:145-158 — before */
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-links a {
  font-family: var(--font-mono); font-size: 12px; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--ink-2); padding: 9px 13px; border-radius: 0;
  transition: color .25s, background .25s;
  position: relative;
}
.nav-links a:hover { color: var(--ink); background: none; }
.nav-links a.active { color: var(--live); }
.nav-links a.active::after {
  content: ""; position: absolute; bottom: 4px; left: 50%; transform: translateX(-50%);
  width: 4px; height: 4px; border-radius: 50%; background: var(--live);
}
@media (max-width: 880px){ .nav-links{ display:none; } }

/* after */
.nav-links { display: flex; align-items: center; gap: 4px; }
.nav-links a {
  font-family: var(--font-sans); font-size: 12px; font-weight: 700; letter-spacing: .08em;
  text-transform: uppercase; color: var(--ink-2); padding: 9px 13px; border-radius: 0;
  transition: color .25s, background .25s;
  position: relative;
}
.nav-links a:hover { color: var(--ink); background: none; }
.nav-links a.active { color: var(--ink); }
.nav-links a.active::after {
  content: ""; position: absolute; bottom: 4px; left: 13px; right: 13px;
  height: 1px; background: var(--line);
}
@media (max-width: 880px){ .nav-links{ display:none; } }
```

- [ ] **Step 4: Restyle `.btn-primary` to plain ink-filled, `.btn-ghost` to borderless text**

```css
/* app/globals.css:160-172 — before */
.nav-tools { display: flex; align-items: center; gap: 10px; }

.btn {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: var(--font-mono); font-size: 13px; letter-spacing: .04em;
  padding: 13px 22px; border-radius: 0; cursor: pointer; border: 2px solid transparent;
  white-space: nowrap;
  transition: transform .25s var(--ease), background .25s, border-color .25s, color .25s;
}
.btn-primary { background: var(--live); color: #fff; border: 2px solid var(--live); font-weight: 700; }
.btn-primary:hover { transform: translateY(-2px); }
.btn-ghost { border: 2px solid var(--ink); color: var(--ink); }
.btn-ghost:hover { background: var(--surface); transform: translateY(-2px); }

/* after */
.nav-tools { display: flex; align-items: center; gap: 10px; }

.btn {
  display: inline-flex; align-items: center; gap: 9px;
  font-family: var(--font-sans); font-size: 13px; letter-spacing: .04em;
  padding: 13px 22px; border-radius: 0; cursor: pointer; border: 1px solid transparent;
  white-space: nowrap;
  transition: transform .25s var(--ease), background .25s, border-color .25s, color .25s;
}
.btn-primary { background: var(--ink); color: var(--bg); border: 1px solid var(--ink); font-weight: 600; }
.btn-primary:hover { background: var(--ink-2); border-color: var(--ink-2); transform: translateY(-2px); }
.btn-ghost { border: none; color: var(--ink-2); background: transparent; }
.btn-ghost:hover { color: var(--ink); }
```

- [ ] **Step 5: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors.

Manually at `npm run dev`: no tally dot next to brand, 1px hairline under the nav, active link shows ink text + thin underline (not a dot), "Hire me" is a solid ink-filled rectangle with dark text, no amber/red anywhere.

```bash
git add components/Nav.tsx app/globals.css
git commit -m "refactor(nav): drop broadcast tally/dot decoration, flatten borders and buttons to grayscale"
```

---

### Task 3: Hero — strip broadcast decoration, tokenize colors/fonts, loosen spacing

**Files:**
- Modify: `components/HeroSection.tsx:13-127`
- Modify: `app/globals.css:174-432`

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--ink-3`, `--line`, `--bg`, `--bg-2`, `--font-sans`, `--nav-h`, `--cam-w`, `--metrics-w`, `--hero-shift`, existing `[data-reveal]`/`.in` mechanism, existing `enter-fade`/`enter-up` keyframes.
- Produces: None — leaf task. **This task deletes the shared `.tally-dot` and `.cam-corner` CSS rules (and `.scanline`) from the Hero block.** `ShowreelSection.tsx` still renders `.cam-corner` spans until Task 4 strips them; its own `.showreel-badge .tally-dot` selector is self-contained (redefines size/color) so it keeps working in the interim. Expected transient — resolved by Task 4. This task also makes the **surgical** reduced-motion Block A edit (delete `.scanline`/`.cam-corner`/`.bus-onair`/`.tally-dot` lines).

- [ ] **Step 1: Strip decorative broadcast markup from HeroSection.tsx JSX**

Before (full file):
```tsx
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { siteData } from '@/lib/content'
import Timecode from './Timecode'
import CountUp from './CountUp'
import MarqueeTicker from './MarqueeTicker'

const HeroMetrics = dynamic(() => import('./HeroMetrics'), { ssr: false })

export default function HeroSection() {
  const { hero } = siteData
  return (
    <header className="vmix" id="hero" data-reveal="">
      {/* ── Bus Label Bar ── */}
      <div className="bus-bar">
        <div className="bus-input">INPUT 01 / CAM 01</div>
        <div className="bus-program">● PROGRAM BUS · TMJ / BROADCAST PORTFOLIO</div>
        <div className="bus-onair">
          <span className="tally-dot" />
          ON AIR
        </div>
      </div>

      {/* ── 3-Column Hero Body ── */}
      <div className="vmix-body">

        {/* Left — Camera Input */}
        <div className="cam-col">
          <div className="cam-frame">
            {/* Sweeping scan line */}
            <div className="scanline" />

            {/* Corner brackets */}
            <span className="cam-corner tl" />
            <span className="cam-corner tr" />
            <span className="cam-corner bl" />
            <span className="cam-corner br" />

            {/* Live timecode */}
            <Timecode start="00:14:22:08" />

            {/* Headshot image */}
            <Image
              className="cam-img"
              src={hero.headshot}
              alt="Tri Muhammad Jidan"
              width={766}
              height={972}
              priority
              sizes="(max-width: 940px) 100vw, 350px"
              placeholder={hero.headshotBlur ? 'blur' : 'empty'}
              blurDataURL={hero.headshotBlur}
            />
          </div>

          {/* Cam Label Bar */}
          <div className="cam-label">
            <span className="cam-label-live">
              <span className="tally-dot" />
              CAM 01
            </span>
            <span className="cam-label-pgm">PGM</span>
          </div>
        </div>

        {/* Center — Title */}
        <div className="vmix-title">
          <div className="vmix-role" data-reveal="" data-delay="1">
            {hero.kicker.toUpperCase()}
          </div>

          {hero.nameLines.map((line, i) => (
            <div className="vmix-name-wrap" key={line}>
              <h1
                className="vmix-name-line"
                data-reveal=""
                data-delay={i === 0 ? '2' : '3'}
              >
                {line.toUpperCase()}
              </h1>
            </div>
          ))}

          <div className="vmix-sub" data-reveal="" data-delay="3">
            LIVE ESPORTS BROADCAST
          </div>

          <p className="vmix-lede" data-reveal="" data-delay="3">
            {hero.lede}
          </p>

          <div className="vmix-tags" data-reveal="" data-delay="4">
            {hero.marquee.map((tag) => (
              <span className="vmix-tag" key={tag}>{tag}</span>
            ))}
          </div>

          <div className="vmix-cta" data-reveal="" data-delay="4">
            {hero.cta.map((c) => (
              <a
                key={c.href}
                className={`btn ${c.primary ? 'btn-primary' : 'btn-ghost'}`}
                href={c.href}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right — Metrics with parallax drift */}
        <HeroMetrics />

      </div>

      {/* ── Ticker Strip ── */}
      <div className="ticker">
        <MarqueeTicker
          text={`${hero.marquee.join(' · ')} · ${hero.ticker.join(' · ')} · `}
        />
        <div className="ticker-onair">
          <span className="tally-dot" />
          ON AIR
        </div>
      </div>
    </header>
  )
}
```

After (full file):
```tsx
import Image from 'next/image'
import dynamic from 'next/dynamic'
import { siteData } from '@/lib/content'
import Timecode from './Timecode'
import CountUp from './CountUp'
import MarqueeTicker from './MarqueeTicker'

const HeroMetrics = dynamic(() => import('./HeroMetrics'), { ssr: false })

export default function HeroSection() {
  const { hero } = siteData
  return (
    <header className="vmix" id="hero" data-reveal="">
      {/* ── Bus Label Bar ── */}
      <div className="bus-bar">
        <div className="bus-input">INPUT 01 / CAM 01</div>
        <div className="bus-program">● PROGRAM BUS · TMJ / BROADCAST PORTFOLIO</div>
        <div className="bus-onair">ON AIR</div>
      </div>

      {/* ── 3-Column Hero Body ── */}
      <div className="vmix-body">

        {/* Left — Camera Input */}
        <div className="cam-col">
          <div className="cam-frame">
            {/* Live timecode */}
            <Timecode start="00:14:22:08" />

            {/* Headshot image */}
            <Image
              className="cam-img"
              src={hero.headshot}
              alt="Tri Muhammad Jidan"
              width={766}
              height={972}
              priority
              sizes="(max-width: 940px) 100vw, 350px"
              placeholder={hero.headshotBlur ? 'blur' : 'empty'}
              blurDataURL={hero.headshotBlur}
            />
          </div>

          {/* Cam Label Bar */}
          <div className="cam-label">
            <span className="cam-label-live">CAM 01</span>
            <span className="cam-label-pgm">PGM</span>
          </div>
        </div>

        {/* Center — Title */}
        <div className="vmix-title">
          <div className="vmix-role" data-reveal="" data-delay="1">
            {hero.kicker.toUpperCase()}
          </div>

          {hero.nameLines.map((line, i) => (
            <div className="vmix-name-wrap" key={line}>
              <h1
                className="vmix-name-line"
                data-reveal=""
                data-delay={i === 0 ? '2' : '3'}
              >
                {line.toUpperCase()}
              </h1>
            </div>
          ))}

          <div className="vmix-sub" data-reveal="" data-delay="3">
            LIVE ESPORTS BROADCAST
          </div>

          <p className="vmix-lede" data-reveal="" data-delay="3">
            {hero.lede}
          </p>

          <div className="vmix-tags" data-reveal="" data-delay="4">
            {hero.marquee.map((tag) => (
              <span className="vmix-tag" key={tag}>{tag}</span>
            ))}
          </div>

          <div className="vmix-cta" data-reveal="" data-delay="4">
            {hero.cta.map((c) => (
              <a
                key={c.href}
                className={`btn ${c.primary ? 'btn-primary' : 'btn-ghost'}`}
                href={c.href}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right — Metrics with parallax drift */}
        <HeroMetrics />

      </div>

      {/* ── Ticker Strip ── */}
      <div className="ticker">
        <MarqueeTicker
          text={`${hero.marquee.join(' · ')} · ${hero.ticker.join(' · ')} · `}
        />
        <div className="ticker-onair">ON AIR</div>
      </div>
    </header>
  )
}
```

- [ ] **Step 2: Remove `.tally-dot` and tighten `.vmix` wrapper border**

Before:
```css
/* Shared tally dot (used in bus-bar, cam-label, ticker) */
.tally-dot {
  width: 8px; height: 8px; border-radius: 50%; background: var(--live);
  display: inline-block; flex-shrink: 0;
  animation: tally-pulse 1.4s ease-in-out infinite;
}

/* Outer hero wrapper — full-bleed, no max-width */
.vmix {
  border-bottom: 3px solid var(--ink);
  position: relative;
  padding-top: var(--nav-h);
  padding-left: var(--hero-shift);
}
```

After:
```css
/* Outer hero wrapper — full-bleed, no max-width */
.vmix {
  border-bottom: 1px solid var(--line);
  position: relative;
  padding-top: var(--nav-h);
  padding-left: var(--hero-shift);
}
```

- [ ] **Step 3: Bus bar — plain tokens, loosened padding, no red styling**

Before:
```css
/* ── Bus Label Bar ── */
.bus-bar {
  display: grid;
  grid-template-columns: var(--cam-w) 1fr auto;
  border-bottom: 2px solid var(--ink);
  animation: enter-fade 0.5s ease 0s both;
}
.bus-input {
  padding: 10px 16px;
  border-right: 1px solid var(--line);
  font-family: var(--font-mono); font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-2);
  display: flex; align-items: center;
}
.bus-program {
  padding: 10px 16px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--live);
  display: flex; align-items: center;
}
.bus-onair {
  padding: 10px 18px;
  border-left: 2px solid var(--live);
  display: flex; align-items: center; gap: 9px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--live); white-space: nowrap;
  animation: badge-glow 1.4s ease-in-out infinite;
}
```

After:
```css
/* ── Bus Label Bar ── */
.bus-bar {
  display: grid;
  grid-template-columns: var(--cam-w) 1fr auto;
  border-bottom: 1px solid var(--line);
  animation: enter-fade 0.5s ease 0s both;
}
.bus-input {
  padding: 14px 20px;
  border-right: 1px solid var(--line);
  font-family: var(--font-sans); font-size: 10px;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-2);
  display: flex; align-items: center;
}
.bus-program {
  padding: 14px 20px;
  font-family: var(--font-sans); font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-2);
  display: flex; align-items: center;
}
.bus-onair {
  padding: 14px 22px;
  border-left: 1px solid var(--line);
  display: flex; align-items: center; gap: 9px;
  font-family: var(--font-sans); font-size: 10px; font-weight: 700;
  letter-spacing: 0.12em; text-transform: uppercase;
  color: var(--ink-2); white-space: nowrap;
}
```

- [ ] **Step 4: Camera column — 1px borders, tokenized stripe background; DELETE `.scanline` + `.cam-corner` rules**

Before:
```css
/* ── Camera Column ── */
.cam-col {
  border-left: 2px solid var(--ink);
  border-right: 2px solid var(--ink);
  display: flex; flex-direction: column;
  animation: enter-fade 0.5s ease 0.15s both;
}
.cam-frame {
  flex: 1;
  position: relative; overflow: hidden;
  background: repeating-linear-gradient(
    -45deg,
    #141414 0px, #141414 8px,
    #0F0F0F 8px, #0F0F0F 16px
  );
  display: flex; align-items: center; justify-content: center;
}
.cam-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center 18%;
  position: absolute; inset: 0;
  z-index: 1;
}
.scanline {
  position: absolute; left: 0; right: 0; height: 5px; z-index: 4;
  background: linear-gradient(to bottom, transparent, rgba(255,255,255,.07) 50%, transparent);
  animation: scanline 3.8s linear infinite;
}
/* corner brackets — 4 variants */
.cam-corner {
  position: absolute;
  box-sizing: border-box;
  width: 22px; height: 22px;
  border: 3px solid var(--live);
  display: block; z-index: 5;
}
.cam-corner.tl { top: 10px; left: 10px; border-right: 0; border-bottom: 0; animation: corner-draw 0.35s ease 0.60s both; }
.cam-corner.tr { top: 10px; right: 10px; border-left: 0; border-bottom: 0; animation: corner-draw 0.35s ease 0.68s both; }
.cam-corner.bl { bottom: 10px; left: 10px; border-right: 0; border-top: 0; animation: corner-draw 0.35s ease 0.76s both; }
.cam-corner.br { bottom: 10px; right: 10px; border-left: 0; border-top: 0; animation: corner-draw 0.35s ease 0.84s both; }
```

After:
```css
/* ── Camera Column ── */
.cam-col {
  border-left: 1px solid var(--line);
  border-right: 1px solid var(--line);
  display: flex; flex-direction: column;
  animation: enter-fade 0.5s ease 0.15s both;
}
.cam-frame {
  flex: 1;
  position: relative; overflow: hidden;
  background: repeating-linear-gradient(
    -45deg,
    var(--bg-2) 0px, var(--bg-2) 8px,
    var(--bg) 8px, var(--bg) 16px
  );
  display: flex; align-items: center; justify-content: center;
}
.cam-img {
  width: 100%; height: 100%;
  object-fit: cover; object-position: center 18%;
  position: absolute; inset: 0;
  z-index: 1;
}
```

- [ ] **Step 5: Timecode overlay — token font/background**

Before:
```css
/* Timecode overlay */
.tc {
  position: absolute; top: 13px; left: 50%; transform: translateX(-50%);
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.07em;
  color: var(--ink-3); background: rgba(0,0,0,.8); padding: 2px 10px;
  white-space: nowrap; z-index: 6;
  animation: enter-fade 0.4s ease 0.90s both;
}
```

After:
```css
/* Timecode overlay */
.tc {
  position: absolute; top: 13px; left: 50%; transform: translateX(-50%);
  font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.07em;
  color: var(--ink-3); background: color-mix(in srgb, var(--bg) 80%, transparent); padding: 2px 10px;
  white-space: nowrap; z-index: 6;
  animation: enter-fade 0.4s ease 0.90s both;
}
```

- [ ] **Step 6: Cam label bar — plain text, no pill treatment**

Before:
```css
/* Cam label bar */
.cam-label {
  border-top: 2px solid var(--live);
  padding: 8px 14px;
  background: var(--bg);
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--font-mono); font-size: 11px; letter-spacing: 0.07em;
  flex: none;
  animation: enter-fade 0.4s ease 0.25s both;
}
.cam-label-live {
  color: var(--live); font-weight: 700;
  display: flex; align-items: center; gap: 8px;
}
.cam-label-pgm { color: var(--ink-3); }
```

After:
```css
/* Cam label bar */
.cam-label {
  border-top: 1px solid var(--line);
  padding: 14px 20px;
  background: var(--bg);
  display: flex; justify-content: space-between; align-items: center;
  font-family: var(--font-sans); font-size: 11px; letter-spacing: 0.07em;
  flex: none;
  animation: enter-fade 0.4s ease 0.25s both;
}
.cam-label-live { color: var(--ink-2); }
.cam-label-pgm { color: var(--ink-3); }
```

- [ ] **Step 7: Title column — drop red glow, plain tokens, airier spacing**

Before:
```css
/* ── Title Column ── */
.vmix-title {
  position: relative;
  padding: 30px 28px;
  border-right: 1px solid var(--line-2);
  display: flex; flex-direction: column; justify-content: center;
}
.vmix-title::before {
  content: "";
  position: absolute;
  top: -30%; left: -15%; width: 130%; height: 160%;
  background: radial-gradient(ellipse, color-mix(in srgb, var(--live) 8%, transparent), transparent 70%);
  pointer-events: none; z-index: 0;
}
.vmix-title > * { position: relative; z-index: 1; }
.vmix-role {
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-2); margin-bottom: 16px;
  animation: enter-up 0.5s ease 0.30s both;
}
.vmix-name-wrap { overflow: hidden; }
.vmix-name-line {
  font-family: var(--font-display); font-weight: 900;
  font-size: clamp(44px, 8vw, 76px);
  line-height: .88; text-transform: uppercase; letter-spacing: -0.01em;
  color: var(--ink); margin: 0;
}
.vmix-name-wrap:nth-child(2) .vmix-name-line { animation: enter-up 0.55s ease 0.42s both; }
.vmix-name-wrap:nth-child(3) .vmix-name-line { animation: enter-up 0.55s ease 0.50s both; }
.vmix-sub {
  font-family: var(--font-display); font-weight: 700;
  font-size: 28px; text-transform: uppercase;
  color: var(--live); letter-spacing: 0.03em;
  margin-top: 10px;
  animation: enter-up 0.5s ease 0.58s both;
}
.vmix-lede {
  margin-top: 20px;
  font-family: var(--font-mono); font-size: 12px;
  color: #888880; line-height: 1.7; max-width: 380px;
  animation: enter-fade 0.5s ease 0.68s both;
}
.vmix-tags {
  margin-top: 22px;
  display: flex; gap: 7px; flex-wrap: wrap;
  animation: enter-fade 0.5s ease 0.78s both;
}
.vmix-tag {
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.06em;
  color: var(--ink-3); border: 1px solid #272725; padding: 4px 11px;
}
.vmix-cta {
  display: flex; gap: 14px; margin-top: 24px; flex-wrap: wrap;
  animation: enter-fade 0.5s ease 0.88s both;
}
```

After:
```css
/* ── Title Column ── */
.vmix-title {
  position: relative;
  padding: 48px 40px;
  border-right: 1px solid var(--line);
  display: flex; flex-direction: column; justify-content: center;
}
.vmix-role {
  font-family: var(--font-sans); font-size: 9px;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-2); margin-bottom: 20px;
  animation: enter-up 0.5s ease 0.30s both;
}
.vmix-name-wrap { overflow: hidden; }
.vmix-name-line {
  font-family: var(--font-sans); font-weight: 700;
  font-size: clamp(44px, 8vw, 76px);
  line-height: .88; text-transform: uppercase; letter-spacing: -0.01em;
  color: var(--ink); margin: 0;
}
.vmix-name-wrap:nth-child(2) .vmix-name-line { animation: enter-up 0.55s ease 0.42s both; }
.vmix-name-wrap:nth-child(3) .vmix-name-line { animation: enter-up 0.55s ease 0.50s both; }
.vmix-sub {
  font-family: var(--font-sans); font-weight: 700;
  font-size: 28px; text-transform: uppercase;
  color: var(--ink-2); letter-spacing: 0.03em;
  margin-top: 14px;
  animation: enter-up 0.5s ease 0.58s both;
}
.vmix-lede {
  margin-top: 24px;
  font-family: var(--font-sans); font-size: 12px;
  color: var(--ink-2); line-height: 1.7; max-width: 380px;
  animation: enter-fade 0.5s ease 0.68s both;
}
.vmix-tags {
  margin-top: 28px;
  display: flex; gap: 7px; flex-wrap: wrap;
  animation: enter-fade 0.5s ease 0.78s both;
}
.vmix-tag {
  font-family: var(--font-sans); font-size: 10px; letter-spacing: 0.06em;
  color: var(--ink-3); border: 1px solid var(--line); padding: 4px 11px;
}
.vmix-cta {
  display: flex; gap: 14px; margin-top: 32px; flex-wrap: wrap;
  animation: enter-fade 0.5s ease 0.88s both;
}
```

- [ ] **Step 8: Metrics column — plain ink numbers, no amber label color**

Before:
```css
/* ── Metrics Column ── */
.vmix-metrics {
  padding: 22px 16px;
}
.metrics-header {
  font-family: var(--font-mono); font-size: 9px; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--amber); margin-bottom: 20px;
  animation: enter-fade 0.4s ease 0.35s both;
}
.metric {
  border-top: 1px solid var(--line-2);
  padding-top: 16px; margin-bottom: 18px;
}
.metric:nth-child(2) { animation: enter-up 0.5s ease 0.46s both; }
.metric:nth-child(3) { animation: enter-up 0.5s ease 0.62s both; }
.metric:nth-child(4) { animation: enter-up 0.5s ease 0.78s both; }
.metric-n {
  font-family: var(--font-display); font-weight: 700;
  font-size: 40px; line-height: 1; color: var(--ink);
}
.metric-l {
  font-family: var(--font-mono); font-size: 9px;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-3); margin-top: 4px;
}
```

After:
```css
/* ── Metrics Column ── */
.vmix-metrics {
  padding: 32px 24px;
}
.metrics-header {
  font-family: var(--font-sans); font-size: 9px; font-weight: 700;
  letter-spacing: 0.16em; text-transform: uppercase;
  color: var(--ink-2); margin-bottom: 20px;
  animation: enter-fade 0.4s ease 0.35s both;
}
.metric {
  border-top: 1px solid var(--line);
  padding-top: 20px; margin-bottom: 24px;
}
.metric:nth-child(2) { animation: enter-up 0.5s ease 0.46s both; }
.metric:nth-child(3) { animation: enter-up 0.5s ease 0.62s both; }
.metric:nth-child(4) { animation: enter-up 0.5s ease 0.78s both; }
.metric-n {
  font-family: var(--font-sans); font-weight: 700;
  font-size: 40px; line-height: 1; color: var(--ink);
}
.metric-l {
  font-family: var(--font-sans); font-size: 9px;
  letter-spacing: 0.08em; text-transform: uppercase;
  color: var(--ink-3); margin-top: 4px;
}
```

- [ ] **Step 9: Ticker strip — drop badge coloring, 1px border**

Before:
```css
/* ── Ticker Strip ── */
.ticker {
  padding: 10px 20px;
  border-top: 1px solid var(--line-2);
  display: flex; justify-content: space-between; align-items: center;
  animation: enter-fade 0.5s ease 0.95s both;
}
.ticker-text {
  font-family: var(--font-mono); font-size: 10px;
  color: var(--ink-2); letter-spacing: 0.06em;
}
.ticker-onair {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; color: var(--live);
  flex: none; margin-left: 32px;
}
```

After:
```css
/* ── Ticker Strip ── */
.ticker {
  padding: 16px 24px;
  border-top: 1px solid var(--line);
  display: flex; justify-content: space-between; align-items: center;
  animation: enter-fade 0.5s ease 0.95s both;
}
.ticker-text {
  font-family: var(--font-sans); font-size: 10px;
  color: var(--ink-2); letter-spacing: 0.06em;
}
.ticker-onair {
  display: flex; align-items: center; gap: 8px;
  font-family: var(--font-sans); font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; color: var(--ink-2);
  flex: none; margin-left: 32px;
}
```

- [ ] **Step 10: Responsive collapse — 1px border weight**

Before:
```css
/* ── Responsive — single column under 1050px ── */
@media (max-width: 1050px) {
  .vmix { padding-top: 72px; padding-left: 0; }
  .bus-bar { grid-template-columns: 1fr auto; }
  .bus-input { display: none; }
  .vmix-body { grid-template-columns: 1fr; min-height: auto; }
  .cam-col { border-left: none; border-right: none; border-bottom: 2px solid var(--ink); }
  .cam-frame { min-height: 240px; }
  .vmix-metrics { border-top: 2px solid var(--ink); display: flex; flex-wrap: wrap; gap: 0; }
  .metrics-header { width: 100%; }
  .metric { flex: 1 0 calc(33% - 16px); margin-bottom: 0; padding-bottom: 16px; }
  .ticker { flex-wrap: wrap; gap: 8px; }
}
```

After:
```css
/* ── Responsive — single column under 1050px ── */
@media (max-width: 1050px) {
  .vmix { padding-top: 72px; padding-left: 0; }
  .bus-bar { grid-template-columns: 1fr auto; }
  .bus-input { display: none; }
  .vmix-body { grid-template-columns: 1fr; min-height: auto; }
  .cam-col { border-left: none; border-right: none; border-bottom: 1px solid var(--line); }
  .cam-frame { min-height: 240px; }
  .vmix-metrics { border-top: 1px solid var(--line); display: flex; flex-wrap: wrap; gap: 0; }
  .metrics-header { width: 100%; }
  .metric { flex: 1 0 calc(33% - 16px); margin-bottom: 0; padding-bottom: 16px; }
  .ticker { flex-wrap: wrap; gap: 8px; }
}
```

- [ ] **Step 11: Reduced-motion Block A — SURGICAL delete of 4 dead lines**

In the Hero-region `@media (prefers-reduced-motion: reduce)` block (**Block A**, ~line 422), delete these four lines (and only these four — leave the hero-classes comma-list and the `.tl-onair`/`.ev-onair` lines for their owning tasks):

```css
  .scanline { animation: none; }
  .cam-corner { animation: none; width: 22px; height: 22px; }
  .bus-onair { animation: none; }
  .tally-dot { animation: none; }
```

- [ ] **Step 12: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors.

Manually at `npm run dev`: no tally dots, no corner brackets, no scanline, no red/amber anywhere, all borders 1px, sharp corners, plain-text CAM 01/PGM/ON AIR labels, airier padding around bus bar / title / metrics / ticker.

```bash
git add components/HeroSection.tsx app/globals.css
git commit -m "refactor(hero): strip broadcast decoration, tokenize colors/fonts, loosen spacing"
```

### Task 4: Showreel — strip broadcast decoration, apply Signal Minimal tokens

**Files:**
- Modify: `components/ShowreelSection.tsx:83-90`
- Modify: `app/globals.css` (SHOWREEL CSS block)

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--ink-3`, `--line`, `--bg`, `--bg-2`, `--font-sans`, `--ease`, existing auto-rotate slideshow logic (unchanged), existing `[data-reveal]`/`.in`.
- Produces: None — leaf task. After this task no component renders `.cam-corner` (Hero stripped them in Task 3, Showreel here) — the `.cam-corner` CSS rules were already deleted in Task 3's Hero block; Showreel's own selectors (`.showreel-frame`, `.showreel-badge`, etc.) are fully self-contained and rewritten here.

- [ ] **Step 1: Strip cam-corner brackets and tally dot from ShowreelSection.tsx**

Before (lines 83-90, inside the `.showreel-slide` / `.showreel-frame` JSX):
```tsx
            <div className="showreel-frame">
              <span className="cam-corner tl" />
              <span className="cam-corner tr" />
              <span className="cam-corner bl" />
              <span className="cam-corner br" />
              <div className="showreel-badge">
                <span className="tally-dot" />
                {slide.badge}
              </div>
              {/* ...slide image/video... */}
            </div>
```

After:
```tsx
            <div className="showreel-frame">
              <div className="showreel-badge">{slide.badge}</div>
              {/* ...slide image/video... */}
            </div>
```

(Keep the surrounding slide/image/video markup exactly as-is — only the four `.cam-corner` spans and the inner `<span className="tally-dot" />` are removed. The plain `.showreel-badge` wrapper stays as a text label.)

- [ ] **Step 2: Rewrite the SHOWREEL CSS block**

Before:
```css
/* ── Showreel Section ── */
.showreel-frame {
  position: relative; overflow: hidden;
  border: 2px solid var(--ink);
  background: var(--surface);
  aspect-ratio: 16 / 9;
}
.showreel-badge {
  position: absolute; top: 16px; left: 16px; z-index: 4;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px;
  background: var(--bg); border: 2px solid var(--live);
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--live);
  animation: badge-glow 1.4s ease-in-out infinite;
}
.showreel-cap {
  font-family: var(--font-display); font-weight: 700;
  font-size: clamp(18px, 2.4vw, 26px); color: var(--ink);
  margin-top: 16px;
}
.showreel-title { color: var(--ink); font-weight: 700; }
.showreel-meta {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--amber); margin-top: 6px; letter-spacing: 0.06em;
}
.showreel-watch {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 18px; font-family: var(--font-mono); font-size: 12px;
  color: var(--live); border-bottom: 1px solid var(--live); padding-bottom: 2px;
}
.showreel-nav {
  display: flex; gap: 6px; margin-top: 18px;
}
.showreel-nav button {
  width: 28px; height: 4px; border: 0; padding: 0; cursor: pointer;
  background: var(--line-2); transition: background .25s;
}
.showreel-nav button.active { background: var(--live); }
.showreel-direct {
  display: flex; gap: 10px; margin-top: 14px; flex-wrap: wrap;
}
.showreel-direct button {
  font-family: var(--font-mono); font-size: 10px;
  color: var(--ink-3); background: none; border: 1px solid var(--line-2);
  padding: 5px 10px; cursor: pointer; transition: color .25s, border-color .25s;
}
.showreel-direct button.active { color: var(--ink); border-color: var(--ink); }
```

After:
```css
/* ── Showreel Section ── */
.showreel-frame {
  position: relative; overflow: hidden;
  border: 1px solid var(--line);
  background: var(--bg-2);
  aspect-ratio: 16 / 9;
}
.showreel-badge {
  position: absolute; top: 16px; left: 16px; z-index: 4;
  padding: 6px 12px;
  background: var(--bg);
  font-family: var(--font-sans); font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-2);
}
.showreel-cap {
  font-family: var(--font-sans); font-weight: 700;
  font-size: clamp(18px, 2.4vw, 26px); color: var(--ink);
  margin-top: 18px;
}
.showreel-title { color: var(--ink); font-weight: 700; }
.showreel-meta {
  font-family: var(--font-sans); font-size: 11px;
  color: var(--ink-2); margin-top: 8px; letter-spacing: 0.06em;
}
.showreel-watch {
  display: inline-flex; align-items: center; gap: 8px;
  margin-top: 22px; font-family: var(--font-sans); font-size: 12px;
  color: var(--ink); border-bottom: 1px solid var(--line); padding-bottom: 2px;
  transition: border-color .25s, color .25s;
}
.showreel-watch:hover { border-color: var(--ink); }
.showreel-nav {
  display: flex; gap: 6px; margin-top: 20px;
}
.showreel-nav button {
  width: 28px; height: 4px; border: 0; padding: 0; cursor: pointer;
  background: var(--line); transition: background .25s;
}
.showreel-nav button.active { background: var(--ink); }
.showreel-direct {
  display: flex; gap: 10px; margin-top: 16px; flex-wrap: wrap;
}
.showreel-direct button {
  font-family: var(--font-sans); font-size: 10px;
  color: var(--ink-3); background: none; border: 1px solid var(--line);
  padding: 5px 10px; cursor: pointer; transition: color .25s, border-color .25s;
}
.showreel-direct button.active { color: var(--ink); border-color: var(--ink); }
```

- [ ] **Step 3: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors.

Manually at `npm run dev`: showreel frame has a 1px hairline border on a lifted `--bg-2` surface, badge is plain gray text (no border, no glow, no pulse), meta caption is gray not amber, watch CTA is ink with hairline underline, active dot is ink not red, thumbnails/direct-nav active state is ink.

```bash
git add components/ShowreelSection.tsx app/globals.css
git commit -m "style(showreel): strip broadcast decoration, apply Signal Minimal grayscale tokens"
```

---

### Task 5: About — drop GSAP scroll effects, flatten to Signal Minimal tokens

**Files:**
- Modify: `components/AboutPortrait.tsx` (full rewrite — drops `'use client'`, GSAP, frame-corner/frame-tag spans)
- Modify: `components/AboutCopy.tsx` (drop GSAP word-reveal + wrapWords walker)
- Modify: `app/globals.css` (ABOUT CSS block + delete `.word-reveal` block)

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--line`, `--bg`, `--font-sans`, existing `[data-reveal]`/`.in` for the section reveal.
- Produces: None — leaf task. After this task `AboutPortrait` is a server component (no `'use client'`), and `AboutCopy` no longer imports `useEffect`/`useRef`/`useState`/`gsap`.

- [ ] **Step 1: Rewrite AboutPortrait.tsx as a plain server component**

Before (full file):
```tsx
'use client'
import Image from 'next/image'
import { useRef } from 'react'
import { gsap } from 'gsap'
import { about } from '@/lib/content'

export default function AboutPortrait() {
  const ref = useRef<HTMLDivElement>(null)

  if (typeof window !== 'undefined') {
    // parallax drift on the inner image, scrubbed to scroll
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      if (!ref.current) return
      gsap.registerPlugin(ScrollTrigger)
      gsap.to(ref.current, {
        yPercent: -12,
        ease: 'none',
        scrollTrigger: { trigger: ref.current, start: 'top bottom', end: 'bottom top', scrub: true },
      })
    })
  }

  return (
    <div className="about-portrait">
      <div className="about-portrait-inner" ref={ref}>
        <div className="about-portrait-frame">
          <span className="frame-corner tl" />
          <span className="frame-corner tr" />
          <span className="frame-corner bl" />
          <span className="frame-corner br" />
          <span className="frame-tag">
            <span className="dot" /> CAM 02 · INT
          </span>
          <Image
            src={about.portrait}
            alt={about.name}
            width={640}
            height={800}
            sizes="(max-width: 940px) 100vw, 480px"
            placeholder={about.portraitBlur ? 'blur' : 'empty'}
            blurDataURL={about.portraitBlur}
          />
        </div>
      </div>
    </div>
  )
}
```

After (full file):
```tsx
import Image from 'next/image'
import { about } from '@/lib/content'

export default function AboutPortrait() {
  return (
    <div className="about-portrait">
      <div className="about-portrait-inner">
        <div className="about-portrait-frame">
          <Image
            src={about.portrait}
            alt={about.name}
            width={640}
            height={800}
            sizes="(max-width: 940px) 100vw, 480px"
            placeholder={about.portraitBlur ? 'blur' : 'empty'}
            blurDataURL={about.portraitBlur}
          />
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Drop GSAP word-reveal walker from AboutCopy.tsx**

Before (relevant pieces — imports + the `useEffect`/`useRef`/`useState` walker that wraps each word in a `.word-reveal` span and staggers them via GSAP):
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
// ...
export default function AboutCopy() {
  const ref = useRef<HTMLDivElement>(null)
  const [wrapped, setWrapped] = useState(false)
  useEffect(() => {
    if (!ref.current || wrapped) return
    // wrapWords walker — splits .about-copy-body text into .word-reveal spans
    // ... then gsap.from('.word-reveal', { stagger ... scrollTrigger ... })
    setWrapped(true)
  }, [wrapped])
  return (
    <div ref={ref} className="about-copy-body" dangerouslySetInnerHTML={{ __html: about.bioHtml }} />
  )
}
```

After (full file):
```tsx
import { about } from '@/lib/content'

export default function AboutCopy() {
  return (
    <div className="about-copy-body" dangerouslySetInnerHTML={{ __html: about.bioHtml }} />
  )
}
```

(The `dangerouslySetInnerHTML` stays — `about.bioHtml` is trusted content from `lib/content.ts`. The component is now a server component; the reveal still works via the section-level `[data-reveal]` on the About wrapper in `page.tsx`.)

- [ ] **Step 3: ABOUT CSS — flatten portrait frame, delete corner/tag rules, de-amber the mark/chips**

Before:
```css
/* ── About Section ── */
.about-portrait { position: relative; }
.about-portrait-inner { position: relative; inset: -36px 0; will-change: transform; }
.about-portrait-frame {
  position: relative; overflow: hidden;
  border: 2px solid var(--ink);
}
.frame-corner {
  position: absolute; box-sizing: border-box;
  width: 22px; height: 22px;
  border: 3px solid var(--amber);
  display: block; z-index: 5;
}
.frame-corner.tl { top: 10px; left: 10px; border-right: 0; border-bottom: 0; }
.frame-corner.tr { top: 10px; right: 10px; border-left: 0; border-bottom: 0; }
.frame-corner.bl { bottom: 10px; left: 10px; border-right: 0; border-top: 0; }
.frame-corner.br { bottom: 10px; right: 10px; border-left: 0; border-top: 0; }
.frame-tag {
  position: absolute; top: 12px; right: 12px; z-index: 6;
  display: inline-flex; align-items: center; gap: 6px;
  padding: 4px 10px; background: var(--bg);
  font-family: var(--font-mono); font-size: 10px; letter-spacing: 0.08em;
  color: var(--amber);
}
.frame-tag .dot {
  width: 6px; height: 6px; border-radius: 50%; background: var(--amber);
}
.mark { color: var(--amber); font-weight: 700; }
.interest-inline h4 {
  font-family: var(--font-mono); font-size: 11px;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--amber);
  margin-bottom: 10px;
}
.chip {
  font-family: var(--font-mono); font-size: 11px;
  color: var(--ink-3); border: 1px solid var(--line-2); padding: 4px 11px;
}
```

After:
```css
/* ── About Section ── */
.about-portrait-inner { position: relative; inset: 0; }
.about-portrait-frame {
  position: relative; overflow: hidden;
  border: 1px solid var(--line);
}
.mark { color: var(--ink); font-weight: 700; font-style: italic; }
.interest-inline h4 {
  font-family: var(--font-sans); font-size: 11px;
  letter-spacing: 0.1em; text-transform: uppercase; color: var(--ink-2);
  margin-bottom: 12px;
}
.chip {
  font-family: var(--font-sans); font-size: 11px;
  color: var(--ink-3); border: 1px solid var(--line); padding: 4px 11px;
}
```

(`.about-portrait { position: relative }` is deleted — no longer needed without the parallax. `.frame-corner`/`.frame-tag`/`.frame-tag .dot` rules deleted entirely.)

- [ ] **Step 4: Delete the `.word-reveal` CSS block**

Find and delete (was used by the old AboutCopy GSAP word-stagger):
```css
.word-reveal { display: inline-block; opacity: 0; transform: translateY(0.4em); }
.about-copy-body.in .word-reveal { animation: enter-up 0.5s ease both; }
```
(Selector names may differ slightly — delete any rule whose selector contains `.word-reveal`. The `.about-copy-body` base typography, if present, stays.)

- [ ] **Step 5: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors, no unused-import warnings.

Manually at `npm run dev`: portrait has a 1px hairline frame (no corner brackets, no CAM 02 tag), no parallax drift on scroll, `.mark` is italic ink, interest headings and chips are grayscale, bio copy still reveals with the section.

```bash
git add components/AboutPortrait.tsx components/AboutCopy.tsx app/globals.css
git commit -m "refactor(about): drop GSAP scroll effects, flatten About section to Signal Minimal tokens"
```

---

### Task 6: Skills + Graphics merge — fold GraphicsSection into SkillsSection

**Files:**
- Modify: `components/SkillsSection.tsx` (add `'use client'`, render skills + inline graphics gallery, new `SkillsGraphicsCard` sub-component)
- Modify: `app/page.tsx:11` (delete `GraphicsSection` import) and `app/page.tsx:71` (delete `<GraphicsSection />` render)
- Delete: `components/GraphicsSection.tsx` (via `git rm`)
- Modify: `app/globals.css` (SKILLS/TOOLS block retokenized + GRAPHICS GALLERY block → SKILLS GRAPHICS merged block)

**Interfaces:**
- Consumes: `skills` and `graphics` data from `lib/content.ts` (both already exported there — `graphics.json` is still consumed, just by `SkillsSection` now), `--ink`, `--ink-2`, `--ink-3`, `--line`, `--bg`, `--bg-2`, `--font-sans`, existing `[data-reveal]`/`.in`.
- Produces: `.skills-graphics`, `.skills-graphics-grid`, `.skills-graphics-card`, `.skills-graphics-media`, `.skills-graphics-vid`, `.skills-graphics-body`, `.skills-graphics-label`, `.skills-graphics-tools` CSS classes (new). `SkillsGraphicsCard` is a local component (not exported). After this task `GraphicsSection` is gone and `page.tsx` no longer references it.

- [ ] **Step 1: Rewrite SkillsSection.tsx to render skills + inline graphics gallery**

Before (structure — skills-only, server component):
```tsx
import { skills } from '@/lib/content'
// ... renders SKILLS + TOOLS blocks from `skills`
```

After (full file):
```tsx
'use client'
import Image from 'next/image'
import { useRef, useState } from 'react'
import { skills, graphics } from '@/lib/content'

function SkillsGraphicsCard({ item }: { item: typeof graphics[number] }) {
  const ref = useRef<HTMLVideoElement>(null)
  const [playable, setPlayable] = useState(true)

  function onEnter() {
    ref.current?.play().catch(() => setPlayable(false))
  }
  function onLeave() {
    if (ref.current) { ref.current.pause() }
  }

  return (
    <article
      className="skills-graphics-card"
      data-reveal=""
      onMouseEnter={onEnter}
      onMouseLeave={onLeave}
    >
      <div className="skills-graphics-media">
        {item.video && playable ? (
          <video
            ref={ref}
            className="skills-graphics-vid"
            src={item.video}
            muted
            loop
            playsInline
            preload="metadata"
          />
        ) : (
          item.poster && (
            <Image
              src={item.poster}
              alt={item.title}
              fill
              sizes="(max-width: 940px) 100vw, 380px"
            />
          )
        )}
      </div>
      <div className="skills-graphics-body">
        <div className="skills-graphics-label">{item.title}</div>
        {item.tools && (
          <div className="skills-graphics-tools">{item.tools.join(' · ')}</div>
        )}
      </div>
    </article>
  )
}

export default function SkillsSection() {
  return (
    <section id="skills" className="block section-block" data-reveal="">
      <div className="wrap">
        <div className="section-head">
          <span className="kicker">{skills.kicker}</span>
          <h2>{skills.title}</h2>
          <p>{skills.lede}</p>
        </div>

        {/* SKILLS + TOOLS grid — existing structure, kept as-is */}
        {/* ...existing skills/tools JSX... */}

        {/* Inline graphics gallery (folded in from GraphicsSection) */}
        {graphics?.length > 0 && (
          <div className="skills-graphics">
            <div className="skills-graphics-grid">
              {graphics.map((item) => (
                <SkillsGraphicsCard key={item.title} item={item} />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
```

> **Note for the implementer:** the existing SKILLS + TOOLS JSX (role-tags, tool rows with `.meter .fill`, etc.) is preserved verbatim in the `{/* ...existing skills/tools JSX... */}` position — do not delete it, only wrap it as shown and append the graphics gallery block after it. If the existing component is already `'use client'` or already imports `Image`/`useRef`, dedupe the imports.

- [ ] **Step 2: Remove GraphicsSection from page.tsx**

```tsx
// app/page.tsx:11 — before
import GraphicsSection from '@/components/GraphicsSection'
// after (delete this line entirely)
```

```tsx
// app/page.tsx:71 — before
      <GraphicsSection />
// after (delete this line entirely)
```

- [ ] **Step 3: Delete GraphicsSection.tsx**

```bash
git rm components/GraphicsSection.tsx
```

- [ ] **Step 4: Retokenize SKILLS/TOOLS CSS, replace GRAPHICS GALLERY block with SKILLS GRAPHICS merged block**

Before (SKILLS/TOOLS block — representative rules):
```css
.tool {
  border: 2px solid var(--line);
  background: var(--surface);
  padding: 14px 16px;
  transition: border-color .25s, background .25s;
}
.tool:hover { border-color: var(--amber); background: var(--surface-2); }
.meter { height: 4px; background: var(--line-2); }
.meter .fill {
  height: 100%;
  background: repeating-linear-gradient(45deg, var(--amber) 0 6px, var(--accent) 6px 12px);
}
.role-tags .rt b { color: var(--accent); font-family: var(--font-mono); }
```

After (SKILLS/TOOLS block):
```css
.tool {
  border: 1px solid var(--line);
  background: var(--bg);
  padding: 16px 18px;
  transition: border-color .25s, background .25s;
}
.tool:hover { border-color: var(--ink); background: var(--bg-2); }
.meter { height: 4px; background: var(--line); }
.meter .fill { height: 100%; background: var(--ink); }
.role-tags .rt b { color: var(--ink); font-family: var(--font-sans); }
```

Before (GRAPHICS GALLERY block — `.gfx-*` classes, now orphaned):
```css
.gfx { ... }
.gfx-grid { ... }
.gfx-card { border: 2px solid var(--ink); background: var(--surface); ... }
.gfx-media { ... }
.gfx-vid { ... }
.gfx-body { ... }
.gfx-label { color: var(--amber); font-family: var(--font-mono); ... }
.gfx-tools { color: var(--ink-3); font-family: var(--font-mono); ... }
```

After (replace the entire `.gfx-*` block with the SKILLS GRAPHICS merged block):
```css
/* ── Skills Graphics (merged from GraphicsSection) ── */
.skills-graphics { margin-top: clamp(36px, 5vw, 64px); }
.skills-graphics-grid {
  display: grid; gap: 16px;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
}
.skills-graphics-card {
  position: relative;
  border: 1px solid var(--line);
  background: var(--bg-2);
  overflow: hidden;
  transition: border-color .25s, transform .25s var(--ease);
}
.skills-graphics-card:hover { border-color: var(--ink); transform: translateY(-4px); }
.skills-graphics-media { position: relative; aspect-ratio: 16 / 9; overflow: hidden; }
.skills-graphics-vid { width: 100%; height: 100%; object-fit: cover; display: block; }
.skills-graphics-body { padding: 14px 16px; }
.skills-graphics-label {
  font-family: var(--font-sans); font-weight: 600; font-size: 14px; color: var(--ink);
}
.skills-graphics-tools {
  font-family: var(--font-sans); font-size: 11px; color: var(--ink-3);
  letter-spacing: 0.04em; margin-top: 6px;
}
```

- [ ] **Step 5: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors, no "GraphicsSection not found" import error, no unused-export warnings.

Manually at `npm run dev`: Skills section shows its existing skills/tools grid (now with 1px borders, solid ink meter fills, no amber), followed by the inline graphics gallery grid below it — video clips play on hover (fallback to poster image on mobile/autoplay-blocked), hairline borders, ink hover state. The old standalone Graphics section between sections is gone.

```bash
git add components/SkillsSection.tsx app/page.tsx app/globals.css
git commit -m "Merge GraphicsSection into SkillsSection, restyle to Signal Minimal tokens"
```

(`git rm components/GraphicsSection.tsx` is already staged by Step 3.)

---

### Task 7: Experience — remove on-air/complete color-coded timeline badge

**Files:**
- Modify: `components/ExperienceSection.tsx` (`.tl-badge` JSX simplification)
- Modify: `app/globals.css` (TIMELINE/EXPERIENCE block)

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--ink-3`, `--line`, `--font-sans`, existing `[data-reveal]`/`.in`, the `experience` data from `lib/content.ts` (the `item.active` boolean is still used — only the visual treatment changes).
- Produces: None — leaf task. The `.tl-onair`/`.tl-complete` modifier classes are no longer rendered; their CSS rules can be deleted (or left — they just won't match; deleting is cleaner). Makes the **surgical** reduced-motion Block A edit (delete the `.tl-onair .tl-badge { animation: none; }` line).

- [ ] **Step 1: Simplify the `.tl-badge` JSX to plain text**

Before (inside the `.tl-item` map):
```tsx
          <div className={`tl-badge ${item.active ? 'tl-onair' : 'tl-complete'}`}>
            <span className="dot" />
            {item.active ? 'ON AIR' : 'COMPLETE'}
          </div>
```

After:
```tsx
          <div className="tl-badge">
            {item.active ? 'Present' : 'Complete'}
          </div>
```

(Plain text, no dot, no modifier class. Copy change here is presentation-only — "Present"/"Complete" are status labels, not content edits; the underlying `item.active` data is unchanged. If you prefer to keep "ON AIR"/"COMPLETE" exactly, keep those strings — but the spec's non-goal is "no content/copy changes," and these are UI status labels not portfolio content; "Present"/"Complete" reads cleaner in the minimal direction. If unsure, keep "ON AIR"/"COMPLETE" to honor the no-copy-change rule strictly.)

- [ ] **Step 2: Rewrite the TIMELINE/EXPERIENCE CSS block**

Before:
```css
/* ── Experience / Timeline ── */
.tl-item {
  display: grid; grid-template-columns: 200px 1fr;
  gap: 32px; padding: 36px 0;
  border-top: 2px solid var(--ink);
}
.tl-badge {
  justify-self: start;
  display: inline-flex; align-items: center; gap: 8px;
  padding: 6px 12px;
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.1em; text-transform: uppercase;
  border: 2px solid var(--line);
}
.tl-badge .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--ink-3); }
.tl-onair .tl-badge { color: var(--live); border-color: var(--live); }
.tl-onair .tl-badge .dot { background: var(--live); animation: tally-pulse 1.4s ease-in-out infinite; }
.tl-complete .tl-badge { color: var(--amber); border-color: var(--amber); }
.tl-complete .tl-badge .dot { background: var(--amber); }
.tl-role { font-family: var(--font-display); font-weight: 700; font-size: 22px; color: var(--ink); }
.tl-org { font-family: var(--font-mono); font-size: 12px; color: var(--ink-2); margin-top: 4px; }
.tl-period { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); }
.tl-desc { font-family: var(--font-mono); font-size: 13px; color: var(--ink-2); margin-top: 12px; line-height: 1.7; }
```

After:
```css
/* ── Experience / Timeline ── */
.tl-item {
  display: grid; grid-template-columns: 200px 1fr;
  gap: 36px; padding: 44px 0;
  border-top: 1px solid var(--line);
}
.tl-badge {
  justify-self: start;
  display: inline-flex; align-items: center;
  padding: 6px 12px;
  font-family: var(--font-sans); font-size: 10px; font-weight: 600;
  letter-spacing: 0.1em; text-transform: uppercase;
  color: var(--ink);
  border: 1px solid var(--line);
}
.tl-role { font-family: var(--font-sans); font-weight: 700; font-size: 22px; color: var(--ink); }
.tl-org { font-family: var(--font-sans); font-size: 12px; color: var(--ink-2); margin-top: 6px; }
.tl-period { font-family: var(--font-sans); font-size: 11px; color: var(--ink-3); }
.tl-desc { font-family: var(--font-sans); font-size: 13px; color: var(--ink-2); margin-top: 14px; line-height: 1.7; }
```

(The `.tl-badge .dot`, `.tl-onair .tl-badge`, `.tl-onair .tl-badge .dot`, `.tl-complete .tl-badge`, `.tl-complete .tl-badge .dot` rules are all deleted — no longer rendered.)

- [ ] **Step 3: Reduced-motion Block A — SURGICAL delete of one dead line**

In the Hero-region `@media (prefers-reduced-motion: reduce)` block (**Block A**, ~line 422), delete this one line (and only this one):

```css
  .tl-onair .tl-badge { animation: none; }
```

- [ ] **Step 4: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors.

Manually at `npm run dev`: timeline rows separated by 1px hairlines, generous vertical padding, badge is a plain bordered gray pill with text "Present"/"Complete" (no colored dot, no pulse), all role/org/period/desc text in Geist grayscale.

```bash
git add components/ExperienceSection.tsx app/globals.css
git commit -m "refactor(experience): remove on-air/complete color-coded timeline badge"
```

---

### Task 8: Work/Gallery — drop GSAP entrance for CSS reveal, strip gallery state-color styling

**Files:**
- Modify: `components/WorkSection.tsx` (drop GSAP/ScrollTrigger import + the `galleryRef`/`useEffect` ScrollTrigger block; add `data-reveal`/`data-delay` to `.ev` articles; simplify the `ev-${state}` class; strip tally span from `.ev-state-badge`)
- Modify: `app/globals.css` (GALLERY CSS block)

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--ink-3`, `--line`, `--bg`, `--bg-2`, `--font-sans`, `--ease`, the canonical `[data-reveal]`/`.in` mechanism (this task switches Work's entrance from GSAP to that mechanism), the `work` data from `lib/content.ts` (the per-item `state` field — 'onair'/'standby'/'complete' — is still read for filtering but no longer drives a color-coded class).
- Produces: None — leaf task. After this task `WorkSection.tsx` no longer imports `gsap`/`ScrollTrigger` or `useEffect`/`useRef`. Makes the **surgical** reduced-motion Block A edit (delete the `.ev-onair .ev-state-badge` line).

- [ ] **Step 1: Drop GSAP, switch entrance to data-reveal, strip state classes/badge tally**

Before (representative — imports + ref/effect + the article className + badge):
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
// ...
export default function WorkSection() {
  const galleryRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!galleryRef.current) return
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      gsap.from('.ev', {
        y: 40, opacity: 0, duration: 0.6, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: galleryRef.current, start: 'top 80%' },
      })
    })
  }, [])
  // ...
  return (
    <section ...>
      <div className="gallery" ref={galleryRef}>
        {filtered.map((item, i) => (
          <article key={item.id} className={`ev ev-${item.state} ev-${item.platform}`}>
            {/* ... */}
            <div className="ev-state-badge">
              <span className="tally" />
              {item.stateLabel}
            </div>
            {/* ... */}
          </article>
        ))}
      </div>
    </section>
  )
}
```

After (the gallery map):
```tsx
import { useState } from 'react'
// ... (no gsap, no useEffect/useRef)
export default function WorkSection() {
  const [filter, setFilter] = useState('all')
  // ...
  return (
    <section ...>
      <div className="gallery">
        {filtered.map((item, i) => (
          <article
            key={item.id}
            className={`ev ev-${item.platform}`}
            data-reveal=""
            data-delay={i % 4 || undefined}
          >
            {/* ... */}
            <div className="ev-state-badge">{item.stateLabel}</div>
            {/* ... */}
          </article>
        ))}
      </div>
    </section>
  )
}
```

(Keep `'use client'` if the filter buttons need it — yes, `useState` for the filter stays. Drop the `useEffect`/`useRef`/`gsap` import. The `ev-${state}` class is dropped (only `ev-${platform}` remains); `data-reveal` + `data-delay` drive the entrance via the existing IntersectionObserver mechanism. The `<span className="tally" />` inside `.ev-state-badge` is removed.)

- [ ] **Step 2: Rewrite the GALLERY CSS block**

Before (representative rules):
```css
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filter {
  font-family: var(--font-mono); font-size: 11px; font-weight: 700;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 8px 14px; background: var(--surface); border: 2px solid var(--line);
  color: var(--ink-2); cursor: pointer; transition: all .25s;
}
.filter:hover { border-color: var(--ink); }
.filter.active { background: var(--amber); color: var(--accent-ink); border-color: var(--amber); }
.ev {
  background: var(--surface); border: 2px solid var(--line);
  transition: transform .35s var(--ease), border-color .35s;
}
.ev:hover { transform: translateY(-6px); border-color: var(--ink); }
.tally { width: 8px; height: 8px; border-radius: 50%; background: var(--live); display: inline-block; animation: tally-pulse 1.4s ease-in-out infinite; }
.ev-onair .ev-state-badge { color: var(--live); border-color: var(--live); }
.ev-onair .ev-state-badge .tally { background: var(--live); }
.ev-standby .ev-state-badge { color: var(--amber); border-color: var(--amber); }
.ev-standby .ev-state-badge .tally { background: var(--amber); }
.ev-complete .ev-state-badge { color: var(--ink-3); border-color: var(--ink-3); }
.ev-state-badge {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 4px 10px; border: 1px solid var(--line);
  font-family: var(--font-mono); font-size: 10px; font-weight: 700;
  letter-spacing: 0.08em; text-transform: uppercase;
}
```

After:
```css
.filters { display: flex; gap: 8px; flex-wrap: wrap; }
.filter {
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
  letter-spacing: 0.06em; text-transform: uppercase;
  padding: 8px 14px; background: var(--bg-2); border: 1px solid var(--line);
  color: var(--ink-2); cursor: pointer; transition: color .25s, border-color .25s, background .25s;
}
.filter:hover { border-color: var(--ink); color: var(--ink); }
.filter.active { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.ev {
  background: var(--bg-2); border: 1px solid var(--line);
  transition: transform .35s var(--ease), border-color .35s;
}
.ev:hover { transform: translateY(-6px); border-color: var(--ink); }
.ev-state-badge {
  display: inline-flex; align-items: center;
  padding: 4px 10px; border: 1px solid var(--line);
  font-family: var(--font-sans); font-size: 10px; font-weight: 600;
  letter-spacing: 0.08em; text-transform: uppercase; color: var(--ink-2);
}
```

(The `.tally`, `.ev-onair .ev-state-badge`, `.ev-onair .ev-state-badge .tally`, `.ev-standby .ev-state-badge`, `.ev-standby .ev-state-badge .tally`, `.ev-complete .ev-state-badge` rules are all deleted.)

- [ ] **Step 3: Reduced-motion Block A — SURGICAL delete of one dead line**

In the Hero-region `@media (prefers-reduced-motion: reduce)` block (**Block A**, ~line 422), delete this one line (and only this one — the class no longer exists):

```css
  .ev-onair .ev-state-badge { animation: none; }
```

- [ ] **Step 4: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors, no unused `gsap` import.

Manually at `npm run dev`: filter buttons are hairline-bordered gray pills, active filter is a solid ink pill; gallery cards on `--bg-2` with 1px hairline borders lifting to ink on hover; state badges are plain gray text pills; entrance is the same IntersectionObserver stagger used elsewhere (no GSAP).

```bash
git add components/WorkSection.tsx app/globals.css
git commit -m "refactor(work): drop GSAP entrance for CSS reveal, strip gallery state-color styling"
```

### Task 9: Freelance + Testimonial — drop GSAP marquee for CSS crossfade, migrate to minimal tokens

**Files:**
- Modify: `components/FreelanceSection.tsx` (drop inline `style={{ color: 'var(--accent)' }}` on stat `.plus`)
- Modify: `components/TestimonialCarousel.tsx` (full rewrite — drop GSAP marquee, use `useState` + `setInterval` crossfade with `data-active` on `.test-card`)
- Modify: `app/globals.css` (FREELANCE/UPWORK block + TESTIMONIAL block)

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--ink-3`, `--line`, `--bg`, `--bg-2`, `--font-sans`, existing `[data-reveal]`/`.in`, `freelance` and `testimonials` data from `lib/content.ts`.
- Produces: None — leaf task. `TestimonialCarousel` becomes a client component using `useState(0)` + `setInterval(..., 5000)`, rendering all cards in a stacked grid with `data-active` on the visible one. Makes the **surgical** reduced-motion Block A edit (ADD `.test-card { transition: none; }`).

- [ ] **Step 1: Drop the accent color style on FreelanceSection stat**

Before:
```tsx
          <div className="stat">
            <span className="n"><CountUp ... /></span>
            <span className="plus" style={{ color: 'var(--accent)' }}>+</span>
            <span className="l">{stat.label}</span>
          </div>
```

After:
```tsx
          <div className="stat">
            <span className="n"><CountUp ... /></span>
            <span className="plus">+</span>
            <span className="l">{stat.label}</span>
          </div>
```

(Inline `style` removed — the `.plus` color is set in CSS via the FREELANCE block rewrite below.)

- [ ] **Step 2: Rewrite TestimonialCarousel.tsx as a CSS-crossfade carousel**

Before (GSAP marquee — structure):
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { testimonials } from '@/lib/content'

export default function TestimonialCarousel() {
  const trackRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!trackRef.current) return
    const totalWidth = trackRef.current.scrollWidth / 2
    gsap.to(trackRef.current, { x: -totalWidth, duration: 30, ease: 'none', repeat: -1 })
  }, [])
  return (
    <div className="test-track" ref={trackRef}>
      {testimonials.map((t) => (
        <figure className="test-card" key={t.author}>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <span className="test-author">{t.author}</span>
            <span className="test-role">{t.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
```

After (full file):
```tsx
'use client'
import { useEffect, useState } from 'react'
import { testimonials } from '@/lib/content'

export default function TestimonialCarousel() {
  const [active, setActive] = useState(0)

  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      setActive((i) => (i + 1) % testimonials.length)
    }, 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <div className="test-stage">
      {testimonials.map((t, i) => (
        <figure className="test-card" key={t.author} data-active={i === active || undefined}>
          <blockquote>{t.quote}</blockquote>
          <figcaption>
            <span className="test-author">{t.author}</span>
            <span className="test-role">{t.role}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  )
}
```

(All cards render in a stacked grid; only the `data-active` one is visible via opacity crossfade. Reduced-motion: skip the interval, all cards present but only the first shows — acceptable since transitions are also killed in CSS.)

- [ ] **Step 3: Rewrite FREELANCE/UPWORK CSS**

Before (representative):
```css
/* ── Freelance / Upwork ── */
.freelance-card { background: var(--surface); border: 2px solid var(--line); padding: 32px; }
.stat .n { font-family: var(--font-display); font-weight: 900; font-size: 44px; color: var(--ink); }
.stat .plus { font-family: var(--font-display); font-weight: 900; font-size: 44px; color: var(--amber); }
.stat .l { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; }
.upwork-cta { font-family: var(--font-mono); color: var(--live); border-bottom: 1px solid var(--live); }
```

After:
```css
/* ── Freelance / Upwork ── */
.freelance-card { background: var(--bg-2); border: 1px solid var(--line); padding: clamp(32px, 4vw, 48px); }
.stat .n { font-family: var(--font-sans); font-weight: 700; font-size: 44px; color: var(--ink); }
.stat .plus { font-family: var(--font-sans); font-weight: 700; font-size: 44px; color: var(--ink-2); }
.stat .l { font-family: var(--font-sans); font-size: 11px; color: var(--ink-3); letter-spacing: 0.08em; text-transform: uppercase; }
.upwork-cta { font-family: var(--font-sans); color: var(--ink); border-bottom: 1px solid var(--line); transition: border-color .25s; }
.upwork-cta:hover { border-color: var(--ink); }
```

- [ ] **Step 4: Replace TESTIMONIAL CSS (marquee track → crossfade grid)**

Before:
```css
/* ── Testimonials ── */
.test-track { display: flex; gap: 24px; width: max-content; }
.test-card {
  flex: 0 0 420px; background: var(--surface); border: 2px solid var(--line);
  padding: 28px;
}
.test-card blockquote { font-family: var(--font-mono); font-size: 14px; color: var(--ink); line-height: 1.7; }
.test-author { display: block; font-family: var(--font-display); font-weight: 700; color: var(--ink); margin-top: 16px; }
.test-role { display: block; font-family: var(--font-mono); font-size: 11px; color: var(--amber); margin-top: 4px; }
```

After:
```css
/* ── Testimonials (crossfade) ── */
.test-stage { display: grid; }
.test-card {
  grid-area: 1 / 1;
  background: var(--bg-2); border: 1px solid var(--line);
  padding: clamp(28px, 3.5vw, 40px);
  opacity: 0; pointer-events: none;
  transition: opacity .6s var(--ease);
}
.test-card[data-active] { opacity: 1; pointer-events: auto; }
.test-card blockquote { font-family: var(--font-sans); font-size: 14px; color: var(--ink); line-height: 1.7; }
.test-author { display: block; font-family: var(--font-sans); font-weight: 700; color: var(--ink); margin-top: 18px; }
.test-role { display: block; font-family: var(--font-sans); font-size: 11px; color: var(--ink-2); margin-top: 4px; }
```

- [ ] **Step 5: Reduced-motion Block A — ADD one line**

In the Hero-region `@media (prefers-reduced-motion: reduce)` block (**Block A**, ~line 422), append this one rule (after the existing lines — this is an addition, not a delete):

```css
  .test-card { transition: none; }
```

- [ ] **Step 6: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors, no unused `gsap` import in TestimonialCarousel.

Manually at `npm run dev`: freelance card is `--bg-2` with hairline border and generous padding, the `+` is muted gray, Upwork CTA is ink with hairline underline; testimonial crossfades every 5s (or static under reduced-motion), card is `--bg-2` with hairline border, role label is `--ink-2` not amber.

```bash
git add components/FreelanceSection.tsx components/TestimonialCarousel.tsx app/globals.css
git commit -m "refactor(freelance): drop GSAP marquee for CSS crossfade, migrate to minimal token set"
```

---

### Task 10: Ledger + ProofStrip + Footer — flatten to grayscale tokens

**Files:**
- Modify: `components/Footer.tsx` (remove `<span className="tally" />`)
- Modify: `app/globals.css` (PROOF STRIP + LEDGER + FOOTER blocks)

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--ink-3`, `--line`, `--bg`, `--bg-2`, `--font-sans`.
- Produces: None — leaf task.

- [ ] **Step 1: Retokenize PROOF STRIP CSS**

Before (representative):
```css
/* ── Proof Strip ── */
.proof-names li { font-family: var(--font-mono); font-size: 12px; color: var(--ink-2); padding: 10px 0; border-bottom: 1px solid var(--line-2); }
.proof-names li::before { content: "●"; color: var(--accent); margin-right: 10px; }
.proof-logo { background: var(--surface); border: 1px solid var(--line-2); padding: 16px; }
```

After:
```css
/* ── Proof Strip ── */
.proof-names li { font-family: var(--font-sans); font-size: 13px; color: var(--ink-2); padding: 14px 0; border-bottom: 1px solid var(--line); }
.proof-names li::before { content: "·"; color: var(--ink-3); margin-right: 10px; }
.proof-logo { background: var(--bg-2); border: 1px solid var(--line); padding: 18px; }
```

- [ ] **Step 2: Retokenize LEDGER CSS**

Before (representative):
```css
/* ── Ledger ── */
.ledger .row { display: grid; grid-template-columns: 1fr auto; gap: 16px; padding: 18px 0; border-bottom: 1px solid var(--line-2); transition: background .25s; }
.ledger .row:hover { background: var(--surface); }
.ledger .meta { font-family: var(--font-mono); font-size: 11px; color: var(--amber); }
.ledger .row b { font-family: var(--font-display); font-weight: 700; color: var(--ink); }
```

After:
```css
/* ── Ledger ── */
.ledger .row { display: grid; grid-template-columns: 1fr auto; gap: 16px; padding: 22px 0; border-bottom: 1px solid var(--line); transition: background .25s; }
.ledger .row:hover { background: var(--bg-2); }
.ledger .meta { font-family: var(--font-sans); font-size: 11px; color: var(--ink-2); }
.ledger .row b { font-family: var(--font-sans); font-weight: 700; color: var(--ink); }
```

- [ ] **Step 3: Retokenize FOOTER CSS**

Before:
```css
/* ── Footer ── */
.foot { border-top: 3px solid var(--ink); padding: 48px var(--gut); }
.foot-sig { font-family: var(--font-display); font-weight: 900; font-size: clamp(36px, 5vw, 56px); color: var(--live); }
.foot-sig .tally { width: 12px; height: 12px; border-radius: 50%; background: var(--live); display: inline-block; animation: tally-pulse 1.4s ease-in-out infinite; margin-right: 12px; vertical-align: middle; }
.foot-meta { font-family: var(--font-mono); font-size: 11px; color: var(--ink-3); }
```

After:
```css
/* ── Footer ── */
.foot { border-top: 1px solid var(--line); padding: 48px var(--gut); }
.foot-sig { font-family: var(--font-sans); font-weight: 700; font-size: clamp(36px, 5vw, 56px); color: var(--ink); }
.foot-meta { font-family: var(--font-sans); font-size: 11px; color: var(--ink-3); }
```

(The `.foot-sig .tally` rule is deleted entirely — no longer rendered after Step 4.)

- [ ] **Step 4: Remove tally span from Footer.tsx**

Before:
```tsx
      <div className="foot-sig">
        <span className="tally" />
        {siteData.brand.label}
      </div>
```

After:
```tsx
      <div className="foot-sig">
        {siteData.brand.label}
      </div>
```

- [ ] **Step 5: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors.

Manually at `npm run dev`: proof-strip names are gray with a muted middle-dot bullet, logos on `--bg-2`; ledger rows are airier with hairline dividers, hover lifts to `--bg-2`, meta is gray; footer top border is 1px hairline, signature is ink Geist with no tally dot.

```bash
git add components/Footer.tsx app/globals.css
git commit -m "style: flatten footer border, drop tally pulse, degrade ledger/proof to grayscale tokens"
```

---

### Task 11: Contact + Lightbox — strip broadcast tally/amber, 1px grayscale borders

**Files:**
- Modify: `components/Lightbox.tsx` (delete the `.lb-tally` REC pill)
- Modify: `app/globals.css` (LIGHTBOX block + CONTACT block)

**Interfaces:**
- Consumes: `--ink`, `--ink-2`, `--ink-3`, `--line`, `--bg`, `--bg-2`, `--font-sans`, `--ease`.
- Produces: None — leaf task. **`.cform-btn` is reconciled to match Task 2's `.btn-primary` treatment** (per plan self-review): `background: var(--ink); color: var(--bg); border: 1px solid var(--ink); font-weight: 600; :hover { background: var(--ink-2); border-color: var(--ink-2); }` — consistent with the nav "Hire me" button.

- [ ] **Step 1: Delete the REC tally pill from Lightbox.tsx**

Before:
```tsx
      <div className="lb-frame">
        <span className="lb-tally"><span className="dot" />REC</span>
        {/* ...image... */}
```

After:
```tsx
      <div className="lb-frame">
        {/* ...image... */}
```

- [ ] **Step 2: Retokenize LIGHTBOX CSS**

Before (representative):
```css
/* ── Lightbox ── */
.lb-frame { border: 2px solid var(--ink); background: var(--surface); position: relative; }
.lb-tally { position: absolute; top: 12px; left: 12px; display: inline-flex; align-items: center; gap: 6px; padding: 4px 10px; background: var(--bg); font-family: var(--font-mono); font-size: 10px; color: var(--live); z-index: 4; }
.lb-tally .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--live); animation: tally-pulse 1.4s ease-in-out infinite; }
.lb-close { background: var(--bg); border: 2px solid var(--live); color: var(--live); font-family: var(--font-mono); }
.lb-close:hover { background: var(--live); color: #fff; }
.lb-nav { border: 2px solid var(--ink); color: var(--ink); font-family: var(--font-mono); }
.lb-nav:hover { background: var(--ink); color: var(--bg); }
.lb-thumbs img.active { border: 2px solid var(--amber); }
```

After:
```css
/* ── Lightbox ── */
.lb-frame { border: 1px solid var(--line); background: var(--bg-2); position: relative; }
.lb-close { background: var(--bg); border: 1px solid var(--line); color: var(--ink); font-family: var(--font-sans); transition: background .25s, color .25s, border-color .25s; }
.lb-close:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.lb-nav { border: 1px solid var(--line); color: var(--ink); font-family: var(--font-sans); background: var(--bg); transition: background .25s, color .25s, border-color .25s; }
.lb-nav:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.lb-thumbs img { border: 1px solid var(--line); transition: border-color .25s; }
.lb-thumbs img.active { border-color: var(--ink); }
```

(The `.lb-tally` and `.lb-tally .dot` rules are deleted — no longer rendered.)

- [ ] **Step 3: Retokenize CONTACT CSS, reconcile `.cform-btn` to `.btn-primary`**

Before (representative):
```css
/* ── Contact ── */
.contact-card { background: var(--surface); border: 2px solid var(--ink); box-shadow: 0 0 0 1px var(--line-2); padding: 32px; }
.contact-card .on-air { color: var(--live); }
.clink { display: flex; justify-content: space-between; padding: 16px 0; border-bottom: 1px solid var(--line-2); font-family: var(--font-mono); color: var(--ink); }
.clink:hover { color: var(--amber); }
.cfield { background: var(--bg); border: 2px solid var(--line); font-family: var(--font-mono); }
.cfield:focus { border-color: var(--amber); }
.cform-btn { background: var(--live); color: #fff; border: 2px solid var(--live); font-family: var(--font-mono); font-weight: 700; }
.cform-btn:hover { background: var(--amber); }
```

After:
```css
/* ── Contact ── */
.contact-card { background: var(--bg-2); border: 1px solid var(--line); box-shadow: none; padding: clamp(40px, 7vw, 88px); }
.clink { display: flex; justify-content: space-between; padding: 18px 0; border-bottom: 1px solid var(--line); font-family: var(--font-sans); color: var(--ink); transition: border-color .25s, transform .25s var(--ease); }
.clink:hover { border-color: var(--ink); transform: translateX(6px); }
.cfield { background: var(--bg); border: 1px solid var(--ink-2); font-family: var(--font-sans); transition: border-color .25s; }
.cfield:focus { border-color: var(--ink); outline: none; }
.cform-btn { background: var(--ink); color: var(--bg); border: 1px solid var(--ink); font-family: var(--font-sans); font-weight: 600; transition: background .25s, border-color .25s, transform .25s var(--ease); }
.cform-btn:hover { background: var(--ink-2); border-color: var(--ink-2); transform: translateY(-2px); }
```

(The orphan `.contact-card .on-air` rule is deleted — no element renders `.on-air` inside `.contact-card`. `.cform-btn` now matches Task 2's `.btn-primary`: ink fill, bg text, 1px ink border, weight 600, hover degrades to `--ink-2`. Consistent primary-button treatment site-wide.)

- [ ] **Step 4: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors.

Manually at `npm run dev`: lightbox frame is `--bg-2` with hairline border, no REC pill, close/nav buttons are hairline gray filling to ink on hover, active thumb has ink border; contact card is `--bg-2` with generous padding and hairline border (no box-shadow), contact links slide right + ink underline on hover, fields have `--ink-2` borders focusing to `--ink`, submit button matches the nav "Hire me" button exactly.

```bash
git add components/Lightbox.tsx app/globals.css
git commit -m "style(contact,lightbox): strip broadcast tally/amber, move to 1px grayscale borders + airier spacing"
```

---

### Task 12: MarqueeTicker — replace GSAP xPercent tween with CSS keyframe animation

**Files:**
- Modify: `components/MarqueeTicker.tsx` (drop `'use client'` + GSAP, become server component with two duplicated tracks)
- Modify: `app/globals.css` (add `@keyframes marquee-scroll` + `.marquee-track` animation, retokenize font)
- Modify: `app/globals.css` reduced-motion **Block A** (append `, .marquee-track` to the kill-list)

**Interfaces:**
- Consumes: `--ink-2`, `--font-sans`, existing `[data-reveal]`/`.in` (ticker sits inside the Hero, which already reveals).
- Produces: `.marquee-track` CSS animation (28s linear infinite, matches the original GSAP tween timing). After this task `MarqueeTicker.tsx` is a server component (no `'use client'`, no `useEffect`, no `gsap`). Makes the **surgical** reduced-motion Block A edit.

- [ ] **Step 1: Rewrite MarqueeTicker.tsx as a server component**

Before (GSAP-driven marquee):
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

export default function MarqueeTicker({ text }: { text: string }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    gsap.to(ref.current, { xPercent: -50, duration: 28, ease: 'none', repeat: -1 })
  }, [])
  return (
    <div className="ticker-text" ref={ref}>
      <span className="marquee-content">{text}</span>
    </div>
  )
}
```

After (full file):
```tsx
export default function MarqueeTicker({ text }: { text: string }) {
  return (
    <div className="marquee-track">
      <span className="marquee-content">{text}</span>
      <span className="marquee-content" aria-hidden>{text}</span>
    </div>
  )
}
```

(Two duplicated `.marquee-content` spans inside `.marquee-track` — the CSS animates `translateX(0)` → `translateX(-50%)` for a seamless loop. The outer `.ticker-text` wrapper styling is folded into `.marquee-track` below.)

- [ ] **Step 2: Add the marquee keyframe + animation CSS, retokenize font**

Add (in the Hero/ticker region, replacing the old `.ticker-text` rule):
```css
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.marquee-track {
  display: inline-flex;
  animation: marquee-scroll 28s linear infinite;
  font-family: var(--font-sans);
  font-size: 10px;
  color: var(--ink-2);
  letter-spacing: 0.06em;
  white-space: nowrap;
  will-change: transform;
}
.marquee-content { display: inline-block; padding-right: 32px; }
```

(If a `.ticker-text` rule exists from the original, replace it with `.marquee-track`. If `.ticker-onair` lived next to it, Task 3 already retokenized it — leave that.)

- [ ] **Step 3: Reduced-motion Block A — append `, .marquee-track` to the kill-list**

In the Hero-region `@media (prefers-reduced-motion: reduce)` block (**Block A**, ~line 422), find the comma-separated hero-classes line that nulls animations (it lists classes like `.vmix-name-line, .metric, .bus-bar, ...`). Append `, .marquee-track` to that list so the marquee stops under reduced-motion. If no such combined line exists, add a standalone line:

```css
  .marquee-track { animation: none; }
```

- [ ] **Step 4: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors, no `'use client'` or `gsap` import left in MarqueeTicker.

Manually at `npm run dev`: hero ticker scrolls continuously at the same pace as before (28s loop), gray Geist text, no jank; under reduced-motion (toggle in devtools) the marquee parks.

```bash
git add components/MarqueeTicker.tsx app/globals.css
git commit -m "refactor(marquee): replace GSAP xPercent tween with CSS keyframe animation"
```

---

### Task 13: HeroMetrics + CountUp — replace GSAP scrub/count-up with data-reveal + IntersectionObserver

**Files:**
- Modify: `components/HeroMetrics.tsx` (drop GSAP scrub, add `data-reveal=""` on the `.vmix-metrics` wrapper)
- Modify: `components/CountUp.tsx` (drop GSAP tween, use local IntersectionObserver + requestAnimationFrame)

**Interfaces:**
- Consumes: existing `[data-reveal]`/`.in` mechanism, `requestAnimationFrame`, `IntersectionObserver`, the `metrics` data + `target` number prop.
- Produces: `CountUp` animates once on viewport entry (threshold 0.1), 1600ms ease-out-cubic via rAF; under reduced-motion it parks at the final `target` value immediately. Non-numeric `target` strings render as-is. After this task `HeroMetrics.tsx` and `CountUp.tsx` no longer import `gsap`.

- [ ] **Step 1: Drop GSAP scrub from HeroMetrics.tsx, add data-reveal**

Before (structure):
```tsx
'use client'
import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'
import CountUp from './CountUp'
import { siteData } from '@/lib/content'

export default function HeroMetrics() {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (!ref.current) return
    import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
      gsap.registerPlugin(ScrollTrigger)
      gsap.from('.metric', { y: 30, opacity: 0, stagger: 0.12, scrollTrigger: { trigger: ref.current, start: 'top 80%' } })
    })
  }, [])
  return (
    <div className="vmix-metrics" ref={ref}>
      {/* ...metrics... */}
    </div>
  )
}
```

After:
```tsx
import CountUp from './CountUp'
import { siteData } from '@/lib/content'

export default function HeroMetrics() {
  return (
    <div className="vmix-metrics" data-reveal="">
      {/* ...metrics — keep existing JSX verbatim... */}
    </div>
  )
}
```

(Now a server component. The per-`.metric` entrance already has CSS `@keyframes enter-up` from Task 3's Hero CSS rewrite — the section-level `data-reveal` ensures the block itself reveals too. No `useEffect`/`useRef`/`gsap`.)

- [ ] **Step 2: Rewrite CountUp.tsx — IntersectionObserver + rAF, no GSAP**

Before (GSAP count-up):
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

export default function CountUp({ target, suffix, duration = 1600 }: { target: number; suffix?: string; duration?: number }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    if (!ref.current) return
    const tween = gsap.to({ n: 0 }, {
      n: target, duration: duration / 1000, ease: 'power2.out',
      onUpdate: function () { setVal(Math.round(this.targets()[0].n)) },
      scrollTrigger: { trigger: ref.current, start: 'top 85%', once: true },
    })
    return () => { tween.kill() }
  }, [target, duration])
  return <span ref={ref}>{val}{suffix}</span>
}
```

After (full file):
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'

export default function CountUp({ target, suffix, duration = 1600 }: { target: number | string; suffix?: string; duration?: number }) {
  const [val, setVal] = useState<number | string>(target)
  const ref = useRef<HTMLSpanElement>(null)
  const reduced = typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  useEffect(() => {
    const node = ref.current
    if (node == null) return
    if (typeof target !== 'number') { setVal(target); return }
    if (reduced) { setVal(target); return }

    let raf = 0
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        io.disconnect()
        const start = performance.now()
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3) // ease-out-cubic
          setVal(Math.round(eased * target))
          if (t < 1) raf = requestAnimationFrame(tick)
        }
        raf = requestAnimationFrame(tick)
      })
    }, { threshold: 0.1 })
    io.observe(node)
    return () => { io.disconnect(); cancelAnimationFrame(raf) }
  }, [target, duration, reduced])

  return <span ref={ref}>{val}{suffix ? <span>{suffix}</span> : null}</span>
}
```

(Starts at `target` so SSR/no-JS shows the final number; animates from 0 → target once on viewport entry. Non-numeric `target` (e.g. `"5+"`) renders as-is. `suffix` rendered in a nested span so it doesn't animate. Reduced-motion parks at `target`.)

- [ ] **Step 3: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors, no `gsap` import in HeroMetrics or CountUp.

Manually at `npm run dev`: hero metrics numbers count up once when scrolled into view (or instantly under reduced-motion), block reveals with the section. No GSAP errors in console.

```bash
git add components/HeroMetrics.tsx components/CountUp.tsx
git commit -m "refactor(hero): replace GSAP ScrollTrigger scrub/count-up with data-reveal + IntersectionObserver"
```

---

### Task 14: NameIntro — drop gsap glitch/flash, css-only reveal

**Files:**
- Modify: `components/NameIntro.tsx` (drop `useRef` + `gsap` import; remove glitch-shake + white-flash timers; keep scramble/reveal character cycling in plain JS state; JSX rewritten to classes)
- Modify: `app/globals.css` (add new `NAME INTRO` CSS section before HERO; own reduced-motion block)

**Interfaces:**
- Consumes: `--bg`, `--ink`, `--ink-2`, `--ink-3`, `--font-sans`, existing `enter-up`/`enter-fade` keyframes (Task 1 kept them), `setTimeout`/`useState`/`useEffect` from React.
- Produces: `.name-intro`, `.name-intro-scanline`, `.name-intro-name`, `.name-intro-name.is-locked`, `.name-intro-tc` CSS classes. After this task `NameIntro.tsx` no longer imports `gsap`.

- [ ] **Step 1: Rewrite NameIntro.tsx — css-only reveal, keep scramble logic**

Before (structure — GSAP glitch + white flash + scramble):
```tsx
'use client'
import { useEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'
import { siteData } from '@/lib/content'

export default function NameIntro({ onDone }: { onDone: () => void }) {
  const ref = useRef<HTMLDivElement>(null)
  const [display, setDisplay] = useState('')
  useEffect(() => {
    // ... scramble characters over time, setDisplay(...) ...
    // glitch shake via gsap on ref
    gsap.fromTo(ref.current, { x: -8 }, { x: 0, duration: 0.08, repeat: 20, ease: 'steps(1)' })
    // white flash via gsap
    gsap.fromTo('.name-flash', { opacity: 1 }, { opacity: 0, duration: 0.4, delay: 0.6 })
    setTimeout(onDone, 1400)
  }, [onDone])
  return (
    <div className="name-intro" ref={ref} style={{ ... }}>
      <div className="name-flash" style={{ background: '#fff' }} />
      <span className="tally-dot" />
      <div className="name-status">GLITCH / SIGNAL LOCKED</div>
      <h1 className="name-intro-name">{display}</h1>
    </div>
  )
}
```

After (full file):
```tsx
'use client'
import { useEffect, useState } from 'react'
import { siteData } from '@/lib/content'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@%'

export default function NameIntro({ onDone }: { onDone: () => void }) {
  const final = siteData.hero.nameLines.join(' ')
  const [display, setDisplay] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    let frame = 0
    const totalFrames = 24
    const id = setInterval(() => {
      frame++
      const revealCount = Math.floor((frame / totalFrames) * final.length)
      const scrambled = Array.from({ length: final.length }, (_, i) => {
        if (i < revealCount || final[i] === ' ') return final[i]
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join('')
      setDisplay(scrambled)
      if (frame >= totalFrames) {
        clearInterval(id)
        setDisplay(final)
        setDone(true)
        setTimeout(onDone, 300)
      }
    }, 45)
    return () => clearInterval(id)
  }, [final, onDone])

  return (
    <div className={`name-intro${done ? ' is-done' : ''}`}>
      <div className="name-intro-scanline" />
      <h1 className={`name-intro-name${done ? ' is-locked' : ''}`}>{display}</h1>
      <div className="name-intro-tc">SIGNAL · LOCKED</div>
    </div>
  )
}
```

(Scramble/reveal kept as plain JS state on a 45ms interval; the final lock uses a CSS class `.is-locked` for the fade-in via `enter-up`; `onDone` fires 300ms after lock to let the CSS transition play. The glitch-shake, white-flash div, tally-dot, and "GLITCH/SIGNAL LOCKED" pill are all deleted. CHARS is the scramble alphabet.)

- [ ] **Step 2: Add the NAME INTRO CSS section (before the HERO block, ~`globals.css:172`)**

Add:
```css
/* ---------- NAME INTRO ---------- */
.name-intro {
  position: fixed; inset: 0; z-index: 100;
  background: var(--bg);
  display: flex; flex-direction: column; align-items: center; justify-content: center;
  gap: 24px;
  opacity: 1; transition: opacity .4s var(--ease);
}
.name-intro.is-done { opacity: 0; }
.name-intro-scanline {
  position: absolute; left: 0; right: 0; height: 2px;
  background: linear-gradient(to bottom, transparent, color-mix(in srgb, var(--ink) 18%, transparent), transparent);
  animation: enter-fade 1.6s linear infinite;
  top: 50%;
}
.name-intro-name {
  font-family: var(--font-sans); font-weight: 700;
  font-size: clamp(40px, 8vw, 90px);
  color: var(--ink); letter-spacing: -0.01em; text-align: center;
  margin: 0; opacity: 0;
}
.name-intro-name.is-locked { animation: enter-up 0.5s var(--ease) both; }
.name-intro-tc {
  font-family: var(--font-sans); font-size: 11px; font-weight: 600;
  letter-spacing: 0.2em; text-transform: uppercase; color: var(--ink-3);
}

@media (prefers-reduced-motion: reduce) {
  .name-intro { transition: opacity 0.01s; }
  .name-intro-scanline { display: none; }
  .name-intro-name { opacity: 1; }
  .name-intro-name.is-locked { animation: none; }
}
```

- [ ] **Step 3: Delete the old `.name-flash`, `.tally-dot` (name-intro variant), and `.name-status` CSS rules if present**

Find and delete any orphaned rules whose selectors reference `.name-flash`, `.name-intro .tally-dot`, or `.name-status` (they belonged to the old GSAP/glitch markup and no longer match).

- [ ] **Step 4: Verify and commit**

Run: `npm run build`
Expected: passes, no type/lint errors, no `gsap` import in NameIntro.

Manually at `npm run dev` (hard reload to re-trigger the intro): name scrambles then locks, fades out cleanly via CSS opacity, no shake/white-flash, the "SIGNAL · LOCKED" label is muted gray; under reduced-motion the intro is near-instant with no scanline.

```bash
git add components/NameIntro.tsx app/globals.css
git commit -m "refactor(name-intro): drop gsap glitch/flash, css-only reveal"
```

- [ ] **Step 5: Verify NameIntro still calls `onDone`**

Re-confirm in the browser that after the intro fades, the main page becomes interactive (the parent `PortfolioChrome` / `page.tsx` unmounts `NameIntro` on `onDone`). If the parent was gating scroll or visibility on `onDone`, that contract is unchanged — only the internal animation changed.

---

### Task 15: SmoothScrollProvider + cleanup + final verify

**Files:**
- Modify: `components/SmoothScrollProvider.tsx` (drop `gsap`/`ScrollTrigger`, use `new Lenis({ autoRaf: true })`)
- Modify: `package.json` + `package-lock.json` (drop `gsap` — **grep-gated**)
- Modify: `app/globals.css` (delete the duplicate `.work-pinned-layout`/`.work-pin-left` block in the Hero responsive region if present; canonical block at ~`globals.css:895-917` stays)

**Interfaces:**
- Consumes: `lenis` (already a dependency — `^1.3.23`), `(prefers-reduced-motion: reduce)` media query.
- Produces: a single Lenis instance with `autoRaf: true` (Lenis drives its own RAF loop — no GSAP ticker needed). **This is the gate task** — if the grep in Step 2 returns zero `gsap` references, the `gsap` package is removed from `package.json` and the redesign is complete.

- [ ] **Step 1: Rewrite SmoothScrollProvider.tsx**

Before (GSAP ticker driving Lenis):
```tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis()
    lenis.on('scroll', ScrollTrigger.update)
    gsap.ticker.add((time) => { lenis.raf(time * 1000) })
    gsap.ticker.lagSmoothing(0)
    return () => { lenis.destroy() }
  }, [])
  return <>{children}</>
}
```

After (full file):
```tsx
'use client'
import { useEffect } from 'react'
import Lenis from 'lenis'

export default function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({ lerp: 0.1, wheelMultiplier: 1, smoothWheel: true, autoRaf: true })
    return () => { lenis.destroy() }
  }, [])
  return <>{children}</>
}
```

(`autoRaf: true` makes Lenis run its own RAF loop internally — no GSAP ticker required. Reduced-motion: early return, native scroll. Cleanup: `lenis.destroy()`.)

- [ ] **Step 2: Grep-gate — confirm no remaining `gsap` references before removing the dependency**

Run (from repo root):
```bash
grep -rln "gsap" --include="*.ts" --include="*.tsx" components app
```

- **If zero files match:** proceed to Step 3 (remove `gsap` from `package.json`).
- **If any files match:** STOP. Do not remove `gsap`. List the offending files in the commit message and open a follow-up. (Expected after Tasks 3–14: zero matches. The grep also catches any stray `import('gsap/...')` dynamic imports.)

- [ ] **Step 3: Remove the `gsap` dependency (only if Step 2 passed)**

In `package.json`, delete the line:
```json
    "gsap": "^3.15.0",
```

Then update the lockfile:
```bash
npm install
```
Expected: `npm install` runs, `package-lock.json` updates with `gsap` removed, no peer-dependency errors. (Lenis has no dependency on gsap.)

- [ ] **Step 4: Delete duplicate `.work-pinned-layout` / `.work-pin-left` block if present**

Search `app/globals.css` for `.work-pinned-layout` — if it appears twice (once in the Hero responsive region as a stray duplicate, once canonical at ~`globals.css:895-917`), delete the duplicate copy and keep the canonical one. If it appears once, do nothing. (This is a pre-existing cleanup the spec's "rewrite scoped" scope allows — it's not a redesign change, just deduplication surfaced while rewriting the Hero region.)

- [ ] **Step 5: Final full-site verification**

Run:
```bash
npm run build
```
Expected: build passes cleanly, no type errors, no lint errors, no warnings about missing `gsap` modules.

Then:
```bash
npm run dev
```
Manually walk the whole site at http://localhost:3000 with these checks:
- [ ] Geist font everywhere (headings + body + labels); no condensed/mono anywhere.
- [ ] No tally red (`--live`) or amber (`--amber`) anywhere on the page (devtools → compute styles, or visual scan). The only non-grayscale color permitted is the headshot photograph itself and any video thumbnails.
- [ ] No tally dots, cam-corner brackets, ON-AIR/REC pills, or boxed multi-side borders on any card.
- [ ] All borders are 1px `--line` hairlines; hover states brighten to `--ink`/`--ink-2`.
- [ ] Zero rounded corners on rectangles (dots/circles like cursor-glow keep 50%).
- [ ] No box-shadows on containers (cursor-glow retinted to a neutral radial glow is the only glow).
- [ ] IntersectionObserver reveal works on every section (scroll: elements fade/translate in once).
- [ ] Marquee scrolls smoothly (CSS), parks under reduced-motion.
- [ ] Name intro scrambles → locks → fades, no glitch/flash.
- [ ] Smooth scroll works (Lenis via autoRaf); native scroll under reduced-motion.
- [ ] Lightbox opens/closes, hairline borders, no REC pill.
- [ ] Contact form fields focus to ink border, submit button matches nav "Hire me" button.
- [ ] Toggle reduced-motion in devtools: all animations park/stop, content fully visible.
- [ ] No console errors (especially no "gsap is not defined", no ScrollTrigger errors).
- [ ] Mobile (≤880px): nav collapses, hero stacks, no horizontal overflow.

- [ ] **Step 6: Commit the cleanup + dependency removal**

```bash
git add components/SmoothScrollProvider.tsx package.json package-lock.json app/globals.css
git commit -m "Drop GSAP ticker for Lenis autoRaf, dedupe work-pinned-layout CSS

gsap dependency removed from package.json (grep confirmed zero references
in components/app after Tasks 3-14). SmoothScrollProvider now uses Lenis
built-in autoRaf. Final task of Signal Minimal redesign."
```

- [ ] **Step 7: Push the spec + plan commits**

The spec commit (`50c0782`, local-only) and the plan commit need pushing to the remote. After all task commits land:
```bash
git push
```
Expected: spec + plan + all 15 task commits push to the remote tracking branch.

---

## Self-Review (run after writing, before offering execution)

**Spec coverage** — every spec section maps to a task:
- Tokens → Task 1 · Fonts (Geist) → Task 1 · Hero → Task 3 · Showreel → Task 4 · About → Task 5 · Skills+Graphics merge → Task 6 · Experience/Work/Freelance/Ledger/Contact/Footer → Tasks 7/8/9/10/11 · Nav → Task 2 · Lightbox → Task 11 · Marquee → Task 12 · NameIntro → Task 14 · Motion simplification (AboutPortrait/CountUp/HeroMetrics/TestimonialCarousel/WorkSection/SmoothScrollProvider) → Tasks 5/8/9/13/15 · `gsap` removal gate → Task 15. Non-goals (no light mode, no new sections, no copy changes, no Lenis/reveal changes, no accent color) enforced in Global Constraints + per-task notes. ✓ No gaps.

**Placeholder scan** — no TBD/TODO/"implement later"/"add appropriate X". The two `{/* ...existing... */}` markers in Task 6 and Task 13 are explicit "keep verbatim" directives with surrounding context, not placeholders (the existing JSX is preserved, not re-described). ✓ Clean.

**Type consistency** — `CountUp` `target` widened to `number | string` (Task 13) and consumed consistently. `SkillsGraphicsCard` prop typed `typeof graphics[number]` matching `lib/content.ts`'s `graphics` export. `.btn-primary` (Task 2) and `.cform-btn` (Task 11) reconciled to identical treatment. Reduced-motion Block A edited surgically across Tasks 3/7/8/9/12 with the exact one-line-per-task change listed. ✓ Consistent.

---

## Execution Handoff

**Plan complete and saved to `docs/superpowers/plans/2026-07-17-signal-minimal-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** — I dispatch a fresh subagent per task, review between tasks, fast iteration. Best for this plan because each task is a self-contained CSS/JSX edit with its own build gate, so subagents stay focused and I catch regressions (especially the shared reduced-motion Block A edits) between tasks.

**2. Inline Execution** — Execute tasks in this session using executing-plans, batch execution with checkpoints.

**Which approach?**
