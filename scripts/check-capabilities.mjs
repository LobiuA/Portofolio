// scripts/check-capabilities.mjs
import assert from 'node:assert'

// Mock data exactly matching content/skills.json & content/experience.json
const roles = [
  "In-game Observer", "League Operation", "Encoder Operator", "Replay Operator",
  "CG / Graphics Operator", "Audio Operator", "Technical Support", "vMix Consultant"
]
const experience = [
  { role: "Freelance", org: "Self-Employed" },
  { role: "Broadcast Engineer", org: "One Up" },
  { role: "Broadcast Officer", org: "Ligagame" }
]

const has = (needle) => roles.find((r) => r.toLowerCase().includes(needle.toLowerCase()))
const pick = (...needles) =>
  [...new Set(needles.map((n) => has(n)).filter((x) => Boolean(x)))]

const expTitles = experience.map((e) => `${e.role} — ${e.org}`)

const CAP_GROUPS = [
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

// Asserts
assert.equal(CAP_GROUPS.length, 3)
for (const g of CAP_GROUPS) {
  assert.ok(g.title.length > 0, 'group has title')
  assert.ok(Array.isArray(g.roles), 'roles is array')
  assert.ok(Array.isArray(g.experience), 'experience is array')
}

// Check correct mapping
assert.deepEqual(CAP_GROUPS[0].roles, ["vMix Consultant", "CG / Graphics Operator", "Replay Operator"])
assert.deepEqual(CAP_GROUPS[1].roles, ["Audio Operator", "Encoder Operator"])
assert.deepEqual(CAP_GROUPS[2].roles, ["In-game Observer", "League Operation", "Technical Support", "vMix Consultant"])

// CG / Graphics dedupe check
const testCG = pick('CG', 'Graphics')
assert.deepEqual(testCG, ["CG / Graphics Operator"]) // CG / Graphics Operator should be matched and deduped

console.log('capabilities OK')
