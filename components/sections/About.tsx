'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import BlurRevealText from '@/components/ui/BlurRevealText'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const body = bodyRef.current
    const image = imageRef.current
    const signature = signatureRef.current

    if (!section || !body || !image || !signature) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
      },
    })

    // heading géré par BlurRevealText (motion)
    tl.fromTo(body, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, '-=0.5')
    tl.fromTo(
      image,
      { opacity: 0, x: 60, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, ease: 'none' },
      '-=0.6'
    )
    tl.fromTo(signature, { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'none' }, '-=0.3')

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <div className="lg:col-span-5 order-2 lg:order-1">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-8">
              <BlurRevealText text="La voix au service des mots" mode="word" stagger={0.07} />
            </h2>

            <div ref={bodyRef} className="space-y-6 opacity-0">
              <p className="font-sans text-base md:text-lg text-charcoal leading-relaxed">
                Formée au conservatoire et passionnée par la mise en voix, j&apos;apporte à chaque
                projet une chaleur et une précision qui font la différence. De la narration intime
                d&apos;un roman à l&apos;énergie d&apos;un spot publicitaire, ma voix est le lien
                entre vos mots et votre audience.
              </p>

              <p className="font-sans text-base md:text-lg text-charcoal leading-relaxed">
                Basée en Île-de-France, je travaille avec des clients du monde entier — maisons
                d&apos;édition, agences créatives, institutions culturelles, marques. Chaque projet
                est une invitation à trouver le ton juste, celui qui résonne et perdure.
              </p>

              <p className="font-sans text-base md:text-lg text-charcoal leading-relaxed">
                Qu&apos;il s&apos;agisse d&apos;un spot de 30 secondes ou d&apos;un livre audio de
                plusieurs heures, j&apos;aborde chaque enregistrement avec la même exigence :
                précision, émotion, et cette qualité particulière qui fait que l&apos;auditeur se
                laisse emporter.
              </p>
            </div>

            <p
              ref={signatureRef}
              className="font-serif text-3xl md:text-4xl text-ink mt-10 italic opacity-0"
            >
              Tiffany
            </p>
          </div>

          <div className="lg:col-span-7 order-1 lg:order-2">
            <div ref={imageRef} className="relative opacity-0">
              <div className="aspect-[3/4] max-w-lg mx-auto lg:max-w-none relative">
                {/* Carré décoratif gold — coin haut-gauche */}
                <div className="absolute -top-5 -left-5 w-24 h-24 bg-gold/20 -z-10 pointer-events-none" />
                {/* Carré décoratif gold — coin bas-droit — même taille */}
                <div className="absolute -bottom-5 -right-5 w-24 h-24 bg-gold/20 -z-10 pointer-events-none" />

                <div className="absolute -inset-3 border border-ink/10 pointer-events-none" />
                <div className="absolute -inset-6 border border-ink/5 pointer-events-none" />

                <Image
                  src="/profil-Tiffany.png"
                  alt="Tiffany Hengebaert - Comédienne de voix"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />

                <div className="absolute inset-0 bg-gradient-to-t from-cream/20 to-transparent pointer-events-none" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Vagues sinusoïdales animées */}
      <div className="absolute bottom-0 left-0 right-0 h-32 pointer-events-none overflow-hidden">
        {/* Vague 1 — lente */}
        <svg
          className="absolute top-0 left-0 h-full animate-wave-flow"
          style={{ width: '200%', animationDuration: '14s' }}
          viewBox="0 0 2400 128"
          preserveAspectRatio="none"
        >
          <path
            d="M0,64 C200,20 400,108 600,64 C800,20 1000,108 1200,64 C1400,20 1600,108 1800,64 C2000,20 2200,108 2400,64"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="1.2"
            opacity="0.18"
          />
        </svg>
        {/* Vague 2 — plus rapide, inversée */}
        <svg
          className="absolute top-0 left-0 h-full animate-wave-flow"
          style={{ width: '200%', animationDuration: '9s', animationDirection: 'reverse' }}
          viewBox="0 0 2400 128"
          preserveAspectRatio="none"
        >
          <path
            d="M0,80 C200,110 400,50 600,80 C800,110 1000,50 1200,80 C1400,110 1600,50 1800,80 C2000,110 2200,50 2400,80"
            fill="none"
            stroke="#1A1A1A"
            strokeWidth="0.7"
            opacity="0.1"
          />
        </svg>
        {/* Vague 3 — vitesse médiane */}
        <svg
          className="absolute top-0 left-0 h-full animate-wave-flow"
          style={{ width: '200%', animationDuration: '18s' }}
          viewBox="0 0 2400 128"
          preserveAspectRatio="none"
        >
          <path
            d="M0,48 C300,90 600,20 900,60 C1200,90 1500,20 1800,60 C2100,90 2400,20 2400,48"
            fill="none"
            stroke="#B8A88A"
            strokeWidth="0.8"
            opacity="0.15"
          />
        </svg>
      </div>
    </section>
  )
}
