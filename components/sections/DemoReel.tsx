'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Play, Pause, Volume2, VolumeX, SkipBack, SkipForward } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

interface Track {
  id: string
  title: string
  category: 'Voix Off' | 'Livre Audio'
  duration: string
  durationSeconds: number
}

const tracks: Track[] = [
  {
    id: '1',
    title: "L'Oréal Paris — Parce que vous le valez bien",
    category: 'Voix Off',
    duration: '00:30',
    durationSeconds: 30,
  },
  {
    id: '2',
    title: 'Le Petit Prince — Extrait',
    category: 'Livre Audio',
    duration: '02:15',
    durationSeconds: 135,
  },
  {
    id: '3',
    title: 'Air France — Classe Affaires',
    category: 'Voix Off',
    duration: '00:45',
    durationSeconds: 45,
  },
  {
    id: '4',
    title: 'Madame Bovary — Chapitre premier',
    category: 'Livre Audio',
    duration: '03:20',
    durationSeconds: 200,
  },
  {
    id: '5',
    title: "Chanel N°5 — L'Essence",
    category: 'Voix Off',
    duration: '00:30',
    durationSeconds: 30,
  },
  {
    id: '6',
    title: 'Le Cirque des Rêves — Prologue',
    category: 'Livre Audio',
    duration: '04:10',
    durationSeconds: 250,
  },
  {
    id: '7',
    title: "Dior J'adore — Nouvelle campagne",
    category: 'Voix Off',
    duration: '00:20',
    durationSeconds: 20,
  },
  {
    id: '8',
    title: "Les Misérables — L'histoire de Fantine",
    category: 'Livre Audio',
    duration: '05:45',
    durationSeconds: 345,
  },
]

