// lib/nav.ts
// The 6 real section anchors for the redesigned layout. Single source for
// OverlayMenu + SiteFooter. Deliberately NOT siteData.nav — general.json's nav
// still points at removed sections and content is frozen.
export const NAV_LINKS: { label: string; href: string }[] = [
  { label: 'Work', href: '#work' },
  { label: 'About', href: '#about' },
  { label: 'Capabilities', href: '#capabilities' },
  { label: 'Freelance', href: '#freelance' },
  { label: 'Showreel', href: '#showreel' },
  { label: 'Contact', href: '#contact' },
]
