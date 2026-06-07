'use client'

import { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioTrack {
  id: string
  title: string
  category: string
  duration: string
}

interface AudioPlayerProps {
  tracks: AudioTrack[]
  /** 'audiobook' = livres audio (sobre), 'voiceover' = voix off (vif) */
  variant?: 'audiobook' | 'voiceover'
}

export default function AudioPlayer({ tracks, variant = 'audiobook' }: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const accentHex = variant === 'voiceover' ? '#CB769E' : '#7681B3'

  const handlePlay = (index: number) => {
    if (currentTrack === index) {
      setIsPlaying((p) => !p)
    } else {
      setCurrentTrack(index)
      setIsPlaying(true)
      setProgress(0)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      progressInterval.current = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false)
            return 0
          }
          return prev + 0.4
        })
      }, 100)
    } else if (progressInterval.current) {
      clearInterval(progressInterval.current)
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isPlaying])

  return (
    <div className="w-full space-y-3">
      {tracks.map((track, index) => {
        const isActive = currentTrack === index
        return (
          <div
            key={track.id}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
              isActive
                ? 'border-cream/40 bg-cream/[0.07]'
                : 'border-cream/15 hover:border-cream/30 hover:bg-cream/[0.05]'
            }`}
          >
            {/* Progress background */}
            {isActive && (
              <div
                className="absolute left-0 top-0 bottom-0 transition-all duration-100 pointer-events-none"
                style={{
                  width: `${progress}%`,
                  background: `linear-gradient(90deg, ${accentHex}22, ${accentHex}10)`,
                }}
              />
            )}

            <div className="relative flex items-center gap-4 px-5 py-4">
              {/* Play button */}
              <button
                onClick={() => handlePlay(index)}
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'text-cream scale-110 shadow-[0_8px_24px_-6px_rgba(0,0,0,0.4)]'
                    : 'bg-cream/8 text-cream hover:bg-cream hover:text-studio'
                }`}
                style={isActive ? { backgroundColor: accentHex } : undefined}
                aria-label={isActive && isPlaying ? 'Pause' : 'Lecture'}
              >
                {isActive && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              {/* Mini waveform - deterministic */}
              <div className="hidden sm:flex items-end gap-[2px] h-7 flex-shrink-0 w-16">
                {[...Array(14)].map((_, i) => {
                  const h = Math.round(25 + Math.abs(Math.sin(i * 0.9 + index * 0.5)) * 70)
                  return (
                    <div
                      key={i}
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        isActive && isPlaying ? 'animate-pulse' : ''
                      }`}
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.06}s`,
                        backgroundColor:
                          isActive && isPlaying
                            ? accentHex
                            : 'rgba(238, 226, 223, 0.25)',
                      }}
                    />
                  )
                })}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-serif text-base md:text-lg font-medium truncate transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-cream/95 group-hover:text-cream'
                  }`}
                >
                  {track.title}
                </p>
                <p
                  className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] mt-1.5"
                  style={{ color: accentHex }}
                >
                  {track.category}
                </p>
              </div>

              {/* Duration / Volume */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {isActive && isPlaying && (
                  <Volume2 className="w-4 h-4 animate-pulse" style={{ color: accentHex }} />
                )}
                <span className="font-sans text-xs font-medium text-cream/75 tabular-nums">
                  {track.duration}
                </span>
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className="absolute bottom-0 left-0 h-px transition-all duration-300"
              style={{
                width: isActive ? '100%' : '0%',
                backgroundColor: accentHex,
              }}
            />
            <div
              className="absolute bottom-0 left-0 h-px w-0 group-hover:w-full transition-all duration-500 pointer-events-none"
              style={{ backgroundColor: `${accentHex}66` }}
            />
          </div>
        )
      })}
    </div>
  )
}
