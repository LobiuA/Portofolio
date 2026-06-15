// Adapter over the JSON content files in /content (edited via the Sveltia CMS at /admin).
// Section components stay unchanged: this file assembles `siteData` in the exact shape they
// expect and reconstructs the keyed `galleryData` (consumed by the Lightbox) from each
// event's / client's inline `images` list.

import general from '@/content/general.json'
import heroJson from '@/content/hero.json'
import aboutJson from '@/content/about.json'
import skills from '@/content/skills.json'
import experience from '@/content/experience.json'
import workRaw from '@/content/work.json'
import freelanceRaw from '@/content/freelance.json'
import ledger from '@/content/ledger.json'
import contact from '@/content/contact.json'

export const img = (key: string) => `/work/${key}.jpg`

export const accents = [
  { name: 'Signal Teal', c: '#2fe3c4', ink: '#04201b' },
  { name: 'Stream Blue', c: '#4d8dff', ink: '#04132e' },
  { name: 'Caster Magenta', c: '#ff5bb0', ink: '#2e0421' },
  { name: 'Tally Amber', c: '#ffb13d', ink: '#2e1c04' },
  { name: 'Court Green', c: '#7be05a', ink: '#0c2604' },
] as const

interface ImageRef {
  src: string
  caption: string
}
interface Flag {
  label: string
  live?: boolean
}
interface WorkEvent {
  event: string
  game: string
  roles: string[]
  cover: string
  flags: Flag[]
  year: string
  title: string
  role: string
  galleryTitle: string
  images: ImageRef[]
  count: number
}
interface Client {
  event: string
  cover: string
  pin: string
  name: string
  loc: string
  desc: string
  galleryTitle: string
  images: ImageRef[]
  count: number
}

// derive `count` (shots shown on each card) from the number of images, so the CMS
// editor never has to keep a separate counter in sync.
const workEvents: WorkEvent[] = (workRaw.events as unknown as Omit<WorkEvent, 'count'>[]).map(
  (e) => ({ ...e, count: e.images.length }),
)
const freelanceClients: Client[] = (
  freelanceRaw.clients as unknown as Omit<Client, 'count'>[]
).map((c) => ({ ...c, count: c.images.length }))

export const siteData = {
  brand: general.brand,
  nav: general.nav,
  hero: { ...heroJson, headshot: img(heroJson.headshot) },
  about: { ...aboutJson, portrait: img(aboutJson.portrait) },
  skills,
  experience,
  work: {
    kicker: workRaw.kicker,
    heading: workRaw.heading,
    sub: workRaw.sub,
    gameFilters: workRaw.gameFilters,
    roleFilters: workRaw.roleFilters,
    events: workEvents,
  },
  freelance: {
    kicker: freelanceRaw.kicker,
    heading: freelanceRaw.heading,
    sub: freelanceRaw.sub,
    stats: freelanceRaw.stats,
    clients: freelanceClients,
    testimonial: freelanceRaw.testimonial,
  },
  ledger,
  contact,
  footer: general.footer,
}

// Rebuild the keyed gallery sets the Lightbox expects: { [event]: { title, imgs: [src, caption][] } }
export const galleryData: Record<string, { title: string; imgs: [string, string][] }> =
  Object.fromEntries(
    [...workEvents, ...freelanceClients].map((item) => [
      item.event,
      {
        title: item.galleryTitle,
        imgs: item.images.map((im): [string, string] => [im.src, im.caption]),
      },
    ]),
  )
