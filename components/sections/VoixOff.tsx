'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mic } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'
import BlurRevealText from '@/components/ui/BlurRevealText'

gsap.registerPlugin(ScrollTrigger)

const tracks = [
  { id: 'vo-1', title: 'Spot publicitaire — Parfum', category: 'Marques & pub', duration: '0:45' },
  { id: 'vo-2', title: 'Audio guide — Musée', category: 'Institutions', duration: '2:10' },
  { id: 'vo-3', title: 'Film corporate — Startup tech', category: 'Entreprises', duration: '1:30' },
  { id: 'vo-4', title: 'Motion design — Application', category: 'Digital', duration: '0:58' },
]

export default function VoixOff() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const player = playerRef.current

    if (!section || !content || !player) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 25%',
        scrub: 0.5,
      },
    })

    tl.fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0)
    tl.fromTo(player, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.15)

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="voix-off"
      className="relative w-full bg-studio py-24 md:py-32 overflow-hidden"
    >
      {/* Décor : halo framboise sur ce bloc plus "vif" */}
      <div className="absolute top-1/3 -right-32 w-[30rem] h-[30rem] rounded-full bg-raspberry/14 blur-[110px] pointer-events-none" />

      {/* Trait de séparation lumineux en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream/15 to-transparent" />

      <div className="relative z-10 max-w-6xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Colonne gauche — player */}
          <div className="lg:col-span-7 order-2 lg:order-1">
            <div ref={playerRef} className="opacity-0">
              <AudioPlayer tracks={tracks} variant="voiceover" />
            </div>
          </div>

          {/* Colonne droite — titre + intro */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:sticky lg:top-32 lg:text-right">
            <div className="inline-flex items-center gap-3 mb-7 px-3 py-1.5 rounded-full bg-raspberry/10 border border-raspberry/25">
              <Mic className="w-4 h-4 text-raspberry" strokeWidth={2} />
              <p className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-raspberry">
                Quatre démos
              </p>
            </div>

            <h2 className="font-serif text-cream leading-[0.95] tracking-tight font-medium"
                style={{ fontSize: 'clamp(2.4rem, 6.5vw, 6rem)' }}>
              <BlurRevealText text="Voix" mode="char" stagger={0.06} duration={0.5} />
              <br />
              <span className="italic font-normal" style={{ color: '#CB769E' }}>
                <BlurRevealText text="off" mode="char" stagger={0.08} delay={0.2} duration={0.5} />
              </span>
            </h2>

            <div ref={contentRef} className="mt-8 lg:ml-auto max-w-md opacity-0">
              <p className="font-sans text-base md:text-lg text-cream/90 leading-relaxed">
                Pubs, films corporate, audio guides, motion design — la même voix, des registres
                différents. Quatre démos qui montrent l&apos;étendue.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
