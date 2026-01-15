"use client"

import React, { useEffect, useRef, useImperativeHandle } from 'react'
import * as THREE from 'three'
import { EffectComposer, EffectPass, RenderPass, Effect } from 'postprocessing'

type Variant = 'square' | 'circle' | 'triangle' | 'diamond'

interface TouchPoint {
  x: number
  y: number
  vx: number
  vy: number
  force: number
  age: number
}

interface TouchTexture {
  canvas: HTMLCanvasElement
  texture: THREE.Texture
  addTouch: (norm: { x: number; y: number }) => void
  update: () => void
  radiusScale: number
  size: number
}

interface Props {
  variant?: Variant
  pixelSize?: number
  color?: string
  className?: string
  style?: React.CSSProperties
  antialias?: boolean
  patternScale?: number
  patternDensity?: number
  liquid?: boolean
  liquidStrength?: number
  liquidRadius?: number
  pixelSizeJitter?: number
  enableRipples?: boolean
  rippleIntensityScale?: number
  rippleThickness?: number
  rippleSpeed?: number
  liquidWobbleSpeed?: number
  autoPauseOffscreen?: boolean
  speed?: number
  transparent?: boolean
  edgeFade?: number
  noiseAmount?: number
  centerGrow?: number
}

const createTouchTexture = (): TouchTexture => {
  const size = 64
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!
  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, size, size)

  const texture = new THREE.Texture(canvas)
  texture.minFilter = THREE.LinearFilter
  texture.magFilter = THREE.LinearFilter
  texture.generateMipmaps = false

  const trail: TouchPoint[] = []
  let last: { x: number; y: number } | null = null
  const maxAge = 64
  let radius = 0.1 * size

  const clear = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, size, size)
  }

  const drawPoint = (p: TouchPoint) => {
    const pos = { x: p.x * size, y: (1 - p.y) * size }
    const easeOutSine = (t: number) => Math.sin((t * Math.PI) / 2)
    const easeOutQuad = (t: number) => -t * (t - 2)

    let intensity = p.age < maxAge * 0.3
      ? easeOutSine(p.age / (maxAge * 0.3))
      : easeOutQuad(1 - (p.age - maxAge * 0.3) / (maxAge * 0.7)) || 0
    intensity *= p.force

    const color = `${((p.vx + 1) / 2) * 255}, ${((p.vy + 1) / 2) * 255}, ${intensity * 255}`
    const offset = size * 5

    ctx.shadowOffsetX = offset
    ctx.shadowOffsetY = offset
    ctx.shadowBlur = radius
    ctx.shadowColor = `rgba(${color},${0.22 * intensity})`
    ctx.beginPath()
    ctx.fillStyle = 'rgba(255,0,0,1)'
    ctx.arc(pos.x - offset, pos.y - offset, radius, 0, Math.PI * 2)
    ctx.fill()
  }

  const addTouch = (norm: { x: number; y: number }) => {
    let force = 0, vx = 0, vy = 0
    if (last) {
      const dx = norm.x - last.x
      const dy = norm.y - last.y
      if (dx === 0 && dy === 0) return
      const d = Math.sqrt(dx * dx + dy * dy)
      vx = dx / (d || 1)
      vy = dy / (d || 1)
      force = Math.min(dx * dx + dy * dy * 10000, 1)
    }
    last = { x: norm.x, y: norm.y }
    trail.push({ x: norm.x, y: norm.y, age: 0, force, vx, vy })
  }

  const update = () => {
    clear()
    const speed = 1 / maxAge
    for (let i = trail.length - 1; i >= 0; i--) {
      const p = trail[i]
      const f = p.force * speed * (1 - p.age / maxAge)
      p.x += p.vx * f
      p.y += p.vy * f
      p.age++
      if (p.age > maxAge) trail.splice(i, 1)
    }
    trail.forEach(drawPoint)
    texture.needsUpdate = true
  }

  return {
    canvas,
    texture,
    addTouch,
    update,
    set radiusScale(v: number) { radius = 0.1 * size * v },
    get radiusScale() { return radius / (0.1 * size) },
    size
  }
}

