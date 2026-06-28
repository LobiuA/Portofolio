import Image from 'next/image'
import dynamic from 'next/dynamic'
import { siteData } from '@/lib/content'
import Timecode from './Timecode'
import CountUp from './CountUp'
import MarqueeTicker from './MarqueeTicker'

const HeroMetrics = dynamic(() => import('./HeroMetrics'), { ssr: false })

export default function HeroSection() {
  const { hero } = siteData
  return (
    <header className="vmix" id="hero" data-reveal="">
      {/* ── Bus Label Bar ── */}
      <div className="bus-bar">
        <div className="bus-input">INPUT 01 / CAM 01</div>
        <div className="bus-program">● PROGRAM BUS · TMJ / BROADCAST PORTFOLIO</div>
        <div className="bus-onair">
          <span className="tally-dot" />
          ON AIR
        </div>
      </div>

      {/* ── 3-Column Hero Body ── */}
      <div className="vmix-body">

        {/* Left — Camera Input */}
        <div className="cam-col">
          <div className="cam-frame">
            {/* Sweeping scan line */}
            <div className="scanline" />

            {/* Corner brackets */}
            <span className="cam-corner tl" />
            <span className="cam-corner tr" />
            <span className="cam-corner bl" />
            <span className="cam-corner br" />

            {/* Live timecode */}
            <Timecode start="00:14:22:08" />

            {/* Headshot image */}
            <Image
              className="cam-img"
              src={hero.headshot}
              alt="Tri Muhammad Jidan"
              width={766}
              height={972}
              priority
              sizes="(max-width: 940px) 100vw, 350px"
              placeholder={hero.headshotBlur ? 'blur' : 'empty'}
              blurDataURL={hero.headshotBlur}
            />
          </div>

          {/* Cam Label Bar */}
          <div className="cam-label">
            <span className="cam-label-live">
              <span className="tally-dot" />
              CAM 01
            </span>
            <span className="cam-label-pgm">PGM</span>
          </div>
        </div>

        {/* Center — Title */}
        <div className="vmix-title">
          <div className="vmix-role" data-reveal="" data-delay="1">
            {hero.kicker.toUpperCase()}
          </div>

          {hero.nameLines.map((line, i) => (
            <div className="vmix-name-wrap" key={line}>
              <h1
                className="vmix-name-line"
                data-reveal=""
                data-delay={i === 0 ? '2' : '3'}
              >
                {line.toUpperCase()}
              </h1>
            </div>
          ))}

          <div className="vmix-sub" data-reveal="" data-delay="3">
            LIVE ESPORTS BROADCAST
          </div>

          <p className="vmix-lede" data-reveal="" data-delay="3">
            {hero.lede}
          </p>

          <div className="vmix-tags" data-reveal="" data-delay="4">
            {hero.marquee.map((tag) => (
              <span className="vmix-tag" key={tag}>{tag}</span>
            ))}
          </div>

          <div className="vmix-cta" data-reveal="" data-delay="4">
            {hero.cta.map((c) => (
              <a
                key={c.href}
                className={`btn ${c.primary ? 'btn-primary' : 'btn-ghost'}`}
                href={c.href}
              >
                {c.label}
              </a>
            ))}
          </div>
        </div>

        {/* Right — Metrics with parallax drift */}
        <HeroMetrics />

      </div>

      {/* ── Ticker Strip ── */}
      <div className="ticker">
        <MarqueeTicker
          text={`${hero.marquee.join(' · ')} · ${hero.ticker.join(' · ')} · `}
        />
        <div className="ticker-onair">
          <span className="tally-dot" />
          ON AIR
        </div>
      </div>
    </header>
  )
}
