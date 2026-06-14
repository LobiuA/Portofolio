import { siteData } from '@/lib/content'

export default function Footer() {
  const { footer } = siteData
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <span>{footer.left}</span>
        <span>
          {footer.right} · <a href="#top">Back to top ↑</a>
        </span>
      </div>
    </footer>
  )
}
