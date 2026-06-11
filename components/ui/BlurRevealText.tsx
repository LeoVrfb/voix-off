'use client'

import { useRef } from 'react'
import { motion, useInView } from 'motion/react'

interface BlurRevealTextProps {
  text: string
  className?: string
  delay?: number
  /** 'word' = mot par mot, 'char' = lettre par lettre */
  mode?: 'word' | 'char'
  /** Durée de l'animation (s) */
  duration?: number
  /** Délai entre chaque unité (s) */
  stagger?: number
}

export default function BlurRevealText({
  text,
  className,
  delay = 0,
  mode = 'word',
  duration = 0.5,
  stagger = 0.06,
}: BlurRevealTextProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-10% 0px -10% 0px' })

  const units = mode === 'char' ? text.split('') : text.split(' ')

  return (
    <span ref={ref} className={className} aria-label={text}>
      {units.map((unit, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, filter: 'blur(8px)', y: 8 }}
          animate={isInView ? { opacity: 1, filter: 'blur(0px)', y: 0 } : {}}
          transition={{
            delay: delay + i * stagger,
            duration,
            ease: 'easeOut',
          }}
          className="inline-block"
          style={{ whiteSpace: 'pre' }}
        >
          {mode === 'char' && unit === ' ' ? '\u00A0' : unit}
          {mode === 'word' && i < units.length - 1 ? '\u00A0' : ''}
        </motion.span>
      ))}
    </span>
  )
}
