'use client'

import { useEffect, useRef } from 'react'

interface Props {
  className?: string
  side?: 'left' | 'right' | 'full'
}

export function DragonScaleOverlay({ className, side = 'right' }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const mouseRef  = useRef({ nx: -1, ny: -1 })

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const off    = document.createElement('canvas')
    const offCtx = off.getContext('2d')
    if (!offCtx) return

    let animId: number
    let t = 0
    let last = 0
    const SCALE = 4

    // ── Palette — D: Fogo Subaquático ─────────────────────────────
    const PALETTE: [number, number, number][] = [
      [  1,  27,  84],   // azul escuro (brand-dark)
      [ 10,  60, 175],   // azul royal
      [  0, 110, 210],   // azul vivo
      [255, 110,  15],   // laranja queimado
      [255, 185,   0],   // dourado
      [200,  80,   0],   // âmbar escuro
      [ 20,  40, 110],   // azul médio (ponte de volta)
      [  1,  27,  84],   // azul escuro (brand-dark)
    ]
    const NP = PALETTE.length

    const sample = (phase: number): [number, number, number] => {
      const nt = ((phase % 1) + 1) % 1
      const fi = nt * NP
      const lo = Math.floor(fi) % NP
      const hi = (lo + 1) % NP
      const f  = fi - Math.floor(fi)
      const [r1, g1, b1] = PALETTE[lo]
      const [r2, g2, b2] = PALETTE[hi]
      return [r1 + (r2 - r1) * f, g1 + (g2 - g1) * f, b1 + (b2 - b1) * f]
    }

    // ── Perlin-style gradient noise ────────────────────────────────
    // Gradient at integer grid point (ix, iy) — deterministic, unit-length
    const grad2 = (ix: number, iy: number): [number, number] => {
      const h = Math.sin(ix * 127.1 + iy * 311.7) * 43758.5453
      const angle = (h - Math.floor(h)) * Math.PI * 2
      return [Math.cos(angle), Math.sin(angle)]
    }

    // Quintic fade curve
    const quintic = (t_: number) => t_ * t_ * t_ * (t_ * (t_ * 6 - 15) + 10)
    const lerp    = (a: number, b: number, f: number) => a + (b - a) * f

    const noise2 = (x: number, y: number): number => {
      const ix = Math.floor(x), iy = Math.floor(y)
      const fx = x - ix,       fy = y - iy
      const ux = quintic(fx),  uy = quintic(fy)

      const [g00x, g00y] = grad2(ix,     iy    )
      const [g10x, g10y] = grad2(ix + 1, iy    )
      const [g01x, g01y] = grad2(ix,     iy + 1)
      const [g11x, g11y] = grad2(ix + 1, iy + 1)

      const n00 = g00x * fx       + g00y * fy
      const n10 = g10x * (fx - 1) + g10y * fy
      const n01 = g01x * fx       + g01y * (fy - 1)
      const n11 = g11x * (fx - 1) + g11y * (fy - 1)

      return lerp(lerp(n00, n10, ux), lerp(n01, n11, ux), uy)
    }

    // fBm — 3 octaves of noise summed with decreasing amplitude.
    const fbm = (x: number, y: number, time: number): number => {
      const tx = time * 0.055
      const ty = time * 0.028
      const n1 = noise2(x * 2.2  + tx,       y * 2.2  + ty      )
      const n2 = noise2(x * 4.7  - tx * 1.3, y * 4.7  + ty * 0.7) * 0.5
      const n3 = noise2(x * 9.1  + tx * 0.6, y * 9.1  - ty * 1.2) * 0.25
      return (n1 + n2 + n3) / 1.75
    }

    // Domain warping — warp the input coords with a separate noise layer
    // before sampling fBm. This creates swirling, turbulent shapes instead
    // of round blobs. Two passes of warping = "folded marble" look.
    const warpedFbm = (x: number, y: number, time: number): number => {
      const tw = time * 0.032
      // First warp pass
      const wx = noise2(x * 2.8 + tw,        y * 2.8         ) * 0.22
      const wy = noise2(x * 2.8 + 5.2,       y * 2.8 + tw    ) * 0.22
      // Second warp pass (warp the warp)
      const wx2 = noise2((x + wx) * 2.2 + tw * 0.7, (y + wy) * 2.2) * 0.14
      const wy2 = noise2((x + wx) * 2.2,             (y + wy) * 2.2 + tw * 0.7) * 0.14
      return fbm(x + wx + wx2, y + wy + wy2, time)
    }

    // ── Cone fade — emanates from fingertip contact point ────────
    // Focal point = where the two fingers touch in the PNG (1920×1080, object-cover centered).
    // Tune FPX/FPY if the visual origin drifts from the actual contact point.
    const FPX = 0.53, FPY = 0.52
    const HALF_ANGLE = 54 * Math.PI / 180   // half-opening angle of cone
    const smoothstep = (v: number) => v * v * (3 - 2 * v)

    const getConeFade = (nx_: number, ny_: number): number => {
      const dx = nx_ - FPX
      const dy = ny_ - FPY

      // Only the right side of the focal point
      if (dx < 0) return 0

      const radialDist = Math.sqrt(dx * dx + dy * dy)
      const angle      = Math.atan2(Math.abs(dy), Math.max(dx, 0.0001))

      // Angular fade: 1 on the horizontal axis, 0 at cone edge
      const angFade = Math.max(0, 1 - angle / HALF_ANGLE)

      // Radial ramp: starts at 0 from the focal point, reaches full at ~0.15
      const radFade = Math.min(1, radialDist / 0.12)

      return smoothstep(angFade) * smoothstep(radFade)
    }

    const resize = () => {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      off.width     = Math.max(1, Math.ceil(canvas.width  / SCALE))
      off.height    = Math.max(1, Math.ceil(canvas.height / SCALE))
    }
    resize()
    window.addEventListener('resize', resize)

    const draw = (now: number) => {
      animId = requestAnimationFrame(draw)
      const dt = Math.min((now - last) / 1000, 0.05)
      last = now
      t += dt

      const W = off.width
      const H = off.height
      const img = offCtx.createImageData(W, H)
      const buf = img.data

      const { nx: mx, ny: my } = mouseRef.current
      const hasMouse = mx >= 0

      for (let py = 0; py < H; py++) {
        const ny_ = py / H
        for (let px = 0; px < W; px++) {
          const nx_ = px / W

          const fade = getConeFade(nx_, ny_)
          if (fade < 0.01) continue

          // ── Radial wave flowing outward from focal point ─────────
          const rdx = nx_ - FPX, rdy = ny_ - FPY
          const radialDist = Math.sqrt(rdx * rdx + rdy * rdy)
          // Rings expanding outward — faster near origin, slower at edges
          const radial = Math.sin(radialDist * 22 - t * 1.4) * 0.5 + 0.5

          // ── Base iridescent wave ─────────────────────────────────
          const diag = nx_ * 5.5
          const w1   = Math.sin(diag * 2.4 + t * 0.55)
          const w2   = Math.sin(diag * 5.8 - t * 0.38 + ny_ * 3.4)
          const w3   = Math.sin(nx_  * 3.7 - ny_ * 6.2 + t * 0.72)
          // Blend planar wave with radial rings — rings dominate near origin
          const ringBlend = Math.max(0, 1 - radialDist * 4.5)
          let phase = (w1 * 0.50 + w2 * 0.32 + w3 * 0.18 + 1) * 0.5
          phase = phase * (1 - ringBlend * 0.6) + radial * ringBlend * 0.6

          // ── Organic phase warp via domain-warped fBm ────────────
          // Double-warped noise creates swirling turbulence.
          const noiseVal = warpedFbm(nx_, ny_, t)   // range ~[-1, 1]
          phase = ((phase + noiseVal * 0.62) % 1 + 1) % 1

          // ── Mouse tilt ───────────────────────────────────────────
          if (hasMouse) {
            const dx   = nx_ - mx, dy = ny_ - my
            const pull = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / 0.40) ** 1.5
            phase = ((phase + pull * 0.48) % 1 + 1) % 1
          }

          const [r, g, b] = sample(phase)

          // Brightness-driven alpha — wider range for more contrast
          const bri   = (r + g + b) / (3 * 255)
          const alpha = Math.round((55 + bri * 145) * fade)

          const idx = (py * W + px) * 4
          buf[idx]     = r
          buf[idx + 1] = g
          buf[idx + 2] = b
          buf[idx + 3] = Math.min(alpha, 210)
        }
      }

      offCtx.putImageData(img, 0, 0)
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.imageSmoothingEnabled = true
      ctx.imageSmoothingQuality = 'high'
      ctx.drawImage(off, 0, 0, canvas.width, canvas.height)
    }

    animId = requestAnimationFrame((ts) => { last = ts; draw(ts) })

    const section = canvas.closest('section') ?? document.body
    const onMove  = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect()
      mouseRef.current = {
        nx: (e.clientX - r.left) / canvas.width,
        ny: (e.clientY - r.top)  / canvas.height,
      }
    }
    const onLeave = () => { mouseRef.current = { nx: -1, ny: -1 } }
    section.addEventListener('mousemove', onMove)
    section.addEventListener('mouseleave', onLeave)

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
      section.removeEventListener('mousemove', onMove)
      section.removeEventListener('mouseleave', onLeave)
    }
  }, [side])

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className ?? 'z-[0]'}`}
      aria-hidden="true"
    />
  )
}
