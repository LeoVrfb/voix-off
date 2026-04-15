'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { BookOpen, Headphones, Heart } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'
import BlurRevealText from '@/components/ui/BlurRevealText'

gsap.registerPlugin(ScrollTrigger)

const tracks = [
  { id: 'lit-1', title: 'Les Liaisons Dangereuses — Extrait', category: 'Roman classique', duration: '2:34' },
  { id: 'lit-2', title: "L'Art de la Simplicité", category: 'Essai', duration: '1:58' },
  { id: 'lit-3', title: 'Le Petit Prince — Chapitre IV', category: 'Jeunesse', duration: '3:12' },
  { id: 'lit-4', title: 'Madame Bovary — Extrait', category: 'Roman', duration: '2:45' },
]

export default function NarratriceAudio() {
  const sectionRef = useRef<HTMLElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)
  const categoriesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const content = contentRef.current
    const player = playerRef.current
    const categories = categoriesRef.current

    if (!section || !content || !player || !categories) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
      },
    })

    // heading géré par BlurRevealText
    tl.fromTo(content, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0.1)
    tl.fromTo(player, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.2)
    tl.fromTo(categories.children, { opacity: 0, y: 20 }, { opacity: 1, y: 0, stagger: 0.08, ease: 'none' }, 0.3)

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="narratrice"
      className="relative w-full min-h-screen bg-cream py-20 md:py-32"
    >
      {/* Waveform décoratif */}
      <div className="absolute top-0 right-0 w-1/3 h-full opacity-[0.025] pointer-events-none overflow-hidden">
        <svg className="absolute top-1/2 -translate-y-1/2 right-0 w-[600px] h-[800px]" viewBox="0 0 600 800" fill="none">
          {[...Array(15)].map((_, i) => (
            <path
              key={i}
              d={`M 600 ${100 + i * 50} Q 400 ${80 + i * 50 + Math.sin(i) * 30}, 200 ${100 + i * 50} T 0 ${100 + i * 50}`}
              stroke="#2C2C2C"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* Colonne gauche — Titre */}
          <div className="lg:col-span-5">
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-ink leading-[0.9] tracking-tight">
              <BlurRevealText text="Narratrice" mode="char" stagger={0.04} duration={0.45} />
              <br />
              <span className="italic text-gold">
                <BlurRevealText text="Audio" mode="char" stagger={0.05} delay={0.25} duration={0.45} />
              </span>
            </h2>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex items-center gap-2 text-ink/50">
                <BookOpen className="w-4 h-4" />
                <span className="font-sans text-xs tracking-wide">Littérature</span>
              </div>
              <div className="flex items-center gap-2 text-ink/50">
                <Headphones className="w-4 h-4" />
                <span className="font-sans text-xs tracking-wide">Intime</span>
              </div>
              <div className="flex items-center gap-2 text-ink/50">
                <Heart className="w-4 h-4" />
                <span className="font-sans text-xs tracking-wide">Passion</span>
              </div>
            </div>
          </div>

          {/* Colonne droite — Contenu */}
          <div className="lg:col-span-7 space-y-10">
            <div ref={contentRef} className="space-y-5 opacity-0">
              <p className="font-sans text-base md:text-lg text-charcoal leading-relaxed">
                Donner vie aux mots. De la fiction au savoir, j&apos;accompagne les maisons
                d&apos;édition et les auteurs dans la création d&apos;univers sonores intimes
                et captivants.
              </p>
              <p className="font-sans text-sm text-charcoal/70 leading-relaxed">
                Chaque livre audio est une performance unique — une rencontre entre le texte et la
                voix. Je m&apos;investis pleinement dans chaque projet pour offrir une expérience
                d&apos;écoute qui transporte l&apos;auditeur au cœur de l&apos;histoire.
              </p>
            </div>

            <div ref={playerRef} className="opacity-0">
              <h3 className="font-serif text-xl md:text-2xl text-ink mb-4">
                Extraits <span className="text-gold">.</span>
              </h3>
              <AudioPlayer tracks={tracks} variant="literary" />
            </div>

            <div ref={categoriesRef} className="pt-6 border-t border-ink/10">
              <p className="font-sans text-xs tracking-[0.2em] uppercase text-ink/40 mb-4">Genres</p>
              <div className="flex flex-wrap gap-3">
                {['Romans', 'Essais', 'Jeunesse', 'Classiques', 'Théâtre'].map((cat) => (
                  <span
                    key={cat}
                    className="px-4 py-2 font-sans text-xs tracking-wide text-ink/60 border border-ink/10 rounded-full hover:border-gold hover:text-gold transition-colors duration-300 cursor-default"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-ink/10 to-transparent" />
    </section>
  )
}
