'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

/**
 * ShaderBackground — fond animé WebGL "plasma" de 21st.dev
 * (minhxthanh/shader-background), mouvement libre d'origine.
 *
 * Différences avec l'original :
 *  - FOND supprimé (canvas transparent), on ne garde que les lignes (violet) ;
 *  - le champ d'interaction vertical est borné par [fieldBottom, fieldTop]
 *    (unités "espace plasma") : on ne COUPE jamais les ondes, on remappe leur
 *    amplitude dans cette bande. Réduire la bande = ondes plus resserrées.
 *  - mode debug : bordures rouges nettes (dessinées dans le shader) + poignées
 *    DRAGGABLES rendues en overlay `position: fixed` (z très élevé) afin
 *    qu'elles soient attrapables au-dessus de toutes les sections.
 */

interface ShaderBackgroundProps {
  className?: string
  /** Bord HAUT du champ d'interaction (unités espace, 0 = centre du canvas). */
  fieldTop?: number
  /** Bord BAS du champ d'interaction (unités espace, négatif = sous le centre). */
  fieldBottom?: number
  /** Affiche les bordures rouges nettes (haut/bas) du champ. */
  showField?: boolean
  /** Active les poignées draggables (n'a d'effet qu'avec showField). */
  interactive?: boolean
}

const vsSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`

const fsSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float uFieldTop;     // bord haut du champ (unités espace, baseY)
  uniform float uFieldBottom;  // bord bas du champ (unités espace, baseY)
  uniform float uShowField;    // > 0.5 => bordures rouges de debug

  const float overallSpeed = 0.2;
  const float gridSmoothWidth = 0.015;
  const float scale = 5.0;
  const vec4 lineColor = vec4(0.4, 0.2, 0.8, 1.0);
  const float minLineWidth = 0.01;
  const float maxLineWidth = 0.2;
  const float lineSpeed = 1.0 * overallSpeed;
  const float lineAmplitude = 1.0;
  const float lineFrequency = 0.2;
  const float warpSpeed = 0.2 * overallSpeed;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 1.0;
  const float offsetFrequency = 0.5;
  const float offsetSpeed = 1.33 * overallSpeed;
  const float minOffsetSpread = 0.6;
  const float maxOffsetSpread = 2.0;
  const int linesPerGroup = 16;

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  float getPlasmaY(float x, float horizontalFade, float offset) {
    return random(x * lineFrequency + iTime * lineSpeed) * horizontalFade * lineAmplitude + offset;
  }

  // Amplitude verticale "naturelle" max du motif (plasma ~3 + warp ~1.5). Sert
  // à remapper la plage [-nominalSpread, +nominalSpread] dans [bottom, top].
  const float nominalSpread = 4.5;

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);

    // Warp vertical organique — gardé à part pour garder une coordonnée pure.
    float warpY = random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.y += warpY;
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    // Coordonnée verticale PURE (sans warp) : compare les lignes + bordures.
    float baseY = (fragCoord.y - iResolution.y * 0.5) / iResolution.x * 2.0 * scale;

    vec4 lines = vec4(0.0);

    for(int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);

      // Position naturelle de la ligne, remappée dans la bande [bottom, top].
      float nat = getPlasmaY(space.x, horizontalFade, offset) - warpY;
      float t = (nat + nominalSpread) / (2.0 * nominalSpread);
      float targetY = mix(uFieldBottom, uFieldTop, t);
      float line = drawSmoothLine(targetY, halfWidth, baseY) / 2.0 + drawCrispLine(targetY, halfWidth * 0.15, baseY);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      float natC = getPlasmaY(circleX, horizontalFade, offset) - warpY;
      float tC = (natC + nominalSpread) / (2.0 * nominalSpread);
      float circleY = mix(uFieldBottom, uFieldTop, tC);
      float circle = drawCircle(vec2(circleX, circleY), 0.01, vec2(space.x, baseY)) * 4.0;

      line = line + circle;
      lines += line * lineColor * rand;
    }

    // Fond supprimé : que les lignes, sur transparent.
    float alpha = clamp(max(lines.r, max(lines.g, lines.b)), 0.0, 1.0);
    gl_FragColor = vec4(lines.rgb, alpha);

    // Bordures rouges de debug : exactement les limites du champ.
    if (uShowField > 0.5) {
      float bw = 0.012;
      float top = drawCrispLine(uFieldTop, bw, baseY);
      float bot = drawCrispLine(uFieldBottom, bw, baseY);
      float border = clamp(top + bot, 0.0, 1.0);
      gl_FragColor = mix(gl_FragColor, vec4(1.0, 0.0, 0.0, 1.0), border);
    }
  }
`

function loadShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null
  gl.shaderSource(shader, source)
  gl.compileShader(shader)
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error: ', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }
  return shader
}

function initShaderProgram(
  gl: WebGLRenderingContext,
  vs: string,
  fs: string
): WebGLProgram | null {
  const vertexShader = loadShader(gl, gl.VERTEX_SHADER, vs)
  const fragmentShader = loadShader(gl, gl.FRAGMENT_SHADER, fs)
  if (!vertexShader || !fragmentShader) return null
  const program = gl.createProgram()
  if (!program) return null
  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Shader program link error: ', gl.getProgramInfoLog(program))
    return null
  }
  return program
}

export default function ShaderBackground({
  className,
  fieldTop = 2.2,
  fieldBottom = -2.2,
  showField = false,
  interactive = false,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  // Valeurs live du champ (refs => lues par le shader chaque frame, sans re-render).
  const topRef = useRef(fieldTop)
  const bottomRef = useRef(fieldBottom)
  const showFieldRef = useRef(showField)
  showFieldRef.current = showField

  // Re-synchro sur les props (ex : changement de taille d'écran => nouvelles
  // valeurs par device). Le drag repart donc de la valeur du device courant.
  useEffect(() => {
    topRef.current = fieldTop
  }, [fieldTop])
  useEffect(() => {
    bottomRef.current = fieldBottom
  }, [fieldBottom])

  // Poignées (overlay fixe) — refs DOM, pilotées en impératif.
  const topHandleRef = useRef<HTMLDivElement>(null)
  const bottomHandleRef = useRef<HTMLDivElement>(null)
  const topLabelRef = useRef<HTMLSpanElement>(null)
  const bottomLabelRef = useRef<HTMLSpanElement>(null)

  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  const showHandles = showField && interactive

  // ── WebGL ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    const gl = canvas.getContext('webgl', { alpha: true })
    if (!gl) {
      console.warn('WebGL not supported.')
      return
    }

    const program = initShaderProgram(gl, vsSource, fsSource)
    if (!program) return

    const positionBuffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
    const positions = [-1, -1, 1, -1, -1, 1, 1, 1]
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW)

    const loc = {
      vertexPosition: gl.getAttribLocation(program, 'aVertexPosition'),
      resolution: gl.getUniformLocation(program, 'iResolution'),
      time: gl.getUniformLocation(program, 'iTime'),
      fieldTop: gl.getUniformLocation(program, 'uFieldTop'),
      fieldBottom: gl.getUniformLocation(program, 'uFieldBottom'),
      showField: gl.getUniformLocation(program, 'uShowField'),
    }

    const ensureSize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(2, window.devicePixelRatio || 1)
      const w = Math.max(1, Math.floor(rect.width * dpr))
      const h = Math.max(1, Math.floor(rect.height * dpr))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    const ro = new ResizeObserver(ensureSize)
    ro.observe(canvas)
    ensureSize()

    let raf = 0
    let running = true
    const startTime = Date.now()

    const render = () => {
      if (!running) {
        raf = 0
        return
      }
      const currentTime = (Date.now() - startTime) / 1000

      gl.clearColor(0, 0, 0, 0)
      gl.clear(gl.COLOR_BUFFER_BIT)
      gl.useProgram(program)

      gl.uniform2f(loc.resolution, canvas.width, canvas.height)
      gl.uniform1f(loc.time, currentTime)
      gl.uniform1f(loc.fieldTop, topRef.current)
      gl.uniform1f(loc.fieldBottom, bottomRef.current)
      gl.uniform1f(loc.showField, showFieldRef.current ? 1 : 0)

      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.vertexAttribPointer(loc.vertexPosition, 2, gl.FLOAT, false, 0, 0)
      gl.enableVertexAttribArray(loc.vertexPosition)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      raf = requestAnimationFrame(render)
    }

    const startLoop = () => {
      if (raf === 0 && running) raf = requestAnimationFrame(render)
    }
    const stopLoop = () => {
      if (raf !== 0) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          running = e.isIntersecting
          if (running) startLoop()
          else stopLoop()
        }
      },
      { threshold: 0 }
    )
    io.observe(wrapper)

    const onVis = () => {
      if (document.hidden) stopLoop()
      else {
        running = true
        startLoop()
      }
    }
    document.addEventListener('visibilitychange', onVis)

    startLoop()

    return () => {
      stopLoop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      gl.deleteProgram(program)
      gl.deleteBuffer(positionBuffer)
    }
  }, [])

  // ── Poignées : positionnement impératif via rAF (suit scroll/resize). ────
  useEffect(() => {
    if (!showHandles) return
    let raf = 0
    const tick = () => {
      const wrapper = wrapperRef.current
      if (wrapper) {
        const r = wrapper.getBoundingClientRect()
        const unit = r.width / 10 // 1 unité espace = width/10 px (scale=5)
        const center = r.top + r.height / 2 // baseY = 0 au centre du canvas
        const place = (
          el: HTMLDivElement | null,
          label: HTMLSpanElement | null,
          field: number,
          name: string
        ) => {
          if (!el) return
          el.style.left = `${r.left}px`
          el.style.width = `${r.width}px`
          el.style.top = `${center - field * unit - 14}px`
          if (label) label.textContent = `${name} ${field.toFixed(2)}`
        }
        place(topHandleRef.current, topLabelRef.current, topRef.current, 'haut')
        place(bottomHandleRef.current, bottomLabelRef.current, bottomRef.current, 'bas')
      }
      raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [showHandles])

  const startDrag = (which: 'top' | 'bottom') => (e: React.PointerEvent) => {
    e.preventDefault()
    const move = (ev: PointerEvent) => {
      const wrapper = wrapperRef.current
      if (!wrapper) return
      const r = wrapper.getBoundingClientRect()
      const field =
        Math.round((((r.top + r.height / 2 - ev.clientY) * 10) / r.width) * 100) / 100
      if (which === 'top') topRef.current = field
      else bottomRef.current = field
    }
    const up = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', up)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', up)
  }

  const fixedHandleStyle: React.CSSProperties = {
    position: 'fixed',
    height: 28,
    zIndex: 9999,
    cursor: 'ns-resize',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'auto',
    touchAction: 'none',
  }

  const labelStyle: React.CSSProperties = {
    fontFamily: 'ui-monospace, monospace',
    fontSize: 11,
    fontWeight: 700,
    color: '#fff',
    background: 'rgba(220,0,0,0.9)',
    padding: '3px 10px',
    borderRadius: 999,
    userSelect: 'none',
    boxShadow: '0 2px 10px rgba(0,0,0,0.5)',
  }

  return (
    <>
      <div
        ref={wrapperRef}
        className={className}
        style={{ position: 'absolute', inset: 0 }}
      >
        <canvas
          ref={canvasRef}
          aria-hidden="true"
          style={{ width: '100%', height: '100%', display: 'block' }}
        />
      </div>

      {mounted &&
        showHandles &&
        createPortal(
          <>
            <div
              ref={topHandleRef}
              onPointerDown={startDrag('top')}
              style={fixedHandleStyle}
            >
              <span ref={topLabelRef} style={labelStyle}>
                haut
              </span>
            </div>
            <div
              ref={bottomHandleRef}
              onPointerDown={startDrag('bottom')}
              style={fixedHandleStyle}
            >
              <span ref={bottomLabelRef} style={labelStyle}>
                bas
              </span>
            </div>
          </>,
          document.body
        )}
    </>
  )
}
