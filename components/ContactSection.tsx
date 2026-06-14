import { siteData } from '@/lib/content'

export default function ContactSection() {
  const { contact } = siteData
  return (
    <section className="block contact" id="contact">
      <div className="wrap">
        <div className="contact-card" data-reveal="">
          <div className="contact-intro">
            <span className="kicker">{contact.kicker}</span>
            <h2 style={{ marginTop: 18 }}>
              {contact.heading.map((line, idx) => (
                <span key={line}>
                  {line}
                  {idx < contact.heading.length - 1 && <br />}
                </span>
              ))}
            </h2>
            <p>{contact.sub}</p>
          </div>
          <div className="contact-links">
            {contact.links.map((l) => (
              <a className="clink" href={l.href} key={l.type}>
                <span>
                  <span className="lbl">{l.lbl}</span>
                  <span className="val">{l.val}</span>
                </span>
                <span className="arr">↗</span>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