const createLiquidEffect = (texture: THREE.Texture, strength = 0.025, freq = 4.5) => {
  const uniforms = new Map<string, THREE.Uniform>()
  uniforms.set('uTexture', new THREE.Uniform(texture))
  uniforms.set('uStrength', new THREE.Uniform(strength))
  uniforms.set('uTime', new THREE.Uniform(0))
  uniforms.set('uFreq', new THREE.Uniform(freq))

  return new Effect('LiquidEffect', `
    uniform sampler2D uTexture;
    uniform float uStrength;
    uniform float uTime;
    uniform float uFreq;
    void mainUv(inout vec2 uv) {
      vec4 tex = texture2D(uTexture, uv);
      float vx = tex.r * 2.0 - 1.0;
      float vy = tex.g * 2.0 - 1.0;
      float intensity = tex.b;
      float wave = 0.5 + 0.5 * sin(uTime * uFreq + intensity * 6.2831853);
      uv += vec2(vx, vy) * uStrength * intensity * wave;
    }
  `, { uniforms })
}

const SHAPES: Record<Variant, number> = { square: 0, circle: 1, triangle: 2, diamond: 3 }

const VERT = `void main() { gl_Position = vec4(position, 1.0); }`

const FRAG = `
precision highp float;
uniform vec3 uColor;
uniform vec2 uResolution;
uniform float uTime;
uniform float uPixelSize;
uniform float uScale;
uniform float uDensity;
uniform float uPixelJitter;
uniform int uEnableRipples;
uniform float uRippleSpeed;
uniform float uRippleThickness;
uniform float uRippleIntensity;
uniform float uEdgeFade;
uniform int uShapeType;
uniform float uCenterGrow;

const int MAX_CLICKS = 10;
uniform vec2 uClickPos[MAX_CLICKS];
uniform float uClickTimes[MAX_CLICKS];

out vec4 fragColor;

float Bayer2(vec2 a) { a = floor(a); return fract(a.x / 2. + a.y * a.y * .75); }
#define Bayer4(a) (Bayer2(.5*(a))*0.25 + Bayer2(a))
#define Bayer8(a) (Bayer4(.5*(a))*0.25 + Bayer2(a))

float hash11(float n) { return fract(sin(n)*43758.5453); }

float vnoise(vec3 p) {
  vec3 ip = floor(p), fp = fract(p);
  float n000 = hash11(dot(ip, vec3(1,57,113)));
  float n100 = hash11(dot(ip + vec3(1,0,0), vec3(1,57,113)));
  float n010 = hash11(dot(ip + vec3(0,1,0), vec3(1,57,113)));
  float n110 = hash11(dot(ip + vec3(1,1,0), vec3(1,57,113)));
  float n001 = hash11(dot(ip + vec3(0,0,1), vec3(1,57,113)));
  float n101 = hash11(dot(ip + vec3(1,0,1), vec3(1,57,113)));
  float n011 = hash11(dot(ip + vec3(0,1,1), vec3(1,57,113)));
  float n111 = hash11(dot(ip + vec3(1,1,1), vec3(1,57,113)));
  vec3 w = fp*fp*fp*(fp*(fp*6.0-15.0)+10.0);
  return mix(mix(mix(n000,n100,w.x), mix(n010,n110,w.x), w.y),
             mix(mix(n001,n101,w.x), mix(n011,n111,w.x), w.y), w.z) * 2.0 - 1.0;
}

float fbm2(vec2 uv, float t) {
  vec3 p = vec3(uv * uScale, t);
  float amp = 1.0, freq = 1.0, sum = 1.0;
  for (int i = 0; i < 5; i++) {
    sum += amp * vnoise(p * freq);
    freq *= 1.25;
  }
  return sum * 0.5 + 0.5;
}

float maskCircle(vec2 p, float cov) {
  float r = sqrt(cov) * .25;
  float d = length(p - 0.5) - r;
  return cov * (1.0 - smoothstep(-fwidth(d)*0.5, fwidth(d)*0.5, d * 2.0));
}

float maskTriangle(vec2 p, vec2 id, float cov) {
  if (mod(id.x + id.y, 2.0) > 0.5) p.x = 1.0 - p.x;
  float d = p.y - sqrt(cov) * (1.0 - p.x);
  return cov * clamp(0.5 - d/fwidth(d), 0.0, 1.0);
}

float maskDiamond(vec2 p, float cov) {
  return step(abs(p.x - 0.49) + abs(p.y - 0.49), sqrt(cov) * 0.564);
}

void main() {
  vec2 fragCoord = gl_FragCoord.xy - uResolution * .5;
  float aspect = uResolution.x / uResolution.y;
  vec2 pixelId = floor(fragCoord / uPixelSize);
  vec2 pixelUV = fract(fragCoord / uPixelSize);
  float cellSize = 8.0 * uPixelSize;
  vec2 cellId = floor(fragCoord / cellSize);
  vec2 uv = cellId * cellSize / uResolution * vec2(aspect, 1.0);

  // Distance from center for radial growth
  vec2 centerDist = gl_FragCoord.xy / uResolution - 0.5;
  float distFromCenter = length(centerDist * vec2(aspect, 1.0));

  float base = fbm2(uv, uTime * 0.05) * 0.5 - 0.65;
  float feed = base + (uDensity - 0.5) * 0.3;

  // Radial growth from center - slow expansion over time
  if (uCenterGrow > 0.0) {
    float growRadius = uTime * uCenterGrow * 0.15;
    float radialMask = smoothstep(growRadius, growRadius - 0.3, distFromCenter);
    feed *= radialMask;
  }

  if (uEnableRipples == 1) {
    for (int i = 0; i < MAX_CLICKS; i++) {
      vec2 pos = uClickPos[i];
      if (pos.x < 0.0) continue;
      vec2 cuv = ((pos - uResolution * .5 - cellSize * .5) / uResolution) * vec2(aspect, 1.0);
      float t = max(uTime - uClickTimes[i], 0.0);
      float r = distance(uv, cuv);
      float ring = exp(-pow((r - uRippleSpeed * t) / uRippleThickness, 2.0));
      feed = max(feed, ring * exp(-t) * exp(-10.0 * r) * uRippleIntensity);
    }
  }

  float bayer = Bayer8(fragCoord / uPixelSize) - 0.5;
  float bw = step(0.5, feed + bayer);
  float h = fract(sin(dot(pixelId, vec2(127.1, 311.7))) * 43758.5453);
  float coverage = bw * (1.0 + (h - 0.5) * uPixelJitter);

  float M;
  if (uShapeType == 1) M = maskCircle(pixelUV, coverage);
  else if (uShapeType == 2) M = maskTriangle(pixelUV, pixelId, coverage);
  else if (uShapeType == 3) M = maskDiamond(pixelUV, coverage);
  else M = coverage;

  if (uEdgeFade > 0.0) {
    vec2 norm = gl_FragCoord.xy / uResolution;
    float edge = min(min(norm.x, norm.y), min(1.0 - norm.x, 1.0 - norm.y));
    M *= smoothstep(0.0, uEdgeFade, edge);
  }

  vec3 c = mix(uColor * 12.92, 1.055 * pow(uColor, vec3(1.0/2.4)) - 0.055, step(0.0031308, uColor));
  fragColor = vec4(c, M);
}
`

