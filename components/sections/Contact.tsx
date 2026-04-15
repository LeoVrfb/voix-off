'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, CheckCircle } from 'lucide-react'
import BlurRevealText from '@/components/ui/BlurRevealText'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

gsap.registerPlugin(ScrollTrigger)

const projectTypes = ['Voix Off', 'Livre Audio', 'Entreprise', 'Podcast', 'Documentaire', 'Autre']

export default function Contact() {
  const sectionRef = useRef<HTMLElement>(null)
  const headingRef = useRef<HTMLDivElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const infoRef = useRef<HTMLDivElement>(null)

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  })
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleProjectType = (val: string) => {
    setFormData((prev) => ({ ...prev, projectType: val }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
  }

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const form = formRef.current
    const info = infoRef.current

    if (!section || !heading || !form || !info) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      },
    })

    tl.fromTo(heading, { opacity: 0, y: 40 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' })
    tl.fromTo(form, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
    tl.fromTo(info, { opacity: 0, x: 30 }, { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' }, '-=0.6')

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section
      ref={sectionRef}
      id="contact"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto section-padding">
        {/* Entête */}
        <div ref={headingRef} className="mb-16 md:mb-20 opacity-0">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-charcoal/75 mb-4">
            Me contacter
          </p>
          <h2 className="font-serif text-4xl md:text-6xl lg:text-7xl text-ink leading-none">
            <BlurRevealText text="Travaillons" mode="word" stagger={0.1} duration={0.5} />
            <br />
            <span className="italic text-gold">
              <BlurRevealText text="ensemble." mode="word" delay={0.15} stagger={0.1} duration={0.5} />
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-20">
          {/* Formulaire */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="py-16 flex flex-col items-start gap-6">
                <CheckCircle size={40} className="text-gold" strokeWidth={1.5} />
                <div>
                  <h3 className="font-serif text-3xl text-ink mb-2">Message envoyé</h3>
                  <p className="font-sans text-charcoal/70">
                    Merci. Je vous répondrai dans les 24 heures.
                  </p>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-10 opacity-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="group">
                    <label
                      htmlFor="name"
                      className="block font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-3"
                    >
                      Nom
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Jean Dupont"
                      className="w-full bg-transparent border-b border-ink/15 focus:border-gold py-2 font-sans text-base text-ink placeholder:text-charcoal/35 outline-none focus-visible:outline-none ring-0 focus:ring-0 transition-colors duration-300"
                    />
                  </div>
                  <div className="group">
                    <label
                      htmlFor="email"
                      className="block font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-3"
                    >
                      E-mail
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="jean@exemple.fr"
                      className="w-full bg-transparent border-b border-ink/15 focus:border-gold py-2 font-sans text-base text-ink placeholder:text-charcoal/35 outline-none focus-visible:outline-none ring-0 focus:ring-0 transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label
                    className="block font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-3"
                  >
                    Type de projet
                  </label>
                  <Select value={formData.projectType} onValueChange={handleProjectType} required>
                    <SelectTrigger className="w-full bg-transparent border-0 border-b border-ink/15 data-[state=open]:border-gold rounded-none px-0 py-2 font-sans text-base text-ink shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 h-auto">
                      <SelectValue
                        placeholder={
                          <span className="text-charcoal/65">Choisir un type de projet</span>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-[#F5F1EB] border border-ink/10 rounded-none shadow-lg">
                      {projectTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="font-sans text-sm text-ink focus:bg-ink/5 focus:text-ink cursor-pointer rounded-none"
                        >
                          {type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label
                    htmlFor="message"
                    className="block font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-3"
                  >
                    Votre projet
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={4}
                    placeholder="Je recherche une voix pour..."
                      className="w-full bg-transparent border-b border-ink/15 focus:border-gold py-2 font-sans text-base text-ink placeholder:text-charcoal/35 outline-none focus-visible:outline-none ring-0 focus:ring-0 transition-colors duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-4 font-sans text-sm tracking-wider uppercase text-ink hover:text-gold transition-colors duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border border-ink/30 border-t-ink rounded-full animate-spin" />
                      <span>Envoi en cours…</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer</span>
                      <span className="w-10 h-px bg-ink group-hover:bg-gold group-hover:w-14 transition-all duration-300" />
                      <Send size={14} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Infos de contact — style éditorial */}
          <div ref={infoRef} className="lg:col-span-5 opacity-0">
            <div className="space-y-10">
              <div>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-3">
                  E-mail
                </p>
                <a
                  href="mailto:contact@tiffanyhengebaert.fr"
                  className="font-serif text-xl md:text-2xl text-ink hover:text-gold transition-colors duration-300 break-all"
                >
                  contact@tiffanyhengebaert.fr
                </a>
              </div>

              <div className="w-full h-px bg-ink/8" />

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-2">
                    Studio
                  </p>
                  <p className="font-sans text-sm text-ink">Île-de-France</p>
                  <p className="font-sans text-xs text-charcoal/75 mt-1 leading-relaxed">
                    Sessions à distance
                    <br />
                    partout dans le monde
                  </p>
                </div>
                <div>
                  <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-2">
                    Réponse
                  </p>
                  <p className="font-sans text-sm text-ink">24 heures</p>
                  <p className="font-sans text-xs text-charcoal/75 mt-1 leading-relaxed">
                    Précisez si votre
                    <br />
                    projet est urgent
                  </p>
                </div>
              </div>

              <div className="w-full h-px bg-ink/8" />

              <div>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-3">
                  Langues
                </p>
                <div className="flex gap-6">
                  {['Français — natif', 'Anglais — courant'].map((lang) => (
                    <span key={lang} className="font-sans text-sm text-ink/70">
                      {lang}
                    </span>
                  ))}
                </div>
              </div>

              <div className="w-full h-px bg-ink/8" />

              <div>
                <p className="font-sans text-[10px] tracking-[0.25em] uppercase text-charcoal/65 mb-3">
                  Formation Doublage
                </p>
                <p className="font-sans text-sm text-charcoal/80 leading-relaxed">
                  En cours — disponibilité prévue
                  <br />
                  <span className="text-gold">fin 2025</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="mt-24 md:mt-32 pt-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-serif text-2xl text-ink">Tiffany Hengebaert</p>
              <p className="font-sans text-xs tracking-wider uppercase text-charcoal/80 mt-1">
                Comédienne de voix
              </p>
            </div>

            <div className="flex items-center gap-6">
              <a
                href="#hero"
                className="font-sans text-xs tracking-wider uppercase text-charcoal/80 hover:text-ink transition-colors"
              >
                Haut de page
              </a>
            </div>

            <p className="font-sans text-xs text-charcoal/65">
              © {new Date().getFullYear()} Tiffany Hengebaert. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>

      <div className="absolute top-1/3 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
    </section>
  )
}
