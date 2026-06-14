import { siteData } from '@/lib/content'

export default function AboutSection() {
  const { about } = siteData
  return (
    <section className="block" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-portrait" data-reveal="">
            <span className="frame-corner tl" />
            <span className="frame-corner br" />
            <span className="frame-tag">
              <span className="dot" />
              OFF AIR
            </span>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={about.portrait} alt="Tri Muhammad Jidan portrait" />
          </div>

          <div className="about-copy" data-reveal="" data-delay="1">
            <span className="kicker">{about.kicker}</span>
            {about.paras.map((p, idx) => (
              <p
                key={idx}
                style={idx === 0 ? { marginTop: 22 } : undefined}
                dangerouslySetInnerHTML={{ __html: p }}
              />
            ))}
            <div className="interest-inline">
              <h4>{about.interestsLabel}</h4>
              <div className="chips">
                {about.chips.map((c) => (
                  <span className="chip" key={c}>
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
