'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { Play, Pause, Volume2 } from 'lucide-react'

interface AudioTrack {
  id: string
  title: string
  category: string
  src: string
  cover?: string
  /** Durée de secours affichée avant chargement des métadonnées */
  duration?: string
}

interface AudioPlayerProps {
  tracks: AudioTrack[]
  /** 'audiobook' = livres audio (sobre), 'voiceover' = voix off (vif) */
  variant?: 'audiobook' | 'voiceover'
  /** Regroupe les pistes par catégorie avec un intitulé fin entre les groupes */
  grouped?: boolean
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return '--:--'
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${String(s).padStart(2, '0')}`
}

export default function AudioPlayer({ tracks, variant = 'audiobook', grouped = false }: AudioPlayerProps) {
  const [currentTrack, setCurrentTrack] = useState<number | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [durations, setDurations] = useState<Record<number, string>>({})
  const audioRefs = useRef<(HTMLAudioElement | null)[]>([])

  const accentHex = variant === 'voiceover' ? '#CFC3AE' : '#B8AE9F'

  const handlePlay = (index: number) => {
    const audio = audioRefs.current[index]
    if (!audio) return

    if (currentTrack === index) {
      if (isPlaying) {
        audio.pause()
        setIsPlaying(false)
      } else {
        void audio.play().catch(() => {})
        setIsPlaying(true)
      }
      return
    }

    // Couper la piste précédente
    if (currentTrack !== null) {
      const prev = audioRefs.current[currentTrack]
      if (prev) {
        prev.pause()
        prev.currentTime = 0
      }
    }

    setCurrentTrack(index)
    setProgress(0)
    audio.currentTime = 0
    void audio.play().catch(() => {})
    setIsPlaying(true)
  }

  const renderTrack = (track: AudioTrack, index: number) => {
    const isActive = currentTrack === index
    return (
          <div
            key={track.id}
            className={`group relative overflow-hidden rounded-2xl border transition-all duration-300 ${
              isActive
                ? 'border-cream/70 bg-cream/[0.10]'
                : 'border-cream/40 bg-cream/[0.04] hover:border-cream/65 hover:bg-cream/[0.08]'
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

            {/* Élément audio réel (un par piste, pour garder les durées) */}
            <audio
              ref={(el) => {
                audioRefs.current[index] = el
              }}
              src={track.src}
              preload="metadata"
              onLoadedMetadata={(e) => {
                const a = e.currentTarget
                if (a.duration === Infinity || Number.isNaN(a.duration)) {
                  // Certains MP3 ne donnent pas la durée tant qu'on n'a pas sondé la fin
                  const onSeeked = () => {
                    a.removeEventListener('timeupdate', onSeeked)
                    const real = a.duration
                    a.currentTime = 0
                    setDurations((d) => ({ ...d, [index]: formatTime(real) }))
                  }
                  a.addEventListener('timeupdate', onSeeked)
                  a.currentTime = 1e101
                } else {
                  setDurations((d) => ({ ...d, [index]: formatTime(a.duration) }))
                }
              }}
              onTimeUpdate={(e) => {
                if (currentTrack !== index) return
                const a = e.currentTarget
                setProgress(a.duration ? (a.currentTime / a.duration) * 100 : 0)
              }}
              onEnded={() => {
                setIsPlaying(false)
                setProgress(0)
              }}
            />

            <div className="relative flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-4">
              {/* Pochette / logo — à gauche de chaque enregistrement */}
              {track.cover && (
                <div className="relative flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-xl overflow-hidden ring-1 ring-cream/20 bg-studio-soft">
                  <Image
                    src={track.cover}
                    alt={track.title}
                    fill
                    className="object-cover"
                    sizes="56px"
                  />
                </div>
              )}

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
              <div className="hidden lg:flex items-end gap-[2px] h-7 flex-shrink-0 w-14">
                {[...Array(12)].map((_, i) => {
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
                          isActive && isPlaying ? accentHex : 'rgba(238, 226, 223, 0.25)',
                      }}
                    />
                  )
                })}
              </div>

              {/* Track info */}
              <div className="flex-1 min-w-0">
                <p
                  className={`font-serif text-base md:text-lg font-medium leading-tight transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-cream/95 group-hover:text-cream'
                  }`}
                >
                  {track.title}
                </p>
                {!grouped && (
                  <p
                    className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] mt-1.5"
                    style={{ color: accentHex }}
                  >
                    {track.category}
                  </p>
                )}
              </div>

              {/* Duration / Volume */}
              <div className="flex items-center gap-3 flex-shrink-0">
                {isActive && isPlaying && (
                  <Volume2 className="w-4 h-4 animate-pulse" style={{ color: accentHex }} />
                )}
                <span className="font-sans text-xs font-medium text-cream/75 tabular-nums">
                  {durations[index] ?? track.duration ?? '--:--'}
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
  }

  // Regroupe les pistes par catégorie en conservant l'index global (refs/état)
  const groups: { category: string; items: { track: AudioTrack; index: number }[] }[] = []
  tracks.forEach((track, index) => {
    const last = groups[groups.length - 1]
    if (grouped && last && last.category === track.category) {
      last.items.push({ track, index })
    } else if (grouped) {
      groups.push({ category: track.category, items: [{ track, index }] })
    } else {
      if (!last) groups.push({ category: '', items: [] })
      groups[groups.length - 1].items.push({ track, index })
    }
  })

  return (
    <div className={`w-full ${grouped ? 'space-y-7' : 'space-y-3'}`}>
      {groups.map((group, gi) => (
        <div key={group.category || `g-${gi}`} className="space-y-3">
          {grouped && group.category && (
            <p className="font-sans text-[11px] font-medium uppercase tracking-[0.28em] text-cream/45 pl-1 pb-0.5">
              {group.category}
            </p>
          )}
          {group.items.map(({ track, index }) => renderTrack(track, index))}
        </div>
      ))}
    </div>
  )
}
