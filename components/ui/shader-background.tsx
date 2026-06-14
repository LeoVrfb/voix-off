'use client'

import { useEffect, useRef } from 'react'

/**
 * ShaderBackground — fond animé WebGL "plasma" (lignes ondulantes + halos),
 * adapté de 21st.dev (minhxthanh/shader-background).
 *
 * Différences avec l'original :
 *  - remplit son conteneur parent (pas tout l'écran) ;
 *  - se met en pause hors écran / onglet caché ;
 *  - typé, nettoyage complet ;
 *  - FOND TRANSPARENT : on supprime le dégradé bleu/violet, mais les lignes
 *    gardent EXACTEMENT leur couleur et leur intensité (alpha prémultiplié,
 *    donc pas de délavage ni de translucidité parasite).
 */

interface ShaderBackgroundProps {
  className?: string
  /** Vitesse globale (1 = vitesse d'origine). */
  speed?: number
  /** Palette des lignes (3 couleurs, dégradées d'une ligne à l'autre). */
  colors?: [string, string, string]
  /**
   * Étendue verticale visible en unités "espace plasma".
   * Plus la valeur est grande, plus on dézoome verticalement (les courbes
   * paraissent plus tassées mais on est sûr de toutes les voir).
   * 9 = cadrage serré (lignes touchant presque les bords), 10-11 = un peu de marge.
   */
  verticalExtent?: number
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
  uniform float uSpeed;
  uniform vec3 uColA;
  uniform vec3 uColB;
  uniform vec3 uColC;
  // Étendue verticale visible (en unités "espace plasma").
  // Les lignes s'étalent ~±4.5 ; une valeur >= 9 garantit qu'elles
  // tiennent toutes dans le cadre quelle que soit sa hauteur.
  uniform float uVerticalExtent;

  const float scale = 5.0;
  const float gridSmoothWidth = 0.015;
  const float minLineWidth = 0.01;
  const float maxLineWidth = 0.2;
  const float lineAmplitude = 2.2;
  const float lineFrequency = 0.33;
  const float warpFrequency = 0.5;
  const float warpAmplitude = 1.0;
  const float offsetFrequency = 0.5;
  const float minOffsetSpread = 0.35;
  const float maxOffsetSpread = 1.5;
  const int linesPerGroup = 16;

  #define drawCircle(pos, radius, coord) smoothstep(radius + gridSmoothWidth, radius, length(coord - (pos)))
  #define drawSmoothLine(pos, halfWidth, t) smoothstep(halfWidth, 0.0, abs(pos - (t)))
  #define drawCrispLine(pos, halfWidth, t) smoothstep(halfWidth + gridSmoothWidth, halfWidth, abs(pos - (t)))

  float random(float t) {
    return (cos(t) + cos(t * 1.3 + 1.3) + cos(t * 1.4 + 1.4)) / 3.0;
  }

  // tanh (absent en GLSL ES 1.0) : replie les valeurs extrêmes vers une limite
  // sans coupure brutale. Sert à contenir les ondes dans le cadre.
  float tanhApprox(float x) {
    x = clamp(x, -4.0, 4.0);
    float e = exp(2.0 * x);
    return (e - 1.0) / (e + 1.0);
  }

  float getPlasmaY(float x, float horizontalFade, float offset, float lineSpeed, float phase) {
    // Onde de base (basse fréquence). La PHASE par ligne décorrèle les tracés :
    // chaque filament a sa propre forme/direction au lieu de bouger à l'unisson.
    float base = random(x * lineFrequency + iTime * lineSpeed + phase);
    // Harmonique plus haute fréquence : variations de courbure + pentes franches.
    float detail = random(x * lineFrequency * 2.6 + iTime * lineSpeed * 1.4 + 4.0 + phase * 1.3) * 0.55;
    return (base + detail) * horizontalFade * lineAmplitude + offset;
  }

