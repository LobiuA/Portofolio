import Image from 'next/image'
import { siteData } from '@/lib/content'

export default function HeroSection() {
  const { hero } = siteData
  return (
    <header className="hero" id="hero">
      <div className="wrap">
        <div className="hero-inner">
          <div className="hero-lead">
            <span className="kicker" data-reveal="">
              {hero.kicker}
            </span>
            <h1 data-reveal="" data-delay="1">
              {hero.nameLines.map((line) => (
                <span className="line" key={line}>
                  <span>{line}</span>
                </span>
              ))}
            </h1>
            <p className="role" data-reveal="" data-delay="2">
              {hero.role.pre}
              <span className="accent">{hero.role.accent}</span>
              {hero.role.post}
            </p>
            <p className="lede" data-reveal="" data-delay="2">
              {hero.lede}
            </p>
            <div className="hero-cta" data-reveal="" data-delay="3">
              {hero.cta.map((c) => (
                <a key={c.href} className={`btn ${c.primary ? 'btn-primary' : 'btn-ghost'}`} href={c.href}>
                  {c.label}
                </a>
              ))}
            </div>
          </div>

          <aside className="hero-aside" data-reveal="" data-delay="2">
            <div className="headshot-frame">
              <span className="frame-corner tl" />
              <span className="frame-corner br" />
              <span className="frame-tag">
                <span className="dot" />
                CAM 01 · ON AIR
              </span>
              <Image
                className="headshot-img"
                src={hero.headshot}
                alt="Tri Muhammad Jidan"
                width={766}
                height={972}
                priority
                sizes="(max-width: 880px) 100vw, 40vw"
                placeholder={hero.headshotBlur ? 'blur' : 'empty'}
                blurDataURL={hero.headshotBlur}
              />
            </div>
            <div className="hero-stats">
              {hero.stats.map((s) => (
                <div className="stat" key={s.label}>
                  <div className="n">
                    {s.n}
                    {s.plus && <span style={{ color: 'var(--accent)' }}>{s.plus}</span>}
                  </div>
                  <div className="l">{s.label}</div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </div>

      <div className="marquee" aria-hidden="true">
        <div className="marquee-track">
          {[...hero.marquee, ...hero.marquee].map((m, idx) => (
            <span key={`${m}-${idx}`}>{m}</span>
          ))}
        </div>
      </div>
    </header>
  )
}
