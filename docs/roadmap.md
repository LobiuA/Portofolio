# Roadmap & Technical Debt — Portfolio (Tri Muhammad Jidan)

> **Semi-permanent.** Forward-looking. Update when debt is paid or a phase ships. The *live* one-at-a-time task is in `docs/tasks.md`; this is the bigger picture.
> ⚠️ Next.js 16 / Tailwind v4 differ from training data — verify against installed packages before acting.

## Technical-debt register
Ranked by leverage. Each: what / why it matters / where. (Updated 2026-06-15 to the redesigned app.)

1. **Images unoptimized.** Gallery/cover/headshot use plain `<img loading="lazy">` instead of `next/image` — no responsive sizing or format negotiation. — `lib/content.ts`, `components/{Work,Freelance,Hero,About,Lightbox}*`.
2. **Not under version control, not deployed.** No git history (no rollback safety net) and no live URL.

> **Resolved 2026-06-15:** real contact links filled (email/WhatsApp/Instagram/Upwork); dead code/deps deleted (`framer-motion`, `useGsapReveal.ts`, `components/ui/`, `tailwind.config.ts`); asset clutter pruned (64 raw PNGs + 5 starter SVGs) — `public/` now holds only the 58 used JPGs. Build clean throughout. `prefers-reduced-motion` gated in 3 places. Docs match reality (hand-written CSS in `globals.css` with `:root` tokens, no `@theme`/GSAP-reveal).

## Development roadmap
**Phase 1 — Performance.** `next/image` pass on the galleries (#1).
**Phase 2 — Ship.** `git init` + first commit, then deploy to Vercel (mirror the VCT setup).

> Definition of done for any phase item: `npm run build` clean (it's the type/lint gate) + a real-browser visual check (headless screenshots leave below-hero ScrollTrigger sections hidden — expected).
