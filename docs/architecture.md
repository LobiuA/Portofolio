# Architecture — Portfolio (Tri Muhammad Jidan)

> **Permanent knowledge.** Update only when structure/data flow change, not per task.
> ⚠️ Next.js 16 conventions differ from older versions — verify against `node_modules/next/dist/docs/`.

## Mental model
A single scrolling page composed of independent **sections**. Content is data-driven from one file. Animation is pure CSS + IntersectionObserver scroll reveal; it never owns the content.

## Module map
```
app/
├─ layout.tsx        # root: next/font (Geist), metadata, data-theme="dark", skip-link.
├─ page.tsx          # composes the tree: SmoothScrollProvider > PortfolioChrome > TopBar + main + SiteFooter
└─ globals.css       # THE design — plain CSS classes + :root tokens (Signal Minimal tokens only, ~700 lines)
components/
├─ SmoothScrollProvider.tsx   # single Lenis instance (disabled under reduced-motion, uses autoRaf)
├─ PortfolioChrome.tsx        # client context: openLightbox; IntersectionObserver reveal, cursor-glow; renders <Lightbox>
├─ TopBar.tsx                 # fixed header bar with brand logo & overlay menu toggle button
├─ OverlayMenu.tsx            # full-screen navigation modal with Esc listener, scroll lock, and focus management
├─ Hero01.tsx                 # section 1: full-viewport title-driven hero
├─ Manifesto02.tsx            # section 2: blockquote statement, biography copy, headshot, key stats
├─ WorkSlider03.tsx           # section 3: selected works slideshow; crossfades slide covers, links to Lightbox
├─ Capabilities04.tsx         # section 4: 3-item accordion splitting skills & experience roles
├─ Freelance05.tsx            # section 5: client cards (→ Lightbox), client testimonial, experience timeline ledger
├─ Showreel06.tsx             # section 6: automated cover-art slideshow loop
├─ Contact07.tsx              # section 7: reach out title header, email link, social profiles
├─ SiteFooter.tsx             # footer: oversized watermark text, navigation bar, copyright line
├─ WordReveal.tsx             # utility wrapper for word-by-word reveal transitions driven by IntersectionObserver
├─ WordIntro.tsx              # name intro overlay splash sequence; skipped under reduced motion
└─ Lightbox.tsx               # image showcase carousel modal matching chosen event key
lib/
├─ content.ts        # ALL copy, data, image URLs: siteData, galleryData, img()  ← single source (frozen)
├─ nav.ts            # anchor list for navigation
└─ capabilities.ts   # accordion category splits mapping roleTags & experience items
```

## Dependency map
Arrows = "imports / depends on". Verified by grep — keep arrows pointing one way.
```
layout → next/font + metadata (no providers here)
page   → SmoothScrollProvider, PortfolioChrome, TopBar, Hero01..Contact07, SiteFooter   # the tree
SmoothScrollProvider → lenis (autoRaf)       # sole `new Lenis()` instance
PortfolioChrome      → Lightbox              # provides usePortfolio() context
TopBar               → OverlayMenu           # controls opening state
WorkSlider03 / Freelance05 → usePortfolio()  # calls openLightbox()
Lightbox             → lib/content (galleryData, img)
every *0X / SiteFooter → lib/content (its slice)
lib/capabilities     → lib/content (roleTags + experience items)
lib/content → (leaf, data only, no internal imports)
```
- **Hubs** (change with care): `lib/content` (every section + lightbox), `PortfolioChrome` (context for openLightbox), `SmoothScrollProvider` (wraps the app), `globals.css` (every class lives here), `lib/nav` (OverlayMenu + SiteFooter).
- **Leaves** (safe to edit in isolation): `lib/content` data, any single section component.

## Data + render flow
1. `lib/content.ts` exports typed content objects (`siteData`, `galleryData`).
2. Each section imports its slice, rendering structure only, using `WordReveal` or tagging items with `data-reveal` for anim transitions.
3. `page.tsx` orders the sections inside `SmoothScrollProvider > PortfolioChrome`.
4. On mount, `PortfolioChrome` observes `[data-reveal]` to add `.in` as they enter viewport (also fills `.fill[data-w]`).
5. `SmoothScrollProvider` runs Lenis (skipped entirely under `prefers-reduced-motion`).
6. Selecting a work cover triggers `openLightbox(event)` → `Lightbox` mounts matching `galleryData` slideshow.

## Boundaries
- **Sections hold no copy** — text/data/images come from `lib/content.ts`.
- **Scroll behaviour is centralized** in `SmoothScrollProvider`; **app UI state (lightbox)** is centralized in `PortfolioChrome`.
- **Styling is custom CSS in `globals.css`** — plain CSS class rules, minimal design tokens in `:root`, no tailwind utilities used in markup.
- **Animations are additive** — must fall back gracefully when motion is disabled.
- **Intro & transition delays respect prefers-reduced-motion** (skipped/revealed instantly).
