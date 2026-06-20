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
  const signatureRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const body = bodyRef.current
    const signature = signatureRef.current

    if (!section || !body || !signature) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top 25%',
        scrub: 0.5,
      },
    })

    tl.fromTo(body, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0)
    tl.fromTo(signature, { opacity: 0, y: 20 }, { opacity: 1, y: 0, ease: 'none' }, 0.4)

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
      className="relative w-full bg-studio py-24 md:py-36 overflow-hidden"
    >
      {/* Décor : grand cercle peach et lavender flous */}
      <div className="absolute top-20 -left-32 w-[28rem] h-[28rem] rounded-full bg-lavender/12 blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-32 -right-20 w-[32rem] h-[32rem] rounded-full bg-peach/8 blur-[110px] pointer-events-none" />

      <div className="relative max-w-5xl mx-auto section-padding">
        <h2
          className="font-serif uppercase text-cream leading-[1] tracking-[-0.01em] whitespace-nowrap text-center"
          style={{ fontSize: 'clamp(1.9rem, 7.5vw, 4.75rem)' }}
        >
          <BlurRevealText text="Qui suis-je ?" mode="char" stagger={0.04} duration={0.5} />
        </h2>

        <div ref={bodyRef} className="mt-12 md:mt-16 text-left opacity-0">
          {/* Photo flottante à droite : le texte l'habille puis reprend toute la largeur dessous */}
          <div className="md:float-right md:ml-10 md:mb-5 w-full max-w-[340px] md:w-[40%] md:max-w-[440px] mx-auto md:mx-0 mb-8">
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl ring-1 ring-cream/15 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)]">
              <Image
                src="/img/tiffany-about.jpg"
                alt="Tiffany en studio"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio/45 via-transparent to-transparent" />
            </div>
            <p className="mt-4 text-center font-sans text-[11px] font-medium tracking-[0.28em] uppercase text-cream/50">
              Narration · Voix off
            </p>
          </div>

          {/* Texte (habille la photo, puis pleine largeur) — police Lora */}
          <div className="space-y-4 md:space-y-5" style={{ fontFamily: 'Lora, serif' }}>
            <p className="text-base md:text-lg text-cream/95 leading-relaxed">
              Passionnée de littérature depuis toujours, j&apos;ai d&apos;abord transmis mon amour
              des textes en tant que professeure de français. C&apos;est au contact d&apos;élèves aux
              profils variés (dyslexiques, malvoyants ou en difficulté d&apos;apprentissage) que
              j&apos;ai découvert toute la puissance de la lecture à voix haute et du livre audio.
              J&apos;ai alors réalisé à quel point une voix pouvait donner vie à un texte, en révéler
              le sens, transmettre des émotions et captiver un auditoire.
            </p>
            <p className="text-base md:text-lg text-cream/90 leading-relaxed">
              Cette découverte a fait naître une évidence : à mon tour, je voulais raconter des
              histoires.
            </p>
            <p className="text-base md:text-lg text-cream/90 leading-relaxed">
              Curieuse, expressive et profondément attachée à la richesse des mots, j&apos;aime
              explorer des registres très différents et me mettre au service de chaque texte. Roman,
              récit historique, documentaire, guide touristique, spots publicitaires, présentation
              d&apos;entreprise ou module e-learning : chaque projet représente pour moi une
              rencontre et une expérience humaine unique.
            </p>
            <p className="text-base md:text-lg text-cream/90 leading-relaxed">
              Ma voix est souvent décrite comme chaleureuse, captivante et incarnée. J&apos;accorde
              une attention particulière à la compréhension d&apos;un texte, à son rythme, à sa
              musicalité et à l&apos;émotion qu&apos;il porte. Mon objectif est simple : offrir une
              interprétation sincère, vivante et fidèle à l&apos;intention de l&apos;auteur ou du
              client.
            </p>
            <p className="text-base md:text-lg text-cream/90 leading-relaxed">
              Cette envie de faire vivre les textes m&apos;a naturellement conduite à me former à la
              narration de livres audio auprès de Mathieu Buscatto, lauréat du Prix Audiolib 2025,
              ainsi qu&apos;à la voix off auprès de Julie Bataille, ancienne voix des Guignols de
              l&apos;Info. En 2026, j&apos;ai également obtenu le 3e Prix du casting « La Voix » lors
              du Festival du Livre Audio de Strasbourg.
            </p>
            <p className="text-base md:text-lg text-cream/90 leading-relaxed">
              Professionnelle et réactive, je sais m&apos;adapter facilement et je m&apos;investis
              pleinement dans chaque projet. Mon ouverture d&apos;esprit me permet d&apos;aborder avec
              la même curiosité tous les types de textes et d&apos;univers, même ceux qui sont
              éloignés de ma sensibilité. J&apos;aime découvrir de nouveaux horizons : chaque
              territoire inconnu représente pour moi un défi, une source d&apos;enrichissement et une
              nouvelle aventure. Ce sont souvent eux qui me passionnent le plus.
            </p>
          </div>
          <div className="clear-both" />
        </div>

        <p
          ref={signatureRef}
          className="font-serif italic text-3xl md:text-4xl text-raspberry mt-14 text-center opacity-0"
        >
          Tiffany Voix Off
        </p>
      </div>
    </section>
  )
}
