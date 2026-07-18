// components/SiteFooter.tsx
import { siteData } from '@/lib/content'
import { NAV_LINKS } from '@/lib/nav'

export default function SiteFooter() {
  const { footer } = siteData
  return (
    <footer className="sf">
      <div className="sf-wm" aria-hidden="true">
        JIDAN
      </div>
      <div className="sf-bar wrap">
        <span>{footer.left}</span>
        <span className="sf-nav">{NAV_LINKS.map((n) => n.label).join(' · ')}</span>
      </div>
    </footer>
  )
}
