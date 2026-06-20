import { siteData } from '@/lib/content'

export default function ExperienceSection() {
  const { experience } = siteData
  return (
    <section className="block" id="experience">
      <div className="wrap">
        <div className="section-head" data-reveal="">
          <span className="kicker">{experience.kicker}</span>
          <h2>{experience.heading}</h2>
        </div>
        <div className="timeline">
          {experience.items.map((item) => (
            <div className={`tl-item ${item.active ? 'tl-onair' : 'tl-complete'}`} data-reveal="" key={item.role}>
              <div className="tl-when">
                {item.when}
                <div className="tl-badge">
                  {item.active ? (
                    <>
                      <span className="tally" />
                      ON AIR
                    </>
                  ) : (
                    'COMPLETE'
                  )}
                </div>
              </div>
              <div className="tl-body">
                <h3>{item.role}</h3>
                <div className="where">
                  <span className="org">{item.org}</span>
                </div>
                <p className="desc">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
