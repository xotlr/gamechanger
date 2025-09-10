"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import CRTEffect from "@/components/crt-effect"
import Navbar from "@/components/navbar"
import HeroSection from "@/components/hero-section"
import AboutSection from "@/components/about-section"
import TeamSection from "@/components/team-section"
import ContactSection from "@/components/contact-section"
import { Noise } from "@/components/noise"
import BootSequence from "@/components/boot-sequence"

// Einfachere, zuverlässigere Version des Cursors
function SimpleCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  
  // Position mit direkter Aktualisierung verfolgen
  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      setVisible(true)
      
      // Prüfen, ob Maus über interaktivem Element ist
      const target = e.target as HTMLElement
      const isInteractive = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' ||
        target.closest('a') !== null ||
        target.closest('button') !== null ||
        target.classList.contains('interactive') ||
        !!target.closest('.interactive') ||
        !!target.closest('.crt-button')
        
      setIsHovering(isInteractive)
    }
    
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    const handleMouseLeave = () => setVisible(false)
    
    // Event-Listener hinzufügen
    document.addEventListener("mousemove", updatePosition)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    document.addEventListener("mouseleave", handleMouseLeave)
    
    // WICHTIG: NICHT den Standard-Cursor ausblenden!
    // Dies kann Klick-Probleme verursachen
    
    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [])
  
  // Für Mobilgeräte nicht anzeigen
  if (!visible || typeof window !== 'undefined' && window.innerWidth < 768) return null
  
  return (
    <div 
      style={{
        position: 'fixed',
        pointerEvents: 'none',
        zIndex: 9999,
        left: 0,
        top: 0,
        transform: `translate(${position.x}px, ${position.y}px)`,
        transition: 'transform 0.05s ease-out, opacity 0.2s ease',
      }}
    >
      <div
        style={{
          width: isHovering ? '32px' : '24px',
          height: isHovering ? '32px' : '24px',
          borderRadius: '50%',
          border: '2px solid rgba(255, 0, 87, 0.8)',
          boxShadow: '0 0 8px rgba(255, 0, 87, 0.6)',
          backgroundColor: isHovering ? 'rgba(255, 0, 87, 0.15)' : 'transparent',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: `translate(-50%, -50%) scale(${isClicking ? 0.8 : 1})`,
          transition: 'width 0.2s, height 0.2s, transform 0.1s, background-color 0.2s',
        }}
      />
      
      <div
        style={{
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#2196f3',
          boxShadow: '0 0 8px #2196f3',
          position: 'absolute',
          top: 0,
          left: 0,
          transform: 'translate(-50%, -50%)',
          transition: 'width 0.2s, height 0.2s',
        }}
      />
    </div>
  )
}

import { audioManager } from "@/lib/audio-manager"
import { SettingsIcon, VolumeIcon, VolumeXIcon, EyeIcon } from "raster-react"

