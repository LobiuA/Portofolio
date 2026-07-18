// components/Hero01.tsx
import { siteData } from '@/lib/content'

export default function Hero01() {
  const { nameLines, role, kicker } = siteData.hero
  return (
    <section className="h01" id="top">
      <div className="h01-meta">
        <span>{kicker}</span>
      </div>
      <h1 className="h01-name">
        {nameLines.map((line) => (
          <span key={line}>{line}</span>
        ))}
      </h1>
      <div className="h01-rule" />
      <div className="h01-sub">
        <span>
          {role.pre}
          {role.accent}
          {role.post}
        </span>
        <span className="h01-hint">Scroll ↓</span>
      </div>
    </section>
  )
}
