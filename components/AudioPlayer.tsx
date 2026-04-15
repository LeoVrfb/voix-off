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
  variant?: 'literary' | 'commercial'
}

export default function AudioPlayer({ tracks, variant = 'literary' }: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const progressInterval = useRef<ReturnType<typeof setInterval> | null>(null)

  const isLiterary = variant === 'literary'

  const handlePlay = (index: number) => {
    if (currentTrack === index) {
      setIsPlaying(!isPlaying)
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
    } else {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
    return () => {
      if (progressInterval.current) clearInterval(progressInterval.current)
    }
  }, [isPlaying])

  return (
    <div className="w-full space-y-2">
      {tracks.map((track, index) => {
        const isActive = currentTrack === index
        return (
          <div
            key={track.id}
            className={`group relative overflow-hidden transition-all duration-300 ${
              isLiterary
                ? `border border-ink/10 ${isActive ? 'bg-ink/5' : 'hover:bg-ink/5'}`
                : `border border-cream/10 ${isActive ? 'bg-cream/10' : 'hover:bg-cream/10'}`
            }`}
          >
            {/* Progress background */}
            {isActive && (
              <div
                className={`absolute left-0 top-0 bottom-0 transition-all duration-100 ${
                  isLiterary ? 'bg-gold/15' : 'bg-gold/20'
                }`}
                style={{ width: `${progress}%` }}
              />
            )}

            <div className="relative flex items-center gap-4 px-5 py-4">
              {/* Play button */}
              <button
                onClick={() => handlePlay(index)}
                className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 cursor-pointer ${
                  isActive
                    ? 'bg-ink text-cream scale-110'
                    : isLiterary
                    ? 'bg-ink/10 text-ink hover:bg-ink hover:text-cream'
                    : 'bg-cream/10 text-cream hover:bg-cream hover:text-ink'
                }`}
                aria-label={isActive && isPlaying ? 'Pause' : 'Lecture'}
              >
                {isActive && isPlaying ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>

              {/* Mini waveform — deterministic */}
              <div className="hidden sm:flex items-center gap-[2px] h-6 flex-shrink-0">
                {[...Array(12)].map((_, i) => {
                  const h = Math.round(25 + Math.abs(Math.sin(i * 0.9 + index * 0.5)) * 55)
                  return (
                    <div
                      key={i}
                      className={`w-[2px] rounded-full transition-all duration-300 ${
                        isActive && isPlaying
                          ? 'bg-gold animate-pulse'
                          : isLiterary
                          ? 'bg-ink/20'
                          : 'bg-cream/20'
                      }`}
                      style={{
                        height: `${h}%`,
                        animationDelay: `${i * 0.06}s`,
                      }}
                    />
                  )
                })}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-serif text-base truncate transition-colors duration-300 ${
                    isLiterary
                      ? isActive
                        ? 'text-ink'
                        : 'text-ink/70 group-hover:text-ink'
                      : isActive
                      ? 'text-cream'
                      : 'text-cream/70 group-hover:text-cream'
                  }`}
                >
                  {track.title}
                </p>
                <p
                  className={`font-sans text-xs uppercase tracking-wider mt-0.5 ${
                    isLiterary ? 'text-ink/40' : 'text-cream/40'
                  }`}
                >
                  {track.category}
                </p>
              </div>

              {/* Duration / Volume */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {isActive && isPlaying && (
                  <Volume2
                    className={`w-4 h-4 animate-pulse ${isLiterary ? 'text-gold' : 'text-gold'}`}
                  />
                )}
                <span
                  className={`font-sans text-xs ${isLiterary ? 'text-ink/40' : 'text-cream/40'}`}
                >
                  {track.duration}
                </span>
              </div>
            </div>

            {/* Bottom accent line */}
            <div
              className={`absolute bottom-0 left-0 h-[1px] bg-gold transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </div>
        )
      })}
    </div>
  )
}
