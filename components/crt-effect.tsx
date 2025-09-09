"use client"

import { useRef, useState, useEffect } from "react"
import * as THREE from "three"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { ShaderMaterial } from "three"

// CRT-Shader-Definitionen
const CRTShader = {
  uniforms: {
    tDiffuse: { value: null },
    time: { value: 0.0 },
    resolution: { value: new THREE.Vector2() },
    curvature: { value: 4.0 },
    vignetteBoost: { value: 1.2 },
    vignetteDarkness: { value: 1.5 },
    scanlineIntensity: { value: 0.075 },
    scanlineCount: { value: 800.0 },
    flickerAmount: { value: 0.1 },
    bleedAmount: { value: 10.0 },
    horizontalBleed: { value: 0.4 },
    bloomStrength: { value: 0.4 },
    bloomSpread: { value: 0.01 },
    glowStrength: { value: 0.8 },
    glowSpread: { value: 0.02 },
    glowThreshold: { value: 0.4 },
    colorBleedStrength: { value: 0.25 },
    colorBleedSpread: { value: 0.0004 },
    chromaticAberration: { value: 0.004 },
    gridIntensity: { value: 0.2 },
    gridScale: { value: 2 },
    backgroundColor: { value: new THREE.Vector3(0.05, 0.05, 0.1) },
    borderWidth: { value: 0.03 },
    vignetteAmount: { value: 0.5 },
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
    uniform float vignetteBoost;
    uniform float vignetteDarkness;
    uniform float scanlineIntensity;
    uniform float scanlineCount;
    uniform float flickerAmount;
    uniform float bleedAmount;
    uniform float horizontalBleed;
    uniform float bloomStrength;
    uniform float bloomSpread;
    uniform float glowStrength;
    uniform float glowSpread;
    uniform float glowThreshold;
    uniform float colorBleedStrength;
    uniform float colorBleedSpread;
    uniform float chromaticAberration;
    uniform float gridIntensity;
    uniform float gridScale;
    uniform vec3 backgroundColor;
    uniform float borderWidth;
    uniform float vignetteAmount;
    varying vec2 vUv;

    vec2 curveRemapUV(vec2 uv) {
      // Convert to -1 to 1 range
      vec2 cuv = uv * 2.0 - 1.0;
      
      // Apply stronger curve towards edges
      vec2 offset = abs(cuv.yx) / vec2(curvature);
      cuv += cuv * offset * offset;
      
      // Add barrel distortion
      float barrelDistance = length(cuv);
      cuv *= 1.0 + barrelDistance * barrelDistance * 0.03;
      
      // Return to 0-1 range
      return cuv * 0.5 + 0.5;
    }

    // Improved brightness calculation that preserves color
    float getBrightness(vec3 color) {
      return dot(color, vec3(0.2, 0.7, 0.1)); // Weight green higher
    }

    float getVignette(vec2 uv) {
      uv = uv * 2.0 - 1.0;
      return smoothstep(1.0, 0.2, length(uv) * vignetteAmount);
    }

    void main() {
      vec2 uv = curveRemapUV(vUv);
      vec4 finalColor = vec4(backgroundColor, 1.0);
      float scanline = 1.0;
      float flicker = 1.0;
      
      // Improved border handling
      float border = 1.0;
      if (uv.x < 0.0 || uv.x > 1.0 || uv.y < 0.0 || uv.y > 1.0) {
        gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
        return;
      }
      
      // Smooth border transition
      if (uv.x < borderWidth) border *= smoothstep(0.0, borderWidth, uv.x);
      if (uv.x > 1.0 - borderWidth) border *= smoothstep(1.0, 1.0 - borderWidth, uv.x);
      if (uv.y < borderWidth) border *= smoothstep(0.0, borderWidth, uv.y);
      if (uv.y > 1.0 - borderWidth) border *= smoothstep(1.0, 1.0 - borderWidth, uv.y);

      // Sample with chromatic aberration - Enhanced red/blue split for gaming theme
      float chromaticOffset = chromaticAberration * 1.5; // Increased for more visible effect
      vec4 r = texture2D(tDiffuse, uv + vec2(chromaticOffset, 0.0));
      vec4 g = texture2D(tDiffuse, uv);
      vec4 b = texture2D(tDiffuse, uv - vec2(chromaticOffset, 0.0));
      
      // Adjusted to enhance red/blue separation
      vec4 baseColor = vec4(r.r * 1.2, g.g * 0.8, b.b * 1.3, g.a);

      // Sample with color separation - Enhanced for red/blue theme
      vec4 rColor = texture2D(tDiffuse, uv + vec2(colorBleedSpread * 1.5, 0.0));
      vec4 bColor = texture2D(tDiffuse, uv - vec2(colorBleedSpread * 1.5, 0.0));
      
      vec4 centerColor = mix(baseColor, vec4(rColor.r * 1.2, baseColor.g * 0.8, bColor.b * 1.3, baseColor.a), colorBleedStrength * 1.5);

      vec4 glow = vec4(0.0);
      float brightness = getBrightness(centerColor.rgb);
      
      // Enhanced glow calculation with wider radius - adjusted for gaming theme
      if(brightness > glowThreshold) {
        float glowFactor = 0.0;
        
        // Sample more points with much wider spacing
        for(float i = 1.0; i <= 8.0; i++) {
          float offset = i * glowSpread;
          float weight = pow(0.85, i); // Reduced falloff for wider glow
          
          vec4 sampleL = texture2D(tDiffuse, uv - vec2(offset, 0.0));
          vec4 sampleR = texture2D(tDiffuse, uv + vec2(offset, 0.0));
          vec4 sampleU = texture2D(tDiffuse, uv - vec2(0.0, offset));
          vec4 sampleD = texture2D(tDiffuse, uv + vec2(0.0, offset));
          
          // Add diagonal samples for better spread
          vec4 sampleUL = texture2D(tDiffuse, uv + vec2(-offset, -offset) * 0.707);
          vec4 sampleUR = texture2D(tDiffuse, uv + vec2(offset, -offset) * 0.707);
          vec4 sampleDL = texture2D(tDiffuse, uv + vec2(-offset, offset) * 0.707);
          vec4 sampleDR = texture2D(tDiffuse, uv + vec2(offset, offset) * 0.707);
          
          glowFactor += weight;
          glow += (sampleL + sampleR + sampleU + sampleD + 
                  sampleUL + sampleUR + sampleDL + sampleDR) * weight * 0.5;
        }
        
        // Enhance the glow intensity - Adjusted for red/blue theme
        glow *= centerColor / max(0.001, brightness);
        glow *= glowStrength * smoothstep(glowThreshold, 1.0, brightness);
        
        // Add a red-blue tint to the glow
        glow.r *= 1.3; // Boost red
        glow.g *= 0.7; // Reduce green
        glow.b *= 1.2; // Boost blue slightly
      }

      // Enhance the final color mix
      finalColor = mix(centerColor, centerColor + glow, 0.7);
      finalColor += glow * bloomStrength; // Add additional bloom

      // Apply scanlines and flicker
      scanline = sin(uv.y * scanlineCount + time * 10.0) * 0.5 + 0.5;
      scanline = 1.0 - (scanlineIntensity * scanline);
      flicker = 1.0 + sin(time * 100.0) * flickerAmount;

      // Apply grid lines - new calculation
      float gridX = abs(sin(uv.x * resolution.x / gridScale));
      float gridY = abs(sin(uv.y * resolution.y / gridScale));
      
      // Make grid lines more pronounced
      gridX = smoothstep(0.95, 1.0, gridX);
      gridY = smoothstep(0.95, 1.0, gridY);
      float grid = max(gridX, gridY) * gridIntensity;

      // Apply grid as a multiplicative dark mask
      finalColor.rgb *= (1.0 - grid);

      // Adjust final color for CRT look with red/blue tint
      finalColor.rgb = mix(backgroundColor, finalColor.rgb, 0.9);
      finalColor.rgb += backgroundColor * 0.15; 
      
      // Enhance red and blue channels for theme
      finalColor.r *= 1.2;
      finalColor.g *= 0.8; 
      finalColor.b *= 1.3;

      // Apply vignette and border
      float vignette = getVignette(uv);
      finalColor.rgb *= vignette * border;
      
      // Add subtle bloom near edges with red/blue tint
      float edgeGlow = (1.0 - border) * 0.5;
      finalColor.rgb += vec3(0.15, 0.05, 0.2) * edgeGlow; // Red-blue tinted edge glow

      gl_FragColor = finalColor * scanline * flicker;
    }
  `,
}

// Shader-Material-Screen
function CRTScreen() {
  const { size } = useThree()
  const timeRef = useRef<number>(0)
  const materialRef = useRef<ShaderMaterial>(null)

  useFrame(() => {
    timeRef.current += 0.01
    if (materialRef.current) {
      materialRef.current.uniforms.time.value = timeRef.current
      materialRef.current.uniforms.resolution.value.set(size.width, size.height)
    }
  })

  return (
    <mesh>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial 
        ref={materialRef}
        args={[{
          uniforms: CRTShader.uniforms,
          vertexShader: CRTShader.vertexShader,
          fragmentShader: CRTShader.fragmentShader,
        }]}
      />
    </mesh>
  )
}

// CSS-basierte CRT-Effekte
function CSSCRTEffects() {
  return (
    <div className="fixed inset-0 w-full h-full pointer-events-none" style={{ zIndex: 9998 }}>
      <div className="crt-overlay absolute inset-0 w-full h-full"></div>
      <div className="scanlines absolute inset-0 w-full h-full"></div>
      <div className="vignette absolute inset-0 w-full h-full"></div>
      <div className="pixel-grid absolute inset-0 w-full h-full"></div>
      <div className="scan-line absolute inset-0 w-full h-full"></div>
    </div>
  )
}

export default function CRTEffect() {
  const canvasRef = useRef<HTMLDivElement>(null);
  const [isMounted, setIsMounted] = useState(false);
  
  // Nach dem Mounting das pointer-events: none anwenden
  useEffect(() => {
    setIsMounted(true);
    
    const applyPointerEvents = () => {
      // Alle Canvas-Elemente finden und pointer-events: none setzen
      const canvasElements = document.querySelectorAll('canvas');
      canvasElements.forEach(canvas => {
        canvas.style.pointerEvents = 'none';
      });
    };
    
    // Nach dem Rendern anwenden
    applyPointerEvents();
    // Und noch einmal nach einer Verzögerung (für dynamisch geladene Elemente)
    setTimeout(applyPointerEvents, 500);
  }, []);

  return (
    <>
      {/* Vollbild-Container */}
      <div 
        ref={canvasRef} 
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ 
          zIndex: 9999, // Höchste z-index für den Canvas
          pointerEvents: 'none',
          overflow: 'hidden' 
        }}
      >
        <Canvas 
          style={{ 
            position: 'absolute', 
            width: '100%', 
            height: '100%', 
            pointerEvents: 'none',
            // Bildschirmfüllend mit schärferen Pixeln
            imageRendering: 'pixelated',
            touchAction: 'none' // Verhindert Touch-Interaktionen
          }}
          gl={{ 
            antialias: false, // Wichtig für Pixel-Look
            alpha: true, // Für Transparenz
            powerPreference: 'high-performance',
            precision: 'lowp' // Bessere Performance
          }}
          dpr={1} // Reduzierte Auflösung für bessere Performance
          camera={{ position: [0, 0, 0.1], fov: 90 }}
        >
          <CRTScreen />
        </Canvas>
      </div>
      
      {/* CSS-Fallback-Effekte für bessere Performance */}
      <CSSCRTEffects />
      
      {/* Globales CSS für pointer-events */}
      <style jsx global>{`
        canvas {
          pointer-events: none !important;
        }
        
        /* Verbesserte CSS-Effekte für CRT-Look */
        .crt-overlay {
          background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.1) 50%);
          background-size: 100% 4px;
          opacity: 0.5;
          mix-blend-mode: multiply;
          pointer-events: none;
        }
        
        .scanlines {
          background: linear-gradient(to bottom, 
            transparent 0%, 
            rgba(220, 30, 70, 0.03) 25%,
            transparent 50%,
            rgba(33, 150, 243, 0.03) 75%,
            transparent 100%);
          background-size: 100% 8px;
          opacity: 0.6;
          pointer-events: none;
        }
        
        .vignette {
          background: radial-gradient(
            circle at center,
            transparent 60%,
            rgba(0, 0, 0, 0.5) 100%
          );
          opacity: 0.6;
          pointer-events: none;
        }
        
        .pixel-grid {
          background-image: 
            linear-gradient(to right, rgba(255, 255, 255, 0.02) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255, 255, 255, 0.02) 1px, transparent 1px);
          background-size: 4px 4px;
          opacity: 0.4;
          pointer-events: none;
        }
        
        .scan-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background: linear-gradient(to right,
            rgba(220, 30, 70, 0.15),
            rgba(33, 150, 243, 0.15)
          );
          animation: scanline 6s linear infinite;
          pointer-events: none;
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