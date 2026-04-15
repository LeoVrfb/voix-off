'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Building2, Clapperboard, Radio, TrendingUp } from 'lucide-react'
import AudioPlayer from '@/components/AudioPlayer'
import BlurRevealText from '@/components/ui/BlurRevealText'

gsap.registerPlugin(ScrollTrigger)

const tracks = [
  { id: 'com-1', title: 'Spot Publicitaire — Parfum', category: 'Marques & Publicité', duration: '0:45' },
  { id: 'com-2', title: 'Musée du Louvre — Audio Guide', category: 'Institutions & Culture', duration: '2:10' },
  { id: 'com-3', title: 'Film Corporate — Startup Tech', category: 'Contenus Digitaux', duration: '1:30' },
  { id: 'com-4', title: 'Motion Design — Application', category: 'Productions Audiovisuelles', duration: '0:58' },
]

const sectors = [
  {
    icon: TrendingUp,
    title: 'Marques & Publicité',
    description: 'Spots radio & TV, brand content, campagnes institutionnelles',
  },
  {
    icon: Building2,
    title: 'Institutions & Culture',
    description: 'Musées, audio guides, e-learning, contenus administratifs',
  },
  {
    icon: Radio,
    title: 'Contenus Digitaux',
    description: 'Podcasts, YouTube, réseaux sociaux, webinaires',
  },
  {
    icon: Clapperboard,
    title: 'Productions Audiovisuelles',
    description: 'Films corporate, motion design, immobilier, documentaires',
  },
]

export default function VoixOff() {
  const sectionRef = useRef<HTMLElement>(null)
  const introRef = useRef<HTMLDivElement>(null)
  const sectorsRef = useRef<HTMLDivElement>(null)
  const playerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const intro = introRef.current
    const sectors = sectorsRef.current
    const player = playerRef.current

    if (!section || !intro || !sectors || !player) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
      },
    })

    // heading géré par BlurRevealText
    tl.fromTo(intro, { opacity: 0, y: 40 }, { opacity: 1, y: 0, ease: 'none' }, 0.1)
    tl.fromTo(sectors.children, { opacity: 0, x: -20 }, { opacity: 1, x: 0, stagger: 0.07, ease: 'none' }, 0.2)
    tl.fromTo(player, { opacity: 0, y: 60 }, { opacity: 1, y: 0, ease: 'none' }, 0.4)

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="voixoff"
      className="relative w-full min-h-screen bg-ink py-20 md:py-32"
    >
      {/* Waveform décoratif */}
      <div className="absolute top-0 left-0 w-1/3 h-full opacity-[0.04] pointer-events-none overflow-hidden">
        <svg className="absolute top-1/2 -translate-y-1/2 left-0 w-[600px] h-[800px]" viewBox="0 0 600 800" fill="none">
          {[...Array(15)].map((_, i) => (
            <path
              key={i}
              d={`M 0 ${100 + i * 50} Q 200 ${80 + i * 50 + Math.sin(i) * 30}, 400 ${100 + i * 50} T 600 ${100 + i * 50}`}
              stroke="#E0E0E0"
              strokeWidth="1"
              fill="none"
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">

          {/* Colonne gauche — Contenu */}
          <div className="lg:col-span-7 space-y-10 order-2 lg:order-1">
            <div ref={introRef} className="opacity-0">
              <p className="font-sans text-base md:text-lg text-cream/80 leading-relaxed">
                Une voix chaleureuse et professionnelle pour vos projets audiovisuels.
                J&apos;accompagne les marques, les institutions et les créateurs dans la
                réalisation de contenus sonores impactants.
              </p>
            </div>

            {/* Grille des secteurs */}
            <div ref={sectorsRef} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sectors.map((sector) => {
                const Icon = sector.icon
                return (
                  <div
                    key={sector.title}
                    className="group p-5 border border-cream/10 hover:border-gold/40 hover:bg-cream/5 transition-all duration-300 opacity-0"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-10 h-10 border border-cream/10 group-hover:border-gold/40 group-hover:bg-gold/10 flex items-center justify-center transition-all duration-300">
                        <Icon className="w-5 h-5 text-gold" strokeWidth={1.5} />
                      </div>
                      <div>
                        <h4 className="font-sans text-sm font-medium text-cream mb-1">
                          {sector.title}
                        </h4>
                        <p className="font-sans text-xs text-cream/50 leading-relaxed">
                          {sector.description}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div ref={playerRef} className="opacity-0">
              <h3 className="font-serif text-xl md:text-2xl text-cream mb-4">
                Démos <span className="text-gold">.</span>
              </h3>
              <AudioPlayer tracks={tracks} variant="commercial" />
            </div>
          </div>

          {/* Colonne droite — Titre */}
          <div className="lg:col-span-5 order-1 lg:order-2 lg:text-right">
            <h2 className="font-serif text-5xl md:text-6xl lg:text-7xl xl:text-8xl text-cream leading-[0.9] tracking-tight">
              <BlurRevealText text="Voix" mode="char" stagger={0.06} duration={0.45} />
              <br />
              <span className="italic text-gold">
                <BlurRevealText text="Off" mode="char" stagger={0.07} delay={0.2} duration={0.45} />
              </span>
            </h2>

            <div className="mt-8 flex lg:justify-end gap-8">
              <div className="text-center lg:text-right">
                <p className="font-serif text-3xl md:text-4xl text-gold">150+</p>
                <p className="font-sans text-xs text-cream/40 mt-1">Projets réalisés</p>
              </div>
              <div className="text-center lg:text-right">
                <p className="font-serif text-3xl md:text-4xl text-gold">8</p>
                <p className="font-sans text-xs text-cream/40 mt-1">Années d&apos;expérience</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream/10 to-transparent" />
    </section>
  )
}
