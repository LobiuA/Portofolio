# Handoff — latest session snapshot

> **Temporary.** Overwrite at the end of every session. Keep to one screen. First thing the next chat reads. Resume order: `CLAUDE.md` (imports `@AGENTS.md`) → this file → `docs/tasks.md`.

**Date:** 2026-06-15

## Project Overview
Personal broadcast portfolio site for Tri Muhammad Jidan ("Broadcast & Livestream Operator"). Single scrolling page, content-driven. **Location:** `C:\Users\Desktop\portfolio-jidan\`. Not a git repo, not deployed yet.

## Current Architecture (redesigned — was re-ported since the last handoff)
- **Stack:** Next.js 16.2.9 (App Router, Turbopack) + React 19 + TypeScript + Tailwind CSS v4 (imported only) + Lenis + GSAP (ticker only). `framer-motion` is installed but **unused**.
- **Sections (order in `app/page.tsx`):** Nav · Hero · About · Skills · Experience · Work · Freelance · Ledger · Contact · Footer.
- **Tree:** `SmoothScrollProvider` (Lenis) > `PortfolioChrome` (theme/accent/lightbox context + IntersectionObserver reveal + cursor glow) > Nav + `<main>` sections + Footer.
- **Content:** all copy/data/images in `lib/content.ts` (`siteData`, `accents`, `galleryData`, `img()`).
- **Styling:** hand-written CSS in `app/globals.css` — `.block`/`.wrap`/etc. classes, `:root` tokens, `[data-theme="dark|light"]`, runtime-swappable `--accent`. **Not** Tailwind utilities, **no** `@theme`. Fonts: Space Grotesk / Hanken Grotesk / Space Mono.
- **Reveals:** `[data-reveal]` → `.in` toggled by IntersectionObserver in `PortfolioChrome` (CSS transitions; `[data-delay]` staggers). No GSAP ScrollTrigger in sections.

## Completed Features
- Full redesign built: themeable (dark/light + 5 accents, persisted to `localStorage`), sticky Nav, filterable Work gallery + Lightbox, Freelance/Upwork section, timeline, skill meters, ledger, contact.
- `prefers-reduced-motion` honoured in 3 places (PortfolioChrome reveal, SmoothScrollProvider Lenis skip, CSS guard).
- All images referenced in `lib/content.ts` exist in `public/work/`.

## Current Work In Progress
- None active. This session: (1) synced all docs to the redesigned reality; (2) **filled real contact links** (email/WhatsApp/Instagram/Upwork — all live); (3) **deleted dead code** (`framer-motion` dep, `useGsapReveal.ts`, `components/ui/`, `tailwind.config.ts`); (4) **pruned asset clutter** (64 raw PNGs + 5 starter SVGs — `public/` now holds only the 58 used JPGs). `npm run build` clean throughout.

## Pending Tasks
See `docs/tasks.md`. Headline items: `next/image` optimization pass on the galleries; then `git init` + Vercel deploy.

## Important Decisions
See `docs/decisions.md` (newest entries, 2026-06-15): look is hand-written CSS (supersedes the `@theme` ADR); UI state centralized in `PortfolioChrome`; reveal via IntersectionObserver not GSAP; dead code/deps removed (repo is now config-less for Tailwind — tokens in `:root`/`[data-theme]`).

## Known Bugs
- None open.
- Headless Chrome screenshots leave below-hero sections hidden (no scroll) — expected. Use a real browser for full-page view.

## Critical Files
- `app/page.tsx` (tree/order) · `app/layout.tsx` (fonts/metadata) · `app/globals.css` (the whole design) · `lib/content.ts` (all content) · `components/PortfolioChrome.tsx` (state + reveal) · `components/SmoothScrollProvider.tsx` (Lenis) · `CLAUDE.md` (+ `AGENTS.md`).

## Next Recommended Actions
1. `next/image` optimization pass on the galleries (currently plain `<img loading="lazy">`).
2. `git init` + first commit, then deploy to Vercel (mirror the VCT setup).

## Context Required For Continuation
- Node v24 at `C:\Program Files\nodejs\` (refresh PATH in new bash shells: `export PATH="$PATH:/c/Program Files/nodejs"`).
- `npm run dev` (port 3000). `npm run build` is the type/lint gate — currently **clean**.
- Verify visuals: `chrome --headless=new --disable-gpu --hide-scrollbars --window-size=1440,900 --virtual-time-budget=4000 --screenshot=out.png http://localhost:3000`.
- Next.js 16 / Tailwind v4 differ from training-data defaults — verify syntax against the installed packages.
