# Full Layout Redesign "Signal Minimal × Lucas" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the 12-section Broadcast-Brutalism layout with a 7-section, typography-driven "Signal Minimal × Lucas" layout, keeping all content and the Signal Minimal token system.

**Architecture:** Single Next.js page. `app/page.tsx` composes `WordIntro` → `TopBar`+`OverlayMenu` → seven new section components → `SiteFooter`, all inside the existing `SmoothScrollProvider` + `PortfolioChrome`. New sections read from the unchanged `siteData`. Motion is CSS + IntersectionObserver only — no GSAP. Old section components and their CSS are deleted in the same pass.

**Tech Stack:** Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript, hand-written CSS in `app/globals.css`, Geist (next/font), Lenis smooth scroll.

## Global Constraints

- **Branch:** all work on `signal-minimal-redesign` (current). Do NOT commit to `main` — `main` auto-deploys to production.
- **Build gate:** `export PATH="$PATH:/c/Program Files/nodejs" && npm run build` must pass before each commit that touches code (Node is not on the default PATH).
- **Content is frozen:** never edit `lib/content.ts`, `content/*.json`, or `lib/blur.json`. Read only.
- **Tokens frozen:** `--bg #0A0A0A`, `--ink #F2F0EB`, `--line #2A2A28`, `--r-sm/md/lg 0`, `--font-sans: var(--font-geist)…`. No `--live`, no `--amber`, no serif, no accent, no light mode.
- **Motion:** CSS + IntersectionObserver only. No GSAP, no new animation deps. Every animation respects `prefers-reduced-motion`.
- **Hydration rule:** no `Math.random()` / `Date.now()` / `new Date()` in a `useState` initializer or in render. Deterministic initial state; do random/time work in `useEffect`.
- **Commit trailer:** every commit ends with `Co-Authored-By: Claude <noreply@anthropic.com>`.
- **CSS home:** all new styles in `app/globals.css`, matching existing plain-class style. No Tailwind utilities in JSX.

---

## File Structure

**New components (`components/`):**
- `WordReveal.tsx` (client) — splits text into words, reveals on scroll. Used by Manifesto + Contact.
- `WordIntro.tsx` (client) — word-by-word name intro overlay.
- `TopBar.tsx` (client) — thin fixed bar: "JIDAN" + "Menu" button; owns overlay open state.
- `OverlayMenu.tsx` (client) — full-screen menu; receives `open`/`onClose`.
- `Hero01.tsx` (server) — full-viewport hero.
- `Manifesto02.tsx` (server) — statement + headshot + bio + stats.
- `WorkSlider03.tsx` (client) — big auto-crossfade work slider → lightbox.
- `Capabilities04.tsx` (client) — 3-group accordion.
- `Freelance05.tsx` (server) — client cards + testimonial + ledger.
- `Showreel06.tsx` (client) — cover slideshow.
- `Contact07.tsx` (server) — CTA + email + socials.
- `SiteFooter.tsx` (server) — watermark + nav + copyright.

**New helper (`lib/`):**
- `split-words.ts` — `splitWords(text): string[]`.
- `capabilities.ts` — static group definitions mapping roleTags + experience into 3 accordion groups.
- `nav.ts` — `NAV_LINKS: {label,href}[]` — the 6 real section anchors. Single source for OverlayMenu + SiteFooter. NOT `siteData.nav` (whose hrefs still point at removed `#skills`/`#graphics`).

**Modified:**
- `app/page.tsx` — new composition.
- `app/globals.css` — add new section CSS, delete dead CSS.

**Deleted components:** `HeroSection.tsx`, `Timecode.tsx`, `AboutSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, `ProofStrip.tsx`, `WorkSection.tsx`, `FreelanceSection.tsx`, `LedgerSection.tsx`, `ContactSection.tsx`, `ShowreelSection.tsx`, `Nav.tsx`, `NameIntro.tsx`, `GraphicsSection.tsx` (if present and unused).

**Unchanged:** `PortfolioChrome.tsx`, `Lightbox.tsx`, `SmoothScrollProvider.tsx`, `Footer.tsx` (deleted only after `SiteFooter` replaces it), `lib/content.ts`, all `content/*.json`, `scripts/gen-blur.mjs`, `lib/blur.json`.

---

## Task 1: `splitWords` helper + self-check

**Files:**
- Create: `lib/split-words.ts`
- Create: `scripts/check-split-words.mjs`

**Interfaces:**
- Produces: `splitWords(text: string): string[]` — array of words (no whitespace-only entries).

- [ ] **Step 1: Write the helper**

```ts
// lib/split-words.ts
// Split text into words for per-word reveal. Uses Intl.Segmenter when available
// (correct for Indonesian/English), falls back to whitespace split.
export function splitWords(text: string): string[] {
  const t = text.trim()
  if (!t) return []
  if (typeof Intl !== 'undefined' && 'Segmenter' in Intl) {
    const seg = new Intl.Segmenter('id', { granularity: 'word' })
    return [...seg.segment(t)].map((s) => s.segment).filter((s) => s.trim().length > 0)
  }
  return t.split(/\s+/).filter(Boolean)
}
```

- [ ] **Step 2: Write the self-check**

```js
// scripts/check-split-words.mjs
import assert from 'node:assert'
import { splitWords } from '../lib/split-words.ts'

assert.deepEqual(splitWords('TRI MUHAMMAD JIDAN'), ['TRI', 'MUHAMMAD', 'JIDAN'])
assert.deepEqual(splitWords('  '), [])
assert.equal(splitWords('one two three').length, 3)
assert.deepEqual(splitWords('halo dunia'), ['halo', 'dunia'])
console.log('split-words OK')
```

- [ ] **Step 3: Run the self-check**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && node --experimental-strip-types scripts/check-split-words.mjs`
Expected: prints `split-words OK` (exit 0). If `--experimental-strip-types` is unavailable on this Node, change the import to inline the function body in the check and re-run.

- [ ] **Step 4: Commit**

```bash
git add lib/split-words.ts scripts/check-split-words.mjs
git commit -m "feat(redesign): splitWords helper for per-word reveal

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 2: `WordReveal` component + CSS

**Files:**
- Create: `components/WordReveal.tsx`
- Modify: `app/globals.css` (append WordReveal block)

**Interfaces:**
- Consumes: `splitWords` (Task 1).
- Produces: `<WordReveal text={string} as?: 'p'|'h1'|'h2'|'blockquote' className?: string />` — default tag `p`.

- [ ] **Step 1: Write the component**

```tsx
// components/WordReveal.tsx
'use client'

import { useEffect, useRef, useState, type ElementType } from 'react'
import { splitWords } from '@/lib/split-words'

export default function WordReveal({
  text,
  as,
  className = '',
}: {
  text: string
  as?: ElementType
  className?: string
}) {
  const Tag = (as ?? 'p') as ElementType
  const ref = useRef<HTMLElement>(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setInView(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setInView(true)
          io.disconnect()
        }
      },
      { threshold: 0.25 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <Tag ref={ref} className={`word-reveal${inView ? ' in' : ''} ${className}`.trim()}>
      {splitWords(text).map((w, i) => (
        <span key={i} className="word-reveal-w" style={{ transitionDelay: `${i * 40}ms` }}>
          {w}
          {' '}
        </span>
      ))}
    </Tag>
  )
}
```

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   WORD REVEAL
   ============================================================ */
