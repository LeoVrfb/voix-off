import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const About = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const signatureRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const body = bodyRef.current;
    const image = imageRef.current;
    const signature = signatureRef.current;

    if (!section || !heading || !body || !image || !signature) return;

    // Create scroll-triggered animations
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 20%',
        scrub: 0.5,
      }
    });

    tl.fromTo(heading,
      { opacity: 0, y: 60 },
      { opacity: 1, y: 0, ease: 'none' }
    );

    tl.fromTo(body,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, ease: 'none' },
      '-=0.5'
    );

    tl.fromTo(image,
      { opacity: 0, x: 60, scale: 0.95 },
      { opacity: 1, x: 0, scale: 1, ease: 'none' },
      '-=0.6'
    );

    tl.fromTo(signature,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, ease: 'none' },
      '-=0.3'
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
      id="about"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <h2 
              ref={headingRef}
              className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink leading-tight mb-8 opacity-0"
            >
              The Voice Behind<br />The Story
            </h2>
            
            <div ref={bodyRef} className="space-y-6 opacity-0">
              <p className="font-sans text-base md:text-lg text-charcoal leading-relaxed">
                With a background in classical theater and a passion for modern storytelling, 
                I bring a unique warmth and versatility to every project. From the subtle 
                nuances of an audiobook character to the punchy energy of a commercial, 
                my voice is the bridge between your words and your audience&apos;s heart.
              </p>
              
              <p className="font-sans text-base md:text-lg text-charcoal leading-relaxed">
                Based in Paris, I work with clients worldwide — from independent publishers 
                to global brands. Each project is an opportunity to craft something memorable, 
                to find the perfect tone that resonates and endures.
              </p>

              <p className="font-sans text-base md:text-lg text-charcoal leading-relaxed">
                Whether it&apos;s a 30-second spot or a 30-hour audiobook, I approach every 
                recording with the same dedication: precision, emotion, and that indefinable 
                quality that makes listeners lean in.
              </p>
            </div>

            {/* Signature */}
            <p 
              ref={signatureRef}
              className="font-serif text-3xl md:text-4xl text-ink mt-10 italic opacity-0"
            >
              Elise
            </p>
          </div>

          {/* Image */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            <div 
              ref={imageRef}
              className="relative opacity-0"
            >
              <div className="aspect-[3/4] max-w-lg mx-auto lg:max-w-none relative">
                {/* Decorative frame */}
                <div className="absolute -inset-3 border border-ink/10 pointer-events-none" />
                <div className="absolute -inset-6 border border-ink/5 pointer-events-none" />
                
                {/* Image */}
                <img 
                  src="/portrait.jpg" 
                  alt="Elise Dubois - Voice Artist"
                  className="w-full h-full object-cover"
                />
                
                {/* Subtle overlay gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-cream/20 to-transparent pointer-events-none" />
              </div>

              {/* Floating accent */}
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-gold/20 -z-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Background waveform decoration */}
      <div className="absolute bottom-0 left-0 right-0 h-32 opacity-5 pointer-events-none overflow-hidden">
        <svg viewBox="0 0 1200 120" className="w-full h-full" preserveAspectRatio="none">
          <path 
            d="M0,60 Q150,20 300,60 T600,60 T900,60 T1200,60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            className="text-ink"
          />
          <path 
            d="M0,60 Q150,100 300,60 T600,60 T900,60 T1200,60" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="1"
            className="text-ink"
          />
        </svg>
      </div>
    </section>
  );
};

export default About;
