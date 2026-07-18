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