.word-reveal-w {
  display: inline-block;
  opacity: 0;
  transform: translateY(0.5em);
  transition: opacity .6s var(--ease), transform .6s var(--ease);
}
.word-reveal.in .word-reveal-w { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) {
  .word-reveal-w { opacity: 1; transform: none; transition: none; }
}
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: build passes (no type errors; `WordReveal` compiles even though not yet imported).

- [ ] **Step 4: Commit**

```bash
git add components/WordReveal.tsx app/globals.css
git commit -m "feat(redesign): WordReveal component + CSS

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 3: `WordIntro` component + CSS

**Files:**
- Create: `components/WordIntro.tsx`
- Modify: `app/globals.css` (append WordIntro block)

**Interfaces:**
- Produces: `<WordIntro onDone={() => void} />`. Calls `onDone` after the outro (or immediately under reduced-motion).

- [ ] **Step 1: Write the component**

```tsx
// components/WordIntro.tsx
'use client'

import { useEffect, useState } from 'react'

const WORDS = ['TRI', 'MUHAMMAD', 'JIDAN']

export default function WordIntro({ onDone }: { onDone: () => void }) {
  // Deterministic initial state — no random/time in render (SSR hydration rule).
  const [shown, setShown] = useState(0) // how many words are visible
  const [leaving, setLeaving] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      onDone()
      return
    }
    const timers: ReturnType<typeof setTimeout>[] = []
    WORDS.forEach((_, i) => {
      timers.push(setTimeout(() => setShown(i + 1), 300 + i * 400))
    })
    const holdEnd = 300 + WORDS.length * 400 + 600
    timers.push(setTimeout(() => setLeaving(true), holdEnd))
    timers.push(setTimeout(onDone, holdEnd + 500))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div className={`word-intro${leaving ? ' is-leaving' : ''}`} role="presentation">
      <h1 className="word-intro-name">
        {WORDS.map((w, i) => (
          <span key={w} className={i < shown ? 'on' : ''}>
            {w}
            {i < WORDS.length - 1 ? ' ' : ''}
          </span>
        ))}
      </h1>
    </div>
  )
}
```

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   WORD INTRO
   ============================================================ */
.word-intro {
  position: fixed; inset: 0; z-index: 9999; background: var(--bg);
  display: flex; align-items: center; justify-content: center;
  opacity: 1; transition: opacity .5s var(--ease);
}
.word-intro.is-leaving { opacity: 0; pointer-events: none; }
.word-intro-name {
  font-family: var(--font-sans); font-weight: 600;
  font-size: clamp(32px, 6vw, 72px); letter-spacing: -.01em;
  color: var(--ink); text-align: center; line-height: 1; margin: 0;
}
.word-intro-name span {
  display: inline-block; opacity: 0; transform: translateY(12px);
  transition: opacity .4s var(--ease), transform .4s var(--ease);
}
.word-intro-name span.on { opacity: 1; transform: translateY(0); }
@media (prefers-reduced-motion: reduce) { .word-intro { display: none; } }
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/WordIntro.tsx app/globals.css
git commit -m "feat(redesign): WordIntro word-by-word intro

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 4: `nav.ts` + `TopBar` + `OverlayMenu` + CSS

**Files:**
- Create: `lib/nav.ts`
- Create: `components/OverlayMenu.tsx`
- Create: `components/TopBar.tsx`
- Modify: `app/globals.css` (append TopBar + OverlayMenu block)

**Interfaces:**
- Consumes: `siteData.contact.links` (for overlay footer email).
- Produces: `NAV_LINKS: {label,href}[]`. `<TopBar />` (self-contained; renders `OverlayMenu` internally). `<OverlayMenu open={boolean} onClose={() => void} links={{label,href}[]} email={string} />`.

Why not `siteData.nav`: `general.json` nav has 7 entries whose hrefs point at removed sections (`#skills`, `#graphics`) and omit `#capabilities`. Content is frozen (can't edit the JSON), so nav lives in code.

- [ ] **Step 1: Write `nav.ts`**

```ts
// lib/nav.ts
// The 6 real section anchors for the redesigned layout. Single source for
// OverlayMenu + SiteFooter. Deliberately NOT siteData.nav — general.json's nav
// still points at removed sections and content is frozen.
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Freelance', href: '#freelance' },
  { label: 'Showreel', href: '#showreel' },
  { label: 'Contact', href: '#contact' },
]
```

- [ ] **Step 2: Write `OverlayMenu`**

