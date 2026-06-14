# Context Recovery — how to drive Claude Code on this repo

> Meta-guide. The point of this doc system: **permanent knowledge** (CLAUDE.md, architecture.md, decisions.md) is stable and cheap to reload; **temporary state** (handoff.md, tasks.md) is small and rotates. You rarely need to re-read source to know where you are.

## Reading order when resuming (cheapest → only as needed)
1. `CLAUDE.md` — auto-loaded (and pulls in `AGENTS.md`'s Next.js 16 warning). Stack, commands, rules.
2. `docs/handoff.md` — what the last session was doing and the next step.
3. `docs/tasks.md` — the active checklist.
4. `docs/architecture.md` — only when touching unfamiliar sections/structure.
5. `docs/decisions.md` — only when a choice seems odd.

Source files: read on demand. Don't bulk-read `components/`.

## Next.js 16 reminder
Before writing framework code (routing, metadata, server/client boundaries, config), open the relevant guide in `node_modules/next/dist/docs/`. Tailwind v4 is also CSS-first — confirm syntax against the installed version.

## Starting a NEW conversation
Paste:
> Read CLAUDE.md, docs/handoff.md, and docs/tasks.md. Summarize current state and the next task before doing anything.

Then give the one task for this session. One session = one focused task keeps context small.

## Using `/compact`
`/compact` summarizes the conversation and frees the context window without losing thread.
- **When:** after finishing a sub-task, before switching tasks, or when context feels full.
- **How:** `/compact Keep: current task, files touched, next step. Drop: file dumps and tool output.`
- **Before compacting**, write anything durable into handoff/tasks/decisions — compaction is lossy; docs aren't.
- Prefer **finish task → update docs → `/clear` → new session** over many compactions in one long chat.

## End-of-session ritual (≈1 min)
1. Update `docs/handoff.md`: state now + exact next step.
2. Tick/add items in `docs/tasks.md`.
3. New decision (incl. a Next.js 16 gotcha you hit)? Append to `docs/decisions.md`.
4. Structure changed? Patch `docs/architecture.md`.
5. `/compact` or `/clear`.

## Token discipline
- Quote `file:line`, don't paste whole files or `node_modules` docs — summarize the one rule you needed.
- Keep handoff/tasks short — they're read every resume.
- If a doc keeps growing, it's mixing permanent and temporary knowledge — split it.
