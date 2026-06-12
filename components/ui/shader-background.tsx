'use client'

import { useEffect, useRef } from 'react'

/**
 * ShaderBackground — fond animé WebGL "plasma" de 21st.dev
 * (minhxthanh/shader-background), repris À L'IDENTIQUE.
 *
 * SEULE modification par rapport à l'original : le FOND est supprimé
 * (canvas transparent). On ne touche RIEN d'autre — les lignes gardent leur
 * couleur (violet), leur amplitude et leur liberté de mouvement d'origine.
 *
 * Adaptations purement techniques (n'affectent pas le visuel) :
 *  - le canvas remplit son conteneur parent au lieu de window (pour pouvoir
 *    le poser sur la page) ;
 *  - pause hors-écran / onglet caché ; typé ; nettoyage WebGL.
 */

interface ShaderBackgroundProps {
  className?: string
  /**
   * Décalage vertical du motif (en unités "espace plasma"). Positif = on
   * descend la ligne d'ancrage (points gauche/droite) plus bas. 0 = original.
   */
  offsetY?: number
}

const vsSource = `
  attribute vec4 aVertexPosition;
  void main() {
    gl_Position = aVertexPosition;
  }
`

// Fragment shader = ORIGINAL 21st.dev. Unique changement : on n'écrit plus le
// dégradé de fond ; la sortie est transparente et ne garde que les lignes.
const fsSource = `
  precision highp float;
  uniform vec2 iResolution;
  uniform float iTime;
  uniform float uOffsetY;

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

  void main() {
    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 space = (fragCoord - iResolution.xy / 2.0) / iResolution.x * 2.0 * scale;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);

    space.y += random(space.x * warpFrequency + iTime * warpSpeed) * warpAmplitude * (0.5 + horizontalFade);
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    // Décalage vertical global : descend la ligne d'ancrage (gauche/droite)
    // plus bas sans rien changer au mouvement. uOffsetY > 0 = plus bas.
    space.y += uOffsetY;

    vec4 lines = vec4(0.0);

    for(int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset);
      float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      vec2 circlePosition = vec2(circleX, getPlasmaY(circleX, horizontalFade, offset));
      float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

      line = line + circle;
      lines += line * lineColor * rand;
    }

    // SEULE modif : fond supprimé. On ne garde que les lignes, sur transparent.
    float alpha = clamp(max(lines.r, max(lines.g, lines.b)), 0.0, 1.0);
    gl_FragColor = vec4(lines.rgb, alpha);
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
  offsetY = 0,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)
  const offsetYRef = useRef(offsetY)
  offsetYRef.current = offsetY

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
      offsetY: gl.getUniformLocation(program, 'uOffsetY'),
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
      gl.uniform1f(loc.offsetY, offsetYRef.current)

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

  return (
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
  )
}
