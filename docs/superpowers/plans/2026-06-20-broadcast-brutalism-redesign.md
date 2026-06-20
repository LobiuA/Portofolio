# Broadcast Brutalism Redesign — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign the existing portfolio into the Signal Dark "Broadcast Brutalism" look — hard borders, zero rounded corners, tally-light colors, condensed + mono type — keeping all real content.

**Architecture:** Token-driven retheme. Task 1 retokenizes `:root` + swaps fonts so the whole site shifts to the brutalist base at once; later tasks rebuild individual section markup (Hero → Vision Mixer Strip, Work → event state cards) and refine the rest. Data layer (`lib/content.ts`, `content/*.json`) and the `PortfolioChrome` utilities (scroll-reveal, skill-meter fill, cursor glow, Lightbox) are preserved.

**Tech Stack:** Next.js 16 (App Router) · React 19 · TypeScript · hand-written CSS in `app/globals.css` (Tailwind v4 imported but NOT used for the look) · `next/font/google` · Lenis · GSAP (Lenis ticker only).

**Spec:** `docs/superpowers/specs/2026-06-20-broadcast-brutalism-redesign-design.md`

## Global Constraints

- **Next.js 16 ≠ training data.** Read the relevant guide in `node_modules/next/dist/docs/` before writing any Next.js code (per `AGENTS.md`).
- **Styling = hand-written CSS** in `app/globals.css` keyed off `:root` tokens. Do NOT use Tailwind utilities or `@theme` for the look. Match existing CSS conventions.
- **Content/data lives ONLY in `lib/content.ts` / `content/*.json`.** Section components stay structural shells — never hardcode copy in JSX.
- **Zero rounded corners** on rectangles (cards, frames, badges, buttons, pills). Indicator dots/tally LEDs keep `border-radius: 50%`.
- **No box-shadows on containers/cards** — borders only. Glows are allowed only on tally indicators via animation.
- **Color tokens (Signal Dark):** `--bg:#0A0A0A` · `--ink:#F2F0EB` · `--live:#E8332C` (tally red / ON AIR) · `--amber:#F0A500` · `--accent` is set to `#F0A500` (amber) so existing `--accent` references become section-label amber; red is `--live`.
- **Fonts:** Barlow Condensed (display, 700/900) · JetBrains Mono (mono + body, 400/500/700). No Space Grotesk / Hanken / Space Mono.
- **Respect `prefers-reduced-motion`** (existing guards in `PortfolioChrome` + `SmoothScrollProvider` + CSS). Animate transforms/opacity only.
- **Verification model (this is a visual redesign, no unit-test harness):** every task ends with (a) `npm run build` passing — the type/lint gate — and (b) a manual browser check at `npm run dev` → http://localhost:3000, then a commit. Treat a failing build as a blocker.

---

### Task 1: Foundation — tokens, fonts, radius, keyframes

**Files:**
- Modify: `app/layout.tsx` (font imports + `<html>` className)
- Modify: `app/globals.css:9-78` (`:root` tokens + theme blocks) and the keyframes/pill-radius edits below

**Interfaces:**
- Produces: CSS tokens `--bg --ink --live --amber --accent --accent-ink --line --line-2 --ink-2 --ink-3 --gray-dark --dim`, font vars `--font-display --font-mono --font-body`, and keyframes `tally-pulse badge-glow scanline corner-draw enter-up enter-fade` (consumed by Tasks 3–10).

- [ ] **Step 1: Swap fonts in `app/layout.tsx`**

Replace the three `next/font/google` imports and their consts with:

```tsx
import { Barlow_Condensed, JetBrains_Mono } from 'next/font/google'

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

Update the `<html>` className to: `className={`${barlow.variable} ${jetbrains.variable}`}`. Leave `data-theme="dark"` as-is.

- [ ] **Step 2: Retokenize `:root` in `app/globals.css`**

Replace the `:root { ... }` block (lines ~9-31) and BOTH theme blocks (`:root, [data-theme="dark"]` lines ~34-46 and `[data-theme="light"]` lines ~49-61) with this single block (delete the light theme entirely):

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

  --maxw: 1240px;
  --gut: clamp(20px, 5vw, 80px);
  --r-sm: 0; --r-md: 0; --r-lg: 0;
  --ease: cubic-bezier(.22,.61,.36,1);
}
```

- [ ] **Step 3: Kill rounded pills (keep dots round)**

