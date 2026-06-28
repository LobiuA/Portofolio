'use client'

import { useEffect, useState } from 'react'

export default function LiveTimecode() {
  const [tc, setTc] = useState('00:00:00:00')

  useEffect(() => {
    let frame = 0
    const fps = 25
    const tick = () => {
      const f = frame++ % fps
      const s = Math.floor(frame / fps) % 60
      const m = Math.floor(frame / fps / 60) % 60
      const h = Math.floor(frame / fps / 3600)
      setTc(
        `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}:${String(f).padStart(2, '0')}`,
      )
    }
    const id = setInterval(tick, 1000 / fps)
    return () => clearInterval(id)
  }, [])

  return <>{tc}</>
}
