# Tasks — active work only

> **Temporary.** The live backlog. Keep done items briefly, then prune. "Someday/maybe" goes to the bottom. One in-progress item at a time.

## In progress
- [ ] (none)

## Next up
- [ ] (optional) Custom domain on Vercel.

## Backlog / ideas
> Full debt register + phased plan: `docs/roadmap.md`. Dependency map: `docs/architecture.md`.

## Done (recent — prune periodically)
- [x] **Blur placeholders (LQIP)** — `scripts/gen-blur.mjs` (sharp) → `lib/blur.json` (58 keys); `blur()` helper in `lib/content.ts`; `placeholder="blur"` on all Image in Hero/About/Work/Freelance/Lightbox; wired to `prebuild` so it regens on every build (+ `npm run blur`). sharp added as devDep. Build clean — 2026-06-19
- [x] `next/image` pass — all 6 raw `<img>` migrated to `next/image` (Work/Freelance/Hero/About/Lightbox) — 2026-06-15
- [x] Sveltia CMS end-to-end — /content/*.json + /admin + GitHub OAuth; login confirmed — 2026-06-15
- [x] Deploy to Vercel — live at portofoliotmj.vercel.app, auto-deploy on push to main — 2026-06-15
- [x] Push to GitHub — origin = github.com/LobiuA/Portofolio (private), `main` tracked — 2026-06-15
- [x] git init + initial commit on `main` (local identity: Tri Muhammad Jidan / jidantri14@gmail.com) — 2026-06-15
- [x] Prune asset clutter (64 raw PNGs in public/work/ + 5 starter SVGs in public/) — build clean — 2026-06-15
- [x] Delete dead code (framer-motion dep, useGsapReveal.ts, components/ui/, tailwind.config.ts) — build clean — 2026-06-15
- [x] Fill all real contact links (email/WhatsApp/Instagram/Upwork) — 2026-06-15
- [x] Sync docs to the redesigned app (CLAUDE.md + architecture/decisions/handoff/tasks/roadmap) — 2026-06-15
- [x] Set up docs/ context system — 2026-06-14