In `app/globals.css`, replace every `border-radius: 999px` with `border-radius: 0` (these are the nav links, buttons, chips, filters, tags, badges, icon-btn). Leave every `border-radius: 50%` untouched (tally dots / LEDs). Also set the headshot/card hardcoded radii to 0: change `border-radius: 20px` (`.headshot-img`) to `0`.

- [ ] **Step 4: Add brutalist keyframes**

Append to `app/globals.css` (after the existing `@keyframes pulse`):

```css
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
}
```

- [ ] **Step 5: Verify build + visual**

Run: `npm run build` → Expected: PASS (no type/lint errors).
Run `npm run dev`, open http://localhost:3000 → Expected: whole site is near-black with warm-white text, amber accents, square corners, condensed headings, mono body. (Hero/sections still old layout — that's fine; only the skin changed.)

- [ ] **Step 6: Commit**

```bash
git add app/layout.tsx app/globals.css
git commit -m "feat(redesign): Signal Dark tokens, brutalist fonts, zero-radius base"
```

---

### Task 2: Remove theme toggle + accent picker

**Files:**
- Modify: `components/PortfolioChrome.tsx`
- Modify: `components/Nav.tsx`
- Modify: `lib/content.ts:24-30` (remove `accents` export)
- Modify: `app/globals.css` (remove `.accent-pop`, `.swatches`, `.swatch`, `.sun`/`.moon` toggle rules, `[data-theme="light"] .cursor-glow`)

**Interfaces:**
- Consumes: Task 1 tokens.
- Produces: `usePortfolio()` context now exposes ONLY `{ openLightbox }`. Tasks 3 & 5 rely on this narrowed shape.

- [ ] **Step 1: Narrow `PortfolioChrome.tsx`**

Remove `theme`, `accent` state, `toggleTheme`, `setAccent`, the persisted-restore `useEffect` (lines ~39-59), and the `accents` import. Keep `lbEvent`/`openLightbox`, the scroll-reveal + meter-fill effect, and the cursor-glow effect. New context type + value:

```tsx
interface ChromeCtx { openLightbox: (event: string) => void }
```
```tsx
return (
  <Ctx.Provider value={{ openLightbox }}>
    <div className="cursor-glow" ref={glowRef} aria-hidden="true" />
    {children}
    <Lightbox event={lbEvent} onClose={() => setLbEvent(null)} />
  </Ctx.Provider>
)
```

- [ ] **Step 2: Strip controls from `Nav.tsx`**

Remove the `usePortfolio()` theme/accent destructure, `pickerOpen` state, `popRef`, the picker `useEffect`, the `accents`/`siteData` accent imports that are now unused, and the entire `.accent-pop` block + theme toggle `<button>` in `.nav-tools`. Keep the brand, `.nav-links`, and the "Hire me" `<a className="btn btn-primary">`.

- [ ] **Step 3: Remove `accents` from `lib/content.ts`**

Delete the `export const accents = [...] as const` array (lines ~24-30). Confirm no other file imports it: `grep -rn "accents" components app lib` should return no results after Steps 1-2.

- [ ] **Step 4: Remove dead CSS**

In `app/globals.css` delete: `.accent-pop`, `.swatches`, `.accent-pop.open .swatches`, `.swatch`, `.swatch:hover`, `.swatch[aria-pressed]`, the `.sun`/`[data-theme="light"] .sun`/`.moon` line, and the `[data-theme="light"] .cursor-glow` rule.

- [ ] **Step 5: Verify build + visual**

Run: `npm run build` → Expected: PASS. Confirm no "unused variable" lint errors.
Browser: nav shows brand + links + "Hire me" only — no sun/moon or color-dot buttons.

- [ ] **Step 6: Commit**

```bash
git add components/PortfolioChrome.tsx components/Nav.tsx lib/content.ts app/globals.css
git commit -m "feat(redesign): remove theme toggle + accent picker, lock Signal Dark"
```

---

### Task 3: Nav (bus bar) + Footer (status strip)

**Files:**
- Modify: `components/Footer.tsx`
- Modify: `app/globals.css` (`.nav*`, `.brand`, `.btn*`, `.foot*`)

**Interfaces:**
- Consumes: Task 1 tokens, Task 2 narrowed Nav.

- [ ] **Step 1: Restyle nav CSS**

