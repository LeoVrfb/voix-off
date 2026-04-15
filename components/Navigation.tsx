'use client'

import { useEffect, useRef, useState } from 'react'

const navItems = [
  { id: 'hero', label: 'Accueil' },
  { id: 'about', label: 'À propos' },
  { id: 'narratrice', label: 'Narratrice' },
  { id: 'voixoff', label: 'Voix Off' },
  { id: 'services', label: 'Services' },
  { id: 'testimonials', label: 'Références' },
  { id: 'contact', label: 'Contact' },
]

// Sections avec fond sombre → les dots et labels doivent passer en cream
const DARK_SECTIONS = new Set(['voixoff'])

export default function Navigation() {
  const navRef = useRef<HTMLElement>(null)
  const [activeSection, setActiveSection] = useState('hero')
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const update = () => {
      // Quelle section occupe le plus de pixels visibles à l'écran ?
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

      // Le nav est-il visuellement sur une section sombre ?
      const navEl = navRef.current
      if (navEl) {
        const navCenter = (navEl.getBoundingClientRect().top + navEl.getBoundingClientRect().bottom) / 2
        let onDark = false
        DARK_SECTIONS.forEach((id) => {
          const el = document.getElementById(id)
          if (!el) return
          const rect = el.getBoundingClientRect()
          if (navCenter >= rect.top && navCenter <= rect.bottom) {
            onDark = true
          }
        })
        setIsDark(onDark)
      }
    }

    // Écoute le scroll natif ET les mises à jour RAF (pour Lenis + GSAP pin)
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

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const dotActive = isDark ? 'bg-cream scale-125' : 'bg-ink scale-125'
  const dotInactive = isDark
    ? 'bg-cream/30 group-hover:bg-cream/70 group-hover:scale-110'
    : 'bg-ink/20 group-hover:bg-ink/50 group-hover:scale-110'
  const labelActive = isDark ? 'text-cream' : 'text-ink'
  const labelInactive = isDark ? 'text-cream/60' : 'text-charcoal'

  return (
    <nav
      ref={navRef}
      className="fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 transition-colors duration-500"
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="group relative flex items-center justify-end cursor-pointer"
          aria-label={`Aller à ${item.label}`}
        >
          <span
            className={`absolute right-6 font-sans text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
              activeSection === item.id
                ? `opacity-100 translate-x-0 ${labelActive}`
                : `opacity-0 translate-x-2 ${labelInactive} group-hover:opacity-100 group-hover:translate-x-0`
            }`}
          >
            {item.label}
          </span>
          <div
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === item.id ? dotActive : dotInactive
            }`}
          />
        </button>
      ))}
    </nav>
  )
}
