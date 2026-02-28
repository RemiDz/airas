'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  opacity: number
  size: number
}

export default function AtmosphericCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const rafRef = useRef<number | null>(null)
  const timeRef = useRef(0)
  const lastFrameRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // Create particles
    const count = Math.min(Math.floor((window.innerWidth * window.innerHeight) / 15000), 80)
    particlesRef.current = Array.from({ length: count }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.15 - 0.05,
      opacity: 0.03 + Math.random() * 0.05,
      size: 0.5 + Math.random() * 1.5,
    }))

    let visible = true
    const onVisChange = () => { visible = !document.hidden }
    document.addEventListener('visibilitychange', onVisChange)

    const animate = (timestamp: number) => {
      if (!visible) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }

      // Throttle to ~30fps
      if (timestamp - lastFrameRef.current < 33) {
        rafRef.current = requestAnimationFrame(animate)
        return
      }
      lastFrameRef.current = timestamp
      timeRef.current = timestamp * 0.001

      const w = canvas.width
      const h = canvas.height

      ctx.clearRect(0, 0, w, h)

      // Subtle gradient centre drift
      const cx = w * 0.5 + Math.sin(timeRef.current * 0.1) * w * 0.05
      const cy = h * 0.4 + Math.cos(timeRef.current * 0.08) * h * 0.03

      const grad = ctx.createRadialGradient(cx, cy, 0, w * 0.5, h * 0.5, Math.max(w, h) * 0.7)
      grad.addColorStop(0, '#0A0A2E')
      grad.addColorStop(0.6, '#06061A')
      grad.addColorStop(1, '#040410')
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Draw particles
      for (const p of particlesRef.current) {
        p.x += p.vx
        p.y += p.vy

        // Wrap around edges
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10
        if (p.y < -10) p.y = h + 10
        if (p.y > h + 10) p.y = -10

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(168, 218, 220, ${p.opacity})`
        ctx.fill()
      }

      // Subtle aurora wisps
      const wispOpacity = 0.012 + Math.sin(timeRef.current * 0.3) * 0.005
      const wispGrad = ctx.createLinearGradient(
        w * 0.2 + Math.sin(timeRef.current * 0.05) * w * 0.1,
        h * 0.3,
        w * 0.8 + Math.cos(timeRef.current * 0.07) * w * 0.1,
        h * 0.5
      )
      wispGrad.addColorStop(0, `rgba(168, 218, 220, 0)`)
      wispGrad.addColorStop(0.5, `rgba(78, 205, 196, ${wispOpacity})`)
      wispGrad.addColorStop(1, `rgba(168, 218, 220, 0)`)

      ctx.fillStyle = wispGrad
      ctx.fillRect(0, 0, w, h)

      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVisChange)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 -z-10"
      aria-hidden="true"
    />
  )
}
