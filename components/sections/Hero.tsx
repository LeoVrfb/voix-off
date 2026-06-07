'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import VoiceWave from '@/components/ui/VoiceWave'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const quoteRef = useRef<HTMLParagraphElement>(null)
  const ctaPrimaryRef = useRef<HTMLButtonElement>(null)
  const ctaSecondaryRef = useRef<HTMLButtonElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const name = nameRef.current
    const subtitle = subtitleRef.current
    const portrait = portraitRef.current
    const tagline = taglineRef.current
    const quote = quoteRef.current
    const ctaP = ctaPrimaryRef.current
    const ctaS = ctaSecondaryRef.current
    const wave = waveRef.current
    if (!section || !name || !subtitle || !portrait || !tagline || !quote || !ctaP || !ctaS || !wave) return

    // ─── Reveal initial ────────────────────────────────────────────
    const words = ['TIFFANY', 'VOIX OFF']
    name.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block whitespace-nowrap mr-[0.18em] last:mr-0">${word
            .split('')
            .map(
              (char) =>
                `<span class="inline-block opacity-0 translate-y-8" style="filter: blur(10px)">${
                  char === ' ' ? '&nbsp;' : char
                }</span>`
            )
            .join('')}</span>`
      )
      .join(' ')

    const intro = gsap.timeline({ delay: 1.3 })

    intro.fromTo(
      portrait,
      { opacity: 0, scale: 1.05, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out' }
    )

    intro.to(
      name.querySelectorAll('span span'),
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.025, ease: 'power4.out' },
      '-=0.85'
    )

    intro.fromTo(
      subtitle,
      { opacity: 0, y: 14, filter: 'blur(6px)' },
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
      '-=0.5'
    )

    intro.fromTo(
      tagline,
      { opacity: 0, y: 10 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )

    // ─── Dispersion au scroll ──────────────────────────────────────
    // Chaque élément part dans une direction différente. Mobile : tout part
    // vers le bas avec décalage; desktop : vraie dispersion multi-directionnelle.
    const isMobile = window.matchMedia('(max-width: 768px)').matches

    const dispersion = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top top',
        end: 'bottom top',
        scrub: 0.6,
      },
    })

    if (isMobile) {
      // Mobile : effet souffle vertical, opacités/blur décalés
      dispersion
        .to(portrait, { y: -80, scale: 0.85, opacity: 0, filter: 'blur(6px)', ease: 'none' }, 0)
        .to(subtitle, { y: -40, opacity: 0, ease: 'none' }, 0)
        .to(name, { y: -60, scale: 0.92, opacity: 0, filter: 'blur(4px)', ease: 'none' }, 0.05)
        .to(quote, { y: 30, opacity: 0, ease: 'none' }, 0)
        .to(ctaP, { y: 60, opacity: 0, ease: 'none' }, 0)
        .to(ctaS, { y: 80, opacity: 0, ease: 'none' }, 0.05)
        .to(wave, { y: 30, opacity: 0.3, ease: 'none' }, 0)
    } else {
      // Desktop : dispersion en croix
      dispersion
        .to(portrait, { x: -180, y: -40, rotation: -3, scale: 0.9, opacity: 0, filter: 'blur(4px)', ease: 'none' }, 0)
        .to(subtitle, { y: -80, opacity: 0, ease: 'none' }, 0)
        .to(name, { y: -120, scale: 0.95, opacity: 0, filter: 'blur(6px)', ease: 'none' }, 0.05)
        .to(quote, { x: 100, opacity: 0, ease: 'none' }, 0)
        .to(ctaP, { x: -80, y: 60, opacity: 0, ease: 'none' }, 0)
        .to(ctaS, { x: 80, y: 60, opacity: 0, ease: 'none' }, 0)
        .to(wave, { y: 40, opacity: 0.4, ease: 'none' }, 0)
    }

    return () => {
      intro.kill()
      dispersion.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden bg-studio min-h-[640px] h-[100svh] flex flex-col"
    >
      {/* Halos colores en arriere-plan — restent souples */}
      <div className="absolute -top-40 -left-32 w-[40rem] h-[40rem] rounded-full bg-lavender/15 blur-[120px] pointer-events-none animate-glow-pulse" />
      <div
        className="absolute -bottom-32 -right-24 w-[36rem] h-[36rem] rounded-full bg-raspberry/15 blur-[120px] pointer-events-none animate-glow-pulse"
        style={{ animationDelay: '2s' }}
      />

      {/* Grain studio */}
      <div
        className="absolute inset-0 opacity-[0.06] mix-blend-soft-light pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* Contenu principal — flex-1, peut shrink, centre verticalement */}
      <div className="relative z-10 flex-1 min-h-0 grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-12 items-center px-5 sm:px-6 md:px-12 lg:px-20 pt-24 md:pt-28 pb-6 md:pb-10">
        {/* Portrait */}
        <div className="md:col-span-5 lg:col-span-4 flex justify-center md:justify-end">
          <div ref={portraitRef} className="relative opacity-0">
            {/* Halos de la photo */}
            <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-raspberry/35 via-transparent to-lavender/30 blur-2xl pointer-events-none" />
            <div className="absolute -inset-1 rounded-[2rem] bg-gradient-to-br from-peach/40 to-cream/10 pointer-events-none" />

            <div className="relative w-[140px] h-[185px] sm:w-[180px] sm:h-[240px] md:w-[230px] md:h-[300px] lg:w-[280px] lg:h-[370px] rounded-[1.5rem] sm:rounded-[1.75rem] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-cream/15">
              <Image
                src="/profil-Tiffany.png"
                alt="Tiffany — Comédienne voix off"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 40vw, 30vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio/40 via-transparent to-transparent" />
            </div>

            <div className="absolute -bottom-2 -right-2 sm:-bottom-3 sm:-right-3 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-raspberry shadow-[0_0_30px_rgba(203,118,158,0.7)]" />
          </div>
        </div>

        {/* Texte */}
        <div className="md:col-span-7 lg:col-span-8 text-center md:text-left">
          <p
            ref={subtitleRef}
            className="font-sans text-[10px] sm:text-xs font-medium tracking-[0.4em] sm:tracking-[0.45em] uppercase text-cream/80 mb-3 sm:mb-5 opacity-0"
          >
            <span className="text-raspberry">●</span> Comédienne · Narratrice · Voix off
          </p>

          <h1
            ref={nameRef}
            className="font-serif leading-[0.92] text-cream uppercase tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.9rem, 8vw, 8rem)' }}
          >
            TIFFANY VOIX OFF
          </h1>

          <div ref={taglineRef} className="mt-3 sm:mt-5 md:mt-7 opacity-0">
            <p
              ref={quoteRef}
              className="font-serif italic text-cream/90 text-sm sm:text-lg md:text-2xl text-balance max-w-xl mx-auto md:mx-0"
            >
              « Donner souffle aux mots, du roman intime au spot qui claque. »
            </p>
            <div className="mt-4 sm:mt-5 md:mt-6 flex justify-center md:justify-start gap-3 flex-wrap">
              <button
                ref={ctaPrimaryRef}
                onClick={() =>
                  document.getElementById('livres-audio')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-raspberry text-cream font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-raspberry/90 hover:scale-[1.02] shadow-[0_10px_30px_-10px_rgba(203,118,158,0.6)]"
              >
                Écouter les démos
                <span className="inline-block w-0 group-hover:w-3 h-px bg-cream transition-all duration-300" />
              </button>
              <button
                ref={ctaSecondaryRef}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-cream/30 text-cream font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-cream/10 hover:border-cream/55"
              >
                Me contacter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Waveform vocale — style enregistrement en cours, zone dediee en bas */}
      <div ref={waveRef} className="relative z-0 shrink-0 h-28 sm:h-32 md:h-40 lg:h-44 w-full">
        <VoiceWave className="absolute inset-0" />
      </div>
    </section>
  )
}
