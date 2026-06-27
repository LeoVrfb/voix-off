'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Send, CheckCircle, Mail, MapPin, Clock, ChevronRight } from 'lucide-react'
import BlurRevealText from '@/components/ui/BlurRevealText'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

gsap.registerPlugin(ScrollTrigger)

const projectTypes = ['Livre audio', 'Publicité', 'TV / Radio', 'E-learning', 'Documentaire', 'Podcast']

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
  const [isError, setIsError] = useState(false)

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
    setIsError(false)
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
      if (!res.ok) throw new Error('send failed')
      setIsSubmitted(true)
    } catch {
      setIsError(true)
    } finally {
      setIsSubmitting(false)
    }
  }

  useEffect(() => {
    const section = sectionRef.current
    const heading = headingRef.current
    const form = formRef.current
    const info = infoRef.current
    if (!section || !heading || !form || !info) return

    const tl = gsap.timeline({
      scrollTrigger: { trigger: section, start: 'top 75%' },
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
      className="relative w-full bg-studio py-24 md:py-32 overflow-hidden"
    >
      {/* Décor */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cream/15 to-transparent" />
      <div className="absolute -top-32 left-1/4 w-[28rem] h-[28rem] rounded-full bg-raspberry/12 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[24rem] h-[24rem] rounded-full bg-lavender/12 blur-[120px] pointer-events-none" />

      <div className="relative z-10 max-w-6xl mx-auto section-padding">
        {/* Entête */}
        <div ref={headingRef} className="mb-16 md:mb-20 opacity-0 text-center">
          <h2
            className="font-serif uppercase text-cream leading-[1] tracking-[-0.01em] whitespace-nowrap"
            style={{ fontSize: 'clamp(1.9rem, 7.5vw, 4.75rem)' }}
          >
            <BlurRevealText text="Contact" mode="char" stagger={0.04} duration={0.5} />
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Formulaire */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="py-16 flex flex-col items-start gap-6">
                <CheckCircle size={40} className="text-raspberry" strokeWidth={1.5} />
                <div>
                  <h3 className="font-serif text-3xl text-cream mb-2">Message envoyé</h3>
                  <p className="font-sans text-cream/70">
                    Merci. Je vous réponds dans les 24 heures.
                  </p>
                </div>
              </div>
            ) : (
              <form ref={formRef} onSubmit={handleSubmit} className="space-y-10 opacity-0">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div>
                    <label
                      htmlFor="name"
                      className="block font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-cream/85 mb-3"
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
                      className="w-full bg-transparent border-b border-cream/25 focus:border-raspberry py-2 font-sans text-base text-cream placeholder:text-cream/40 outline-none transition-colors duration-300"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="block font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-cream/85 mb-3"
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
                      className="w-full bg-transparent border-b border-cream/25 focus:border-raspberry py-2 font-sans text-base text-cream placeholder:text-cream/40 outline-none transition-colors duration-300"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-cream/85 mb-3">
                    Type de projet
                  </label>
                  <Select value={formData.projectType} onValueChange={handleProjectType} required>
                    <SelectTrigger className="w-full bg-transparent border-0 border-b border-cream/25 data-[state=open]:border-raspberry rounded-none px-0 py-2 font-sans text-base text-cream shadow-none ring-0 focus:ring-0 focus:ring-offset-0 focus-visible:outline-none focus-visible:ring-0 h-auto">
                      <SelectValue
                        placeholder={
                          <span className="text-cream/50">Choisir un type de projet</span>
                        }
                      />
                    </SelectTrigger>
                    <SelectContent className="bg-studio border border-cream/20 rounded-xl shadow-2xl">
                      {projectTypes.map((type) => (
                        <SelectItem
                          key={type}
                          value={type}
                          className="font-sans text-sm text-cream focus:bg-raspberry/20 focus:text-cream cursor-pointer rounded-lg"
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
                    className="block font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-cream/85 mb-3"
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
                    placeholder="Je recherche une voix pour…"
                    className="w-full bg-transparent border-b border-cream/25 focus:border-raspberry py-2 font-sans text-base text-cream placeholder:text-cream/40 outline-none transition-colors duration-300 resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group inline-flex items-center gap-4 px-7 py-3.5 rounded-full bg-cream hover:bg-cream/90 text-studio font-sans text-sm font-semibold tracking-[0.2em] uppercase transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer shadow-[0_15px_40px_-18px_rgba(0,0,0,0.8)] hover:scale-[1.02]"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border border-studio/30 border-t-studio rounded-full animate-spin" />
                      <span>Envoi en cours…</span>
                    </>
                  ) : (
                    <>
                      <span>Envoyer le message</span>
                      <Send size={16} className="transition-transform duration-300 group-hover:translate-x-1" />
                    </>
                  )}
                </button>

                {isError && (
                  <p className="font-sans text-sm text-raspberry">
                    L&apos;envoi a échoué. Réessayez ou écrivez directement à{' '}
                    <a href="mailto:contact@tiffanyvoixoff.fr" className="underline">
                      contact@tiffanyvoixoff.fr
                    </a>
                    .
                  </p>
                )}
              </form>
            )}
          </div>

          {/* Infos */}
          <div ref={infoRef} className="lg:col-span-5 opacity-0">
            <div className="space-y-5">
              <a
                href="mailto:contact@tiffanyvoixoff.fr"
                className="group block p-6 rounded-3xl border border-cream/20 bg-cream/[0.05] hover:bg-cream/[0.09] hover:border-raspberry/50 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-raspberry/20 flex items-center justify-center text-raspberry group-hover:bg-raspberry group-hover:text-cream transition-all duration-300">
                    <Mail className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div className="min-w-0">
                    <p className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-cream/85 mb-1.5">
                      E-mail direct
                    </p>
                    <p className="font-serif text-lg md:text-xl text-cream group-hover:text-raspberry transition-colors break-all">
                      contact@tiffanyvoixoff.fr
                    </p>
                  </div>
                </div>
              </a>

              <div className="p-6 rounded-3xl border border-cream/20 bg-cream/[0.05]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-lavender/20 flex items-center justify-center text-lavender">
                    <MapPin className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-cream/85 mb-1.5">
                      Studio
                    </p>
                    <p className="font-serif text-lg text-cream">Île-de-France</p>
                    <p className="font-sans text-xs text-cream/80 mt-1 leading-relaxed">
                      Sessions à distance partout dans le monde
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-3xl border border-cream/20 bg-cream/[0.05]">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-11 h-11 rounded-2xl bg-peach/25 flex items-center justify-center text-peach">
                    <Clock className="w-5 h-5" strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="font-sans text-[11px] font-semibold tracking-[0.25em] uppercase text-cream/85 mb-1.5">
                      Réponse
                    </p>
                    <p className="font-serif text-lg text-cream">Sous 24 heures</p>
                    <p className="font-sans text-xs text-cream/80 mt-1 leading-relaxed">
                      Précisez si votre projet est urgent
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 mt-24 md:mt-32 pt-10 border-t border-cream/15">
        <div className="max-w-6xl mx-auto section-padding">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-serif text-2xl text-cream">
                Tiffany <span className="italic text-raspberry">Voix Off</span>
              </p>
              <p className="font-sans text-[10px] font-medium tracking-[0.3em] uppercase text-cream/80 mt-1">
                Narration · Voix off
              </p>
            </div>

            <a
              href="#hero"
              onClick={(e) => {
                e.preventDefault()
                document.getElementById('hero')?.scrollIntoView({ behavior: 'smooth' })
              }}
              className="font-sans text-[10px] font-semibold tracking-[0.3em] uppercase text-cream/85 hover:text-raspberry transition-colors"
            >
              ↑ Haut de page
            </a>

            <p className="font-sans text-xs text-cream/65">
              © {new Date().getFullYear()} Tiffany Voix Off
            </p>
          </div>

          <div className="mt-8 flex justify-center">
            <a
              href="https://leohengebaert.fr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Cliquer pour visiter — Site réalisé par Léo Hengebaert, leohengebaert.fr"
              className="group inline-flex items-center gap-2.5"
            >
              {/* CTA hors du bouton, à gauche */}
              <span className="font-sans text-[11px] font-medium tracking-wide text-cream/80 transition-colors group-hover:text-cream">
                Cliquer pour visiter
              </span>
              {/* Chevrons pointant vers le bouton */}
              <span className="flex items-center text-cream/80 transition-colors group-hover:text-cream">
                <ChevronRight className="h-3.5 w-3.5 animate-signature-chevron [animation-delay:0ms]" />
                <ChevronRight className="-ml-2 h-3.5 w-3.5 animate-signature-chevron [animation-delay:150ms]" />
                <ChevronRight className="-ml-2 h-3.5 w-3.5 animate-signature-chevron [animation-delay:300ms]" />
              </span>
              {/* Le bouton */}
              <span className="relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-peach/40 bg-[#221912] px-4 py-2 shadow-[0_6px_18px_-4px_rgba(0,0,0,0.55),0_4px_20px_-8px_rgba(203,177,153,0.45)] transition-all duration-300 group-hover:-translate-y-0.5 group-hover:border-peach/75 group-hover:shadow-[0_12px_30px_-6px_rgba(0,0,0,0.6),0_14px_36px_-8px_rgba(203,177,153,0.85)]">
                <span className="animate-signature-aurora pointer-events-none absolute inset-0 bg-[radial-gradient(120%_120%_at_0%_50%,rgba(203,177,153,0.30),transparent_55%),radial-gradient(120%_120%_at_100%_50%,rgba(236,229,220,0.22),transparent_55%)]" />
                <span className="animate-signature-sweep pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-cream/60 to-transparent" />
                <span className="animate-signature-sweep-thin pointer-events-none absolute inset-y-0 left-0 w-[14%] bg-gradient-to-r from-transparent via-peach/90 to-transparent" />
                <span className="relative flex h-2 w-2 items-center justify-center">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-peach/70" />
                  <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-peach" />
                </span>
                <span className="relative font-sans text-[11px] font-semibold tracking-[0.05em] text-cream/90 transition-colors group-hover:text-cream">
                  Site réalisé par
                </span>
                <span className="relative bg-gradient-to-r from-[#ECE5DC] via-[#CBB199] to-[#ECE5DC] bg-clip-text font-sans text-[11px] font-bold tracking-[0.02em] text-transparent">
                  leohengebaert.fr
                </span>
              </span>
            </a>
          </div>
        </div>
      </footer>
    </section>
  )
}
