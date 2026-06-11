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

      <div className="relative max-w-5xl mx-auto section-padding text-center">
        <h2
          className="font-serif uppercase text-cream leading-[1] tracking-[-0.01em] whitespace-nowrap"
          style={{ fontSize: 'clamp(1.9rem, 7.5vw, 4.75rem)' }}
        >
          <BlurRevealText text="Qui suis-je ?" mode="char" stagger={0.04} duration={0.5} />
        </h2>

        <h3 className="font-serif text-cream leading-[1.05] text-balance font-medium mt-6 md:mt-8"
            style={{ fontSize: 'clamp(1.7rem, 5.5vw, 4rem)' }}>
          <BlurRevealText text="Comédienne" mode="word" stagger={0.08} />{' '}
          <span className="italic font-normal text-white">
            <BlurRevealText text="passionnée" mode="word" stagger={0.08} delay={0.15} />
          </span>{' '}
          <BlurRevealText text="par les voix qui racontent." mode="word" stagger={0.05} delay={0.35} />
        </h3>

        {/* Contenu (texte + photo) réuni dans un double cadre stylé */}
        <div className="relative mt-12 md:mt-16">
          <div className="relative border border-cream/25 rounded-[24px] p-6 sm:p-8 md:p-12 outline outline-1 outline-cream/12 outline-offset-[7px]">
            {/* Coins accent */}
            <span className="pointer-events-none absolute -top-2 -left-2 w-4 h-4 border-t border-l border-cream/55" />
            <span className="pointer-events-none absolute -top-2 -right-2 w-4 h-4 border-t border-r border-cream/55" />
            <span className="pointer-events-none absolute -bottom-2 -left-2 w-4 h-4 border-b border-l border-cream/55" />
            <span className="pointer-events-none absolute -bottom-2 -right-2 w-4 h-4 border-b border-r border-cream/55" />

            <div
              ref={bodyRef}
              className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center text-left opacity-0"
            >
          {/* Texte */}
          <div className="space-y-6">
            <p className="font-sans text-base md:text-lg text-cream/95 leading-relaxed">
              Je m&apos;appelle Tiffany. Comédienne et lectrice, je prête ma voix aux histoires
              qu&apos;on a envie d&apos;écouter — un livre audio qu&apos;on laisse couler le soir, un
              spot qui fait sourire, une narration qui embarque.
            </p>
            <p className="font-sans text-base md:text-lg text-cream/85 leading-relaxed">
              Formée au jeu, je choisis chaque souffle, chaque silence. J&apos;aime quand un texte
              devient un moment, et quand un moment devient un souvenir. Mon studio est à
              l&apos;écoute partout en France comme à l&apos;international, à distance ou en
              présentiel.
            </p>
          </div>

          {/* Photo illustration */}
          <div className="flex justify-center">
            <div className="relative w-[260px] h-[330px] sm:w-[300px] sm:h-[380px] md:w-full md:max-w-[400px] md:h-[460px] overflow-hidden rounded-2xl ring-1 ring-cream/15 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)]">
              <Image
                src="/img/tiffany-about.jpg"
                alt="Tiffany en studio"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 80vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-studio/40 via-transparent to-transparent" />
            </div>
          </div>
            </div>
          </div>
        </div>

        <p
          ref={signatureRef}
          className="font-serif italic text-3xl md:text-4xl text-raspberry mt-14 opacity-0"
        >
          Tiffany Voix Off
        </p>
      </div>
    </section>
  )
}
