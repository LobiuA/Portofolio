# Decisions (ADR log)

> **Permanent, append-only.** One entry per non-obvious choice. Newest on top. Never rewrite — supersede with a new entry. This is how a future chat learns *why* without re-deriving it.

Format: `## YYYY-MM-DD — Title` · **Decision** · **Why** · **Alternatives/Consequences**

---

## 2026-06-15 — Look is hand-written CSS in globals.css; Tailwind v4 utilities/@theme are not used
**Decision:** The visual design is driven entirely by custom CSS classes (`.block`, `.wrap`, `.nav`, …), `:root` design tokens, and `[data-theme]` themes in `app/globals.css` (design ported from a standalone HTML artifact). `@import "tailwindcss"` stays for the reset/preflight, but no Tailwind utility classes and no `@theme` block are used.
**Why:** The redesign was ported wholesale from a finished CSS artifact; re-expressing ~1000 lines of bespoke styling as Tailwind utilities would be pure churn with no benefit.
**Consequences:** **Supersedes the 2026-06-14 "tokens live in @theme" entry** — there is no `@theme` block; tokens live in `:root`. Add styling as new CSS classes in `globals.css`, not Tailwind utilities. `tailwind.config.ts` is now doubly dead (see below) and slated for deletion in `docs/tasks.md`.

## 2026-06-15 — App UI state centralized in PortfolioChrome; reveal via IntersectionObserver, not GSAP
**Decision:** A single client context `components/PortfolioChrome.tsx` owns light/dark theme + accent colour (persisted to `localStorage` as `tmj-theme`/`tmj-accent`) and the lightbox. Scroll reveals run on a plain IntersectionObserver in that component (`[data-reveal]` → `.in`, CSS handles the transition; `[data-delay]` staggers). Galleries open via `usePortfolio().openLightbox(event)` → `components/Lightbox.tsx` keyed on `galleryData`.
**Why:** The reveal/animation needs were simple toggles, so an IntersectionObserver + CSS is lighter and needs no GSAP timelines; one context avoids prop-drilling theme/accent/lightbox through every section.
**Consequences:** **GSAP no longer drives section reveals** — it remains only to pump the Lenis `raf` ticker in `SmoothScrollProvider`. `lib/useGsapReveal.ts` is now dead. Sections consume `usePortfolio()`; never create a second provider or `new Lenis()`.

## 2026-06-15 — Dead code/deps flagged for removal (not yet deleted)
**Decision:** Identified as unused and safe to delete: `framer-motion` (in `package.json`, imported nowhere), `lib/useGsapReveal.ts`, `components/ui/{Container,Section,SectionLabel}.tsx`, and `tailwind.config.ts` (stale v3 stub holding the *old* design's tokens — never loaded by v4). Left in place for now; cleanup tracked in `docs/tasks.md`.
**Why:** Recording it so a future session doesn't mistake the stale `tailwind.config.ts` tokens (ink/paper/electric/Archivo) for the live design, or try to extend the unused primitives.
**Consequences:** Until removed, treat all four as no-ops. The live fonts are Space Grotesk / Hanken Grotesk / Space Mono (layout.tsx), not the Archivo/Inter named in the dead config.
**Update 2026-06-15:** all four removed (`framer-motion` dropped from `package.json` + `npm install`; files/dir deleted) — `npm run build` clean. The repo is now config-less for Tailwind; tokens live only in `:root`/`[data-theme]` in `globals.css`.

## 2026-06-14 — tailwind.config.ts is inert under Tailwind v4; tokens live in @theme
**Decision:** Treat `tailwind.config.ts` as dead. Define design tokens (colors, fonts, spacing) in `@theme` inside `app/globals.css`. Either delete the JS config or keep it only as an explicitly-marked no-op.
**Why:** Tailwind v4 is CSS-first and does not auto-load the JS config — editing it has no effect, which previously misled session guidance.
**Consequences:** Supersedes earlier "keep colors/fonts in config" guidance; `architecture.md` now points to `@theme` as the token home. Resolving/removing the file is Phase 1 in `docs/roadmap.md`.

## 2026-06-14 — Content centralized in lib/content.ts
**Decision:** All copy, data, and image URLs live in `lib/content.ts`; section components render structure only.
**Why:** Lets content be edited in one place without touching layout/animation code; keeps Claude's edits localized and low-risk.
**Consequences:** New section must add a content slice here, not hardcode text in JSX.

## 2026-06-14 — Lenis smooth scroll centralized in SmoothScrollProvider
**Decision:** Initialize Lenis once in `components/SmoothScrollProvider.tsx`, wrapping the app in `layout.tsx`.
**Why:** One scroll instance avoids conflicts and double-init during HMR; sections just consume scroll.
**Consequences:** Sections must not re-init Lenis; clean up triggers on unmount.

## 2026-06-14 — Pin to Next.js 16 + Tailwind v4 and treat as unfamiliar
**Decision:** Build on Next.js 16 / React 19 / Tailwind v4; require reading `node_modules/next/dist/docs/` before framework code (enforced via `AGENTS.md` import in `CLAUDE.md`).
**Why:** These versions have breaking changes vs. model training data; guessing leads to deprecated/incorrect APIs.
**Consequences:** Slightly slower writes, but avoids broken conventions. Log any v16/v4 gotcha you hit as its own entry here.
