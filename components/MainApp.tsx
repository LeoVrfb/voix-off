'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Lenis from 'lenis'

import Hero from './sections/Hero'
import About from './sections/About'
import NarratriceAudio from './sections/NarratriceAudio'
import VoixOff from './sections/VoixOff'
import Services from './sections/Services'
import Testimonials from './sections/Testimonials'
import Contact from './sections/Contact'
import Navigation from './Navigation'
import LoadingScreen from './LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

export default function MainApp() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    })

    lenisRef.current.on('scroll', ScrollTrigger.update)

    const ticker = (time: number) => {
      lenisRef.current?.raf(time * 1000)
    }

    gsap.ticker.add(ticker)
    gsap.ticker.lagSmoothing(0)

    return () => {
      lenisRef.current?.destroy()
      gsap.ticker.remove(ticker)
    }
  }, [])

  return (
    <div className="relative bg-cream min-h-screen">
      <LoadingScreen />
      <Navigation />

      <main className="relative">
        <Hero />
        <About />
        <NarratriceAudio />
        <VoixOff />
        <Services />
        <Testimonials />
        <Contact />
      </main>
    </div>
  )
}
