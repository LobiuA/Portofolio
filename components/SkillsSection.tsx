import { siteData } from '@/lib/content'

export default function SkillsSection() {
  const { skills } = siteData
  return (
    <section className="block block--tight" id="skills" style={{ background: 'var(--bg-2)' }} data-reveal="from-scale">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{skills.kicker}</span>
          <h2>{skills.heading}</h2>
          <p>{skills.sub}</p>
        </div>

        <div className="cols">
          <div className="tool-grid">
            {skills.tools.map((t, idx) => (
              <div className="tool" data-reveal="" data-delay={idx || undefined} key={t.name}>
                <div className="glyph">{t.glyph}</div>
                <div>
                  <div className="tn">{t.name}</div>
                  <div className="td">{t.desc}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="meter-list" data-reveal="" data-delay="1">
            {skills.meters.map((m) => (
              <div className="meter" key={m.name}>
                <div className="top">
                  <span className="name">{m.name}</span>
                  <span className="lvl">{m.level}</span>
                </div>
                <div className="bar">
                  <span className="fill" data-w={m.w} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="role-tags" data-reveal="" data-delay="2">
          {skills.roleTags.map((rt) => (
            <span className="rt" key={rt}>
              <b>·</b> {rt}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
