'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowLeft, ArrowRight } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const testimonials = [
  {
    id: 1,
    quote:
      "La voix de Tiffany a transformé notre campagne publicitaire. Elle a capturé l'essence de notre marque avec une précision remarquable et apporté une profondeur émotionnelle que nous ne soupçonnions pas.",
    author: 'Marie-Claire Vidal',
    role: "Directrice artistique",
    company: "L'Oréal Paris",
  },
  {
    id: 2,
    quote:
      "Travailler avec Tiffany sur notre série de livres audio a été une révélation. Sa capacité à donner à chaque personnage une voix distincte tout en maintenant le fil narratif est extraordinaire.",
    author: 'Jean-Pierre Martin',
    role: 'Éditeur',
    company: 'Gallimard',
  },
  {
    id: 3,
    quote:
      "La nuance et la chaleur que Tiffany apporte à la narration d'entreprise sont rares. Elle a rendu nos modules de formation passionnants — quelque chose que je n'aurais jamais cru possible.",
    author: 'Sophie Laurent',
    role: 'Responsable formation',
    company: 'Air France',
  },
  {
    id: 4,
    quote:
      "Tiffany a cette capacité rare à faire compter chaque mot. Ses lectures ne vendent pas seulement des produits — elles racontent des histoires qui résonnent longtemps après la diffusion.",
    author: 'Antoine Bernard',
    role: 'Directeur de production',
    company: 'Publicis',
  },
]

export default function Testimonials() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const quoteRef = useRef<HTMLDivElement>(null)

  const goToSlide = (index: number) => {
    if (isAnimating || index === currentIndex) return
    setIsAnimating(true)
    const quote = quoteRef.current
    if (!quote) return
    gsap.to(quote, {
      opacity: 0,
      y: -12,
      duration: 0.25,
      ease: 'power2.in',
      onComplete: () => {
        setCurrentIndex(index)
        gsap.fromTo(
          quote,
          { opacity: 0, y: 12 },
          {
            opacity: 1,
            y: 0,
            duration: 0.35,
            ease: 'power3.out',
            onComplete: () => setIsAnimating(false),
          }
        )
      },
    })
  }

  const nextSlide = () => goToSlide(currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1)
  const prevSlide = () => goToSlide(currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1)

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    if (!section || !heading) return
    gsap.fromTo(
      heading,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out', scrollTrigger: { trigger: section, start: 'top 75%' } }
    )
    return () => {
      ScrollTrigger.getAll().forEach((st) => { if (st.vars.trigger === section) st.kill() })
    }
  }, [])

  useEffect(() => {
    const interval = setInterval(() => { if (!isAnimating) nextSlide() }, 7000)
    return () => clearInterval(interval)
  }, [currentIndex, isAnimating]) // eslint-disable-line react-hooks/exhaustive-deps

  const t = testimonials[currentIndex]

  return (
    <section
      ref={sectionRef}
      id="testimonials"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div ref={headingRef} className="mb-16 md:mb-24 opacity-0">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-charcoal/75 mb-3">
            Ils témoignent
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink">Références</h2>
        </div>

        {/* Contenu principal */}
        <div ref={quoteRef} className="max-w-4xl">
          {/* Numéro */}
          <p className="font-sans text-[10px] tracking-[0.4em] uppercase text-charcoal/75 mb-8">
            {String(currentIndex + 1).padStart(2, '0')}&thinsp;/&thinsp;{String(testimonials.length).padStart(2, '0')}
          </p>

          {/* Citation */}
          <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl xl:text-5xl text-ink leading-[1.3] mb-10">
            &ldquo;{t.quote}&rdquo;
          </blockquote>

          {/* Auteur */}
          <div className="flex items-center gap-6">
            <div className="w-8 h-px bg-gold" />
            <div>
              <p className="font-sans text-sm text-ink font-medium tracking-wide">{t.author}</p>
              <p className="font-sans text-xs text-charcoal/75 mt-0.5">
                {t.role}&ensp;—&ensp;<span className="text-gold">{t.company}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Barre de progression + navigation */}
        <div className="mt-16 md:mt-20 flex items-center justify-between gap-8">
          {/* Barres */}
          <div className="flex gap-1.5 flex-1">
            {testimonials.map((_, i) => (
              <button
                key={i}
                onClick={() => goToSlide(i)}
                aria-label={`Témoignage ${i + 1}`}
                className="relative h-px flex-1 bg-ink/12 overflow-hidden"
              >
                <span
                  className="absolute inset-y-0 left-0 bg-ink transition-all duration-700"
                  style={{ width: i === currentIndex ? '100%' : '0%' }}
                />
              </button>
            ))}
          </div>

          {/* Flèches */}
          <div className="flex items-center gap-4 flex-shrink-0">
            <button
              onClick={prevSlide}
              aria-label="Précédent"
              className="group flex items-center gap-2 font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 hover:text-ink transition-colors duration-300"
            >
              <ArrowLeft size={14} className="transition-transform duration-300 group-hover:-translate-x-1" />
              Prec.
            </button>
            <span className="w-px h-4 bg-ink/15" />
            <button
              onClick={nextSlide}
              aria-label="Suivant"
              className="group flex items-center gap-2 font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 hover:text-ink transition-colors duration-300"
            >
              Suiv.
              <ArrowRight size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-ink/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
    </section>
  )
}
