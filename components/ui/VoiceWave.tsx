'use client'

import { useEffect, useRef } from 'react'

/**
 * VoiceWave — Waveform style "enregistrement en cours" type Super Whisper /
 * Apple Voice Memo. Barres verticales fines arrondies, dont l'enveloppe
 * globale forme une onde organique qui defile lentement, avec un detail
 * rapide qui donne l'aspect "signal audio vivant".
 *
 * Couleurs : palette voix-off (cream → raspberry sur les pics).
 */

interface VoiceWaveProps {
  className?: string
  fadeToBackground?: boolean
  /** Densité de barres (rapport au pixel — 0.18 ≈ 1 barre tous les 5.5px). */
  density?: number
  /** Couleur de fond pour les fondus latéraux. Par défaut studio (#393E41). */
  backgroundColor?: string
}

const COLOR_BASE_R = 238
const COLOR_BASE_G = 226
const COLOR_BASE_B = 223
const COLOR_PEAK_R = 203
const COLOR_PEAK_G = 118
const COLOR_PEAK_B = 158

export default function VoiceWave({
  className,
  fadeToBackground = true,
  density = 0.18,
  backgroundColor = '#393E41',
}: VoiceWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let dpr = window.devicePixelRatio || 1

    const ensureSize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = window.devicePixelRatio || 1
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

    const start = performance.now()
    // Bruit déterministe par barre — chaque barre a sa "signature" stable
    const makeSeeds = (n: number) =>
      Array.from({ length: n }, (_, i) => {
        const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453
        return x - Math.floor(x)
      })
    let seeds = makeSeeds(256)

    const draw = () => {
      ensureSize()
      const W = canvas.width
      const H = canvas.height
      if (W < 4 || H < 4) {
        raf = requestAnimationFrame(draw)
        return
      }

      const centerY = H / 2
      const t = (performance.now() - start) * 0.001

      // Calcul du nombre de barres en fonction de la densité
      const barCount = Math.max(20, Math.floor(W * density / dpr))
      if (seeds.length < barCount) seeds = makeSeeds(barCount + 32)

      const slot = W / barCount
      const barW = Math.max(1.5 * dpr, slot * 0.42)
      const padX = (slot - barW) / 2

      ctx.clearRect(0, 0, W, H)

      // Pré-calcul de toutes les barres pour permettre un rendu en 2 passes
      // (glow + barre nette) sans recalculer
      type Bar = { x: number; y: number; w: number; h: number; intensity: number; edge: number }
      const bars: Bar[] = []

      for (let i = 0; i < barCount; i++) {
        const u = barCount === 1 ? 0.5 : i / (barCount - 1) // 0..1
        const seed = seeds[i] ?? 0

        // Enveloppe globale : 3 sinusoïdes superposées qui défilent à des
        // vitesses différentes → effet "groupes d'amplitude" mouvants
        const env1 = Math.sin(u * Math.PI * 3.5 + t * 1.05) * 0.5 + 0.5
        const env2 = Math.sin(u * Math.PI * 6.2 - t * 0.7 + 1.4) * 0.5 + 0.5
        const env3 = Math.sin(u * Math.PI * 1.6 + t * 0.32) * 0.5 + 0.5
        const envelope = env1 * 0.45 + env2 * 0.3 + env3 * 0.25

        // Détail rapide : la "texture" du signal vocal
        const detail =
          Math.sin(t * 11 + seed * 80) * 0.16 +
          Math.sin(t * 6.7 + seed * 47) * 0.1 +
          (seed - 0.5) * 0.08

        // Atténuation aux bords renforcée (évanescence prononcée)
        // pow > 1 → s'éteint plus vite aux extrémités
        const edgeRaw = Math.sin(u * Math.PI) // 0 → 1 → 0
        const edge = Math.pow(edgeRaw, 1.35)

        const energy = Math.max(0, envelope * (0.85 + detail) * edge)
        const minH = 1.5 * dpr
        const maxH = H * 0.88
        const barH = Math.max(minH, Math.min(maxH, energy * H * 0.95))

        bars.push({
          x: i * slot + padX,
          y: centerY - barH / 2,
          w: barW,
          h: barH,
          intensity: Math.min(1, energy * 1.2),
          edge,
        })
      }

      // ─── Pass 1 : halo doux sous les barres (sensation "évanescent") ───
      ctx.save()
      ctx.shadowBlur = 16 * dpr
      ctx.shadowColor = '#CB769E'
      for (const b of bars) {
        if (b.intensity < 0.35) continue // glow seulement sur les pics
        const r = Math.round(COLOR_PEAK_R)
        const g = Math.round(COLOR_PEAK_G)
        const blue = Math.round(COLOR_PEAK_B)
        ctx.fillStyle = `rgba(${r}, ${g}, ${blue}, ${b.intensity * 0.5})`
        const radius = Math.min(b.w / 2, b.h / 2)
        ctx.beginPath()
        roundedRect(ctx, b.x, b.y, b.w, b.h, radius)
        ctx.fill()
      }
      ctx.restore()

      // ─── Pass 2 : barre nette par-dessus ───
      for (const b of bars) {
        const i = b.intensity
        const r = Math.round(COLOR_BASE_R + (COLOR_PEAK_R - COLOR_BASE_R) * i)
        const g = Math.round(COLOR_BASE_G + (COLOR_PEAK_G - COLOR_BASE_G) * i)
        const blue = Math.round(COLOR_BASE_B + (COLOR_PEAK_B - COLOR_BASE_B) * i)
        ctx.fillStyle = `rgb(${r}, ${g}, ${blue})`
        // L'alpha global s'éteint avec edge → vraie évanescence aux bords
        ctx.globalAlpha = Math.min(1, 0.35 + b.edge * 0.55 + i * 0.15)
        const radius = Math.min(b.w / 2, b.h / 2)
        ctx.beginPath()
        roundedRect(ctx, b.x, b.y, b.w, b.h, radius)
        ctx.fill()
      }

      ctx.globalAlpha = 1
      raf = requestAnimationFrame(draw)
    }

    function roundedRect(
      ctx: CanvasRenderingContext2D,
      x: number,
      y: number,
      w: number,
      h: number,
      r: number
    ) {
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.quadraticCurveTo(x + w, y, x + w, y + r)
      ctx.lineTo(x + w, y + h - r)
      ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h)
      ctx.lineTo(x + r, y + h)
      ctx.quadraticCurveTo(x, y + h, x, y + h - r)
      ctx.lineTo(x, y + r)
      ctx.quadraticCurveTo(x, y, x + r, y)
    }

    raf = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [density])

  return (
    <div
      className={className ?? ''}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        aria-hidden="true"
      />
      {fadeToBackground && (
        <>
          {/* Fondus latéraux élargis pour évanescence prononcée */}
          <div
            className="absolute inset-y-0 left-0 w-24 sm:w-32 md:w-48 lg:w-56 pointer-events-none"
            style={{ background: `linear-gradient(to right, ${backgroundColor} 0%, transparent 100%)` }}
          />
          <div
            className="absolute inset-y-0 right-0 w-24 sm:w-32 md:w-48 lg:w-56 pointer-events-none"
            style={{ background: `linear-gradient(to left, ${backgroundColor} 0%, transparent 100%)` }}
          />
          {/* Halo central rose doux derrière les pics — sensation "souffle lumineux" */}
          <div
            className="absolute inset-0 pointer-events-none mix-blend-screen opacity-30"
            style={{
              background:
                'radial-gradient(ellipse 45% 80% at 50% 50%, rgba(203,118,158,0.35), transparent 70%)',
            }}
          />
        </>
      )}
    </div>
  )
}
