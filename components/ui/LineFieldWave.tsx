'use client'

import { useEffect, useRef } from 'react'

/**
 * LineFieldWave — Onde sonore en "champ de lignes" : plusieurs courbes
 * parallèles dont les amplitudes croissent du centre vers l'extérieur,
 * formant ensemble une onde lumineuse type illustration vectorielle.
 *
 * Le buffer défile droite → gauche (sensation enregistrement en cours).
 * Chaque ligne suit la même forme de signal mais à une amplitude différente,
 * créant un effet de "tranches" de l'onde — similaire à un oscilloscope avec
 * persistance.
 *
 * Couleurs : dégradé horizontal chromatique sur la palette du site
 * (lavender → cream → raspberry → peach) qui défile.
 */

interface LineFieldWaveProps {
  className?: string
  backgroundColor?: string
  /** Nombre d'échantillons dans le buffer. */
  samples?: number
  /** Nombre de lignes par côté (haut). Total = 2 × n. */
  lines?: number
}

const N_DEFAULT = 200
const LINES_DEFAULT = 26

export default function LineFieldWave({
  className,
  backgroundColor = '#201C19',
  samples = N_DEFAULT,
  lines = LINES_DEFAULT,
}: LineFieldWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const N = Math.max(60, Math.floor(samples))
    const K = Math.max(6, Math.floor(lines))
    const buffer = new Float32Array(N)
    // Pré-remplissage déjà significatif pour que la wave soit visible
    // dès la première frame (sinon on attend la synthèse pendant 3s)
    for (let i = 0; i < N; i++) {
      const u = i / (N - 1)
      const env = Math.sin(u * Math.PI * 2.5) * 0.5 + 0.5
      buffer[i] = 0.4 + env * 0.4 + Math.random() * 0.1
    }

    let raf = 0
    let dpr = Math.min(2, window.devicePixelRatio || 1)
    let running = true
    const start = performance.now()

    const ensureSize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
      }
    }

    ensureSize()
    const ro = new ResizeObserver(ensureSize)
    ro.observe(canvas)

    const sampleAmplitude = (t: number, seedJitter: number): number => {
      const env1 = Math.sin(t * 0.55) * 0.5 + 0.5
      const env2 = Math.sin(t * 1.27 + 1.3) * 0.5 + 0.5
      const env3 = Math.sin(t * 0.36 + 2.7) * 0.5 + 0.5
      const envelope = env1 * 0.5 + env2 * 0.35 + env3 * 0.15

      const fast =
        Math.sin(t * 18 + seedJitter * 3.1) * 0.35 +
        Math.sin(t * 31 + seedJitter * 5.7) * 0.2 +
        Math.sin(t * 11 + seedJitter * 1.4) * 0.15 +
        (seedJitter - 0.5) * 0.45

      const amp = envelope * (0.45 + (fast + 1) * 0.35)
      return Math.max(0.04, Math.min(1, amp))
    }

    const SAMPLES_PER_SECOND = 55
    let lastShiftTime = 0

    // Pré-calcul des positions verticales des lignes (factor 0..1)
    // distribution non-linéaire : plus de lignes vers les hautes amplitudes
    // (pour effet "plumage" plus dense à l'extérieur, comme sur la ref)
    const lineFactors = new Float32Array(K)
    for (let k = 0; k < K; k++) {
      const u = (k + 1) / K
      // courbe puissance pour densifier vers l'extérieur
      lineFactors[k] = Math.pow(u, 0.85)
    }

    const drawFrame = (now: number) => {
      const W = canvas.width
      const H = canvas.height
      if (W < 4 || H < 4) return

      const t = (now - start) * 0.001
      const centerY = H / 2
      const halfH = H * 0.46

      // Avance du buffer
      const dt = now - lastShiftTime
      const interval = 1000 / SAMPLES_PER_SECOND
      if (dt >= interval) {
        const shifts = Math.min(N, Math.floor(dt / interval))
        for (let s = 0; s < shifts; s++) {
          const tt = t - (shifts - s) * (interval / 1000)
          const jitter = (Math.sin(tt * 73.13) * 43758.5453) % 1
          const j = jitter - Math.floor(jitter)
          buffer.copyWithin(0, 1)
          buffer[N - 1] = sampleAmplitude(tt, j)
        }
        lastShiftTime = now
      }

      ctx.clearRect(0, 0, W, H)

      const stepX = W / (N - 1)
      // Atténuation latérale prononcée → la wave se résorbe en ligne droite
      // aux extrémités (effet évanescent réf. image 1)
      const edge = (i: number) => {
        const u = i / (N - 1)
        return Math.pow(Math.sin(u * Math.PI), 1.25)
      }

      // Dégradé horizontal chromatique qui défile lentement.
      // Stops calculés en absolu sur [0,1] avec un drift cyclique et un
      // tri pour respecter l'ordre requis par addColorStop.
      const palette: Array<[number, number, number]> = [
        [126, 132, 140], // lavender
        [238, 226, 223], // cream
        [194, 128, 63], // raspberry
        [238, 215, 197], // peach
        [194, 128, 63], // raspberry
        [126, 132, 140], // lavender
      ]
      const drift = ((t * 0.04) % 1 + 1) % 1 // garanti [0,1)
      const grad = ctx.createLinearGradient(0, 0, W, 0)
      const stopsList: Array<{ pos: number; rgb: [number, number, number] }> = []
      for (let s = 0; s < palette.length; s++) {
        let pos = s / (palette.length - 1) + drift
        // ramène dans [0,1]
        pos = pos - Math.floor(pos)
        // clamp défensif pour absorber tout reste de précision float
        if (pos < 0) pos = 0
        if (pos > 1) pos = 1
        stopsList.push({ pos, rgb: palette[s] })
      }
      stopsList.sort((a, b) => a.pos - b.pos)
      // S'assurer qu'il y a un stop à 0 et un à 1 (sinon visuel coupé)
      if (stopsList[0].pos > 0) {
        stopsList.unshift({ pos: 0, rgb: stopsList[stopsList.length - 1].rgb })
      }
      if (stopsList[stopsList.length - 1].pos < 1) {
        stopsList.push({ pos: 1, rgb: stopsList[0].rgb })
      }
      for (const s of stopsList) {
        grad.addColorStop(s.pos, `rgb(${s.rgb[0]},${s.rgb[1]},${s.rgb[2]})`)
      }

      ctx.strokeStyle = grad
      ctx.lineCap = 'round'
      ctx.lineJoin = 'round'
      // Glow doux pour les lignes (effet luminescent réf. image 1)
      ctx.shadowBlur = 6 * dpr
      ctx.shadowColor = 'rgba(194,128,63,0.55)'

      // Tracé des K lignes (top), puis miroir bas
      for (let k = 0; k < K; k++) {
        const f = lineFactors[k]
        // Opacité décroissante très lente vers l'extérieur : toutes les lignes
        // restent franchement visibles. Centre légèrement plus appuyé.
        const alpha = 0.85 - 0.35 * f
        const width = (1.4 + (1 - f) * 0.6) * dpr

        ctx.globalAlpha = alpha
        ctx.lineWidth = width

        // TOP
        ctx.beginPath()
        for (let i = 0; i < N; i++) {
          const x = i * stepX
          const a = buffer[i] * halfH * edge(i) * f
          const y = centerY - a
          if (i === 0) ctx.moveTo(x, y)
          else {
            const prevX = (i - 1) * stepX
            const prevA = buffer[i - 1] * halfH * edge(i - 1) * f
            const cx = (prevX + x) / 2
            const cy = centerY - (prevA + a) / 2
            ctx.quadraticCurveTo(prevX, centerY - prevA, cx, cy)
            if (i === N - 1) ctx.lineTo(x, y)
          }
        }
        ctx.stroke()

        // BOTTOM (miroir)
        ctx.beginPath()
        for (let i = 0; i < N; i++) {
          const x = i * stepX
          const a = buffer[i] * halfH * edge(i) * f
          const y = centerY + a
          if (i === 0) ctx.moveTo(x, y)
          else {
            const prevX = (i - 1) * stepX
            const prevA = buffer[i - 1] * halfH * edge(i - 1) * f
            const cx = (prevX + x) / 2
            const cy = centerY + (prevA + a) / 2
            ctx.quadraticCurveTo(prevX, centerY + prevA, cx, cy)
            if (i === N - 1) ctx.lineTo(x, y)
          }
        }
        ctx.stroke()
      }

      ctx.shadowBlur = 0
      ctx.globalAlpha = 1
    }

    const tick = (now: number) => {
      if (!running) {
        raf = 0
        return
      }
      ensureSize()
      drawFrame(now)
      raf = requestAnimationFrame(tick)
    }

    const startLoop = () => {
      if (raf !== 0 || !running) return
      raf = requestAnimationFrame(tick)
    }

    const stopLoop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    if (prefersReducedMotion) {
      ensureSize()
      drawFrame(performance.now())
      return () => {
        ro.disconnect()
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          running = e.isIntersecting
          if (running) startLoop()
          else stopLoop()
        }
      },
      { threshold: 0 }
    )
    io.observe(wrapper)

    const onVis = () => {
      if (document.hidden) stopLoop()
      else {
        running = true
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    startLoop()

    return () => {
      stopLoop()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      ro.disconnect()
    }
  }, [samples, lines])

  return (
    <div
      ref={wrapperRef}
      className={className ?? ''}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-hidden="true"
      />
      {/* Fondus latéraux */}
      <div
        className="absolute inset-y-0 left-0 w-16 sm:w-24 md:w-32 pointer-events-none"
        style={{ background: `linear-gradient(to right, ${backgroundColor} 0%, transparent 100%)` }}
      />
      <div
        className="absolute inset-y-0 right-0 w-16 sm:w-24 md:w-32 pointer-events-none"
        style={{ background: `linear-gradient(to left, ${backgroundColor} 0%, transparent 100%)` }}
      />
    </div>
  )
}
