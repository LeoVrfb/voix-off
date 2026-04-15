import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'demoreel', label: 'Demo' },
  { id: 'testimonials', label: 'Reviews' },
  { id: 'contact', label: 'Contact' },
];

const Navigation = () => {
  const navRef = useRef<HTMLElement>(null);
  const [activeSection, setActiveSection] = useState('hero');
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Show navigation after scrolling past hero
    ScrollTrigger.create({
      trigger: '#about',
      start: 'top 80%',
      onEnter: () => setIsVisible(true),
      onLeaveBack: () => setIsVisible(false),
    });

    // Track active section
    navItems.forEach((item) => {
      ScrollTrigger.create({
        trigger: `#${item.id}`,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => setActiveSection(item.id),
        onEnterBack: () => setActiveSection(item.id),
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger && navItems.some(item => `#${item.id}` === st.vars.trigger)) {
          st.kill();
        }
      });
    };
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav 
      ref={navRef}
      className={`fixed right-8 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4 transition-all duration-500 ${
        isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8 pointer-events-none'
      }`}
    >
      {navItems.map((item) => (
        <button
          key={item.id}
          onClick={() => scrollToSection(item.id)}
          className="group relative flex items-center justify-end"
          aria-label={`Navigate to ${item.label}`}
        >
          <span className={`absolute right-6 font-sans text-xs tracking-wider uppercase whitespace-nowrap transition-all duration-300 ${
            activeSection === item.id 
              ? 'opacity-100 translate-x-0 text-ink' 
              : 'opacity-0 translate-x-2 text-charcoal group-hover:opacity-100 group-hover:translate-x-0'
          }`}>
            {item.label}
          </span>
          <div 
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              activeSection === item.id 
                ? 'bg-ink scale-125' 
                : 'bg-ink/20 group-hover:bg-ink/50 group-hover:scale-110'
            }`}
          />
        </button>
      ))}
    </nav>
  );
};

export default Navigation;
