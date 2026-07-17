'use client'

import { useState, useEffect, useRef } from 'react'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import PortfolioChrome from '@/components/PortfolioChrome'
import Nav from '@/components/Nav'
import HeroSection from '@/components/HeroSection'
import ShowreelSection from '@/components/ShowreelSection'
import AboutSection from '@/components/AboutSection'
import SkillsSection from '@/components/SkillsSection'
import ExperienceSection from '@/components/ExperienceSection'
import ProofStrip from '@/components/ProofStrip'
import WorkSection from '@/components/WorkSection'
import FreelanceSection from '@/components/FreelanceSection'
import LedgerSection from '@/components/LedgerSection'
import ContactSection from '@/components/ContactSection'
import Footer from '@/components/Footer'
import NameIntro from '@/components/NameIntro'

export default function Home() {
  const [introDone, setIntroDone] = useState(false)
  const flashRef = useRef<HTMLDivElement>(null)

  // Skip intro if user prefers reduced motion
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroDone(true)
    }
  }, [])

  // Flash on hero reveal (glitch cut)
  useEffect(() => {
    if (!introDone || !flashRef.current) return
    const el = flashRef.current
    el.style.opacity = '0.85'
    const raf = requestAnimationFrame(() => {
      el.style.transition = 'opacity 0.25s ease-out'
      el.style.opacity = '0'
    })
    const t = setTimeout(() => el.remove(), 400)
    return () => { cancelAnimationFrame(raf); clearTimeout(t) }
  }, [introDone])

  return (
    <>
      {!introDone && <NameIntro onDone={() => setIntroDone(true)} />}
      {/* Glitch-cut flash overlay — one frame white then fade */}
      {introDone && (
        <div
          ref={flashRef}
          style={{
            position: 'fixed', inset: 0, zIndex: 9998,
            background: '#fff', opacity: 0, pointerEvents: 'none',
          }}
        />
      )}
      <SmoothScrollProvider>
        <PortfolioChrome>
          <Nav />
          <a id="top" />
          <main id="main-content">
            <HeroSection />
            <ShowreelSection />
            <div className="wrap">
              <AboutSection />
            </div>
            <div className="wrap">
              <SkillsSection />
            </div>
            <ExperienceSection />
            <ProofStrip />
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
    </>
  )
}
