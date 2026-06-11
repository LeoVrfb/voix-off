'use client'

import { useEffect, useRef, useState } from 'react'
import { Menu, X } from 'lucide-react'

const navItems = [
  { id: 'hero', label: 'Accueil' },
  { id: 'livres-audio', label: 'Mes démos' },
  { id: 'about', label: 'Qui suis-je ?' },
  { id: 'contact', label: 'Contact' },
]

export default function Navigation() {
  const [activeSection, setActiveSection] = useState('hero')
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 40)

      let bestId = navItems[0].id
      let bestVisible = -1
      navItems.forEach((item) => {
        const el = document.getElementById(item.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const visible = Math.min(rect.bottom, window.innerHeight) - Math.max(rect.top, 0)
        if (visible > bestVisible) {
          bestVisible = visible
          bestId = item.id
        }
      })
      setActiveSection(bestId)
    }

    window.addEventListener('scroll', update, { passive: true })
    const raf = requestAnimationFrame(function loop() {
      update()
      requestAnimationFrame(loop)
    })

    return () => {
      window.removeEventListener('scroll', update)
      cancelAnimationFrame(raf)
    }
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  const goTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setOpen(false)
    }
  }

  return (
    <>
      {/* Desktop : barre top centrée, devient compacte au scroll */}
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 hidden md:flex justify-center transition-all duration-500 ${
          scrolled ? 'pt-3' : 'pt-6'
        }`}
      >
        <div
          className={`pointer-events-auto flex items-center gap-1 rounded-full border transition-all duration-500 backdrop-blur-xl ${
            scrolled
              ? 'bg-studio/95 border-cream/15 px-3 py-2 shadow-[0_10px_40px_-15px_rgba(0,0,0,0.7)]'
              : 'bg-studio/80 border-cream/12 px-4 py-2.5 shadow-[0_8px_30px_-18px_rgba(0,0,0,0.6)]'
          }`}
        >
          {navItems.map((item) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                onClick={() => goTo(item.id)}
                className="group relative px-4 py-2 font-sans text-[11px] font-medium tracking-[0.18em] uppercase transition-colors"
                aria-current={isActive ? 'page' : undefined}
              >
                <span
                  className={`relative z-10 transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-cream/80 group-hover:text-cream'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute inset-0 rounded-full bg-cream/10 ring-1 ring-cream/20" />
                )}
                <span
                  className={`absolute left-1/2 -bottom-0.5 h-px -translate-x-1/2 bg-raspberry transition-all duration-300 ${
                    isActive ? 'w-6' : 'w-0 group-hover:w-3'
                  }`}
                />
              </button>
            )
          })}
        </div>
      </nav>

      {/* Mobile : bouton hamburger fixed à droite */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        aria-expanded={open}
        className="md:hidden fixed top-5 right-5 z-[60] w-12 h-12 rounded-full flex items-center justify-center backdrop-blur-xl bg-studio/90 border border-cream/15 text-cream shadow-[0_10px_30px_-10px_rgba(0,0,0,0.7)] transition-transform active:scale-95"
      >
        <span className="relative w-5 h-5 flex items-center justify-center">
          <Menu
            size={18}
            className={`absolute transition-all duration-300 ${
              open ? 'opacity-0 rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <X
            size={20}
            className={`absolute transition-all duration-300 ${
              open ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 -rotate-90 scale-50'
            }`}
          />
        </span>
      </button>

      {/* Mobile : panneau plein écran */}
      <div
        className={`md:hidden fixed inset-0 z-50 transition-all duration-500 ${
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        }`}
      >
        <div className="absolute inset-0 bg-studio/95 backdrop-blur-2xl" />

        {/* Petits cercles colorés décoratifs */}
        <div className="absolute -top-32 -right-20 w-80 h-80 rounded-full bg-raspberry/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 -left-20 w-96 h-96 rounded-full bg-lavender/15 blur-3xl pointer-events-none" />

        <div className="relative h-full flex flex-col justify-center px-8">
          <ul className="space-y-6">
            {navItems.map((item, i) => {
              const isActive = activeSection === item.id
              return (
                <li
                  key={item.id}
                  className="overflow-hidden"
                  style={{ transitionDelay: `${i * 50}ms` }}
                >
                  <button
                    onClick={() => goTo(item.id)}
                    className="group w-full text-left flex items-baseline gap-4"
                  >
                    <span className="font-sans text-xs tracking-[0.3em] uppercase text-cream/40 w-10">
                      0{i + 1}
                    </span>
                    <span
                      className={`font-serif text-4xl sm:text-5xl leading-none transition-all duration-500 ${
                        isActive
                          ? 'text-raspberry italic'
                          : 'text-cream group-hover:text-raspberry'
                      }`}
                      style={{
                        transform: open ? 'translateY(0)' : 'translateY(40px)',
                        opacity: open ? 1 : 0,
                        transitionProperty: 'transform, opacity, color',
                        transitionDuration: '600ms',
                        transitionDelay: `${100 + i * 70}ms`,
                      }}
                    >
                      {item.label}
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div
            className="mt-16 pl-14"
            style={{
              transform: open ? 'translateY(0)' : 'translateY(20px)',
              opacity: open ? 1 : 0,
              transition: 'all 600ms ease-out 500ms',
            }}
          >
            <p className="font-sans text-[10px] tracking-[0.3em] uppercase text-cream/35 mb-2">
              Tiffany Voix Off
            </p>
            <p className="font-serif italic text-cream/65">Comédienne &amp; narratrice</p>
          </div>
        </div>
      </div>
    </>
  )
}
