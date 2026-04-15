import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const LoadingScreen = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const topCurtainRef = useRef<HTMLDivElement>(null);
  const bottomCurtainRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const tl = gsap.timeline({
      onComplete: () => {
        setIsLoading(false);
      }
    });

    // Animate progress bar
    tl.to(progressRef.current, {
      width: '100%',
      duration: 1.2,
      ease: 'power2.inOut'
    });

    // Fade out text
    tl.to(textRef.current, {
      opacity: 0,
      y: -20,
      duration: 0.4,
      ease: 'power2.in'
    }, '+=0.2');

    // Split curtains
    tl.to(topCurtainRef.current, {
      yPercent: -100,
      duration: 0.8,
      ease: 'power4.inOut'
    }, '-=0.1');

    tl.to(bottomCurtainRef.current, {
      yPercent: 100,
      duration: 0.8,
      ease: 'power4.inOut'
    }, '<');

    // Hide container
    tl.set(containerRef.current, {
      display: 'none'
    });

    return () => {
      tl.kill();
    };
  }, []);

  if (!isLoading) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[100] pointer-events-none"
    >
      {/* Top Curtain */}
      <div 
        ref={topCurtainRef}
        className="absolute top-0 left-0 right-0 h-1/2 bg-ink flex items-end justify-center pb-8"
      >
        <div ref={textRef} className="text-center">
          <p className="text-cream/80 font-sans text-xs tracking-[0.3em] uppercase mb-4">
            Loading Audio Profile
          </p>
          <div className="w-48 h-[2px] bg-cream/20 overflow-hidden">
            <div 
              ref={progressRef}
              className="h-full bg-cream w-0"
            />
          </div>
        </div>
      </div>
      
      {/* Bottom Curtain */}
      <div 
        ref={bottomCurtainRef}
        className="absolute bottom-0 left-0 right-0 h-1/2 bg-ink"
      />
    </div>
  );
};

export default LoadingScreen;