const MAX_CLICKS = 10

export interface PixelBlastRef {
  triggerRipple: (x: number, y: number) => void
}

const PixelBlast = React.forwardRef<PixelBlastRef, Props>(function PixelBlast({
  variant = 'square',
  pixelSize = 3,
  color = '#B19EEF',
  className,
  style,
  antialias = true,
  patternScale = 2,
  patternDensity = 1,
  liquid = false,
  liquidStrength = 0.1,
  liquidRadius = 1,
  pixelSizeJitter = 0,
  enableRipples = true,
  rippleIntensityScale = 1,
  rippleThickness = 0.1,
  rippleSpeed = 0.3,
  liquidWobbleSpeed = 4.5,
  autoPauseOffscreen = true,
  speed = 0.5,
  transparent = true,
  edgeFade = 0.5,
  noiseAmount = 0,
  centerGrow = 0
}, ref) {
  const containerRef = useRef<HTMLDivElement>(null)
  const stateRef = useRef<{
    renderer: THREE.WebGLRenderer
    material: THREE.ShaderMaterial
    clock: THREE.Clock
    clickIx: number
    uniforms: Record<string, { value: unknown }>
    raf: number
    composer?: EffectComposer
    touch?: TouchTexture
    liquidEffect?: Effect
  } | null>(null)
  const speedRef = useRef(speed)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    speedRef.current = speed

    if (stateRef.current) {
      const s = stateRef.current
      s.uniforms.uShapeType.value = SHAPES[variant]
      s.uniforms.uPixelSize.value = pixelSize * s.renderer.getPixelRatio()
      ;(s.uniforms.uColor.value as THREE.Color).set(color)
      s.uniforms.uScale.value = patternScale
      s.uniforms.uDensity.value = patternDensity
      s.uniforms.uPixelJitter.value = pixelSizeJitter
      s.uniforms.uEnableRipples.value = enableRipples ? 1 : 0
      s.uniforms.uRippleIntensity.value = rippleIntensityScale
      s.uniforms.uRippleThickness.value = rippleThickness
      s.uniforms.uRippleSpeed.value = rippleSpeed
      s.uniforms.uEdgeFade.value = edgeFade
      s.uniforms.uCenterGrow.value = centerGrow
      return
    }

    const renderer = new THREE.WebGLRenderer({ antialias, alpha: true, powerPreference: 'high-performance' })
    renderer.domElement.style.cssText = 'width:100%;height:100%'
    renderer.setPixelRatio(Math.min(devicePixelRatio, 2))
    container.appendChild(renderer.domElement)
    if (transparent) renderer.setClearAlpha(0)

    const uniforms: Record<string, { value: unknown }> = {
      uResolution: { value: new THREE.Vector2() },
      uTime: { value: 0 },
      uColor: { value: new THREE.Color(color) },
      uClickPos: { value: Array.from({ length: MAX_CLICKS }, () => new THREE.Vector2(-1, -1)) },
      uClickTimes: { value: new Float32Array(MAX_CLICKS) },
      uShapeType: { value: SHAPES[variant] },
      uPixelSize: { value: pixelSize * renderer.getPixelRatio() },
      uScale: { value: patternScale },
      uDensity: { value: patternDensity },
      uPixelJitter: { value: pixelSizeJitter },
      uEnableRipples: { value: enableRipples ? 1 : 0 },
      uRippleSpeed: { value: rippleSpeed },
      uRippleThickness: { value: rippleThickness },
      uRippleIntensity: { value: rippleIntensityScale },
      uEdgeFade: { value: edgeFade },
      uCenterGrow: { value: centerGrow }
    }

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
    const material = new THREE.ShaderMaterial({
      vertexShader: VERT,
      fragmentShader: FRAG,
      uniforms,
      transparent: true,
      depthTest: false,
      depthWrite: false,
      glslVersion: THREE.GLSL3
    })
    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material))

    const clock = new THREE.Clock()
    const timeOffset = Math.random() * 1000

    const resize = () => {
      const w = container.clientWidth || 1
      const h = container.clientHeight || 1
      renderer.setSize(w, h, false)
      ;(uniforms.uResolution.value as THREE.Vector2).set(renderer.domElement.width, renderer.domElement.height)
      uniforms.uPixelSize.value = pixelSize * renderer.getPixelRatio()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(container)

    let composer: EffectComposer | undefined
    let touch: TouchTexture | undefined
    let liquidEffect: Effect | undefined

    if (liquid) {
      touch = createTouchTexture()
      touch.radiusScale = liquidRadius
      composer = new EffectComposer(renderer)
      composer.addPass(new RenderPass(scene, camera))
      liquidEffect = createLiquidEffect(touch.texture, liquidStrength, liquidWobbleSpeed)
      const pass = new EffectPass(camera, liquidEffect)
      pass.renderToScreen = true
      composer.addPass(pass)
      composer.setSize(renderer.domElement.width, renderer.domElement.height)
    }

    const mapClick = (e: PointerEvent) => {
      const rect = renderer.domElement.getBoundingClientRect()
      const sx = renderer.domElement.width / rect.width
      const sy = renderer.domElement.height / rect.height
      return { x: (e.clientX - rect.left) * sx, y: (rect.height - (e.clientY - rect.top)) * sy }
    }

    const onDown = (e: PointerEvent) => {
      const { x, y } = mapClick(e)
      const ix = stateRef.current?.clickIx ?? 0
      ;(uniforms.uClickPos.value as THREE.Vector2[])[ix].set(x, y)
      ;(uniforms.uClickTimes.value as Float32Array)[ix] = uniforms.uTime.value as number
      if (stateRef.current) stateRef.current.clickIx = (ix + 1) % MAX_CLICKS
    }

    const onMove = (e: PointerEvent) => {
      if (!touch) return
      const { x, y } = mapClick(e)
      touch.addTouch({ x: x / renderer.domElement.width, y: y / renderer.domElement.height })
    }

    renderer.domElement.addEventListener('pointerdown', onDown, { passive: true })
    renderer.domElement.addEventListener('pointermove', onMove, { passive: true })

    let raf = 0
    const animate = () => {
      uniforms.uTime.value = timeOffset + clock.getElapsedTime() * speedRef.current
      if (liquidEffect) {
        const u = (liquidEffect as Effect & { uniforms: Map<string, THREE.Uniform> }).uniforms.get('uTime')
        if (u) u.value = uniforms.uTime.value
      }
      if (composer) {
        touch?.update()
        composer.render()
      } else {
        renderer.render(scene, camera)
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    stateRef.current = { renderer, material, clock, clickIx: 0, uniforms, raf, composer, touch, liquidEffect }

    return () => {
      ro.disconnect()
      cancelAnimationFrame(raf)
      material.dispose()
      composer?.dispose()
      renderer.dispose()
      container.removeChild(renderer.domElement)
      stateRef.current = null
    }
  }, [antialias, liquid, noiseAmount, pixelSize, patternScale, patternDensity, enableRipples, rippleIntensityScale, rippleThickness, rippleSpeed, pixelSizeJitter, edgeFade, transparent, liquidStrength, liquidRadius, liquidWobbleSpeed, autoPauseOffscreen, variant, color, speed, centerGrow])

  useImperativeHandle(ref, () => ({
    triggerRipple(clientX: number, clientY: number) {
      const s = stateRef.current
      if (!s) return
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const sx = s.renderer.domElement.width / rect.width
      const sy = s.renderer.domElement.height / rect.height
      const x = (clientX - rect.left) * sx
      const y = (rect.height - (clientY - rect.top)) * sy
      const ix = s.clickIx
      ;(s.uniforms.uClickPos.value as THREE.Vector2[])[ix].set(x, y)
      ;(s.uniforms.uClickTimes.value as Float32Array)[ix] = s.uniforms.uTime.value as number
      s.clickIx = (ix + 1) % MAX_CLICKS
    }
  }), [])

  return <div ref={containerRef} className={`w-full h-full overflow-hidden ${className ?? ''}`} style={style} />
})

export default PixelBlast
