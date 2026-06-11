'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Image from 'next/image'
import AudioPlayer from '@/components/AudioPlayer'
import BlurRevealText from '@/components/ui/BlurRevealText'

gsap.registerPlugin(ScrollTrigger)

const audiobookTracks = [
  { id: 'la-1', title: '49 jours', category: 'Romans', src: '/demos/audio/49-jours.m4a', cover: '/demos/covers/49-jours.jpg' },
  { id: 'la-3', title: 'Requiem pour les fantômes', category: 'Romans', src: '/demos/audio/requiem-pour-les-fantomes.m4a', cover: '/demos/covers/requiem-pour-les-fantomes.jpg' },
  { id: 'la-4', title: 'Le cosmos et nous', category: 'Essais', src: '/demos/audio/le-cosmos-et-nous.m4a', cover: '/demos/covers/le-cosmos-et-nous.jpg' },
  { id: 'la-2', title: 'Une joie', category: 'Nouvelles', src: '/demos/audio/une-joie.m4a', cover: '/demos/covers/une-joie.jpg' },
  { id: 'la-5', title: 'Conte pour enfants', category: 'Contes pour enfants', src: '/demos/audio/conte-pour-enfants.m4a', cover: '/demos/covers/conte-pour-enfants.jpg' },
]

const voiceoverTracks = [
  { id: 'vo-1', title: 'Prada', category: 'Publicité', src: '/demos/audio/prada.m4a', cover: '/demos/covers/prada.jpg' },
  { id: 'vo-2', title: 'Banque Populaire', category: 'Publicité', src: '/demos/audio/banque-populaire.m4a', cover: '/demos/covers/banque-populaire.png' },
  { id: 'vo-3', title: 'Top Chef', category: 'Télévision', src: '/demos/audio/top-chef.m4a', cover: '/demos/covers/top-chef.jpg' },
  { id: 'vo-4', title: 'Carrefour', category: 'Publicité', src: '/demos/audio/carrefour.m4a', cover: '/demos/covers/carrefour.jpg' },
]

export default function MetsDesMots() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const audioRef = useRef<HTMLDivElement>(null)
  const voixRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const audio = audioRef.current
    const voix = voixRef.current
    if (!section || !heading || !audio || !voix) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
      },
    })

    tl.fromTo(heading, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0)
    tl.fromTo(audio, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.1)
    tl.fromTo(voix, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.2)

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
      {/* Trait de séparation lumineux en haut */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream/15 to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        {/* Titre de section — PP Formula */}
        <div ref={headingRef} className="text-center mb-10 md:mb-14 opacity-0">
          <h2
            className="font-display uppercase text-cream leading-[0.9] tracking-tight"
            style={{ fontSize: 'clamp(3rem, 11vw, 9rem)' }}
          >
            <BlurRevealText text="Mes démos" mode="char" stagger={0.04} duration={0.5} />
          </h2>
        </div>

        {/* Illustration */}
        <div className="mb-16 md:mb-20 flex justify-center">
          <div className="relative w-full max-w-3xl h-[230px] sm:h-[300px] md:h-[380px] overflow-hidden rounded-2xl ring-1 ring-cream/15 shadow-[0_30px_80px_-25px_rgba(0,0,0,0.7)]">
            <Image
              src="/img/tiffany-studio.jpg"
              alt="Tiffany au micro"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 92vw, 768px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-studio/50 via-transparent to-transparent" />
          </div>
        </div>

        {/* Deux côtés : livre audio / voix off */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16">
          <div ref={audioRef} className="opacity-0">
            <h3 className="font-serif text-cream text-2xl md:text-3xl font-medium mb-6 md:mb-8">
              Livres audio
              <span className="block w-12 h-0.5 bg-raspberry/70 rounded-full mt-3" />
            </h3>
            <AudioPlayer tracks={audiobookTracks} variant="audiobook" grouped />
          </div>

          <div ref={voixRef} className="opacity-0">
            <h3 className="font-serif text-cream text-2xl md:text-3xl font-medium mb-6 md:mb-8">
              Voix off
              <span className="block w-12 h-0.5 bg-raspberry/70 rounded-full mt-3" />
            </h3>
            <AudioPlayer tracks={voiceoverTracks} variant="voiceover" />
          </div>
        </div>
      </div>
    </section>
  )
}
