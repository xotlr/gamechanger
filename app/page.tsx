"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import CRTEffect from "@/components/crt-effect"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import TeamSection from "@/components/team-section"
import ContactSection from "@/components/contact-section"
import { Noise } from "@/components/noise"
import BootSequence from "@/components/boot-sequence"
import SimpleCursor from "@/components/simple-cursor"
import SettingsPanel from "@/components/settings-panel"
import ErrorBoundary from "@/components/error-boundary"
import { useAudio, useAccessibility, useViewport } from "@/lib/hooks"
import { audioManager } from "@/lib/audio-manager"
import { STRUCTURED_DATA } from "@/lib/structured-data"
import PixelBlast, { PixelBlastRef } from "@/components/pixel-blast"
import { PIXEL_BLAST_BLUE, PIXEL_BLAST_RED } from "@/lib/pixel-blast-config"
import { ScrollArea } from "@/components/ui/scroll-area"

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [crtEnabled, setCrtEnabled] = useState(true)

  const blastRef = useRef<PixelBlastRef>(null)

  const { isMuted, toggleSound, playStartup } = useAudio()
  const { highContrast, setHighContrast, reducedMotion, setReducedMotion, dyslexiaMode, setDyslexiaMode } = useAccessibility()
  useViewport()

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted || loading) return

    const onClick = (e: MouseEvent) => {
      blastRef.current?.triggerRipple(e.clientX, e.clientY)

      if (audioManager.isMuted()) return
      const t = e.target as HTMLElement
      if (t.tagName === 'BUTTON' || t.tagName === 'A' || t.closest('button') || t.closest('a')) {
        audioManager.init().then(() => audioManager.playSelect())
      }
    }

    const onHover = (e: MouseEvent) => {
      if (audioManager.isMuted()) return
      const t = e.target as HTMLElement
      if (t.tagName === 'BUTTON' || t.tagName === 'A' || t.closest('button') || t.closest('a')) {
        audioManager.playHover()
      }
    }

    document.addEventListener('click', onClick)
    document.addEventListener('mouseover', onHover)
    return () => {
      document.removeEventListener('click', onClick)
      document.removeEventListener('mouseover', onHover)
    }
  }, [mounted, loading])

  useEffect(() => {
    if (dyslexiaMode) {
      document.documentElement.classList.add('dyslexia-mode')
    } else {
      document.documentElement.classList.remove('dyslexia-mode')
    }
  }, [dyslexiaMode])

  const onBootComplete = () => {
    playStartup()
    setLoading(false)
  }

  if (!mounted) return null

  return (
    <ErrorBoundary>
      <div className={`h-screen w-screen overflow-hidden ${reducedMotion ? 'reduce-motion' : ''}`}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(STRUCTURED_DATA) }}
        />

        <style jsx global>{`
          body { background: black !important; }
          button:focus-visible, a:focus-visible, input:focus-visible, textarea:focus-visible {
            outline: 2px solid #ff0057;
            outline-offset: 2px;
          }
          @media (max-width: 768px) {
            button, a { min-height: 44px; min-width: 44px; }
          }
        `}</style>

        {loading ? (
          <BootSequence onComplete={onBootComplete} />
        ) : (
          <>
            {/* Skip to content link for accessibility */}
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[#ff0057] focus:text-white focus:border-2 focus:border-white"
              aria-label="Zum Hauptinhalt springen"
            >
              Zum Hauptinhalt springen
            </a>

            {/* Fixed background - z-0 */}
            <Background blastRef={blastRef} reducedMotion={reducedMotion} />

            {/* Fixed overlays - z-50, pointer-events-none */}
            <div className="fixed inset-0 pointer-events-none z-50">
              {crtEnabled && !reducedMotion && (
                <>
                  <CRTEffect />
                  <Noise />
                  <SimpleCursor />
                  <div className="crt-overlay" />
                  <div className="scanlines" />
                  <div className="vignette" />
                  <div className="pixel-grid" />
                  <div className="scan-line" />
                </>
              )}

              <div className="absolute top-0 left-0 right-0 pointer-events-auto">
                <Navbar isMuted={isMuted} toggleSound={toggleSound} reducedMotion={reducedMotion} />
              </div>

              <SettingsPanel
                showSettings={showSettings}
                setShowSettings={setShowSettings}
                isMuted={isMuted}
                toggleSound={toggleSound}
                crtEffectsEnabled={crtEnabled}
                setCrtEffectsEnabled={setCrtEnabled}
                highContrast={highContrast}
                setHighContrast={setHighContrast}
                reducedMotion={reducedMotion}
                setReducedMotion={setReducedMotion}
                dyslexiaMode={dyslexiaMode}
                setDyslexiaMode={setDyslexiaMode}
              />

              <KeyHints />
            </div>

            {/* ScrollArea wraps only the scrollable content */}
            <ScrollArea className="h-screen w-screen">
              <main id="main-content" className={`relative z-10 min-h-screen pb-24 text-foreground font-terminal pointer-events-none ${highContrast ? 'high-contrast' : ''}`}>
                <div className="pt-20 pointer-events-auto">
                  <HeroSection />
                </div>
                <div className="pointer-events-auto">
                  <AboutSection />
                </div>
                <div className="pointer-events-auto">
                  <TeamSection />
                </div>
                <div className="pointer-events-auto">
                  <ContactSection />
                </div>
              </main>
            </ScrollArea>
          </>
        )}
      </div>
    </ErrorBoundary>
  )
}

interface BackgroundProps {
  blastRef: React.RefObject<PixelBlastRef | null>
  reducedMotion: boolean
}

function Background({ blastRef, reducedMotion }: BackgroundProps) {
  return (
    <div className="fixed inset-0 w-screen h-screen" style={{ zIndex: 0 }}>
      <PixelBlast
        ref={blastRef}
        {...PIXEL_BLAST_BLUE}
        color2={PIXEL_BLAST_RED.color}
        speed={reducedMotion ? 0 : PIXEL_BLAST_BLUE.speed}
        enableRipples={!reducedMotion}
      />
    </div>
  )
}


function KeyHints() {
  return (
    <div className="fixed left-4 bottom-4 z-[55] pointer-events-auto hidden sm:block">
      <div className="bg-[#0a0a14] border border-[#2196f3]/30 p-3 text-xs relative">
        <div className="flex items-center gap-2">
          <kbd className="px-2 py-1 border border-[#ff0057]/50 text-[#ff0057] font-mono">↑↓</kbd>
          <span className="text-[#2196f3]">Navigation</span>
          <kbd className="px-2 py-1 border border-[#2196f3]/50 text-[#2196f3] font-mono ml-2">Tab</kbd>
          <span className="text-[#2196f3]">Fokus</span>
        </div>
        <span className="absolute top-0 left-0 w-1.5 h-1.5 border-t-2 border-l-2 border-[#2196f3]" />
        <span className="absolute top-0 right-0 w-1.5 h-1.5 border-t-2 border-r-2 border-[#2196f3]" />
        <span className="absolute bottom-0 left-0 w-1.5 h-1.5 border-b-2 border-l-2 border-[#2196f3]" />
        <span className="absolute bottom-0 right-0 w-1.5 h-1.5 border-b-2 border-r-2 border-[#2196f3]" />
      </div>
    </div>
  )
}
