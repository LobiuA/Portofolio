import { siteData } from '@/lib/content'
import CountUp from './CountUp'

export default function HeroMetrics() {
  const { hero } = siteData

  return (
    <div className="vmix-metrics">
      <div className="metrics-header" data-reveal="" data-delay="1">METRICS</div>
      {hero.stats.map((s, i) => (
        <div className="metric" key={s.label} data-reveal="" data-delay={String(i + 2)}>
          <div className="metric-n">
            <CountUp value={s.n} suffix={s.plus} />
          </div>
          <div className="metric-l">{s.label}</div>
        </div>
      ))}
    </div>
  )
}
