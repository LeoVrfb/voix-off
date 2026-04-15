import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Mail, MapPin, Send, CheckCircle } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const projectTypes = [
  'Commercial',
  'Audiobook',
  'Corporate',
  'Podcast',
  'Documentary',
  'Other',
];

const Contact = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const infoRef = useRef<HTMLDivElement>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    projectType: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const form = formRef.current;
    const info = infoRef.current;

    if (!section || !heading || !form || !info) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 75%',
      }
    });

    tl.fromTo(heading,
      { opacity: 0, y: 40 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
    );

    tl.fromTo(form,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.5'
    );

    tl.fromTo(info,
      { opacity: 0, x: 30 },
      { opacity: 1, x: 0, duration: 0.8, ease: 'power3.out' },
      '-=0.6'
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
      id="contact"
      className="relative min-h-screen w-full bg-cream py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto section-padding">
        {/* Header */}
        <div ref={headingRef} className="text-center mb-16 md:mb-20 opacity-0">
          <p className="font-sans text-xs tracking-[0.4em] uppercase text-charcoal/60 mb-4">
            Get In Touch
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink">
            Let&apos;s Create Together
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          {/* Form */}
          <div className="lg:col-span-7">
            {isSubmitted ? (
              <div className="bg-paper p-12 md:p-16 text-center border border-border/50">
                <div className="w-16 h-16 rounded-full bg-gold/20 flex items-center justify-center mx-auto mb-6">
                  <CheckCircle size={32} className="text-gold" />
                </div>
                <h3 className="font-serif text-3xl text-ink mb-4">
                  Message Sent
                </h3>
                <p className="font-sans text-charcoal">
                  Thank you for reaching out. I&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form 
                ref={formRef}
                onSubmit={handleSubmit}
                className="space-y-8 opacity-0"
              >
                {/* Name & Email Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="name" className="block font-sans text-xs tracking-wider uppercase text-charcoal/60 mb-2">
                      Your Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="Jean Dupont"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block font-sans text-xs tracking-wider uppercase text-charcoal/60 mb-2">
                      Email Address
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      className="input-field"
                      placeholder="jean@example.com"
                    />
                  </div>
                </div>

                {/* Project Type */}
                <div>
                  <label htmlFor="projectType" className="block font-sans text-xs tracking-wider uppercase text-charcoal/60 mb-2">
                    Project Type
                  </label>
                  <select
                    id="projectType"
                    name="projectType"
                    value={formData.projectType}
                    onChange={handleChange}
                    required
                    className="input-field cursor-pointer"
                  >
                    <option value="">Select a project type</option>
                    {projectTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="message" className="block font-sans text-xs tracking-wider uppercase text-charcoal/60 mb-2">
                    Tell Me About Your Project
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="input-field resize-none"
                    placeholder="I'm looking for a voice for..."
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary flex items-center justify-center gap-3 w-full md:w-auto disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-cream/30 border-t-cream rounded-full animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={16} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div 
            ref={infoRef}
            className="lg:col-span-5 opacity-0"
          >
            <div className="bg-paper p-8 md:p-12 border border-border/50">
              <h3 className="font-serif text-2xl text-ink mb-8">
                Direct Contact
              </h3>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-ink/20">
                    <Mail size={18} className="text-ink/60" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase text-charcoal/60 mb-1">
                      Email
                    </p>
                    <a 
                      href="mailto:hello@elisedubois.voice"
                      className="font-sans text-base text-ink hover:text-gold transition-colors"
                    >
                      hello@elisedubois.voice
                    </a>
                  </div>
                </div>

                {/* Location */}
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center border border-ink/20">
                    <MapPin size={18} className="text-ink/60" />
                  </div>
                  <div>
                    <p className="font-sans text-xs tracking-wider uppercase text-charcoal/60 mb-1">
                      Studio Location
                    </p>
                    <p className="font-sans text-base text-ink">
                      Paris, France
                    </p>
                    <p className="font-sans text-sm text-charcoal/60 mt-1">
                      Remote sessions available worldwide
                    </p>
                  </div>
                </div>
              </div>

              {/* Response Time */}
              <div className="mt-10 pt-8 border-t border-border/50">
                <p className="font-sans text-sm text-charcoal/70">
                  I typically respond to inquiries within 24 hours. For urgent projects, please mention it in your message.
                </p>
              </div>

              {/* Languages */}
              <div className="mt-8">
                <p className="font-sans text-xs tracking-wider uppercase text-charcoal/60 mb-2">
                  Languages
                </p>
                <div className="flex flex-wrap gap-2">
                  {['French (Native)', 'English (Fluent)', 'Spanish (Conversational)'].map(lang => (
                    <span 
                      key={lang}
                      className="font-sans text-xs px-3 py-1 bg-cream text-ink/70"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-24 md:mt-32 pt-12 border-t border-border/50">
        <div className="max-w-7xl mx-auto section-padding">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <p className="font-serif text-2xl text-ink">Elise Dubois</p>
              <p className="font-sans text-xs tracking-wider uppercase text-charcoal/60 mt-1">
                Voice Artist & Narrator
              </p>
            </div>
            
            <div className="flex items-center gap-6">
              <a 
                href="#hero"
                className="font-sans text-xs tracking-wider uppercase text-charcoal/60 hover:text-ink transition-colors"
              >
                Back to Top
              </a>
            </div>

            <p className="font-sans text-xs text-charcoal/40">
              © {new Date().getFullYear()} Elise Dubois. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Background decoration */}
      <div className="absolute top-1/3 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -translate-x-1/2 pointer-events-none" />
    </section>
  );
};

export default Contact;
