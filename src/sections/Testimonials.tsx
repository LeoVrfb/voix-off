import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ChevronLeft, ChevronRight, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const testimonials = [
  {
    id: 1,
    quote: "Elise's voice turned our ad campaign from good to unforgettable. She captured the essence of our brand with remarkable precision and brought an emotional depth we didn't know we needed.",
    author: "Marie-Claire Dubois",
    role: "Creative Director, L'Oréal Paris",
  },
  {
    id: 2,
    quote: "Working with Elise on our audiobook series was a revelation. Her ability to give each character a distinct voice while maintaining narrative flow is extraordinary. Our listeners are captivated.",
    author: "Jean-Pierre Martin",
    role: "Publisher, Éditions Gallimard",
  },
  {
    id: 3,
    quote: "The nuance and warmth Elise brings to corporate narration is rare. She made our training modules engaging — something I never thought possible. A true professional.",
    author: "Sophie Laurent",
    role: "Head of Learning, Air France",
  },
  {
    id: 4,
    quote: "Elise has that rare ability to make every word count. Her commercial reads don't just sell products — they tell stories that resonate with audiences long after the spot ends.",
    author: "Antoine Bernard",
    role: "Executive Producer, Publicis",
  },
];

const Testimonials = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const goToSlide = (index: number) => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    const carousel = carouselRef.current;
    if (!carousel) return;

    gsap.to(carousel, {
      x: `-${index * 100}%`,
      duration: 0.6,
      ease: 'power3.inOut',
      onComplete: () => {
        setIsAnimating(false);
        setCurrentIndex(index);
      }
    });
  };

  const nextSlide = () => {
    const newIndex = currentIndex === testimonials.length - 1 ? 0 : currentIndex + 1;
    goToSlide(newIndex);
  };

  const prevSlide = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1;
    goToSlide(newIndex);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;

    if (!section || !heading) return;

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

    return () => {
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger === section) st.kill();
      });
    };
  }, []);

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isAnimating) {
        nextSlide();
      }
    }, 6000);

    return () => clearInterval(interval);
  }, [currentIndex, isAnimating]);

  return (
    <section 
      ref={sectionRef}
      id="testimonials"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20 opacity-0">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-charcoal/60 mb-4">
            Kind Words
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink">
            Testimonials
          </h2>
        </div>

        {/* Carousel */}
        <div className="relative">
          {/* Quote Icon */}
          <div className="absolute -top-8 left-1/2 -translate-x-1/2 text-gold/30 z-0">
            <Quote size={80} strokeWidth={1} />
          </div>

          {/* Slides Container */}
          <div className="overflow-hidden">
            <div 
              ref={carouselRef}
              className="flex transition-none"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {testimonials.map((testimonial) => (
                <div 
                  key={testimonial.id}
                  className="w-full flex-shrink-0 px-4 md:px-16 lg:px-24"
                >
                  <div className="text-center max-w-4xl mx-auto">
                    <blockquote className="font-serif text-2xl md:text-3xl lg:text-4xl text-ink leading-relaxed mb-10">
                      &ldquo;{testimonial.quote}&rdquo;
                    </blockquote>
                    <div>
                      <p className="font-sans text-sm md:text-base text-ink font-medium">
                        {testimonial.author}
                      </p>
                      <p className="font-sans text-xs md:text-sm text-charcoal/60 mt-1">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-12">
            {/* Prev Button */}
            <button 
              onClick={prevSlide}
              className="w-12 h-12 flex items-center justify-center border border-ink/20 text-ink/60 hover:border-ink hover:text-ink transition-all duration-300"
              aria-label="Previous testimonial"
            >
              <ChevronLeft size={20} />
            </button>

            {/* Dots */}
            <div className="flex items-center gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-ink w-6' 
                      : 'bg-ink/20 hover:bg-ink/40'
                  }`}
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            {/* Next Button */}
            <button 
              onClick={nextSlide}
              className="w-12 h-12 flex items-center justify-center border border-ink/20 text-ink/60 hover:border-ink hover:text-ink transition-all duration-300"
              aria-label="Next testimonial"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="absolute top-1/4 right-0 w-72 h-72 bg-gold/5 rounded-full blur-3xl translate-x-1/2 pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-96 h-96 bg-ink/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
    </section>
  );
};

export default Testimonials;