  void main() {
    float overallSpeed = 0.2 * uSpeed;
    float lineSpeed = overallSpeed;
    float warpSpeed = 0.2 * overallSpeed;
    float offsetSpeed = 1.33 * overallSpeed;

    vec2 fragCoord = gl_FragCoord.xy;
    vec2 uv = fragCoord.xy / iResolution.xy;
    // X : normalisé par la largeur (ondulation horizontale inchangée).
    // Y : normalisé par la HAUTEUR avec une étendue fixe -> indépendant de
    // l'aspect ratio. Toute l'amplitude des courbes tient donc toujours dans
    // le cadre, même très court. Le tracé reste divers (math plasma intacte).
    vec2 space;
    space.x = (fragCoord.x - iResolution.x / 2.0) / iResolution.x * 2.0 * scale;
    space.y = (fragCoord.y - iResolution.y / 2.0) / iResolution.y * uVerticalExtent;

    float horizontalFade = 1.0 - (cos(uv.x * 6.28) * 0.5 + 0.5);

    // Warp horizontal uniquement : on garde la déformation organique sur X,
    // mais plus sur Y (sinon les lignes étaient poussées hors cadre).
    space.x += random(space.y * warpFrequency + iTime * warpSpeed + 2.0) * warpAmplitude * horizontalFade;

    // Limite verticale visible (marge pour l'épaisseur du trait).
    float vLimit = uVerticalExtent * 0.5 - 0.2;

    vec4 lines = vec4(0.0);

    for(int l = 0; l < linesPerGroup; l++) {
      float normalizedLineIndex = float(l) / float(linesPerGroup);
      float offsetTime = iTime * offsetSpeed;
      float offsetPosition = float(l) + space.x * offsetFrequency;
      float rand = random(offsetPosition + offsetTime) * 0.5 + 0.5;
      float halfWidth = mix(minLineWidth, maxLineWidth, rand * horizontalFade) / 2.0;
      // Phase propre à chaque ligne -> filaments décorrélés (formes/directions différentes).
      float phase = float(l) * 3.0;
      float offset = random(offsetPosition + offsetTime * (1.0 + normalizedLineIndex)) * mix(minOffsetSpread, maxOffsetSpread, horizontalFade);
      float linePosition = getPlasmaY(space.x, horizontalFade, offset, lineSpeed, phase);
      // Compression douce : les ondes gardent leur amplitude, mais les crêtes
      // extrêmes sont repliées dans le cadre au lieu d'en sortir (= invisibles).
      linePosition = vLimit * tanhApprox(linePosition / vLimit);
      float line = drawSmoothLine(linePosition, halfWidth, space.y) / 2.0 + drawCrispLine(linePosition, halfWidth * 0.15, space.y);

      float circleX = mod(float(l) + iTime * lineSpeed, 25.0) - 12.0;
      float circleY = vLimit * tanhApprox(getPlasmaY(circleX, horizontalFade, offset, lineSpeed, phase) / vLimit);
      vec2 circlePosition = vec2(circleX, circleY);
      float circle = drawCircle(circlePosition, 0.01, space) * 4.0;

      line = line + circle;

      // Palette multicolore du site : lavender -> raspberry -> peach selon la ligne
      vec3 lc = normalizedLineIndex < 0.5
        ? mix(uColA, uColB, normalizedLineIndex * 2.0)
        : mix(uColB, uColC, (normalizedLineIndex - 0.5) * 2.0);
      lines += line * vec4(lc, 1.0) * rand;
    }

    // Fond transparent, lignes à pleine intensité.
    // alpha prémultiplié : la couleur reste lines.rgb (non divisée),
    // donc pas de délavage là où la ligne est moins intense.
    float alpha = clamp(max(lines.r, max(lines.g, lines.b)), 0.0, 1.0);
    gl_FragColor = vec4(lines.rgb, alpha);
  }
`

function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '')
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean
  return [
    parseInt(full.slice(0, 2), 16) / 255,
    parseInt(full.slice(2, 4), 16) / 255,
    parseInt(full.slice(4, 6), 16) / 255,
  ]
}

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
  speed = 1,
  // Palette du site par défaut : lavender -> raspberry -> peach
  colors = ['#7681B3', '#CB769E', '#EED7C5'],
  verticalExtent = 10,
}: ShaderBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrapper = wrapperRef.current
    if (!canvas || !wrapper) return

    // alpha prémultiplié (défaut) -> le navigateur composite lines.rgb + page*(1-alpha)
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
      speed: gl.getUniformLocation(program, 'uSpeed'),
      colA: gl.getUniformLocation(program, 'uColA'),
      colB: gl.getUniformLocation(program, 'uColB'),
      colC: gl.getUniformLocation(program, 'uColC'),
      verticalExtent: gl.getUniformLocation(program, 'uVerticalExtent'),
    }

    const colA = hexToRgb(colors[0])
    const colB = hexToRgb(colors[1])
    const colC = hexToRgb(colors[2])

    let dpr = Math.min(2, window.devicePixelRatio || 1)
    const ensureSize = () => {
      const rect = canvas.getBoundingClientRect()
      dpr = Math.min(2, window.devicePixelRatio || 1)
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
      gl.uniform1f(loc.speed, speed)
      gl.uniform3f(loc.colA, colA[0], colA[1], colA[2])
      gl.uniform3f(loc.colB, colB[0], colB[1], colB[2])
      gl.uniform3f(loc.colC, colC[0], colC[1], colC[2])
      gl.uniform1f(loc.verticalExtent, verticalExtent)

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
  }, [speed, colors, verticalExtent])

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{ position: 'absolute', inset: 0, overflow: 'hidden' }}
    >
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        style={{ width: '100%', height: '100%', display: 'block' }}
      />
    </div>
  )
}