In `app/globals.css` set `.nav` to a hard bus-bar: `border-bottom: 2px solid var(--ink)`, mono brand. Change `.nav.scrolled` background to `color-mix(in srgb, var(--bg) 90%, transparent)`. Make `.nav-links a` JetBrains Mono 700, 12px, letter-spacing .08em, uppercase, `color: var(--ink-2)`, hover `color: var(--ink)` with no pill background. Make `.btn` square (already radius 0 from Task 1); `.btn-primary` → `background: var(--live); color: var(--ink); border: 2px solid var(--live)`; `.btn-ghost` → `border: 2px solid var(--ink)`. Keep `.brand .tally` as the round red LED with `animation: tally-pulse 1.4s ease-in-out infinite`.

- [ ] **Step 2: Rebuild Footer as status strip**

`components/Footer.tsx` — render from `siteData.footer` (check its shape in `content/general.json` first). Markup:

```tsx
import { siteData } from '@/lib/content'
export default function Footer() {
  const { footer } = siteData
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <span className="foot-id">TMJ / BROADCAST PORTFOLIO · portofoliotmj.vercel.app</span>
        <span className="foot-sig"><span className="tally" /> SIG: LIVE</span>
      </div>
    </footer>
  )
}
```
(If `content/general.json`'s `footer` carries the id string / links, use those values instead of the hardcoded string — keep copy in content.)

- [ ] **Step 3: Footer CSS**

`.foot { border-top: 3px solid var(--ink); padding-block: 18px; }`. `.foot-inner` mono 10px, `color: var(--ink-2)`, space-between. `.foot-sig { color: var(--live); font-weight: 700; letter-spacing:.1em; display:flex; gap:9px; align-items:center; }` with `.foot-sig .tally` a 8px round red dot, `animation: tally-pulse 1.4s ease-in-out infinite`.

- [ ] **Step 4: Verify + commit**

Run: `npm run build` → PASS. Browser: nav is a hard-bordered mono bar; footer is a top-bordered status strip with blinking `● SIG: LIVE`.
```bash
git add components/Footer.tsx app/globals.css
git commit -m "feat(redesign): bus-bar nav + status-strip footer"
```

---

### Task 4: Hero — Vision Mixer Strip

**Files:**
- Rewrite: `components/HeroSection.tsx`
- Create: `components/Timecode.tsx` (client component for the live timecode)
- Modify: `app/globals.css` (replace the entire `HERO` block ~206-256)

**Interfaces:**
- Consumes: `siteData.hero` (`kicker, nameLines, role{pre,accent,post}, lede, cta[], headshot, headshotBlur, stats[], marquee[]`), Task 1 keyframes.
- Produces: full-bleed hero markup; `Timecode` component (`<Timecode start="00:14:22:08" />`).

- [ ] **Step 1: Live-timecode client component**

Create `components/Timecode.tsx`:

```tsx
'use client'
import { useEffect, useState } from 'react'

export default function Timecode({ start = '00:14:22:08' }: { start?: string }) {
  const [tc, setTc] = useState(start)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const [h, m, s, f] = start.split(':').map(Number)
    const startFrames = ((h * 60 + m) * 60 + s) * 25 + f
    const t0 = Date.now()
    const pad = (n: number) => String(n).padStart(2, '0')
    const id = setInterval(() => {
      const total = startFrames + Math.floor((Date.now() - t0) / 40)
      const ff = total % 25
      const ss = Math.floor(total / 25) % 60
      const mm = Math.floor(total / 1500) % 60
      const hh = Math.floor(total / 90000)
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`)
    }, 40)
    return () => clearInterval(id)
  }, [start])
  return <span className="tc" data-timecode>{tc}</span>
}
```

- [ ] **Step 2: Rewrite `HeroSection.tsx`**

Full-bleed `<header className="vmix">` (no `.wrap` width clamp). Bus label bar (3 cols) → 3-col body (camera | title | metrics) → ticker strip. Camera col uses the existing `<Image>` for `hero.headshot` inside `.cam-frame` with scanline div + 4 `.cam-corner` brackets + `<Timecode />` + `.cam-label`. Title col: `hero.kicker` (role label) → `<h1>` mapping `hero.nameLines` (Barlow 900) → red subtitle `LIVE ESPORTS BROADCAST` → `hero.lede` → tag row from `hero.marquee` → `hero.cta` buttons. Metrics col: `METRICS` header + map `hero.stats` to `.metric` blocks (number Barlow 700, label mono). Ticker: join a few `hero.marquee`/event names + `● ON AIR`. Keep `data-reveal` hooks so existing reveal still works. Preserve `<Image>` props (`priority`, `sizes`, `placeholder`, `blurDataURL`).

> Keep real stats (5+/30+/4) — do NOT use README sample numbers.

- [ ] **Step 3: Replace HERO CSS**

Replace the `.hero*` / `.marquee*` block with `.vmix` styles per the spec's "Vision Mixer Strip" section: full-bleed grid, `.bus-bar` (`grid-template-columns: 200px 1fr auto; border-bottom: 2px solid var(--ink)`), `.vmix-body` (`grid-template-columns: 200px 1fr 172px; min-height: 400px`), `.cam-col` (`border-right: 2px solid var(--ink)`), `.cam-frame` diagonal stripe `repeating-linear-gradient(-45deg, #141414 0 8px, #0F0F0F 8px 16px)`, `.scanline` (`animation: scanline 3.8s linear infinite`), `.cam-corner` (4 variants TL/TR/BL/BR, 3px `var(--live)`, staggered `corner-draw .35s ease [0.60/0.68/0.76/0.84s] both`), `.tc` mono, `.cam-label` (`border-top: 2px solid var(--live)`), `.vmix-title h1` (Barlow 900, `font-size: clamp(44px,8vw,76px); line-height:.88`), `.vmix-sub` red, `.metric .n` Barlow 700 40px, `.ticker` (`border-top:1px solid var(--line-2)`). Use exact px/hex from the spec. Add the page-load entrance sequence (`enter-up`/`enter-fade` with the delays in the spec's sequence table). Responsive: collapse to single column under 940px.

- [ ] **Step 4: Verify + commit**

Run: `npm run build` → PASS. Browser: full-width vision-mixer hero; red ON AIR badge pulses; scanline sweeps the camera frame; corner brackets draw in; timecode counts up from `00:14:22:08`; metrics show 5+/30+/4.
```bash
git add components/HeroSection.tsx components/Timecode.tsx app/globals.css
git commit -m "feat(redesign): Vision Mixer Strip hero with live timecode"
```

---

### Task 5: Work → Event state cards (ON AIR / STANDBY / COMPLETE)

**Files:**
- Modify: `components/WorkSection.tsx`
- Modify: `app/globals.css` (`.gallery`, `.ev*`, `.filters`, `.filter`)

**Interfaces:**
- Consumes: `siteData.work` (`events[]` each with `flags[]{label,live}`, `year, title, role, game, roles[], cover, count`), `usePortfolio().openLightbox`.

- [ ] **Step 1: Derive card state**

In `WorkSection.tsx` add a helper:

```tsx
const stateOf = (e: (typeof work.events)[number]): 'onair' | 'standby' | 'complete' => {
  if (e.flags.some((f) => f.live)) return 'onair'
  const year = parseInt(e.year, 10)
  return year >= 2025 ? 'standby' : 'complete'
}
```
Apply as a class on each card: `className={`ev ev-${stateOf(e)}${matches(...) ? '' : ' hide'}`}`. Add a badge in `.ev-body` header showing `ON AIR` / `STANDBY` / `COMPLETE` (text from `stateOf`). Keep the existing filters, `onClick`/`onKeyDown` → `openLightbox`, `<Image>`, `.ev-count`, and `data-reveal`.

- [ ] **Step 2: Event-card CSS**

Restyle `.ev` to the spec's event card: `border: 2px solid var(--ink)` default; header row (title Barlow 900 22px uppercase + badge). State modifiers: `.ev-onair` red animated badge (`border:2px solid var(--live); color:var(--live); animation: badge-glow 1.4s ease-in-out infinite`) + round `.tally` dot; `.ev-standby` amber badge (`border:2px solid var(--amber); color:var(--amber)`, no animation); `.ev-complete` dimmed (`border-color:var(--line); color:var(--dim)`, badge `1px solid var(--gray-dark)`). Remove `box-shadow` on `.ev:hover` (use border color change only). Restyle `.filter` to square mono chips; active filter `background: var(--amber); color: var(--bg)`.

- [ ] **Step 3: Verify + commit**

Run: `npm run build` → PASS. Browser: int'l/live events show pulsing red ON AIR; 2025 non-live show amber STANDBY; older show dimmed COMPLETE. Filters still work; clicking a card opens the Lightbox.
```bash
git add components/WorkSection.tsx app/globals.css
git commit -m "feat(redesign): event cards with ON AIR/STANDBY/COMPLETE states"
```

---

### Task 6: Skills → VU / level meters

**Files:**
- Modify: `components/SkillsSection.tsx` (only if markup needs meter segments; otherwise CSS-only)
- Modify: `app/globals.css` (`.meter*`, `.tool*`, `.role-tags*`)

**Interfaces:**
- Consumes: `siteData.skills`; the meter-fill effect in `PortfolioChrome` sets `.fill` width from `data-w` — keep `.fill[data-w]` markup intact.

- [ ] **Step 1: Meter CSS → console look**

Restyle `.meter .bar` to a hard-edged track (`height: 10px; border: 1px solid var(--line-2); background: var(--surface); border-radius: 0`). `.meter .fill` → solid `background: var(--amber)` (no gradient, radius 0), with a segmented overlay via `background-image: repeating-linear-gradient(90deg, transparent 0 7px, var(--bg) 7px 9px)` to read as VU segments; keep the `width` transition so the existing fill animation still drives it. `.meter .top .name` → Barlow 700; `.lvl` mono amber. Restyle `.tool` cards: `border: 2px solid var(--line)`, no shadow, `.glyph` square amber-on-dark. `.role-tags .rt` square mono.

- [ ] **Step 2: Verify + commit**

Run: `npm run build` → PASS. Browser: skill bars read as segmented amber VU meters that fill on scroll; tool cards are hard-bordered.
```bash
git add components/SkillsSection.tsx app/globals.css
git commit -m "feat(redesign): skills as audio-console VU meters"
```

---

### Task 7: Experience → broadcast rundown

**Files:**
- Modify: `components/ExperienceSection.tsx`
- Modify: `app/globals.css` (`.timeline`, `.tl-item`, `.tl-when`, `.tl-body*`)

**Interfaces:**
- Consumes: `siteData.experience` (`items[]` each `{when, active, role, org, desc}`).

- [ ] **Step 1: State badges on rows**

In `ExperienceSection.tsx`, for each item render a state badge: `active` → `ON AIR` (red), else `COMPLETE` (dim). Add class `tl-onair` / `tl-complete` on `.tl-item`. Keep `data-reveal`.

- [ ] **Step 2: Rundown CSS**

`.tl-item` → hard top border `1px solid var(--line)`, mono meta. `.tl-when` amber mono. `.tl-onair .badge` red with round `.tally` (`animation: tally-pulse 1.4s ...`); `.tl-complete .badge` `1px solid var(--gray-dark); color: var(--dim)`. `.tl-body h3` Barlow 900 uppercase. Remove the rounded `.now` pill styling (square it).

- [ ] **Step 3: Verify + commit**

Run: `npm run build` → PASS. Browser: experience reads as a rundown; the 2020–Present row shows a pulsing ON AIR badge; past roles are dimmed COMPLETE.
```bash
git add components/ExperienceSection.tsx app/globals.css
git commit -m "feat(redesign): experience as broadcast rundown"
```

---

### Task 8: About + Contact panels

**Files:**
- Modify: `app/globals.css` (`.about*`, `.chip`, `.contact*`, `.clink*`)
- Modify: `components/AboutSection.tsx` / `components/ContactSection.tsx` only if a section label needs adding

**Interfaces:**
- Consumes: `siteData.about`, `siteData.contact`.

- [ ] **Step 1: About → STUDIO INFO panel**

`.about-portrait img` radius 0, `border: 2px solid var(--ink)`; `.about-portrait .frame-corner` → `var(--live)`. `.about-copy .mark` → `var(--amber)`. `.chip` → square mono, `border: 1px solid var(--line)`, hover `border-color: var(--amber)`. `.interest-inline h4` amber mono label.

- [ ] **Step 2: Contact → SIGNAL OUT panel**

`.contact-card` → `border: 2px solid var(--ink)`, no shadow, radius 0. `.contact-card h2` Barlow 900 uppercase. `.clink` → square, `border: 1px solid var(--line)`, hover `border-color: var(--amber)` (keep translateX hover). `.clink .lbl` amber mono; `.clink .arr` amber.

- [ ] **Step 3: Verify + commit**

Run: `npm run build` → PASS. Browser: About + Contact are hard-bordered panels; amber labels; square frames.
```bash
git add app/globals.css components/AboutSection.tsx components/ContactSection.tsx
git commit -m "feat(redesign): About + Contact brutalist panels"
```

---

### Task 9: Freelance + Ledger restyle

**Files:**
- Modify: `app/globals.css` (`.fl*`, `.up-stats*`, `.testimonial*`, `.ledger*`)

**Interfaces:**
- Consumes: `siteData.freelance`, `siteData.ledger`.

- [ ] **Step 1: Freelance CSS**

`.fl`, `.fl-img`, `.up-stats`, `.testimonial` → `border` (1–2px) instead of shadow, radius 0. `.fl:hover` border `var(--amber)` (drop translate shadow). `.testimonial` left rule `3px solid var(--amber)`. `.up-stats .stat .n` Barlow 700; `.l` amber mono. `.fl .pin::before` amber tick.

- [ ] **Step 2: Ledger CSS**

`.ledger` rows → mono, hard `border-bottom: 1px solid var(--line)`, hover `background: var(--surface)`. `.ledger .row .meta` amber mono. `.ledger .row .ttl` Barlow 700.

- [ ] **Step 3: Verify + commit**

Run: `npm run build` → PASS. Browser: Freelance cards + Ledger rows are square, hard-bordered, amber accents.
```bash
git add app/globals.css
git commit -m "feat(redesign): Freelance + Ledger brutalist restyle"
```

---

### Task 10: Polish — entrance sequence, responsive, Lightbox, final gate

**Files:**
- Modify: `app/globals.css` (Lightbox `.lb-*`, scrollbar, selection, cursor-glow color, responsive sweeps)

**Interfaces:**
- Consumes: all prior tasks.

- [ ] **Step 1: Lightbox + chrome to Signal Dark**

`.lb-frame`, `.lb-close`, `.lb-nav`, `.lb-thumbs img` → radius 0, hard borders; `.lb-nav:hover { background: var(--amber); color: var(--bg); }`. `::selection { background: var(--amber); color: var(--bg); }`. Scrollbar thumb hover `var(--amber)`. `.cursor-glow` gradient → `color-mix(in srgb, var(--live) 12%, transparent)`.

- [ ] **Step 2: Responsive pass**

At ≤940px the vision-mixer hero stacks (camera → title → metrics). At ≤880px event/freelance grids already collapse — confirm no horizontal overflow from the full-bleed hero (`overflow-x: hidden` on body is present). Check nav-links hidden ≤880px still leaves brand + Hire me usable.

- [ ] **Step 3: Reduced-motion audit**

Confirm scanline, corner-draw, tally-pulse, badge-glow, timecode, and entrance animations are all disabled/static under `prefers-reduced-motion: reduce` (Timecode early-returns; add CSS guards for any keyframe not yet covered).

- [ ] **Step 4: Final build gate + visual sweep**

Run: `npm run build` → PASS. Run `npm run lint` → clean. Browser: scroll the whole page top to bottom — every section is Signal Dark, zero rounded rectangles, no card shadows, amber labels, red tally indicators; Lightbox opens and themes correctly.

- [ ] **Step 5: Commit**

```bash
git add app/globals.css
git commit -m "feat(redesign): polish Lightbox, responsive, reduced-motion"
```

---

## Self-Review

**Spec coverage:** Tokens/fonts/radius → T1. Remove theme/accent picker → T2. Nav bus bar + Footer status strip → T3. Vision Mixer Strip hero + timecode + animations → T4. Event ON AIR/STANDBY/COMPLETE + filters + Lightbox → T5. Skills VU meters → T6. Experience rundown → T7. About + Contact panels → T8. Freelance + Ledger → T9. Lightbox/responsive/reduced-motion/build gate → T10. All spec sections covered.

**Type consistency:** `usePortfolio()` narrowed to `{ openLightbox }` in T2 and consumed (only `openLightbox`) in T5; Nav (T2) no longer reads context. `stateOf` defined and used within T5. `Timecode` defined in T4 Step 1, used T4 Step 2. `--accent`/`--live`/`--amber` defined T1, used throughout.

**Placeholder scan:** No "TBD"/"handle edge cases" — each task names exact files, selectors, and concrete values. Aesthetic restyle tasks specify exact tokens/selectors rather than "make it look good."

**Out of scope (per spec):** light mode, alt color tones, content changes, README sample data, swapping Lenis/GSAP/IO plumbing.
