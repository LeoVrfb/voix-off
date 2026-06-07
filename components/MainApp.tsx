'use client'

import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero from './sections/Hero'
import LivresAudio from './sections/NarratriceAudio'
import VoixOff from './sections/VoixOff'
import About from './sections/About'
import Contact from './sections/Contact'
import Navigation from './Navigation'
import LoadingScreen from './LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

export default function MainApp() {
  useEffect(() => {
    // Scroll natif : on rafraichit ScrollTrigger sur scroll standard
    const onScroll = () => ScrollTrigger.update()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="relative bg-studio min-h-screen">
      <LoadingScreen />
      <Navigation />

      <main className="relative">
        <Hero />
        <LivresAudio />
        <VoixOff />
        <About />
        <Contact />
      </main>
    </div>
  )
}
