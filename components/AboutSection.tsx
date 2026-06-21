import { siteData } from '@/lib/content'
import AboutPortrait from './AboutPortrait'
import AboutCopy from './AboutCopy'

export default function AboutSection() {
  const { about } = siteData
  return (
    <section className="block" id="about">
      <div className="wrap">
        <div className="about-grid">
          <AboutPortrait src={about.portrait} blurDataURL={about.portraitBlur} />

          <div className="about-copy" data-reveal="" data-delay="1">
            <span className="kicker">{about.kicker}</span>
            <AboutCopy paras={about.paras} />
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
