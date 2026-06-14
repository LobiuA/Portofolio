# Architecture — Portfolio (Tri Muhammad Jidan)

> **Permanent knowledge.** Update only when structure/data flow change, not per task.
> ⚠️ Next.js 16 conventions differ from older versions — verify against `node_modules/next/dist/docs/`.

## Mental model
A single scrolling page composed of independent **sections**. Content is data-driven from one file. Animation is layered on top via a scroll provider; it never owns the content.

## Module map
```
app/
├─ layout.tsx        # root: next/font (Space Grotesk / Hanken Grotesk / Space Mono), metadata,
│                    #       data-theme="dark", skip-link. (Providers live in page.tsx.)
├─ page.tsx          # composes the tree: SmoothScrollProvider > PortfolioChrome > Nav + main + Footer
└─ globals.css       # THE design — plain CSS classes + :root tokens + [data-theme] themes (~1000 lines)
components/
├─ SmoothScrollProvider.tsx   # single Lenis instance (off under reduced-motion)  ← all smooth-scroll
├─ PortfolioChrome.tsx        # client context: theme + accent + lightbox; IntersectionObserver reveal,
│                             #   meter-fill, cursor-glow; renders <Lightbox>   ← app-wide UI state
├─ Nav.tsx                    # sticky header: links, theme toggle, accent picker, Hire-me
├─ HeroSection.tsx            # hero + headshot + stats + marquee
├─ AboutSection.tsx           # portrait + bio + interest chips
├─ SkillsSection.tsx          # tools + skill meters + role tags
├─ ExperienceSection.tsx      # career timeline
├─ WorkSection.tsx            # event gallery + game/role filters → opens Lightbox
├─ FreelanceSection.tsx       # Upwork stats + client cards (→ Lightbox) + testimonial
├─ LedgerSection.tsx          # "also crewed" list
├─ ContactSection.tsx         # contact links
├─ Lightbox.tsx               # gallery modal driven by galleryData
└─ Footer.tsx
lib/
└─ content.ts        # ALL copy, data, image URLs: siteData, accents, galleryData, img()  ← single source
public/work/         # portfolio JPGs (event/client shots, headshot, portrait) + unused raw extraction PNGs
```
> No `tailwind.config.ts` (Tailwind v4 is config-less here) and no `components/ui/` or `useGsapReveal.ts` — all removed as dead code on 2026-06-15.

## Dependency map
Arrows = "imports / depends on". Verified by grep — keep arrows pointing one way.
```
layout → next/font + metadata (no providers here)
page   → SmoothScrollProvider, PortfolioChrome, Nav, *Section, Footer   # the tree
SmoothScrollProvider → lenis + gsap          # verified: sole `new Lenis()`; gsap only drives the ticker
PortfolioChrome      → lib/content (accents) + Lightbox                  # provides usePortfolio() context
Nav / WorkSection / FreelanceSection → usePortfolio()   # theme/accent/openLightbox
Lightbox             → lib/content (galleryData, img)
every *Section       → lib/content (its slice)
lib/content → (leaf, data only, no internal imports)
```
- **Hubs** (change with care): `lib/content` (every section + lightbox), `PortfolioChrome` (context for nav + galleries), `SmoothScrollProvider` (wraps the app), `globals.css` (every class lives here).
- **Leaves** (safe to edit in isolation): `lib/content` data, any single `*Section`.
- **Rule:** one `new Lenis()` (in `SmoothScrollProvider`) and one `usePortfolio` provider (`PortfolioChrome`). Copy hardcoded in a section, or a second instance of either, breaks the model.

## Data + render flow
1. `lib/content.ts` exports typed content objects (`siteData`, `accents`, `galleryData`).
2. Each `*Section.tsx` imports its slice and renders structure only, tagging revealable nodes with `data-reveal` (+ optional `data-delay`).
3. `page.tsx` orders the sections inside `SmoothScrollProvider > PortfolioChrome`.
4. On mount, `PortfolioChrome` observes every `[data-reveal]` and adds `.in` as it scrolls into view (CSS does the transition); it also restores theme/accent from `localStorage`.
5. `SmoothScrollProvider` runs Lenis (skipped entirely under `prefers-reduced-motion`).
6. Clicking a Work/Freelance card calls `openLightbox(event)` → `Lightbox` renders that `galleryData` set.

## Boundaries (keep these clean)
- **Sections hold no copy** — text/data/images come from `lib/content.ts`.
- **Scroll behaviour is centralized** in `SmoothScrollProvider`; **app UI state (theme/accent/lightbox)** is centralized in `PortfolioChrome`. Sections consume both via `usePortfolio()`; never reinitialize Lenis or the context.
- **Styling is custom CSS in `globals.css`** — `.block`/`.wrap`/`.nav`/etc. classes, `:root` design tokens, `[data-theme="dark|light"]` themes, and a runtime-swappable `--accent`. Tailwind v4 is imported but its utilities/`@theme` are not used for the look. Add styles as new CSS classes here; don't introduce Tailwind utility classes or touch `tailwind.config.ts`.
- **Animations are additive** — the page must read correctly with motion disabled.

## Animation standards
- Scroll reveals = CSS transitions toggled by the IntersectionObserver in `PortfolioChrome` (`[data-reveal]` → `.in`, with `[data-delay]` for stagger). No GSAP `ScrollTrigger` in sections.
- GSAP is loaded only to pump the Lenis `raf` ticker in `SmoothScrollProvider`.
- Animate transforms/opacity only (GPU). Never animate `width`/`height`/`top`/`left`.
- Gate motion behind `prefers-reduced-motion` (PortfolioChrome reveals everything immediately; SmoothScrollProvider skips Lenis; a CSS guard zeroes the transitions).
- Clean up the observer / Lenis on unmount to avoid leaks during HMR.

## Architecture standards
- New section = new `components/XSection.tsx` + a content slice in `lib/content.ts` + one line in `page.tsx` + its CSS classes in `globals.css`. Tag revealable nodes with `data-reveal`.
- Design tokens (color/space/type) live in `:root` (and `[data-theme]`) in `globals.css`, not per-component and not in `tailwind.config.ts`.
- New dependency or a Next.js 16 convention you had to look up → log it in `docs/decisions.md`.
