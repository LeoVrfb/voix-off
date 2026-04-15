import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

import Hero from './sections/Hero';
import About from './sections/About';
import Services from './sections/Services';
import DemoReel from './sections/DemoReel';
import Testimonials from './sections/Testimonials';
import Contact from './sections/Contact';
import Navigation from './components/Navigation';
import LoadingScreen from './components/LoadingScreen';

import './App.css';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const lenisRef = useRef<Lenis | null>(null);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize Lenis smooth scrolling
    lenisRef.current = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      touchMultiplier: 2,
    });

    // Connect Lenis to GSAP ScrollTrigger
    lenisRef.current.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenisRef.current?.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    return () => {
      lenisRef.current?.destroy();
      gsap.ticker.remove((time) => {
        lenisRef.current?.raf(time * 1000);
      });
    };
  }, []);

  return (
    <div ref={mainRef} className="relative bg-cream min-h-screen">
      <LoadingScreen />
      <Navigation />
      
      <main className="relative">
        <Hero />
        <About />
        <Services />
        <DemoReel />
        <Testimonials />
        <Contact />
      </main>
    </div>
  );
}

export default App;
