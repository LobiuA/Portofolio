'use client'
import { useEffect, useState } from 'react'

export default function Timecode({ start = '00:14:22:08' }: { start?: string }) {
  const [tc, setTc] = useState(start)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const [h, m, s, f] = start.split(':').map(Number)
    const startFrames = ((h * 60 + m) * 60 + s) * 25 + f
    const t0 = Date.now()
    const pad = (n: number) => String(n).padStart(2, '0')
    const id = setInterval(() => {
      const total = startFrames + Math.floor((Date.now() - t0) / 40)
      const ff = total % 25
      const ss = Math.floor(total / 25) % 60
      const mm = Math.floor(total / 1500) % 60
      const hh = Math.floor(total / 90000)
      setTc(`${pad(hh)}:${pad(mm)}:${pad(ss)}:${pad(ff)}`)
    }, 40)
    return () => clearInterval(id)
  }, [start])
  return <span className="tc" data-timecode>{tc}</span>
}
