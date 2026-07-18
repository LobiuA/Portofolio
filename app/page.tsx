// app/page.tsx
'use client'

import { useState, useEffect } from 'react'
import SmoothScrollProvider from '@/components/SmoothScrollProvider'
import PortfolioChrome from '@/components/PortfolioChrome'
import WordIntro from '@/components/WordIntro'
import TopBar from '@/components/TopBar'
import Hero01 from '@/components/Hero01'
import Manifesto02 from '@/components/Manifesto02'
import WorkSlider03 from '@/components/WorkSlider03'
import Capabilities04 from '@/components/Capabilities04'
import Freelance05 from '@/components/Freelance05'
import Showreel06 from '@/components/Showreel06'
import Contact07 from '@/components/Contact07'
import SiteFooter from '@/components/SiteFooter'

export default function Home() {
  const [introDone, setIntroDone] = useState(false)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIntroDone(true)
    }
  }, [])

  return (
    <>
      {!introDone && <WordIntro onDone={() => setIntroDone(true)} />}
      <SmoothScrollProvider>
        <PortfolioChrome>
          <TopBar />
          <main id="main-content">
            <Hero01 />
            <Manifesto02 />
            <WorkSlider03 />
            <Capabilities04 />
            <Freelance05 />
            <Showreel06 />
            <Contact07 />
          </main>
          <SiteFooter />
        </PortfolioChrome>
      </SmoothScrollProvider>
    </>
  )
}
