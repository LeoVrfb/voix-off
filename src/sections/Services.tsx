import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mic, BookOpen, Building2, Headphones, Radio, Film } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const services = [
  {
    icon: Mic,
    title: 'Commercial',
    description: 'High-energy reads for TV, radio, and web campaigns. From luxury brands to everyday products, I deliver the perfect tone to capture attention and drive action.',
  },
  {
    icon: BookOpen,
    title: 'Audiobooks',
    description: 'Engaging narration for fiction and non-fiction. Character voices, emotional depth, and the pacing that keeps listeners hooked for hours.',
  },
  {
    icon: Building2,
    title: 'Corporate',
    description: 'Clear, professional tone for e-learning modules, training videos, IVR systems, and internal communications that sound human, not robotic.',
  },
  {
    icon: Headphones,
    title: 'Podcast Intro/Outro',
    description: 'Memorable voice branding for podcast intros, outros, and mid-roll segments that give your show a professional edge.',
  },
  {
    icon: Radio,
    title: 'Radio Imaging',
    description: 'Station IDs, promos, and sweepers that define your radio brand with distinctive voice work.',
  },
  {
    icon: Film,
    title: 'Documentary',
    description: 'Thoughtful, compelling narration that guides viewers through stories with authority and emotional resonance.',
  },
];

const Services = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const cards = cardsRef.current.filter(Boolean);

    if (!section || !heading || cards.length === 0) return;

    // Heading animation
    gsap.fromTo(heading,
      { opacity: 0, y: 40 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 75%',
        }
      }
    );

    // Cards stagger animation
    gsap.fromTo(cards,
      { opacity: 0, y: 50, scale: 0.95 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.6,
        stagger: 0.1,
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: section,
          start: 'top 65%',
        }
      }
    );

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      id="services"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20 opacity-0">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-charcoal/60 mb-4">
            What I Do
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink">
            Services
          </h2>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={service.title}
                ref={el => { cardsRef.current[index] = el; }}
                className="group relative bg-paper p-8 md:p-10 border border-border/50 hover:border-ink/20 transition-all duration-500 hover:shadow-lg opacity-0"
              >
                {/* Icon */}
                <div className="mb-6">
                  <div className="w-12 h-12 flex items-center justify-center border border-ink/20 group-hover:border-ink/40 group-hover:bg-ink group-hover:text-cream transition-all duration-300">
                    <Icon size={22} strokeWidth={1.5} />
                  </div>
                </div>

                {/* Content */}
                <h3 className="font-serif text-2xl md:text-3xl text-ink mb-4">
                  {service.title}
                </h3>
                <p className="font-sans text-sm md:text-base text-charcoal leading-relaxed">
                  {service.description}
                </p>

                {/* Hover accent line */}
                <div className="absolute bottom-0 left-0 w-0 h-[2px] bg-gold group-hover:w-full transition-all duration-500" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 md:mt-20">
          <p className="font-sans text-sm text-charcoal/70 mb-6">
            Have a project in mind that doesn&apos;t fit these categories?
          </p>
          <a 
            href="#contact"
            className="inline-flex items-center gap-2 font-sans text-sm tracking-wider uppercase text-ink hover:text-gold transition-colors duration-300"
          >
            <span>Let&apos;s discuss</span>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="transition-transform duration-300 group-hover:translate-x-1">
              <path d="M3 8H13M13 8L9 4M13 8L9 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/2 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-ink/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3 pointer-events-none" />
    </section>
  );
};

export default Services;
