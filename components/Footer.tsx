import { siteData } from '@/lib/content'
import LiveTimecode from './LiveTimecode'

export default function Footer() {
  const { footer } = siteData
  return (
    <footer className="foot">
      <div className="wrap foot-inner">
        <span className="foot-id">{footer.left}</span>
        <span className="foot-sub">{footer.right}</span>
        <span className="foot-sig">
          <span className="tally" /> SIGNAL ACTIVE · <LiveTimecode />
        </span>
      </div>
    </footer>
  )
}
