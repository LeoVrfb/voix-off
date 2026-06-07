'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'
import BlurRevealText from '@/components/ui/BlurRevealText'

gsap.registerPlugin(ScrollTrigger)

const tracks = [
  { id: 'la-1', title: 'Les Liaisons Dangereuses — Extrait', category: 'Roman classique', duration: '2:34' },
  { id: 'la-2', title: "L'Art de la Simplicité", category: 'Essai', duration: '1:58' },
  { id: 'la-3', title: 'Le Petit Prince — Chapitre IV', category: 'Jeunesse', duration: '3:12' },
  { id: 'la-4', title: 'Madame Bovary — Extrait', category: 'Roman', duration: '2:45' },
]

export default function LivresAudio() {
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
      id="livres-audio"
      className="relative w-full bg-studio py-24 md:py-32 overflow-hidden"
    >
      {/* Décor : halo lavande sur ce bloc plus "intime/lecture" */}
      <div className="absolute top-1/4 -left-32 w-[28rem] h-[28rem] rounded-full bg-lavender/14 blur-[110px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          {/* Colonne gauche — titre + intro */}
          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-3 mb-7 px-3 py-1.5 rounded-full bg-lavender/10 border border-lavender/25">
              <BookOpen className="w-4 h-4 text-lavender" strokeWidth={2} />
              <p className="font-sans text-[11px] font-semibold tracking-[0.3em] uppercase text-lavender">
                Quatre démos
              </p>
            </div>

            <h2 className="font-serif text-cream leading-[0.95] tracking-tight font-medium"
                style={{ fontSize: 'clamp(2.4rem, 6.5vw, 6rem)' }}>
              <BlurRevealText text="Livres" mode="char" stagger={0.05} duration={0.5} />
              <br />
              <span className="italic font-normal" style={{ color: '#7681B3' }}>
                <BlurRevealText text="audio" mode="char" stagger={0.06} delay={0.25} duration={0.5} />
              </span>
            </h2>

            <div ref={contentRef} className="mt-8 max-w-md opacity-0">
              <p className="font-sans text-base md:text-lg text-cream/90 leading-relaxed">
                Quatre extraits pour entendre comment je m&apos;empare d&apos;un texte — du
                classique au contemporain, du roman au conte. Mettez les écouteurs.
              </p>
            </div>
          </div>

          {/* Colonne droite — player */}
          <div className="lg:col-span-7">
            <div ref={playerRef} className="opacity-0">
              <AudioPlayer tracks={tracks} variant="audiobook" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