export default function DemoReel() {
  const sectionRef = useRef<HTMLElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const headerRef = useRef<HTMLDivElement>(null)
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [volume, setVolume] = useState(80)
  const [isMuted, setIsMuted] = useState(false)
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (isPlaying && currentTrack) {
      progressIntervalRef.current = setInterval(() => {
        setCurrentTime((prev) => {
          if (prev >= currentTrack.durationSeconds) {
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    } else {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }

    return () => {
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current)
      }
    }
  }, [isPlaying, currentTrack])

  const playTrack = useCallback(
    (track: Track) => {
      if (currentTrack?.id === track.id) {
        setIsPlaying(!isPlaying)
      } else {
        setCurrentTrack(track)
        setCurrentTime(0)
        setIsPlaying(true)
      }
    },
    [currentTrack, isPlaying]
  )

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!currentTrack) return
    const rect = e.currentTarget.getBoundingClientRect()
    const percent = (e.clientX - rect.left) / rect.width
    setCurrentTime(Math.floor(percent * currentTrack.durationSeconds))
  }

  const skipTrack = (direction: 'prev' | 'next') => {
    if (!currentTrack) return
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id)
    let newIndex: number
    if (direction === 'prev') {
      newIndex = currentIndex > 0 ? currentIndex - 1 : tracks.length - 1
    } else {
      newIndex = currentIndex < tracks.length - 1 ? currentIndex + 1 : 0
    }
    playTrack(tracks[newIndex])
  }

  useEffect(() => {
    const section = sectionRef.current
    const container = containerRef.current
    const header = headerRef.current

    if (!section || !container || !header) return

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: 'top 80%',
        end: 'top 30%',
        scrub: 0.5,
      },
    })

    tl.fromTo(
      container,
      { y: 100, opacity: 0, borderRadius: '40px' },
      { y: 0, opacity: 1, borderRadius: '0px', ease: 'none' }
    )

    tl.fromTo(
      header,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, ease: 'none' },
      '-=0.3'
    )

    return () => {
      ScrollTrigger.getAll().forEach((st) => {
        if (st.vars.trigger === section) st.kill()
      })
    }
  }, [])

  return (
    <section ref={sectionRef} id="demoreel" className="relative w-full bg-cream">
      <div ref={containerRef} className="relative bg-paper min-h-screen opacity-0">
        <div
          ref={headerRef}
          className="pt-20 md:pt-28 pb-8 section-padding border-b border-border/50 opacity-0"
        >
          <div className="max-w-7xl mx-auto">
            <p className="font-sans text-xs tracking-[0.4em] uppercase text-charcoal/80 mb-4">
              Écouter
            </p>
            <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ink">Démos</h2>
          </div>
        </div>

        <div className="section-padding py-8 md:py-12">
          <div className="max-w-7xl mx-auto">
            <div className="space-y-1">
              {tracks.map((track) => {
                const isCurrentTrack = currentTrack?.id === track.id
                const progress =
                  isCurrentTrack && currentTrack
                    ? (currentTime / currentTrack.durationSeconds) * 100
                    : 0

                return (
                  <div
                    key={track.id}
                    className={`audio-track-row group flex items-center gap-4 md:gap-6 py-4 md:py-5 px-4 md:px-6 cursor-pointer ${
                      isCurrentTrack ? 'bg-cream/50' : ''
                    }`}
                    onClick={() => playTrack(track)}
                  >
                    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center">
                      <div
                        className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-300 ${
                          isCurrentTrack
                            ? 'border-ink bg-ink text-cream'
                            : 'border-ink/20 text-ink/40 group-hover:border-ink/40 group-hover:text-ink/60'
                        }`}
                      >
                        {isCurrentTrack && isPlaying ? (
                          <Pause size={12} />
                        ) : (
                          <Play size={12} className="ml-0.5" />
                        )}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-serif text-lg md:text-xl truncate transition-colors duration-300 ${
                          isCurrentTrack ? 'text-ink' : 'text-ink/70 group-hover:text-ink'
                        }`}
                      >
                        {track.title}
                      </h3>
                      <div className="flex items-center gap-3 mt-1">
                        <span
                          className={`font-sans text-xs uppercase tracking-wider px-2 py-0.5 ${
                            track.category === 'Voix Off'
                              ? 'bg-gold/20 text-ink/70'
                              : 'bg-ink/10 text-ink/70'
                          }`}
                        >
                          {track.category}
                        </span>
                        {isCurrentTrack && (
                          <span className="font-sans text-xs text-charcoal">
                            {formatTime(currentTime)} / {track.duration}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="hidden md:flex items-center gap-0.5 w-32 h-8">
                      {[...Array(20)].map((_, i) => {
                        const barHeight = 20 + Math.sin(i * 0.8) * 15 + Math.abs(Math.sin(i * 2.3)) * 10
                        const isActive = i < (progress / 100) * 20
                        return (
                          <div
                            key={i}
                            className={`w-1 rounded-full transition-all duration-300 ${
                              isCurrentTrack
                                ? isActive
                                  ? 'bg-ink'
                                  : 'bg-ink/20'
                                : 'bg-ink/10 group-hover:bg-ink/20'
                            }`}
                            style={{ height: `${barHeight}%` }}
                          />
                        )
                      })}
                    </div>

                    <span className="font-sans text-sm text-charcoal/80 w-14 text-right">
                      {track.duration}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Sticky Player Bar */}
        <div
          className={`fixed bottom-0 left-0 right-0 bg-paper border-t border-border/50 shadow-lg transition-transform duration-500 z-40 ${
            currentTrack ? 'translate-y-0' : 'translate-y-full'
          }`}
        >
          <div className="section-padding py-4">
            <div className="max-w-7xl mx-auto flex items-center gap-4 md:gap-6">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => skipTrack('prev')}
                  className="w-8 h-8 flex items-center justify-center text-ink/60 hover:text-ink transition-colors cursor-pointer"
                  aria-label="Previous track"
                >
                  <SkipBack size={18} />
                </button>
                <button
                  onClick={() => currentTrack && playTrack(currentTrack)}
                  className="w-10 h-10 rounded-full bg-ink text-cream flex items-center justify-center hover:bg-ink/90 transition-all hover:scale-105 cursor-pointer"
                  aria-label={isPlaying ? 'Pause' : 'Play'}
                >
                  {isPlaying ? <Pause size={16} /> : <Play size={16} className="ml-0.5" />}
                </button>
                <button
                  onClick={() => skipTrack('next')}
                  className="w-8 h-8 flex items-center justify-center text-ink/60 hover:text-ink transition-colors cursor-pointer"
                  aria-label="Next track"
                >
                  <SkipForward size={18} />
                </button>
              </div>

              <div className="flex-1 min-w-0 hidden sm:block">
                <p className="font-serif text-base text-ink truncate">{currentTrack?.title}</p>
                <p className="font-sans text-xs text-charcoal/80 uppercase tracking-wider">
                  {currentTrack?.category}
                </p>
              </div>

              <div className="flex-1 md:flex-none md:w-64 lg:w-80">
                <div
                  className="h-1 bg-border/50 rounded-full cursor-pointer overflow-hidden"
                  onClick={handleProgressClick}
                >
                  <div
                    className="h-full bg-ink transition-all duration-100"
                    style={{
                      width: currentTrack
                        ? `${(currentTime / currentTrack.durationSeconds) * 100}%`
                        : '0%',
                    }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="font-sans text-[10px] text-charcoal/75">
                    {formatTime(currentTime)}
                  </span>
                  <span className="font-sans text-[10px] text-charcoal/75">
                    {currentTrack?.duration}
                  </span>
                </div>
              </div>

              <div className="hidden md:flex items-center gap-2">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-ink/60 hover:text-ink transition-colors cursor-pointer"
                  aria-label={isMuted ? 'Unmute' : 'Mute'}
                >
                  {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={isMuted ? 0 : volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-20 h-1 bg-border/50 rounded-full appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-ink"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="h-20" />
      </div>
    </section>
  )
}
