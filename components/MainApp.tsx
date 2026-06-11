'use client'

import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

import Hero from './sections/Hero'
import MetsDesMots from './sections/NarratriceAudio'
import About from './sections/About'
import Contact from './sections/Contact'
import Navigation from './Navigation'
import LoadingScreen from './LoadingScreen'

gsap.registerPlugin(ScrollTrigger)

export default function MainApp() {
  return (
    <div className="relative bg-studio min-h-screen">
      <LoadingScreen />
      <Navigation />

      <main className="relative">
        <Hero />
        <MetsDesMots />
        <About />
        <Contact />
      </main>
    </div>
  )
}