export default function Home() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": ["Organization", "SportsOrganization", "LocalBusiness"],
    "name": "GAME:changer",
    "alternateName": ["GAME:changer eSport Gaming Verein", "Game Changer Retz", "Gaming Verein Retz"],
    "description": "GAME:changer - Der führende eSport & Gaming Verein in Retz, Pleissing, Niederösterreich. Gaming Community, Turniere, Events.",
    "url": "https://your-domain.com",
    "logo": "https://your-domain.com/logo.png",
    "image": "https://your-domain.com/og-image.jpg",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Retz",
      "addressLocality": "Pleissing",
      "addressRegion": "Niederösterreich", 
      "postalCode": "2070",
      "addressCountry": "AT"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 48.7567,
      "longitude": 15.9457
    },
    "areaServed": [
      {
        "@type": "City",
        "name": "Retz"
      },
      {
        "@type": "City", 
        "name": "Pleissing"
      },
      {
        "@type": "State",
        "name": "Niederösterreich"
      }
    ],
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "availableLanguage": ["German", "de"]
    },
    "sameAs": [
      "https://www.facebook.com/profile.php?id=61565503147498"
    ],
    "keywords": "Gaming Verein Retz, eSport Retz, Gaming Community, Turniere, Gaming Events, GAME:changer",
    "sport": "eSports",
    "memberOf": {
      "@type": "Organization",
      "name": "Österreichische Gaming Vereine"
    },
    "@graph": [
      {
        "@type": "WebSite",
        "name": "GAME:changer Gaming Verein Retz",
        "url": "https://your-domain.com",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://your-domain.com/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "LocalBusiness",
        "name": "GAME:changer Gaming Verein",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Retz",
          "addressRegion": "Niederösterreich",
          "addressCountry": "AT"
        },
        "geo": {
          "@type": "GeoCoordinates", 
          "latitude": 48.7567,
          "longitude": 15.9457
        }
      }
    ]
  };

  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [isMuted, setIsMuted] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  const [crtEffectsEnabled, setCrtEffectsEnabled] = useState(true)
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  
  // Initialisierung
  useEffect(() => {
    setMounted(true)
    
    if (typeof window !== 'undefined') {
      setIsMuted(audioManager.isMuted());
    }
    
    // Viewport-Höhe für Mobile-Geräte richtig setzen
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }
    
    window.addEventListener('resize', setVh)
    setVh()
    
    // Globale Interaktions-Events für Sound-Effekte
    const addInteractiveEffects = () => {
      const handleClick = (e: MouseEvent) => {
        if (!loading && !audioManager.isMuted()) {
          const target = e.target as HTMLElement;
          
          if (
            target.tagName === 'BUTTON' || 
            target.tagName === 'A' || 
            target.closest('button') || 
            target.closest('a') ||
            target.classList.contains('interactive')
          ) {
            audioManager.initializeOnUserAction().then(() => {
              audioManager.playSelect();
            });
          }
        }
      }
      
      const handleMouseOver = (e: MouseEvent) => {
        if (!loading && !audioManager.isMuted()) {
          const target = e.target as HTMLElement;
          
          if (
            target.tagName === 'BUTTON' || 
            target.tagName === 'A' || 
            target.closest('button') || 
            target.closest('a') ||
            target.classList.contains('interactive')
          ) {
            audioManager.playHover();
          }
        }
      }
      
      // Events auf Document-Ebene hinzufügen
      document.addEventListener('click', handleClick);
      document.addEventListener('mouseover', handleMouseOver);
      
      return () => {
        document.removeEventListener('click', handleClick);
        document.removeEventListener('mouseover', handleMouseOver);
      }
    }
    
    const cleanup = addInteractiveEffects();
    
    return () => {
      window.removeEventListener('resize', setVh);
      cleanup();
    }
  }, [loading]);
  
  // Boot-Sequenz abschließen
  const handleBootComplete = () => {
    audioManager.playStartup();
    setLoading(false);
  };
  
  // Sound ein-/ausschalten
  const toggleSound = () => {
    const muted = audioManager.toggleMute();
    setIsMuted(muted);
    
    if (!muted) {
      // Initialize audio and play feedback sound
      audioManager.initializeOnUserAction().then(() => {
        audioManager.playSelect();
      });
    }
  };
  
  if (!mounted) return null;
  
  return (
    <div className={`${reducedMotion ? 'reduced-motion' : ''}`}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      
      {/* Override body background and accessibility styles */}
      <style jsx global>{`
        body {
          background: black !important;
        }
        
        .high-contrast {
          filter: contrast(1.5) brightness(1.2);
        }
        
        .reduced-motion * {
          animation-duration: 0.001s !important;
          animation-delay: 0s !important;
          transition-duration: 0.001s !important;
        }
        
        /* Focus styles for accessibility */
        button:focus-visible,
        a:focus-visible,
        input:focus-visible,
        textarea:focus-visible {
          outline: 2px solid #ff0057;
          outline-offset: 2px;
        }
        
        /* Better touch targets on mobile */
        @media (max-width: 768px) {
          button, a {
            min-height: 44px;
            min-width: 44px;
          }
        }
      `}</style>
      
      
      {loading ? (
        <BootSequence onComplete={handleBootComplete} />
      ) : (
        <>
          {/* Global Background Layer */}
          <div className="fixed inset-0 -z-10">
            {/* Main hero background gradient - Full page */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a14] to-[#0a0a1c]"></div>
            
            {/* Radial gradient for CRT glow */}
            <div 
              className="absolute inset-0"
              style={{
                background: 'radial-gradient(circle at center, rgba(0,0,0,0) 50%, rgba(0,0,0,0.5) 100%)',
                opacity: 0.8
              }}
            />
          </div>
          
          {/* Global UI Layer - All fixed elements coordinated */}
          <div className="fixed inset-0 pointer-events-none z-50">
            {/* CRT Effects - Global */}
            {crtEffectsEnabled && (
              <>
                <CRTEffect />
                <Noise />
                <SimpleCursor />
                
                {/* CRT overlay effects - Full page */}
                <div className="crt-overlay"></div>
                <div className="scanlines"></div>
                <div className="vignette"></div>
                <div className="pixel-grid"></div>
                <div className="scan-line"></div>
              </>
            )}
            
            {/* Background particles - Full page */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="pixel-particle animate-float"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    animationDuration: `${15 + Math.random() * 10}s`,
                    animationDelay: `${Math.random() * 5}s`,
                    opacity: 0.1 + Math.random() * 0.2,
                    backgroundColor: i % 2 === 0 ? '#ff0057' : '#2196f3',
                    boxShadow: i % 2 === 0 ? '0 0 8px rgba(255, 0, 87, 0.5)' : '0 0 8px rgba(33, 150, 243, 0.5)'
                  }}
                />
              ))}
            </div>
            
            {/* Interactive UI Elements */}
            <div className="absolute top-0 left-0 right-0 pointer-events-auto">
              <Navbar isMuted={isMuted} toggleSound={toggleSound} />
            </div>
            
            <div className="fixed bottom-4 right-4 z-[60] pointer-events-auto">
              <motion.button 
                onClick={() => setShowSettings(!showSettings)}
                className={`crt-button px-4 py-3 text-sm flex items-center space-x-2 shadow-lg ${
                  showSettings 
                    ? 'bg-[#ff0057]/20 border-[#ff0057]/70 shadow-[#ff0057]/20' 
                    : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
                } transition-colors duration-200`}
                aria-label={showSettings ? "Einstellungen schließen" : "Einstellungen öffnen"}
                aria-expanded={showSettings}
                aria-haspopup="dialog"
                initial={false}
                animate={{ 
                  rotate: reducedMotion ? 0 : (showSettings ? 45 : 0),
                  scale: 1
                }}
                whileHover={reducedMotion ? {} : { scale: 1.02 }}
                whileTap={reducedMotion ? {} : { scale: 0.98 }}
                transition={{ 
                  duration: reducedMotion ? 0.1 : 0.2,
                  ease: "easeInOut"
                }}
              >
                <SettingsIcon 
                  size={16} 
                  strokeWidth={1} 
                  radius={1}
                />
                <span className="hidden sm:inline">OPTIONEN</span>
              </motion.button>
              
              <AnimatePresence>
                {showSettings && (
                  <>
                    {/* Click outside overlay */}
                    <motion.div 
                      className="fixed inset-0 z-[70]"
                      onClick={() => setShowSettings(false)}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    />
                    
                    {/* Settings panel */}
                    <motion.div 
                      className={`absolute bottom-full right-0 mb-2 p-6 w-80 max-w-sm z-[80] pointer-events-auto rounded-lg border ${
                        highContrast 
                          ? 'bg-black/95 border-[#ff0057] shadow-[0_0_20px_rgba(255,0,87,0.3)]' 
                          : 'bg-[#0a0a14]/95 border-[#2196f3]/30 shadow-2xl'
                      }`}
                      style={{
                        backdropFilter: highContrast ? 'blur(20px)' : 'blur(30px) saturate(150%)',
                        pointerEvents: 'auto'
                      }}
                      role="dialog"
                      aria-modal="true"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      transition={{ 
                        duration: reducedMotion ? 0.1 : 0.2,
                        ease: "easeOut"
                      }}
                    >                    
                    <div className="space-y-6">
                      {/* Sound Control */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          {isMuted ? (
                            <VolumeXIcon size={16} strokeWidth={1} radius={1} style={{ color: "#ff6b6b" }} />
                          ) : (
                            <VolumeIcon size={16} strokeWidth={1} radius={1} style={{ color: "#51cf66" }} />
                          )}
                          <span className="text-sm font-medium">Sound:</span>
                        </div>
                        <button 
                          onClick={toggleSound}
                          className={`px-3 py-2 text-xs min-w-[60px] rounded border transition-all duration-150 ${
                            isMuted 
                              ? 'border-red-500/70 bg-red-500/15 text-red-300 hover:bg-red-500/25' 
                              : 'border-green-500/70 bg-green-500/15 text-green-300 hover:bg-green-500/25'
                          } ${highContrast ? 'border-2 font-semibold' : ''}`}
                          aria-label={isMuted ? "Sound aktivieren" : "Sound deaktivieren"}
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 90 }}
                        >
                          {isMuted ? "AUS" : "AN"}
                        </button>
                      </div>
                      
                      {/* CRT Effects */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <EyeIcon size={16} strokeWidth={1} radius={1} style={{ color: "#2196f3" }} />
                          <span className="text-sm font-medium">CRT-Effekte:</span>
                        </div>
                        <button 
                          onClick={() => setCrtEffectsEnabled(!crtEffectsEnabled)}
                          className={`px-3 py-2 text-xs min-w-[60px] rounded border transition-all duration-150 ${
                            crtEffectsEnabled 
                              ? 'border-green-500/70 bg-green-500/15 text-green-300 hover:bg-green-500/25' 
                              : 'border-red-500/70 bg-red-500/15 text-red-300 hover:bg-red-500/25'
                          } ${highContrast ? 'border-2 font-semibold' : ''}`}
                          aria-label={crtEffectsEnabled ? "CRT-Effekte deaktivieren" : "CRT-Effekte aktivieren"}
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 90 }}
                        >
                          {crtEffectsEnabled ? "AN" : "AUS"}
                        </button>
                      </div>
                      
                      {/* High Contrast */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Hoher Kontrast:</span>
                        <button 
                          onClick={() => setHighContrast(!highContrast)}
                          className={`px-3 py-2 text-xs min-w-[60px] rounded border transition-all duration-150 ${
                            highContrast 
                              ? 'border-green-500/70 bg-green-500/15 text-green-300 hover:bg-green-500/25' 
                              : 'border-red-500/70 bg-red-500/15 text-red-300 hover:bg-red-500/25'
                          } ${highContrast ? 'border-2 font-semibold' : ''}`}
                          aria-label={highContrast ? "Hohen Kontrast deaktivieren" : "Hohen Kontrast aktivieren"}
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 90 }}
                        >
                          {highContrast ? "AN" : "AUS"}
                        </button>
                      </div>
                      
                      {/* Reduced Motion */}
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Weniger Animationen:</span>
                        <button 
                          onClick={() => setReducedMotion(!reducedMotion)}
                          className={`px-3 py-2 text-xs min-w-[60px] rounded border transition-all duration-150 ${
                            reducedMotion 
                              ? 'border-green-500/70 bg-green-500/15 text-green-300 hover:bg-green-500/25' 
                              : 'border-red-500/70 bg-red-500/15 text-red-300 hover:bg-red-500/25'
                          } ${highContrast ? 'border-2 font-semibold' : ''}`}
                          aria-label={reducedMotion ? "Animationen aktivieren" : "Animationen reduzieren"}
                          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 90 }}
                        >
                          {reducedMotion ? "AN" : "AUS"}
                        </button>
                      </div>
                    </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
            
            <div className="fixed left-4 bottom-4 z-[55] pointer-events-auto hidden sm:block">
              <div className="balatro-card p-3 text-xs">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 border border-[#ff0057]/50 rounded text-[#ff0057] font-mono text-xs">
                    ↑↓
                  </kbd>
                  <span className="text-[#2196f3]">Navigation</span>
                  <kbd className="px-2 py-1 border border-[#2196f3]/50 rounded text-[#2196f3] font-mono text-xs ml-2">
                    Tab
                  </kbd>
                  <span className="text-[#2196f3]">Fokus</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <main 
            className={`relative min-h-screen bg-background text-foreground font-terminal ${
              highContrast ? 'high-contrast' : ''
            } ${
              reducedMotion ? 'reduce-motion' : ''
            }`}
            style={{
              filter: crtEffectsEnabled ? 'none' : 'none',
            }}
          >
            <div className="pt-20">
              <HeroSection />
            </div>
            <AboutSection />
            <TeamSection />
            <ContactSection />
          </main>
        </>
      )}
    </div>
  )
}