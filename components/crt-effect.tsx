"use client"

import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ShaderMaterial } from "three"

const CRTShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    resolution: { value: new THREE.Vector2() },
    curvature: { value: 4.0 },
    scanlines: { value: 0.075 },
    vignette: { value: 0.5 },
    rgbShift: { value: 0.004 },
    glow: { value: 0.4 },
  },
  vertexShader: `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: `
    uniform sampler2D tDiffuse;
    uniform float time;
    uniform vec2 resolution;
    uniform float curvature;
    uniform float scanlines;
    uniform float vignette;
    uniform float rgbShift;
    uniform float glow;
    varying vec2 vUv;

    vec2 curve(vec2 uv) {
      vec2 c = uv * 2.0 - 1.0;
      vec2 offset = abs(c.yx) / vec2(curvature);
      c += c * offset * offset;
      c *= 1.0 + length(c) * length(c) * 0.03;
      return c * 0.5 + 0.5;
    }

    void main() {
      vec2 uv = curve(vUv);

      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }

      vec4 r = texture2D(tDiffuse, uv + vec2(rgbShift, 0.0));
      vec4 g = texture2D(tDiffuse, uv);
      vec4 b = texture2D(tDiffuse, uv - vec2(rgbShift, 0.0));
      vec4 color = vec4(r.r * 1.2, g.g * 0.8, b.b * 1.3, g.a);

      float scan = sin(uv.y * 800.0 + time * 10.0) * 0.5 + 0.5;
      color.rgb *= 1.0 - scanlines * scan;
      color.rgb *= 1.0 + sin(time * 100.0) * 0.01;

      vec2 vig = uv * 2.0 - 1.0;
      color.rgb *= smoothstep(1.0, 0.2, length(vig) * vignette);

      color.rgb += vec3(0.15, 0.05, 0.2) * glow * (1.0 - smoothstep(0.0, 0.03, min(min(uv.x, 1.0-uv.x), min(uv.y, 1.0-uv.y))));

      gl_FragColor = color;
    }
  `,
}

function Screen() {
  const { size } = useThree()
  const time = useRef(0)
  const mat = useRef<ShaderMaterial>(null)

  useFrame(() => {
    time.current += 0.01
    if (mat.current) {
      mat.current.uniforms.time.value = time.current
      mat.current.uniforms.resolution.value.set(size.width, size.height)
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={mat}
        args={[{
          uniforms: CRTShader.uniforms,
          vertexShader: CRTShader.vertexShader,
          fragmentShader: CRTShader.fragmentShader,
        }]}
      />
    </mesh>
  )
}

function Overlay() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 9998 }}>
      <div className="crt-overlay absolute inset-0" />
      <div className="scanlines absolute inset-0" />
      <div className="vignette absolute inset-0" />
      <div className="pixel-grid absolute inset-0" />
      <div className="scan-line absolute inset-0" />
    </div>
  )
}

export default function CRTEffect() {
  const [, setReady] = useState(false)

  useEffect(() => {
    setReady(true)
    document.querySelectorAll('canvas').forEach(c => c.style.pointerEvents = 'none')
    setTimeout(() => {
      document.querySelectorAll('canvas').forEach(c => c.style.pointerEvents = 'none')
    }, 500)
  }, [])

  return (
    <>
      <div
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 9999, overflow: 'hidden' }}
      >
        <Canvas
          style={{
            position: 'absolute',
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            imageRendering: 'pixelated',
            touchAction: 'none'
          }}
          gl={{ antialias: false, alpha: true, powerPreference: 'high-performance', precision: 'lowp' }}
          dpr={1}
          camera={{ position: [0, 0, 0.1], fov: 90 }}
        >
          <Screen />
        </Canvas>
      </div>

      <Overlay />

      <style jsx global>{`
        canvas { pointer-events: none !important; }

        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
          background-size: 100% 4px;
          opacity: 0.5;
          mix-blend-mode: multiply;
        }

        .scanlines {
          background: linear-gradient(to bottom,
            transparent 0%, rgba(220, 30, 70, 0.03) 25%,
            transparent 50%, rgba(33, 150, 243, 0.03) 75%,
            transparent 100%);
          background-size: 100% 8px;
          opacity: 0.6;
        }

        .vignette {
          background: radial-gradient(circle at center, transparent 60%, rgba(0, 0, 0, 0.5) 100%);
          opacity: 0.6;
        }

        .pixel-grid {
          background-image:
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 4px 4px;
          opacity: 0.4;
        }

        .scan-line {
          position: absolute;
          top: 0; left: 0;
          width: 100%; height: 4px;
          background: linear-gradient(to right, rgba(220, 30, 70, 0.15), rgba(33, 150, 243, 0.15));
          animation: scanline 6s linear infinite;
          box-shadow: 0 0 10px rgba(150, 50, 255, 0.2);
        }

        @keyframes scanline {
          0% { top: -4px; opacity: 0; }
          10% { opacity: 0.8; }
          35% { opacity: 0.3; }
          50% { opacity: 0.8; }
          75% { opacity: 0.3; }
          90% { opacity: 0.8; }
          100% { top: 100vh; opacity: 0; }
        }
      `}</style>
    </>
  )
}
