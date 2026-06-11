'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import ShaderBackground from '@/components/ui/shader-background'

gsap.registerPlugin(ScrollTrigger)

export default function Hero() {
  const sectionRef = useRef<HTMLElement>(null)
  const portraitRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<HTMLDivElement>(null)
  const nameRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const taglineRef = useRef<HTMLDivElement>(null)
  const ctaPrimaryRef = useRef<HTMLButtonElement>(null)
  const ctaSecondaryRef = useRef<HTMLButtonElement>(null)
  const waveRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const name = nameRef.current
    const subtitle = subtitleRef.current
    const portrait = portraitRef.current
    const frame = frameRef.current
    const tagline = taglineRef.current
    const ctaP = ctaPrimaryRef.current
    const ctaS = ctaSecondaryRef.current
    const wave = waveRef.current
    if (!section || !name || !subtitle || !portrait || !frame || !tagline || !ctaP || !ctaS || !wave) return
    const frameImg = frame.querySelector('img')

    // État initial via gsap.set (PAS via classe Tailwind opacity-0)
    // — sinon le ScrollTrigger capture opacity:0 comme initial et reste à 0
    // après scroll arrière. C'était le bug "photo invisible quand on remonte".
    gsap.set([portrait, subtitle, tagline], { opacity: 0 })
    gsap.set(portrait, { scale: 1.03, y: 20 })
    gsap.set(subtitle, { y: 14, filter: 'blur(6px)' })
    gsap.set(tagline, { y: 10 })
    // Photo : dévoilement "rideau" de bas en haut + léger zoom (classique mais marquant)
    gsap.set(frame, { clipPath: 'inset(100% 0% 0% 0%)' })
    if (frameImg) gsap.set(frameImg, { scale: 1.35 })

    // ─── Reveal initial (lettre par lettre + portrait + texte) ──────
    const words = ['TIFFANY', 'VOIX OFF']
    name.innerHTML = words
      .map(
        (word) =>
          `<span class="inline-block whitespace-nowrap mr-[0.18em] last:mr-0">${word
            .split('')
            .map(
              (char) =>
                `<span class="inline-block" style="opacity:0;transform:translateY(2rem);filter:blur(10px)">${
                  char === ' ' ? '&nbsp;' : char
                }</span>`
            )
            .join('')}</span>`
      )
      .join('<br />')

    const isMobile = window.matchMedia('(max-width: 768px)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    const intro = gsap.timeline({ delay: 1.3 })

    intro.to(portrait, {
      opacity: 1, scale: 1, y: 0, duration: 1.1, ease: 'power3.out',
    })

    intro.to(
      frame,
      { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'power4.inOut' },
      '<0.1'
    )

    if (frameImg) {
      intro.to(frameImg, { scale: 1, duration: 1.8, ease: 'power3.out' }, '<')
    }

    intro.to(
      name.querySelectorAll('span span'),
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.9, stagger: 0.025, ease: 'power4.out' },
      '-=0.85'
    )

    intro.to(
      subtitle,
      { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.7, ease: 'power3.out' },
      '-=0.5'
    )

    intro.to(
      tagline,
      { opacity: 1, y: 0, duration: 0.6, ease: 'power3.out' },
      '-=0.4'
    )

    // ─── Dispersion au scroll — créée APRÈS l'intro pour figer
    // les valeurs de départ à leur état "révélé" (1.0). Sinon scrub
    // capture l'état initial (0) et reste cassé en remontée.
    let dispersion: gsap.core.Timeline | null = null

    intro.eventCallback('onComplete', () => {
      if (prefersReducedMotion) return // pas d'effet pour les sensibles

      dispersion = gsap.timeline({
        defaults: { ease: 'none', force3D: true },
        scrollTrigger: {
          trigger: section,
          start: 'top top',
          end: 'bottom top',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      })

      if (isMobile) {
        dispersion
          .to(portrait, { y: -80, scale: 0.85, opacity: 0 }, 0)
          .to(subtitle, { y: -40, opacity: 0 }, 0)
          .to(name, { y: -60, scale: 0.92, opacity: 0 }, 0.05)
          .to(ctaP, { y: 60, opacity: 0 }, 0)
          .to(ctaS, { y: 80, opacity: 0 }, 0.05)
          .to(wave, { y: 30, opacity: 0.3 }, 0)
      } else {
        dispersion
          .to(portrait, { x: -180, y: -40, rotation: -3, scale: 0.9, opacity: 0 }, 0)
          .to(subtitle, { y: -80, opacity: 0 }, 0)
          .to(name, { y: -120, scale: 0.95, opacity: 0 }, 0.05)
          .to(ctaP, { x: -80, y: 60, opacity: 0 }, 0)
          .to(ctaS, { x: 80, y: 60, opacity: 0 }, 0)
          .to(wave, { y: 40, opacity: 0.4 }, 0)
      }

      // Refresh nécessaire pour que ScrollTrigger reprenne les bonnes valeurs
      ScrollTrigger.refresh()
    })

    return () => {
      intro.kill()
      dispersion?.kill()
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative w-full overflow-hidden bg-studio min-h-[640px] h-[100svh]"
    >
      {/* Image de fond — studio, tout au fond (sous halos, grain, contenu, ondes) */}
      <Image
        src="/bg-tiffany-voix-off.png"
        alt=""
        fill
        priority
        sizes="100vw"
        className="object-cover object-center pointer-events-none select-none"
      />

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

      {/* Contenu principal — centré verticalement ET horizontalement sur l'image
          (absolute inset-0 + flex items-center). Les ondes sont passées en
          fond absolu (bottom), donc le bloc photo+texte+boutons est vraiment
          au milieu de l'image. */}
      <div className="absolute inset-0 z-10 flex items-center">
        <div className="w-full max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-12 items-center px-5 sm:px-6 md:px-10 lg:pl-24 lg:pr-10 pb-[18vh] sm:pb-[14vh] md:pb-0">
        {/* Portrait */}
        <div className="md:col-span-5 lg:col-span-5 flex justify-center md:justify-end">
          <div ref={portraitRef} className="relative">
            {/* Halos de la photo */}
            <div className="absolute -inset-4 bg-gradient-to-br from-raspberry/35 via-transparent to-lavender/30 blur-2xl pointer-events-none" />
            <div className="absolute -inset-1 bg-gradient-to-br from-peach/40 to-cream/10 pointer-events-none" />

            <div
              ref={frameRef}
              className="relative w-[190px] h-[250px] sm:w-[230px] sm:h-[305px] md:w-[330px] md:h-[440px] lg:w-[380px] lg:h-[500px] overflow-hidden shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)] ring-1 ring-cream/15"
            >
              <Image
                src="/img/tiffany-hero.jpg"
                alt="Tiffany — Comédienne voix off"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 55vw, 32vw"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio/40 via-transparent to-transparent" />
            </div>
          </div>
        </div>

        {/* Texte */}
        <div className="md:col-span-7 lg:col-span-7 text-center md:text-left">
          <h1
            ref={nameRef}
            className="font-serif leading-[0.92] text-cream uppercase tracking-[-0.01em]"
            style={{ fontSize: 'clamp(1.9rem, 8vw, 8rem)' }}
          >
            TIFFANY<br />VOIX OFF
          </h1>

          <p
            ref={subtitleRef}
            className="font-sans text-xs sm:text-sm md:text-base font-medium tracking-[0.35em] sm:tracking-[0.4em] uppercase text-cream/80 mt-3 sm:mt-5 flex items-baseline justify-center md:justify-start gap-2.5"
          >
            <span className="text-cream text-[0.7em] leading-none translate-y-[-0.1em]">●</span>
            <span className="text-left">
              Narratrice de livre audio ·<br />
              Comédienne voix off
            </span>
          </p>

          <div ref={taglineRef} className="mt-3 sm:mt-5 md:mt-7">
            <div className="flex justify-center md:justify-start gap-3 flex-wrap">
              <button
                ref={ctaPrimaryRef}
                onClick={() =>
                  document.getElementById('livres-audio')?.scrollIntoView({ behavior: 'smooth' })
                }
                className="group inline-flex items-center gap-3 px-6 py-3 rounded-full bg-studio text-cream border border-cream/25 font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-studio hover:border-cream/45 hover:scale-[1.02] shadow-[0_10px_30px_-14px_rgba(0,0,0,0.8)]"
              >
                Écouter mes démos
                <span className="inline-block w-0 group-hover:w-3 h-px bg-cream transition-all duration-300" />
              </button>
              <button
                ref={ctaSecondaryRef}
                onClick={() => document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' })}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-cream text-studio font-sans text-xs font-medium tracking-[0.2em] uppercase transition-all duration-300 hover:bg-cream/90 hover:scale-[1.02] shadow-[0_10px_30px_-12px_rgba(0,0,0,0.7)]"
              >
                Me contacter
              </button>
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Cadre ondes — bande basse en fond absolu (sous le contenu, z-[1]).
          Hauteur bornée ; le shader garde les courbes dans le cadre,
          overflow-hidden empêche tout débordement. */}
      <div
        ref={waveRef}
        className="absolute bottom-0 left-0 right-0 z-[1] overflow-hidden pointer-events-none h-[20vh] min-h-[120px] max-h-[280px] sm:h-[24vh] md:h-[28vh]"
      >
        <ShaderBackground
          className="absolute inset-0 h-full w-full"
          verticalExtent={5.5}
          speed={1.7}
          colors={['#00E5FF', '#FF2BD6', '#9D4EFF']}
        />
      </div>
    </section>
  )
}
