@AGENTS.md

# CLAUDE.md — Portfolio (Tri Muhammad Jidan)

> Loaded into **every** session. Keep under ~40 lines. Details live in `docs/`.
> ⚠️ The `@AGENTS.md` import above is mandatory: **Next.js 16 has breaking changes vs. training data** — check `node_modules/next/dist/docs/` before writing Next.js code.

## What this is
Premium, animation-heavy single-page broadcast/creative portfolio. **"Broadcast Brutalism" / Signal Dark** look (vMix/ATEM switcher vibe): hard borders, zero rounded corners on rectangles, tally-light colours (red `--live` ON AIR, amber `--amber` labels), condensed + mono type. Scroll-driven reveals, Lenis smooth scroll. Theme is **locked to Signal Dark** (no light mode, no accent picker).

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (imported, but the look is hand-written CSS — see below) · Lenis smooth scroll · GSAP (only to drive the Lenis ticker) · Vercel.
> Reveals run on a plain IntersectionObserver (in `PortfolioChrome`), not GSAP. No `framer-motion` (removed 2026-06-15).

## Commands
```bash
npm run dev     # next dev → http://localhost:3000
npm run build   # next build (also the type/lint gate)
npm run start   # serve production build
npm run lint    # eslint
```

## Where things live
- `app/` — App Router: `layout.tsx` (next/font: Barlow Condensed [display 700/900] + JetBrains Mono [mono+body 400/500/700]; metadata; `data-theme="dark"`; skip-link), `page.tsx` (section order), `globals.css` (the whole design — plain CSS classes + Signal Dark `:root` tokens).
- `lib/content.ts` — **all copy, data, image URLs** (`siteData`, `galleryData`, `img()`). Edit content here, not in components.
- `components/*Section.tsx` — one shell per section: Hero · About · Skills · Experience · Work · Freelance · Ledger · Contact. Rendered in order by `page.tsx`. Hero is the full-bleed "Vision Mixer Strip" (`HeroSection` server component + `Timecode` client island for the live 25fps timecode).
- `components/PortfolioChrome.tsx` — client context exposing only `openLightbox`; runs the IntersectionObserver scroll-reveal (`[data-reveal]` → `.in`), skill-meter fill (`.fill[data-w]`), cursor glow; renders the Lightbox. (Theme/accent picker removed.)
- `components/Nav.tsx` — sticky bus-bar header (links + “Hire me”).
- `components/Lightbox.tsx` — gallery modal driven by `galleryData`; opened via `usePortfolio().openLightbox(event)`.
- `components/SmoothScrollProvider.tsx` — single Lenis instance (disabled under reduced-motion). All scroll behaviour routes through here.
- `components/Footer.tsx`.
Full map: `docs/architecture.md`.
> No `tailwind.config.ts` — Tailwind v4 is config-less here; all design tokens live in `:root` in `globals.css` (Signal Dark only — no `[data-theme="light"]`). Key tokens: `--bg --ink --live --amber --line`; hero layout vars `--nav-h --cam-w --metrics-w --hero-shift`. Zero rounded corners on rectangles (dots keep `50%`); no box-shadows on containers (glows only on tally/badge indicators).

## Architecture principles
- Content/data lives **only** in `lib/content.ts`; section components are structural shells (never hardcode copy in JSX).
- One Lenis instance via `SmoothScrollProvider`; one client context (`PortfolioChrome`) owns lightbox state.
- **Styling is custom CSS in `app/globals.css`** (classes like `.block`, `.wrap`, `.nav`, `.vmix`, plus Signal Dark `:root` tokens). Tailwind v4 is imported but utilities/`@theme` are not used for the look — match the existing CSS, don't reach for Tailwind classes.
- Design spec + plan: `docs/superpowers/specs/2026-06-20-broadcast-brutalism-redesign-design.md` and `docs/superpowers/plans/`.

## Rules
- Respect `prefers-reduced-motion` (handled in PortfolioChrome + SmoothScrollProvider + a CSS guard); animate GPU-friendly transforms only.
- Run `npm run build` before declaring a change done.

## Context system (read when resuming)
`docs/context-recovery.md` → recover state, `/compact`, new chat. `docs/handoff.md` → latest snapshot.
`docs/tasks.md` → active work. `docs/decisions.md` → why things are this way.