```tsx
// components/OverlayMenu.tsx
'use client'

import { useEffect, useRef } from 'react'

export default function OverlayMenu({
  open,
  onClose,
  links,
  email,
}: {
  open: boolean
  onClose: () => void
  links: { label: string; href: string }[]
  email: string
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    ref.current?.querySelector<HTMLElement>('a,button')?.focus()
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  return (
    <div
      ref={ref}
      className={`overlay-menu${open ? ' open' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-hidden={!open}
      aria-label="Menu"
    >
      <button className="overlay-close" aria-label="Close menu" onClick={onClose}>
        ✕
      </button>
      <nav className="overlay-links">
        {links.map((l) => (
          <a key={l.href} href={l.href} onClick={onClose}>
            {l.label}
          </a>
        ))}
      </nav>
      <div className="overlay-foot">
        <a href={`mailto:${email}`}>{email}</a>
        <span>© Tri Muhammad Jidan</span>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Write `TopBar`**

```tsx
// components/TopBar.tsx
'use client'

import { useEffect, useState } from 'react'
import { siteData } from '@/lib/content'
import { NAV_LINKS } from '@/lib/nav'
import OverlayMenu from '@/components/OverlayMenu'

export default function TopBar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const email =
    siteData.contact.links.find((l) => l.type === 'email')?.val ?? ''

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <header className={`topbar${scrolled ? ' scrolled' : ''}`}>
        <a className="topbar-brand" href="#top">
          JIDAN
        </a>
        <button
          className="topbar-menu"
          aria-expanded={open}
          aria-label="Open menu"
          onClick={() => setOpen(true)}
        >
          Menu
        </button>
      </header>
      <OverlayMenu open={open} onClose={() => setOpen(false)} links={NAV_LINKS} email={email} />
    </>
  )
}
```

- [ ] **Step 4: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   TOPBAR + OVERLAY MENU
   ============================================================ */
.topbar {
  position: fixed; inset: 0 0 auto 0; z-index: 60;
  display: flex; align-items: center; justify-content: space-between;
  padding: 20px var(--gut);
  background: transparent; border-bottom: 1px solid transparent;
  transition: background .3s var(--ease), border-color .3s var(--ease);
}
.topbar.scrolled { background: var(--bg); border-bottom-color: var(--line); }
.topbar-brand { font-family: var(--font-sans); font-weight: 600; font-size: 13px; letter-spacing: .12em; }
.topbar-menu {
  background: none; border: 0; color: var(--ink); cursor: pointer;
  font-family: var(--font-sans); font-size: 13px; letter-spacing: .12em; text-transform: uppercase;
}
.overlay-menu {
  position: fixed; inset: 0; z-index: 80;
  background: color-mix(in srgb, var(--bg) 98%, transparent);
  display: flex; flex-direction: column; justify-content: center; padding: 0 var(--gut);
  opacity: 0; pointer-events: none; transition: opacity .35s var(--ease);
}
.overlay-menu.open { opacity: 1; pointer-events: auto; }
.overlay-close {
  position: absolute; top: 20px; right: var(--gut);
  background: none; border: 0; color: var(--ink); font-size: 24px; cursor: pointer; line-height: 1;
}
.overlay-links a {
  display: block; font-family: var(--font-sans); font-weight: 500;
  font-size: clamp(40px, 7vw, 84px); line-height: 1.15; color: var(--ink);
  opacity: 0; transform: translateY(20px);
  transition: opacity .5s var(--ease), transform .5s var(--ease);
}
.overlay-menu.open .overlay-links a { opacity: 1; transform: translateY(0); }
.overlay-menu.open .overlay-links a:nth-child(1) { transition-delay: .05s; }
.overlay-menu.open .overlay-links a:nth-child(2) { transition-delay: .11s; }
.overlay-menu.open .overlay-links a:nth-child(3) { transition-delay: .17s; }
.overlay-menu.open .overlay-links a:nth-child(4) { transition-delay: .23s; }
.overlay-menu.open .overlay-links a:nth-child(5) { transition-delay: .29s; }
.overlay-menu.open .overlay-links a:nth-child(6) { transition-delay: .35s; }
.overlay-foot {
  position: absolute; bottom: 32px; left: var(--gut); right: var(--gut);
  display: flex; justify-content: space-between;
  font-family: var(--font-sans); font-size: 12px; letter-spacing: .1em; color: var(--ink-2);
}
@media (prefers-reduced-motion: reduce) {
  .overlay-links a { transition: none; opacity: 1; transform: none; }
}
```

- [ ] **Step 5: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 6: Commit**

```bash
git add lib/nav.ts components/TopBar.tsx components/OverlayMenu.tsx app/globals.css
git commit -m "feat(redesign): nav links + TopBar + full-screen OverlayMenu

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 5: `Hero01` + CSS

**Files:**
- Create: `components/Hero01.tsx`
- Modify: `app/globals.css` (append Hero01 block)

**Interfaces:**
- Consumes: `siteData.hero` (`nameLines: string[]`, `kicker`, `role: {pre,accent,post}`, `lede`).
- Produces: `<Hero01 />` (server component). Renders `id="top"` anchor target.

- [ ] **Step 1: Write the component**

```tsx
// components/Hero01.tsx
import { siteData } from '@/lib/content'

export default function Hero01() {
  const { nameLines, role, kicker } = siteData.hero
  return (
    <section className="h01" id="top">
      <div className="h01-meta">
        <span>{kicker}</span>
      </div>
      <h1 className="h01-name">
        {nameLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <div className="h01-rule" />
      <div className="h01-sub">
        <span>
          {role.pre}
          {role.accent}
          {role.post}
        </span>
        <span className="h01-hint">Scroll ↓</span>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   01 HERO
   ============================================================ */
.h01 {
  min-height: 100vh; display: flex; flex-direction: column; justify-content: flex-end;
  padding: 0 var(--gut) 48px; position: relative;
}
.h01-meta {
  position: absolute; top: 88px; right: var(--gut); text-align: right;
  display: flex; flex-direction: column; gap: 4px;
  font-family: var(--font-sans); font-size: 13px; line-height: 1.7; color: var(--ink-2);
}
.h01-name {
  font-family: var(--font-sans); font-weight: 600;
  font-size: clamp(56px, 11vw, 160px); line-height: .95; letter-spacing: -.02em;
}
.h01-name span { display: block; }
.h01-rule { height: 1px; background: var(--line); margin: 28px 0 16px; }
.h01-sub {
  display: flex; justify-content: space-between; align-items: center; gap: 24px;
  font-family: var(--font-sans); font-size: 13px; color: var(--ink-2); letter-spacing: .04em;
}
.h01-hint { font-size: 11px; letter-spacing: .2em; text-transform: uppercase; white-space: nowrap; }
@media (max-width: 700px) { .h01-meta { position: static; text-align: left; margin: 96px 0 auto; } }
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/Hero01.tsx app/globals.css
git commit -m "feat(redesign): Hero01 full-viewport hero

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 6: `Manifesto02` + CSS

**Files:**
- Create: `components/Manifesto02.tsx`
- Modify: `app/globals.css` (append Manifesto block)

**Interfaces:**
- Consumes: `siteData.about` (`paras: string[]` — HTML strings; `portrait`, `portraitBlur`), `siteData.proof` (`stats`? — NOTE proof.json has no `stats`; use `siteData.hero.stats` which is `{n, plus, label}[]`), `WordReveal` (Task 2).
- Produces: `<Manifesto02 />` (server component), anchor `id="about"`.

Note: `about.paras[0]` contains HTML (`<span class="mark">`). Statement uses plain text via `WordReveal` (strip tags); bio paragraphs render the raw HTML via `dangerouslySetInnerHTML` (existing pattern — the old AboutSection did this). Stats come from `siteData.hero.stats`.

- [ ] **Step 1: Write the component**

```tsx
// components/Manifesto02.tsx
import Image from 'next/image'
import { siteData } from '@/lib/content'
import WordReveal from '@/components/WordReveal'

const stripTags = (s: string) => s.replace(/<[^>]+>/g, '')

export default function Manifesto02() {
  const { about, hero } = siteData
  const statement = stripTags(about.paras[0])
  return (
    <section className="m02 wrap" id="about">
      <div className="kicker">About</div>
      <WordReveal as="blockquote" className="m02-statement" text={statement} />
      <div className="m02-cols">
        <div className="m02-photo" data-reveal>
          <Image
            src={about.portrait}
            alt="Tri Muhammad Jidan"
            fill
            sizes="(max-width: 700px) 100vw, 320px"
            style={{ objectFit: 'cover' }}
            placeholder={about.portraitBlur ? 'blur' : 'empty'}
            blurDataURL={about.portraitBlur}
          />
        </div>
        <div className="m02-bio">
          {about.paras.slice(1).map((p, i) => (
            <p key={i} data-reveal dangerouslySetInnerHTML={{ __html: p }} />
          ))}
          <div className="m02-stats" data-reveal>
            {hero.stats.map((s) => (
              <div className="m02-stat" key={s.label}>
                <span className="m02-num">
                  {s.n}
                  {s.plus}
                </span>
                <span className="m02-lbl">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   02 MANIFESTO
   ============================================================ */
.m02 { padding-block: clamp(96px, 12vw, 160px); }
.m02-statement {
  font-family: var(--font-sans); font-weight: 500;
  font-size: clamp(28px, 4.2vw, 56px); line-height: 1.25; letter-spacing: -.01em;
  max-width: 22ch; margin: 28px 0 80px;
}
.m02-cols { display: grid; grid-template-columns: 320px 1fr; gap: 64px; align-items: start; }
.m02-photo { position: relative; aspect-ratio: 3/4; border: 1px solid var(--line); overflow: hidden; }
.m02-bio p { font-size: clamp(16px, 1.9vw, 19px); line-height: 1.8; color: var(--ink-2); margin-bottom: 32px; }
.m02-bio p .mark { color: var(--ink); font-weight: 600; }
.m02-stats { border-top: 1px solid var(--line); }
.m02-stat {
  display: flex; justify-content: space-between; align-items: baseline;
  padding: 18px 0; border-bottom: 1px solid var(--line);
}
.m02-num { font-family: var(--font-sans); font-size: 32px; font-weight: 600; }
.m02-lbl { font-family: var(--font-sans); font-size: 12px; letter-spacing: .15em; text-transform: uppercase; color: var(--ink-2); }
@media (max-width: 700px) { .m02-cols { grid-template-columns: 1fr; gap: 40px; } }
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/Manifesto02.tsx app/globals.css
git commit -m "feat(redesign): Manifesto02 statement + bio + stats

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 7: `WorkSlider03` + CSS

**Files:**
- Create: `components/WorkSlider03.tsx`
- Modify: `app/globals.css` (append WorkSlider block)

**Interfaces:**
- Consumes: `siteData.work.events` (`{event, cover, title, year, ...}[]`), `img(key)`, `blur(key)`, `usePortfolio().openLightbox(event)` (from `PortfolioChrome`).
- Produces: `<WorkSlider03 />` (client), anchor `id="work"`.

- [ ] **Step 1: Write the component**

```tsx
// components/WorkSlider03.tsx
'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { siteData, img, blur } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

const AUTO_MS = 5000

export default function WorkSlider03() {
  const events = siteData.work.events
  const { openLightbox } = usePortfolio()
  const [i, setI] = useState(0)
  const hover = useRef(false)

  const go = (d: number) => setI((p) => (p + d + events.length) % events.length)

  useEffect(() => {
    if (events.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => {
      if (!hover.current) setI((p) => (p + 1) % events.length)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [events.length])

  if (events.length === 0) return null
  const cur = events[i]

  return (
    <section className="w03" id="work">
      <div className="wrap">
        <div className="kicker">Selected Work</div>
      </div>
      <div
        className="w03-frame"
        onMouseEnter={() => (hover.current = true)}
        onMouseLeave={() => (hover.current = false)}
        onClick={() => openLightbox(cur.event)}
        role="button"
        tabIndex={0}
        aria-label={`Open ${cur.title} gallery`}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') openLightbox(cur.event)
        }}
      >
        {events.map((ev, idx) => (
          <div key={ev.event} className={`w03-slide${idx === i ? ' on' : ''}`} aria-hidden={idx !== i}>
            <Image
              src={img(ev.cover)}
              alt={ev.title}
              fill
              sizes="70vw"
              style={{ objectFit: 'cover' }}
              placeholder={blur(ev.cover) ? 'blur' : 'empty'}
              blurDataURL={blur(ev.cover)}
              priority={idx === 0}
            />
          </div>
        ))}
      </div>
      <div className="wrap w03-cap">
        <div>
          <span className="w03-name">{cur.title}</span>
          <span className="w03-year"> — {cur.year}</span>
        </div>
        {events.length > 1 && (
          <div className="w03-nav">
            <button aria-label="Previous" onClick={() => go(-1)}>
              ←
            </button>
            <button aria-label="Next" onClick={() => go(1)}>
              →
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   03 WORK SLIDER
   ============================================================ */
.w03 { padding-block: clamp(72px, 9vw, 120px); }
.w03 .kicker { margin-bottom: 40px; }
.w03-frame {
  width: 70vw; max-width: 1100px; margin: 0 auto; position: relative;
  aspect-ratio: 16/10; border: 1px solid var(--line); overflow: hidden;
  background: var(--bg-2); cursor: pointer;
}
.w03-slide { position: absolute; inset: 0; opacity: 0; transition: opacity 1s var(--ease); }
.w03-slide.on { opacity: 1; }
.w03-cap {
  width: 70vw; max-width: 1100px; margin: 20px auto 0;
  display: flex; justify-content: space-between; align-items: center; padding-inline: 0;
}
.w03-name { font-family: var(--font-sans); font-size: 15px; color: var(--ink); }
.w03-year { font-family: var(--font-sans); font-size: 13px; color: var(--ink-2); }
.w03-nav { display: flex; gap: 8px; }
.w03-nav button {
  width: 40px; height: 40px; background: none; border: 1px solid var(--line);
  color: var(--ink); cursor: pointer; font-size: 16px;
  transition: border-color .25s var(--ease);
}
.w03-nav button:hover { border-color: var(--ink); }
@media (prefers-reduced-motion: reduce) { .w03-slide { transition: none; } }
@media (max-width: 700px) { .w03-frame, .w03-cap { width: 100%; } }
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/WorkSlider03.tsx app/globals.css
git commit -m "feat(redesign): WorkSlider03 big auto-crossfade slider → lightbox

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 8: `capabilities.ts` group map + self-check

**Files:**
- Create: `lib/capabilities.ts`
- Create: `scripts/check-capabilities.mjs`

**Interfaces:**
- Consumes: `siteData.skills.roleTags` (`string[]`), `siteData.experience.items`.
- Produces: `CAP_GROUPS: { title: string; roles: string[]; experience: string[] }[]` — 3 groups, roles chosen from roleTags, experience labels chosen from experience.items titles.

- [ ] **Step 1: Write the group map**

```ts
// lib/capabilities.ts
// Manual 3-group split of skills.roleTags for the Capabilities accordion.
// skills.json has no `groups`; this file is the single source for that grouping.
import { siteData } from '@/lib/content'

const roles = siteData.skills.roleTags
const has = (needle: string) => roles.find((r) => r.toLowerCase().includes(needle.toLowerCase()))

export interface CapGroup {
  title: string
  roles: string[]
  experience: string[]
}

// dedupe: one tag can match two needles (e.g. "CG / Graphics Operator"
// matches both 'CG' and 'Graphics') → Set collapses the repeat.
const pick = (...needles: string[]) =>
  [...new Set(needles.map((n) => has(n)).filter((x): x is string => Boolean(x)))]

const expTitles = siteData.experience.items.map((e) => `${e.role} — ${e.org}`)

export const CAP_GROUPS: CapGroup[] = [
  {
    title: 'Switching & Graphics',
    roles: pick('vMix', 'CG', 'Graphics', 'Replay'),
    experience: expTitles.slice(0, 2),
  },
  {
    title: 'Audio & Encoding',
    roles: pick('Audio', 'Encoder'),
    experience: expTitles.slice(1, 3),
  },
  {
    title: 'Observing & Ops',
    roles: pick('Observer', 'League', 'Technical Support', 'Consultant'),
    experience: expTitles.slice(0, 1),
  },
]
```

- [ ] **Step 2: Write the self-check**

```js
// scripts/check-capabilities.mjs
import assert from 'node:assert'
import { CAP_GROUPS } from '../lib/capabilities.ts'

assert.equal(CAP_GROUPS.length, 3)
for (const g of CAP_GROUPS) {
  assert.ok(g.title.length > 0, 'group has title')
  assert.ok(Array.isArray(g.roles), 'roles is array')
  assert.ok(Array.isArray(g.experience), 'experience is array')
}
// at least the first group must have surfaced some roles
assert.ok(CAP_GROUPS[0].roles.length > 0, 'first group has roles')
// no duplicate role within a group (guards the CG/Graphics double-match)
for (const g of CAP_GROUPS) {
  assert.equal(new Set(g.roles).size, g.roles.length, `no dup roles in ${g.title}`)
}
console.log('capabilities OK')
```

- [ ] **Step 3: Run the self-check**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && node --experimental-strip-types scripts/check-capabilities.mjs`
Expected: prints `capabilities OK`. If TS import fails on this Node, temporarily replace the import with a copy of the roleTags array to validate the split logic, then revert.

- [ ] **Step 4: Commit**

```bash
git add lib/capabilities.ts scripts/check-capabilities.mjs
git commit -m "feat(redesign): capabilities group map from roleTags

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 9: `Capabilities04` accordion + CSS

**Files:**
- Create: `components/Capabilities04.tsx`
- Modify: `app/globals.css` (append Capabilities block)

**Interfaces:**
- Consumes: `CAP_GROUPS` (Task 8), `siteData.skills.heading`.
- Produces: `<Capabilities04 />` (client), anchor `id="capabilities"`.

- [ ] **Step 1: Write the component**

```tsx
// components/Capabilities04.tsx
'use client'

import { useState } from 'react'
import { CAP_GROUPS } from '@/lib/capabilities'

export default function Capabilities04() {
  const [open, setOpen] = useState(0)
  if (CAP_GROUPS.length === 0) return null
  return (
    <section className="c04 wrap" id="capabilities">
      <div className="kicker">Capabilities</div>
      <div className="c04-acc">
        {CAP_GROUPS.map((g, idx) => (
          <div key={g.title} className={`c04-item${idx === open ? ' open' : ''}`}>
            <button
              className="c04-head"
              aria-expanded={idx === open}
              onClick={() => setOpen(idx === open ? -1 : idx)}
            >
              <span>{g.title}</span>
              <span className="c04-pm">+</span>
            </button>
            <div className="c04-body">
              <div className="c04-inner">
                <div className="c04-pad">
                  <div>
                    <h4>Roles</h4>
                    <ul>
                      {g.roles.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4>Experience</h4>
                    <ul>
                      {g.experience.map((e) => (
                        <li key={e}>{e}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   04 CAPABILITIES ACCORDION
   ============================================================ */
.c04 { padding-block: clamp(72px, 9vw, 120px); }
.c04-acc { border-top: 1px solid var(--line); margin-top: 40px; }
.c04-item { border-bottom: 1px solid var(--line); }
.c04-head {
  width: 100%; background: none; border: 0; color: var(--ink); cursor: pointer; text-align: left;
  display: flex; justify-content: space-between; align-items: center; padding: 28px 0;
  font-family: var(--font-sans); font-weight: 500; font-size: clamp(20px, 2.6vw, 32px);
}
.c04-pm { color: var(--ink-2); font-size: 24px; transition: transform .3s var(--ease); }
.c04-item.open .c04-pm { transform: rotate(45deg); }
.c04-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .45s var(--ease); }
.c04-item.open .c04-body { grid-template-rows: 1fr; }
.c04-inner { overflow: hidden; }
.c04-pad { padding: 0 0 32px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
.c04-pad h4 { font-family: var(--font-sans); font-size: 11px; letter-spacing: .2em; text-transform: uppercase; color: var(--ink-2); margin-bottom: 14px; }
.c04-pad ul { list-style: none; }
.c04-pad li { padding: 8px 0; border-bottom: 1px solid var(--line); font-size: 14px; color: var(--ink-2); }
.c04-pad li:last-child { border-bottom: 0; }
@media (prefers-reduced-motion: reduce) { .c04-body { transition: none; } }
@media (max-width: 700px) { .c04-pad { grid-template-columns: 1fr; } }
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/Capabilities04.tsx app/globals.css
git commit -m "feat(redesign): Capabilities04 accordion

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 10: `Freelance05` + CSS

**Files:**
- Create: `components/Freelance05.tsx`
- Modify: `app/globals.css` (append Freelance block)

**Interfaces:**
- Consumes: `siteData.freelance` (`clients: {event, cover, name}[]`, `testimonial: {quote, stars, cite}[]` — array of 3, feature `[0]`), `siteData.ledger` (`rows: {idx, title, meta}[]`), `img`, `blur`, `usePortfolio().openLightbox`.
- Produces: `<Freelance05 />` (client — needs openLightbox), anchor `id="freelance"`.

- [ ] **Step 1: Write the component**

```tsx
// components/Freelance05.tsx
'use client'

import Image from 'next/image'
import { siteData, img, blur } from '@/lib/content'
import { usePortfolio } from '@/components/PortfolioChrome'

export default function Freelance05() {
  const { freelance, ledger } = siteData
  const { openLightbox } = usePortfolio()
  // freelance.testimonial is an array of 3 {quote, stars, cite}; feature the first.
  const t = freelance.testimonial[0]
  return (
    <section className="f05 wrap" id="freelance">
      <div className="kicker">Freelance</div>
      <div className="f05-grid">
        {freelance.clients.map((c) => (
          <button
            key={c.event}
            className="f05-card"
            data-reveal
            onClick={() => openLightbox(c.event)}
            aria-label={`Open ${c.name} gallery`}
          >
            <Image
              src={img(c.cover)}
              alt={c.name}
              fill
              sizes="(max-width: 700px) 100vw, 50vw"
              style={{ objectFit: 'cover' }}
              placeholder={blur(c.cover) ? 'blur' : 'empty'}
              blurDataURL={blur(c.cover)}
            />
            <span className="f05-card-name">{c.name}</span>
          </button>
        ))}
      </div>
      {t && (
        <blockquote className="f05-quote" data-reveal>
          {t.quote}
          <small>
            {t.stars} · {t.cite}
          </small>
        </blockquote>
      )}
      <div className="f05-ledger" data-reveal>
        {ledger.rows.map((r) => (
          <div className="f05-row" key={r.idx}>
            <span className="f05-y">{r.idx}</span>
            <span>{r.title}</span>
            <span className="f05-meta">{r.meta}</span>
          </div>
        ))}
      </div>
    </section>
  )
}
```

Note: verify `testimonial.cite` exists in freelance.json; if the field is named differently (e.g. `author`), use that key. (freelance.json testimonial keys confirmed: `quote`, `stars`, `cite`.)

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   05 FREELANCE
   ============================================================ */
.f05 { padding-block: clamp(72px, 9vw, 120px); }
.f05 .kicker { margin-bottom: 40px; }
.f05-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 80px; }
.f05-card {
  position: relative; aspect-ratio: 4/3; border: 1px solid var(--line); overflow: hidden;
  background: var(--bg-2); cursor: pointer; padding: 0; display: block; text-align: left;
}
.f05-card-name {
  position: absolute; left: 0; right: 0; bottom: 0; z-index: 2; padding: 16px 20px;
  font-family: var(--font-sans); font-size: 13px; letter-spacing: .04em; color: var(--ink);
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg) 82%, transparent));
}
.f05-quote {
  font-family: var(--font-sans); font-weight: 500; font-size: clamp(22px, 3vw, 36px);
  line-height: 1.4; max-width: 34ch; margin: 0 auto 80px; text-align: center; color: var(--ink);
}
.f05-quote small { display: block; margin-top: 20px; font-size: 12px; color: var(--ink-2); letter-spacing: .1em; }
.f05-ledger { border-top: 1px solid var(--line); }
.f05-row {
  display: grid; grid-template-columns: 44px 1fr auto; gap: 24px; align-items: baseline;
  padding: 16px 0; border-bottom: 1px solid var(--line); font-family: var(--font-sans); font-size: 14px;
}
.f05-y { color: var(--ink-3); }
.f05-meta { color: var(--ink-2); font-size: 12px; letter-spacing: .03em; text-align: right; }
@media (max-width: 700px) {
  .f05-grid { grid-template-columns: 1fr; }
  .f05-row { grid-template-columns: 36px 1fr; }
  .f05-meta { display: none; }
}
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/Freelance05.tsx app/globals.css
git commit -m "feat(redesign): Freelance05 cards + testimonial + ledger

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 11: `Showreel06` cover slideshow + CSS

**Files:**
- Create: `components/Showreel06.tsx`
- Modify: `app/globals.css` (append Showreel block)

**Interfaces:**
- Consumes: `siteData.work.events` + `siteData.freelance.clients` covers, `siteData.showreel` (`kicker`, `heading`, `label`), `img`, `blur`.
- Produces: `<Showreel06 />` (client), anchor `id="showreel"`.

- [ ] **Step 1: Write the component**

```tsx
// components/Showreel06.tsx
'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { siteData, img, blur } from '@/lib/content'

const AUTO_MS = 4000

export default function Showreel06() {
  const covers = [
    ...siteData.work.events.map((e) => ({ key: e.cover, title: e.title })),
    ...siteData.freelance.clients.map((c) => ({ key: c.cover, title: c.name })),
  ]
  const [i, setI] = useState(0)

  useEffect(() => {
    if (covers.length < 2) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const id = setInterval(() => setI((p) => (p + 1) % covers.length), AUTO_MS)
    return () => clearInterval(id)
  }, [covers.length])

  if (covers.length === 0) return null

  return (
    <section className="s06 wrap" id="showreel">
      <div className="kicker">Showreel</div>
      <div className="s06-frame">
        {covers.map((c, idx) => (
          <div key={c.key + idx} className={`s06-slide${idx === i ? ' on' : ''}`} aria-hidden={idx !== i}>
            <Image
              src={img(c.key)}
              alt={c.title}
              fill
              sizes="100vw"
              style={{ objectFit: 'cover' }}
              placeholder={blur(c.key) ? 'blur' : 'empty'}
              blurDataURL={blur(c.key)}
            />
          </div>
        ))}
        <div className="s06-cap">{covers[i].title}</div>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   06 SHOWREEL
   ============================================================ */
.s06 { padding-block: clamp(72px, 9vw, 120px); }
.s06 .kicker { margin-bottom: 40px; }
.s06-frame {
  position: relative; aspect-ratio: 16/9; border: 1px solid var(--line);
  overflow: hidden; background: var(--bg-2);
}
.s06-slide { position: absolute; inset: 0; opacity: 0; transition: opacity .7s var(--ease); }
.s06-slide.on { opacity: 1; }
.s06-cap {
  position: absolute; left: 0; bottom: 0; z-index: 3; padding: 18px 24px;
  font-family: var(--font-sans); font-size: 13px; letter-spacing: .04em; color: var(--ink);
  background: linear-gradient(180deg, transparent, color-mix(in srgb, var(--bg) 80%, transparent));
}
@media (prefers-reduced-motion: reduce) { .s06-slide { transition: none; } }
```

- [ ] **Step 3: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 4: Commit**

```bash
git add components/Showreel06.tsx app/globals.css
git commit -m "feat(redesign): Showreel06 cover slideshow

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 12: `Contact07` + `SiteFooter` + CSS

**Files:**
- Create: `components/Contact07.tsx`
- Create: `components/SiteFooter.tsx`
- Modify: `app/globals.css` (append Contact + Footer block)

**Interfaces:**
- Consumes: `siteData.contact` (`heading: string[]`, `links: {type,lbl,val,href}[]`), `siteData.footer` (`{left, right}`), `NAV_LINKS` (Task 4), `WordReveal`.
- Produces: `<Contact07 />` (server), anchor `id="contact"`; `<SiteFooter />` (server).

- [ ] **Step 1: Write `Contact07`**

```tsx
// components/Contact07.tsx
import { siteData } from '@/lib/content'
import WordReveal from '@/components/WordReveal'

export default function Contact07() {
  const { contact } = siteData
  const email = contact.links.find((l) => l.type === 'email')
  const socials = contact.links.filter((l) => l.type !== 'email')
  return (
    <section className="ct07 wrap" id="contact">
      <div className="kicker">Contact</div>
      <WordReveal as="h2" className="ct07-h" text={contact.heading.join(' ')} />
      {email && (
        <a className="ct07-mail" href={email.href}>
          {email.val}
        </a>
      )}
      <div className="ct07-social">
        {socials.map((s) => (
          <a key={s.href} href={s.href} target="_blank" rel="noopener noreferrer">
            {s.lbl}
          </a>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Write `SiteFooter`**

```tsx
// components/SiteFooter.tsx
import { siteData } from '@/lib/content'
import { NAV_LINKS } from '@/lib/nav'

export default function SiteFooter() {
  const { footer } = siteData
  return (
    <footer className="sf">
      <div className="sf-wm" aria-hidden="true">
        JIDAN
      </div>
      <div className="sf-bar wrap">
        <span>{footer.left}</span>
        <span className="sf-nav">{NAV_LINKS.map((n) => n.label).join(' · ')}</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 3: Append the CSS**

Append to `app/globals.css`:

```css
/* ============================================================
   07 CONTACT
   ============================================================ */
.ct07 { padding-block: clamp(96px, 12vw, 160px); }
.ct07-h {
  font-family: var(--font-sans); font-weight: 600; font-size: clamp(40px, 7vw, 96px);
  line-height: 1.05; letter-spacing: -.02em; max-width: 16ch; margin: 24px 0 48px;
}
.ct07-mail {
  font-family: var(--font-sans); font-size: clamp(20px, 3vw, 32px); color: var(--ink);
  border-bottom: 1px solid var(--line); padding-bottom: 6px;
  transition: border-color .25s var(--ease);
}
.ct07-mail:hover { border-color: var(--ink); }
.ct07-social {
  margin-top: 56px; border-top: 1px solid var(--line); padding-top: 20px;
  display: flex; gap: 40px; flex-wrap: wrap;
}
.ct07-social a {
  font-family: var(--font-sans); font-size: 13px; letter-spacing: .12em; text-transform: uppercase;
  color: var(--ink-2); transition: color .25s var(--ease);
}
.ct07-social a:hover { color: var(--ink); }

/* ============================================================
   SITE FOOTER
   ============================================================ */
.sf { padding: 120px 0 32px; border-top: 1px solid var(--line); overflow: hidden; }
.sf-wm {
  font-family: var(--font-sans); font-weight: 700; font-size: clamp(80px, 18vw, 260px);
  line-height: .9; letter-spacing: -.03em; white-space: nowrap; user-select: none;
  color: transparent; -webkit-text-stroke: 1px var(--line); text-align: center;
}
.sf-bar {
  display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap; margin-top: 48px;
  font-family: var(--font-sans); font-size: 12px; color: var(--ink-2); letter-spacing: .1em;
}
```

- [ ] **Step 4: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add components/Contact07.tsx components/SiteFooter.tsx app/globals.css
git commit -m "feat(redesign): Contact07 + SiteFooter

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 13: Rewire `app/page.tsx`

**Files:**
- Modify: `app/page.tsx` (full rewrite of the composition)

**Interfaces:**
- Consumes: all new section components + `WordIntro`, `TopBar`, `SiteFooter`, existing `SmoothScrollProvider`, `PortfolioChrome`.

- [ ] **Step 1: Rewrite the file**

```tsx
// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import PortfolioChrome from '@/components/PortfolioChrome'
import WordIntro from '@/components/WordIntro'
import TopBar from '@/components/TopBar'
import Hero01 from '@/components/Hero01'
import Manifesto02 from '@/components/Manifesto02'
import WorkSlider03 from '@/components/WorkSlider03'
import Capabilities04 from '@/components/Capabilities04'
import Freelance05 from '@/components/Freelance05'
import Showreel06 from '@/components/Showreel06'
import Contact07 from '@/components/Contact07'
import SiteFooter from '@/components/SiteFooter'

export default function Home() {
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) setIntroDone(true)
  }, [])

  return (
    <>
      {!introDone && <WordIntro onDone={() => setIntroDone(true)} />}
      <SmoothScrollProvider>
        <PortfolioChrome>
          <TopBar />
          <main id="main-content">
            <Hero01 />
            <Manifesto02 />
            <WorkSlider03 />
            <Capabilities04 />
            <Freelance05 />
            <Showreel06 />
            <Contact07 />
          </main>
          <SiteFooter />
        </PortfolioChrome>
      </SmoothScrollProvider>
    </>
  )
}
```

- [ ] **Step 2: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes. If any removed component is still imported elsewhere, the build fails here — that is expected; it is fixed in Task 14.

- [ ] **Step 3: Commit**

```bash
git add app/page.tsx
git commit -m "feat(redesign): rewire page to 7-section layout

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 14: Delete dead components + prune CSS

**Files:**
- Delete: `components/HeroSection.tsx`, `Timecode.tsx`, `AboutSection.tsx`, `SkillsSection.tsx`, `ExperienceSection.tsx`, `ProofStrip.tsx`, `WorkSection.tsx`, `FreelanceSection.tsx`, `LedgerSection.tsx`, `ContactSection.tsx`, `ShowreelSection.tsx`, `Nav.tsx`, `NameIntro.tsx`, `Footer.tsx`, `GraphicsSection.tsx` (only those that exist)
- Modify: `app/globals.css` (delete dead style blocks)

- [ ] **Step 1: Confirm nothing imports the doomed files**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && grep -rlE "HeroSection|Timecode|AboutSection|SkillsSection|ExperienceSection|ProofStrip|WorkSection|FreelanceSection|LedgerSection|ContactSection|ShowreelSection|GraphicsSection|components/Nav|NameIntro|components/Footer" app components lib`
Expected: no matches (only the files themselves, which we delete). If a match remains in a file we keep, fix that import first.

- [ ] **Step 2: Delete the files**

```bash
git rm components/HeroSection.tsx components/Timecode.tsx components/AboutSection.tsx \
  components/SkillsSection.tsx components/ExperienceSection.tsx components/ProofStrip.tsx \
  components/WorkSection.tsx components/FreelanceSection.tsx components/LedgerSection.tsx \
  components/ContactSection.tsx components/ShowreelSection.tsx components/Nav.tsx \
  components/NameIntro.tsx components/Footer.tsx
# if present:
git rm components/GraphicsSection.tsx 2>/dev/null || true
```

- [ ] **Step 3: Prune dead CSS**

In `app/globals.css`, delete these now-unused blocks (identified by their banner comments): `NAV`, `NAME INTRO`, `HERO — VISION MIXER STRIP` (all `.vmix*`, `.bus*`, `.cam*`, `.tc`, `.ticker*`, `.metric*`), `ABOUT` (`.about-*`, `.interest-*`, `.chips`, `.chip`), `SKILLS / TOOLS` (`.cols`, `.tool*`, `.meter*`, `.role-tags`), `EXPERIENCE TIMELINE` (`.timeline`, `.tl-*`), `GALLERY` (`.filters`, `.filter*`, `.gallery`, `.ev*`), `SHOWREEL` (old `.showreel-*`), `SKILLS GRAPHICS` (`.skills-graphics*`), `PROOF STRIP` (`.proof-*`), `FREELANCE / UPWORK` (`.fl*`, `.up-stats`, `.test-*`), `FULL EVENT LIST` (`.ledger*`), `CONTACT` (old `.contact*`, `.clink*`, `.cform*`, `.cfield*`), old `.foot*` footer, `INFINITE MARQUEE TICKER` (`.marquee*`), `WORK SECTION — PINNED LAYOUT` (`.work-pinned*`, `.work-pin*`).

Keep: `:root`, base resets, `.wrap`, `.kicker`, `.btn*` (if still referenced — check; else remove), LIGHTBOX, SCROLL REVEAL, cursor glow, Lenis, selection/scrollbar, focus, skip-link, grain overlay, reveal keyframes, and all new blocks (WORD REVEAL, WORD INTRO, TOPBAR, 01–07, SITE FOOTER).

After editing, verify no kept rule references a deleted class.

- [ ] **Step 4: Build gate**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "refactor(redesign): delete old sections + prune dead CSS

Co-Authored-By: Claude <noreply@anthropic.com>"
```

---

## Task 15: Verify + update docs

**Files:**
- Modify: `CLAUDE.md`, `docs/architecture.md` (reflect new 7-section layout)
- Delete: `preview-layout.html` (mockup no longer needed)

- [ ] **Step 1: Manual Playwright verification**

Start dev server if not running (`export PATH="$PATH:/c/Program Files/nodejs" && npm run dev`), then via Playwright:
- Navigate to `http://localhost:3000`.
- `page.evaluate` reads `getComputedStyle(document.documentElement)` — assert `--bg` is `#0A0A0A`/`rgb(10,10,10)`, `--live` and `--amber` empty.
- Assert 7 section ids present in order: `top, about, work, capabilities, freelance, showreel, contact` (query `document.querySelectorAll('section[id]')`).
- Click the work slider → assert `.lightbox.open` appears; Esc closes it.
- Click a `.f05-card` → assert lightbox opens.
- Open `.topbar-menu` → assert `.overlay-menu.open`; press Esc → closes.
- Emulate reduced-motion (`page.emulateMedia({ reducedMotion: 'reduce' })`), reload → assert `.word-intro` absent (intro skipped).

Record pass/fail for each; fix any failure before continuing.

- [ ] **Step 2: Update `CLAUDE.md`**

Replace the "Broadcast Brutalism" / Signal Dark description and the section/component map with the Signal Minimal 7-section layout: sections Hero01 · Manifesto02 · WorkSlider03 · Capabilities04 · Freelance05 · Showreel06 · Contact07 + SiteFooter; nav = TopBar + OverlayMenu; intro = WordIntro; motion = CSS + IntersectionObserver (no GSAP). Keep it under ~40 lines.

- [ ] **Step 3: Update `docs/architecture.md`**

Update the component/section map to match the new files. Remove references to deleted components.

- [ ] **Step 4: Delete the preview mockup**

```bash
git rm preview-layout.html
```

- [ ] **Step 5: Build gate + commit**

Run: `export PATH="$PATH:/c/Program Files/nodejs" && npm run build`
Expected: passes.

```bash
git add -A
git commit -m "docs(redesign): update CLAUDE.md + architecture; verify; drop mockup

Co-Authored-By: Claude <noreply@anthropic.com>"
```

- [ ] **Step 6: Finish the branch**

Use superpowers:finishing-a-development-branch to verify build, present merge options, and (with Jidan's confirmation — `main` auto-deploys production) merge or PR.

---

## Self-Review

**Spec coverage:**
- §3 sections 01–07 → Tasks 5,6,7,9,10,11,12. ✓
- WordIntro §5 → Task 3. ✓
- WordReveal §6 → Task 2 (+ helper Task 1). ✓
- Navigation §4 (TopBar + OverlayMenu, Esc, focus, anchor scroll) → Task 4. ✓
- Capabilities from roleTags (spec-corrected) → Tasks 8, 9. ✓
- Showreel cover slideshow (spec-corrected) → Task 11. ✓
- Removed components / pruned CSS §3, §8 → Task 14. ✓
- Docs update §8 → Task 15. ✓
- Testing §10 (build gate + Playwright) → every task's build gate + Task 15. ✓
- Non-goals §11 (content frozen, no GSAP, no serif) → Global Constraints. ✓

**Placeholder scan:** No TBD/TODO; every code step shows full code. One residual risk noted inline: `testimonial.cite` key name — confirmed present in freelance.json, noted in Task 10.

**Type consistency:** `openLightbox(event: string)` used identically in Tasks 7, 10 (matches `PortfolioChrome`). `CAP_GROUPS` shape defined Task 8, consumed Task 9. `splitWords` signature Task 1 → used Task 2. `WordReveal` props (`text`, `as`, `className`) defined Task 2 → used Tasks 6, 12. `NAV_LINKS` defined Task 4 → consumed by OverlayMenu (Task 4) + SiteFooter (Task 12); its 6 hrefs are the section anchor ids by construction. `freelance.testimonial` is an array of 3 — Task 10 features `[0]`.

**Data-shape audit (against real content JSON):** `siteData.nav` (general.json) is deliberately NOT used — its hrefs point at removed `#skills`/`#graphics` and omit `#capabilities`; content is frozen, so `NAV_LINKS` in `lib/nav.ts` owns the 6 anchors (Task 4). `freelance.testimonial` is an array (Task 10 uses `[0]`, not the whole value). `pick()` in Task 8 dedupes via `Set` because `"CG / Graphics Operator"` matches both `'CG'` and `'Graphics'`; a self-check assertion guards the regression. Hero01 (Task 5) renders only real `hero` fields — the invented "Jakarta, Indonesia" / "Open for work" meta was removed (hero.json has no location/availability field).
