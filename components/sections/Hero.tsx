'use client'

import { useEffect, useRef, useCallback, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, Pause } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const scrollProgressRef = useRef(0)
  const barsRef = useRef<number[]>([])

  useEffect(() => {
    const barCount = 80
    barsRef.current = new Array(barCount).fill(0).map(() => Math.random() * 0.3 + 0.1)
  }, [])

  const drawWaveform = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    const width = rect.width
    const height = rect.height
    const centerY = height / 2
    const barCount = barsRef.current.length
    const barWidth = (width / barCount) * 0.6
    const gap = (width / barCount) * 0.4

    ctx.clearRect(0, 0, width, height)

    const intensity = scrollProgressRef.current
    const time = Date.now() * 0.002

    barsRef.current.forEach((baseHeight, i) => {
      const wave1 = Math.sin(time + i * 0.15) * 0.5 + 0.5
      const wave2 = Math.sin(time * 1.5 + i * 0.1) * 0.5 + 0.5
      const noise = Math.sin(time * 0.5 + i * 0.3 + Math.sin(time + i * 0.2)) * 0.5 + 0.5

      const combinedWave = wave1 * 0.4 + wave2 * 0.3 + noise * 0.3
      const barHeight =
        baseHeight * height * 0.4 * (0.3 + combinedWave * 0.7 * (0.5 + intensity * 0.5))

      const x = i * (barWidth + gap) + gap / 2

      const grayValue = Math.floor(209 - intensity * 58)
      ctx.fillStyle = `rgb(${grayValue}, ${grayValue - 3}, ${grayValue - 7})`

      const barY = centerY - barHeight / 2
      ctx.fillRect(x, barY, barWidth, barHeight)
    })

    animationFrameRef.current = requestAnimationFrame(drawWaveform)
  }, [])

  useEffect(() => {
    drawWaveform()
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [drawWaveform])

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const name = nameRef.current
    const subtitle = subtitleRef.current
    const player = playerRef.current

    if (!section || !content || !name || !subtitle || !player) return

    const revealTl = gsap.timeline({ delay: 1.5 })

    // Chaque mot dans un conteneur whitespace-nowrap pour éviter les coupures en milieu de mot
    const words = ['TIFFANY', 'HENGEBAERT']
    name.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block whitespace-nowrap">${word
            .split('')
            .map((char) => `<span class="inline-block opacity-0 translate-y-8">${char}</span>`)
            .join('')}</span>`
      )
      .join(' ')

    revealTl.to(name.querySelectorAll('span span'), {
      opacity: 1,
      y: 0,
      duration: 0.8,
      stagger: 0.03,
      ease: 'power4.out',
    })

    revealTl.fromTo(
      subtitle,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )

    revealTl.fromTo(
      player,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.3'
    )

    const scrollTl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: '+=30%',
        pin: true,
        scrub: 0.3,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
        },
      },
    })

    scrollTl.to(
      content,
      {
        opacity: 0,
        scale: 0.95,
        ease: 'none',
      },
      0
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative h-screen w-full overflow-x-hidden overflow-y-hidden bg-cream"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ opacity: 0.6 }}
      />

      <div
        ref={contentRef}
        className="relative z-10 h-full flex flex-col justify-center"
      >
        <div className="w-full text-center">
          <h1
            ref={nameRef}
            className="font-serif leading-[0.95] text-ink mb-4 uppercase text-center block"
            style={{ fontSize: 'clamp(1.6rem, 8vw, 130px)' }}
          >
            TIFFANY HENGEBAERT
          </h1>

          <p
            ref={subtitleRef}
            className="font-sans text-xs md:text-sm tracking-[0.4em] uppercase text-charcoal mb-12 opacity-0"
          >
            Comédienne de voix
          </p>

          <div
            ref={playerRef}
            className="inline-flex items-center gap-4 bg-paper/80 backdrop-blur-sm px-6 py-4 rounded-sm shadow-sm border border-border/50 opacity-0"
          >
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-12 h-12 rounded-full bg-ink text-cream flex items-center justify-center hover:bg-ink/90 transition-all duration-300 hover:scale-105 cursor-pointer"
              aria-label={isPlaying ? 'Pause' : 'Lecture'}
            >
              {isPlaying ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
            </button>
            <div className="text-left">
              <p className="font-sans text-xs tracking-wider uppercase text-charcoal">
                Démo récente
              </p>
              <p className="font-serif text-lg text-ink">&ldquo;L&apos;Essentiel&rdquo;</p>
            </div>
            <div className="hidden sm:flex items-center gap-1 ml-4">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className={`w-1 bg-ink/30 rounded-full transition-all duration-300 ${
                    isPlaying ? 'animate-pulse' : ''
                  }`}
                  style={{
                    height: `${12 + i * 4}px`,
                    animationDelay: `${i * 0.1}s`,
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3">
          <span className="font-sans text-[9px] tracking-[0.35em] uppercase text-charcoal/65">
            Défiler
          </span>
          {/* Chevron animé — rebondit en boucle */}
          <div className="flex flex-col items-center gap-1">
            {[0, 1].map((i) => (
              <svg
                key={i}
                width="16"
                height="9"
                viewBox="0 0 16 9"
                fill="none"
                className="animate-bounce-chevron text-ink/50"
                style={{ animationDelay: `${i * 0.18}s`, opacity: 1 - i * 0.4 }}
              >
                <path
                  d="M1 1L8 8L15 1"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
