'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Mic, BookOpen, Building2, Radio, Film, Podcast, ArrowRight } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Service {
  icon: LucideIcon
  title: string
  subtitle: string
  description: string
}

const services: Service[] = [
  {
    icon: Mic,
    title: 'Publicité',
    subtitle: 'TV · Radio · Web',
    description:
      "Voix percutantes pour la TV, la radio et le web. Des marques de luxe aux produits du quotidien, je délivre le ton qui capte l'attention et donne envie.",
  },
  {
    icon: BookOpen,
    title: 'Livre Audio',
    subtitle: 'Roman · Essai · Jeunesse',
    description:
      "Narration engageante pour la fiction et le non-fiction. Profondeur émotionnelle et rythme qui tient l'auditeur en haleine des heures durant.",
  },
  {
    icon: Building2,
    title: 'E-learning & Entreprise',
    subtitle: 'Formation · Corporate · SVI',
    description:
      'Ton clair et professionnel pour les modules e-learning, vidéos de formation et communications internes — humain, jamais robotique.',
  },
  {
    icon: Podcast,
    title: 'Podcast & Contenus Digitaux',
    subtitle: 'Podcast · YouTube · Webinaire',
    description:
      "Habillages sonores mémorables pour les intros, outros et mid-rolls qui donnent à votre émission une identité vocale forte.",
  },
  {
    icon: Radio,
    title: 'Institutions & Culture',
    subtitle: 'Musées · Patrimoine · Institutions',
    description:
      'Audio guides, contenus culturels et présentations institutionnelles — une voix au service du patrimoine et des savoirs.',
  },
  {
    icon: Film,
    title: 'Productions Audiovisuelles',
    subtitle: 'Film · Motion Design · Documentaire',
    description:
      'Narration pour les films corporate, motion design et documentaires. Autorité et résonance émotionnelle au service du récit.',
  },
]

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const itemsRef = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const items = itemsRef.current.filter(Boolean) as HTMLDivElement[]

    if (!section || !heading || items.length === 0) return

    gsap.fromTo(
      heading,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 80%' },
      }
    )

    gsap.fromTo(
      items,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: 'power3.out',
        scrollTrigger: { trigger: section, start: 'top 70%' },
      }
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="services"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto section-padding">
        {/* Entête */}
        <div ref={headingRef} className="mb-16 md:mb-20 opacity-0">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-charcoal/75 mb-3">
            Ce que je fais
          </p>
          <div className="flex items-end gap-8 flex-wrap">
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-none">
              Services
            </h2>
            <p className="font-serif italic text-xl md:text-2xl text-charcoal/75 pb-1">
              Deux métiers distincts, une seule voix.
            </p>
          </div>
        </div>

        {/* Grille des services */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0">
          {services.map((service, index) => {
            const Icon = service.icon
            return (
              <div
                key={service.title}
                ref={(el) => { itemsRef.current[index] = el }}
                className="group border-t border-ink/10 pt-8 pb-10 pr-0 md:pr-12 opacity-0"
              >
                {/* Icône */}
                <div className="mb-5">
                  <Icon
                    className="w-5 h-5 text-ink/30 group-hover:text-gold transition-colors duration-500"
                    strokeWidth={1.5}
                  />
                </div>

                {/* Titre + sous-titre */}
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-1 leading-tight">
                  {service.title}
                </h3>
                <p className="font-sans text-[10px] tracking-widest uppercase text-gold/70 mb-4">
                  {service.subtitle}
                </p>

                {/* Description */}
                <p className="font-sans text-sm text-charcoal/80 leading-relaxed">
                  {service.description}
                </p>
              </div>
            )
          })}
        </div>

        {/* CTA bloc — regroupé */}
        <div className="border-t border-ink/10 mt-4 pt-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          <p className="font-serif italic text-2xl md:text-3xl text-ink/50">
            Un projet en dehors de ces catégories&nbsp;?
          </p>
          <a
            href="#contact"
            className="group flex items-center gap-4 border border-ink/25 hover:bg-ink transition-all duration-300 px-8 py-4 flex-shrink-0"
          >
            <span className="font-sans text-xs tracking-[0.25em] uppercase text-ink group-hover:text-cream transition-colors duration-300">
              En discuter
            </span>
            <ArrowRight
              size={14}
              className="text-ink group-hover:text-cream transition-all duration-300 group-hover:translate-x-1"
            />
          </a>
        </div>
      </div>
    </section>
  )
}
