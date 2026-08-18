'use client'

import React, { useEffect, useRef } from 'react'

export default function CanvasBackground() {
  const ref = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    let raf = 0
    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)
    let t = 0
    const draw = () => {
      if (!ctx) return
      t += 0.01
      ctx.clearRect(0,0,canvas.width,canvas.height)
      // simple moving radial gradient blobs
      const grd = ctx.createLinearGradient(0, 0, canvas.width, canvas.height)
      grd.addColorStop(0, 'rgba(124,58,237,0.07)')
      grd.addColorStop(1, 'rgba(6,182,212,0.07)')
      ctx.fillStyle = grd
      ctx.fillRect(0,0,canvas.width,canvas.height)
      raf = requestAnimationFrame(draw)
    }
    draw()
    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return <canvas ref={ref} className="pointer-events-none fixed inset-0 -z-10" />
}
