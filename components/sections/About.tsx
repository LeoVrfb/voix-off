'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import BlurRevealText from '@/components/ui/BlurRevealText'

gsap.registerPlugin(ScrollTrigger)

export default function About() {
  const sectionRef = useRef<HTMLElement>(null)
  const bodyRef = useRef<HTMLDivElement>(null)
  const signatureRef = useRef<HTMLParagraphElement>(null)
  const badgesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const body = bodyRef.current
    const signature = signatureRef.current
    const badges = badgesRef.current

    if (!section || !body || !signature || !badges) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
        end: 'top 25%',
        scrub: 0.5,
      },
    })

    tl.fromTo(body, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0)
    tl.fromTo(
      badges.children,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, stagger: 0.08, ease: 'none' },
      0.2
    )
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

      <div className="relative max-w-4xl mx-auto section-padding text-center">
        <div className="inline-flex items-center gap-3 mb-7 px-3 py-1.5 rounded-full bg-raspberry/10 border border-raspberry/25">
          <span className="w-1.5 h-1.5 rounded-full bg-raspberry" />
          <p className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-raspberry">
            Qui suis-je
          </p>
        </div>

        <h2 className="font-serif text-cream leading-[1.05] text-balance font-medium"
            style={{ fontSize: 'clamp(2rem, 6.5vw, 5rem)' }}>
          <BlurRevealText text="Comédienne" mode="word" stagger={0.08} />{' '}
          <span className="italic font-normal" style={{ color: '#CB769E' }}>
            <BlurRevealText text="passionnée" mode="word" stagger={0.08} delay={0.15} />
          </span>{' '}
          <BlurRevealText text="par les voix qui racontent." mode="word" stagger={0.05} delay={0.35} />
        </h2>

        <div
          ref={bodyRef}
          className="mt-12 space-y-6 max-w-2xl mx-auto opacity-0"
        >
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

        <div
          ref={badgesRef}
          className="mt-12 flex flex-wrap justify-center gap-3"
        >
          {[
            'Livres audio',
            'Voix off pub',
            'Narration',
            'Documentaire',
            'E-learning',
            'Doublage (formation en cours)',
          ].map((tag) => (
            <span
              key={tag}
              className="px-4 py-2 rounded-full border border-cream/25 bg-cream/[0.06] backdrop-blur-sm font-sans text-xs font-medium tracking-wide text-cream/90 hover:border-raspberry/70 hover:text-cream hover:bg-raspberry/15 transition-all duration-300 cursor-default"
            >
              {tag}
            </span>
          ))}
        </div>

        <p
          ref={signatureRef}
          className="font-serif italic text-3xl md:text-4xl text-raspberry mt-14 opacity-0"
        >
          Tiffany
        </p>
      </div>
    </section>
  )
}
