import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import PortfolioChrome from '@/components/PortfolioChrome'
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import ExperienceSection from '@/components/ExperienceSection'
import WorkSection from '@/components/WorkSection'
import FreelanceSection from '@/components/FreelanceSection'
import LedgerSection from '@/components/LedgerSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <SmoothScrollProvider>
      <PortfolioChrome>
        <Nav />
        <a id="top" />
        <main id="main-content">
          <HeroSection />
          <div className="wrap">
            <AboutSection />
          </div>
          <div className="wrap">
            <SkillsSection />
          </div>
          <ExperienceSection />
          <WorkSection />
          <FreelanceSection />
          <LedgerSection />
          <div className="wrap">
            <ContactSection />
          </div>
        </main>
        <Footer />
      </PortfolioChrome>
    </SmoothScrollProvider>
  )
}
