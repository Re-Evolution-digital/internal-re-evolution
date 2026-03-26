'use client'

import { useEffect, useRef } from 'react'

const STAR_COLORS: [number, number, number][] = [
  [255, 255, 255],
  [200, 214, 255],
  [255, 199,   0],
  [168, 216, 255],
  [255, 230, 180],
]

interface Props {
  /** Fracção da largura usada para as estrelas (0–1). Default: 0.52 */
  zoneRatio?: number
  /** Número de estrelas. Default: 280 */
  starCount?: number
  className?: string
}

export function GalaxyBackground({ zoneRatio = 0.52, starCount = 280, className }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationId: number
    let frame = 0

    type Star = {
      // ponto de ancoragem próprio — distribui estrelas por toda a zona
      anchorX: number
      anchorY: number
      angle: number
      orbitR: number       // raio de órbita local (pequeno)
      r: number
      baseAlpha: number
      twinkleSpeed: number
      twinkleOffset: number
      color: [number, number, number]
      orbitSpeed: number
      floatAmp: number
      floatSpeed: number
      floatOffset: number
      bright: boolean
    }

    let stars: Star[] = []

    const init = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      stars = []

      const zone = canvas.width * zoneRatio
      const cx = zone * 0.5
      const cy = canvas.height * 0.5
      const bandAngle = -0.45
      const bandCount = Math.floor(starCount * 0.57)
      // raio de órbita local: pequeno, cabe sempre na zona
      const maxOrbitR = Math.min(canvas.height * 0.3, 30)

      for (let i = 0; i < starCount; i++) {
        let ax: number, ay: number

        if (i < bandCount) {
          // âncoras ao longo da banda Via Láctea
          const along = (Math.random() - 0.5) * Math.max(canvas.height, zone) * 1.3
          const spread = (Math.random() - 0.5) * (Math.random() < 0.6 ? 60 : 130)
          ax = cx + along * Math.cos(bandAngle) - spread * Math.sin(bandAngle)
          ay = cy + along * Math.sin(bandAngle) + spread * Math.cos(bandAngle)
        } else {
          // âncoras dispersas por toda a zona (incluindo cantos)
          ax = Math.random() * zone
          ay = Math.random() * canvas.height
        }

        ax = Math.max(4, Math.min(zone - 4, ax))
        ay = Math.max(4, Math.min(canvas.height - 4, ay))

        const bright = Math.random() < 0.06
        const r = bright ? Math.random() * 1.8 + 1.4 : Math.random() * 0.9 + 0.2
        const orbitR = Math.random() * maxOrbitR + 2
        const orbitSpeed = (0.0008 + Math.random() * 0.0006) * (Math.random() < 0.5 ? 1 : -1)
        const maxFloat = Math.min(16, canvas.height * 0.12)

        stars.push({
          anchorX: ax,
          anchorY: ay,
          angle: Math.random() * Math.PI * 2,
          orbitR,
          r,
          baseAlpha: bright ? Math.random() * 0.4 + 0.55 : Math.random() * 0.45 + 0.15,
          twinkleSpeed: Math.random() * 0.04 + 0.012,
          twinkleOffset: Math.random() * Math.PI * 2,
          color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
          orbitSpeed,
          floatAmp: Math.random() * maxFloat + Math.min(4, canvas.height * 0.04),
          floatSpeed: Math.random() * 0.007 + 0.002,
          floatOffset: Math.random() * Math.PI * 2,
          bright,
        })
      }
    }

    init()
    window.addEventListener('resize', init)

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      frame++

      const zone = canvas.width * zoneRatio
      const cx = zone * 0.5
      const cy = canvas.height * 0.5
      const bandAngle = -0.45

      // Nebulosa suave ao longo da banda
      const gx1 = cx + Math.cos(bandAngle) * (-canvas.height * 0.4)
      const gy1 = cy + Math.sin(bandAngle) * (-canvas.height * 0.4)
      const gx2 = cx + Math.cos(bandAngle) * (canvas.height * 0.4)
      const gy2 = cy + Math.sin(bandAngle) * (canvas.height * 0.4)
      const nebula = ctx.createLinearGradient(gx1, gy1, gx2, gy2)
      nebula.addColorStop(0,   'rgba(60, 80, 160, 0)')
      nebula.addColorStop(0.4, 'rgba(80, 100, 200, 0.05)')
      nebula.addColorStop(0.5, 'rgba(100, 130, 230, 0.09)')
      nebula.addColorStop(0.6, 'rgba(80, 100, 200, 0.05)')
      nebula.addColorStop(1,   'rgba(60, 80, 160, 0)')
      ctx.save()
      ctx.fillStyle = nebula
      ctx.fillRect(0, 0, zone, canvas.height)
      ctx.restore()

      const galaxyDrift = Math.sin(frame * 0.0012) * Math.min(28, canvas.height * 0.18)

      for (const s of stars) {
        s.angle += s.orbitSpeed

        // posição = âncora + micro-órbita local + float individual + drift global
        const x = s.anchorX + s.orbitR * Math.cos(s.angle)
        const floatY = s.floatAmp * Math.sin(frame * s.floatSpeed + s.floatOffset)
        const y = s.anchorY + s.orbitR * Math.sin(s.angle) * 0.4 + floatY + galaxyDrift

        if (x < 0 || x > zone || y < 0 || y > canvas.height) continue

        const alpha = s.baseAlpha * (0.55 + 0.45 * Math.sin(frame * s.twinkleSpeed + s.twinkleOffset))
        const [r, g, b] = s.color

        if (s.bright) {
          const halo = ctx.createRadialGradient(x, y, 0, x, y, s.r * 4)
          halo.addColorStop(0, `rgba(${r},${g},${b},${alpha * 0.4})`)
          halo.addColorStop(1, `rgba(${r},${g},${b},0)`)
          ctx.beginPath()
          ctx.arc(x, y, s.r * 4, 0, Math.PI * 2)
          ctx.fillStyle = halo
          ctx.fill()

          ctx.strokeStyle = `rgba(${r},${g},${b},${alpha * 0.5})`
          ctx.lineWidth = 0.6
          const arm = s.r * 3.5
          ctx.beginPath(); ctx.moveTo(x - arm, y); ctx.lineTo(x + arm, y); ctx.stroke()
          ctx.beginPath(); ctx.moveTo(x, y - arm); ctx.lineTo(x, y + arm); ctx.stroke()
        }

        ctx.beginPath()
        ctx.arc(x, y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${r},${g},${b},${alpha})`
        ctx.fill()
      }

      animationId = requestAnimationFrame(draw)
    }
    draw()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', init)
    }
  }, [zoneRatio, starCount])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none z-[1] ${className ?? ''}`}
      aria-hidden="true"
    />
  )
}
