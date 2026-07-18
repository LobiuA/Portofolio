@AGENTS.md

# CLAUDE.md — Portfolio (Tri Muhammad Jidan)

> Loaded into **every** session. Keep under ~40 lines. Details live in `docs/`.
> ⚠️ The `@AGENTS.md` import above is mandatory: **Next.js 16 has breaking changes vs. training data** — check `node_modules/next/dist/docs/` before writing Next.js code.

## What this is
Premium, typography-driven single-page portfolio. **Signal Minimal × Lucas** look: grayscale, Geist sans-serif, hairline borders (`1px solid var(--line)`), zero rounded corners. Locked to Signal Minimal (no light mode, no accent colors, dark bg only).

## Stack
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 (imported, styling is plain hand-written CSS in `globals.css`) · Lenis smooth scroll.
> Motion is pure CSS and IntersectionObserver. No GSAP or Framer Motion used.

## Commands
```bash
export PATH="$PATH:/c/Program Files/nodejs"
npm run dev     # dev server → http://localhost:3000
npm run build   # next build (type & lint gate)
```

## Where things live
- `app/` — App Router: `layout.tsx` (Geist font; theme metadata), `page.tsx` (main composition), `globals.css` (plain CSS classes + tokens: `--bg #0A0A0A`, `--ink #F2F0EB`, `--line #2A2A28`).
- `lib/content.ts` — **all copy, data, image URLs** (`siteData`, `galleryData`, `img()`). Content is frozen (do not edit).
- `lib/nav.ts` — Single source of navigation links (anchors).
- `lib/capabilities.ts` — Grouping helper for the accordion.
- `components/` — New Signal Minimal 7-section layout:
  - `WordIntro.tsx` (name intro animation)
  - `TopBar.tsx` / `OverlayMenu.tsx` (fixed header + full-screen nav)
  - `Hero01.tsx` (full-viewport hero)
  - `Manifesto02.tsx` (statement + photo + bio + stats)
  - `WorkSlider03.tsx` (crossfade slider → lightbox)
  - `Capabilities04.tsx` (accordion capabilities)
  - `Freelance05.tsx` (client cards + quote + timeline ledger)
  - `Showreel06.tsx` (reel cover slideshow)
  - `Contact07.tsx` (reveal header + email + socials)
  - `SiteFooter.tsx` (nav + trademark)
  - `WordReveal.tsx` (per-word scroll reveal helper)
  - `Lightbox.tsx` (image lightbox gallery)
  - `PortfolioChrome.tsx` (openLightbox context, cursor glow, IntersectionObserver scroll-reveal orchestration)
  - `SmoothScrollProvider.tsx` (Lenis initialization)

## Rules
- Content is frozen (do not modify `lib/content.ts` or content JSONs).
- Run build gate before committing code. All commits must include the Co-Authored-By trailer.
