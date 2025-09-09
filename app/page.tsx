"use client"

import { useState, useEffect } from "react"
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

// Audio-Manager für Sound-Effekte
class AudioManager {
  private sounds: { [key: string]: HTMLAudioElement } = {};
  private muted: boolean = false;
  
  constructor() {
    if (typeof window === 'undefined') return;
    
    // Sound-Effekte laden
    this.loadSound('hover', '/sounds/sparkle.wav');
    this.loadSound('click', '/sounds/unlock.wav');
    this.loadSound('startup', '/sounds/game-over.wav');
    
    // Standardmäßig Sound ausschalten, um Audio-Probleme zu vermeiden
    this.muted = true;
    
    // Lautstärke aus lokaler Speicherung abrufen
    const savedMuted = localStorage.getItem('soundMuted');
    if (savedMuted) {
      this.muted = savedMuted === 'true';
    }
  }
  
  private loadSound(name: string): void {
    if (typeof window === 'undefined') return;
    try {
      const audio = new Audio();
      // Pfad erst bei Abspielen setzen, um das Vorab-Laden zu vermeiden
      this.sounds[name] = audio;
    } catch (e) {
      console.error(`Fehler beim Laden des Sounds ${name}:`, e);
    }
  }
  
  public play(name: string): void {
    if (this.muted || typeof window === 'undefined') return;
    
    const sound = this.sounds[name];
    if (sound) {
      // Sound zurücksetzen und abspielen
      sound.volume = 0.2;
      sound.src = `/sounds/${name}.mp3`;
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Audio-Wiedergabe verhindert:', e));
    }
  }
  
  public toggleMute(): boolean {
    this.muted = !this.muted;
    
    // Einstellung in lokaler Speicherung speichern
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundMuted', this.muted.toString());
    }
    
    return this.muted;
  }
  
  public isMuted(): boolean {
    return this.muted;
  }
}

export default function Home() {
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const [audioManager, setAudioManager] = useState<AudioManager | null>(null)
  const [isMuted, setIsMuted] = useState(true)
  const [showSettings, setShowSettings] = useState(false)
  
  // Initialisierung
  useEffect(() => {
    setMounted(true)
    
    if (!audioManager && typeof window !== 'undefined') {
      const manager = new AudioManager();
      setAudioManager(manager);
      setIsMuted(manager.isMuted());
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
        if (audioManager && !loading) {
          const target = e.target as HTMLElement;
          
          if (
            target.tagName === 'BUTTON' || 
            target.tagName === 'A' || 
            target.closest('button') || 
            target.closest('a') ||
            target.classList.contains('interactive')
          ) {
            audioManager.play('click');
          }
        }
      }
      
      const handleMouseOver = (e: MouseEvent) => {
        if (audioManager && !loading) {
          const target = e.target as HTMLElement;
          
          if (
            target.tagName === 'BUTTON' || 
            target.tagName === 'A' || 
            target.closest('button') || 
            target.closest('a') ||
            target.classList.contains('interactive')
          ) {
            audioManager.play('hover');
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
  }, [audioManager, loading]);
  
  // Boot-Sequenz abschließen
  const handleBootComplete = () => {
    if (audioManager) {
      audioManager.play('startup');
    }
    setLoading(false);
  };
  
  // Sound ein-/ausschalten
  const toggleSound = () => {
    if (audioManager) {
      const muted = audioManager.toggleMute();
      setIsMuted(muted);
      
      if (!muted) {
        // Feedback-Sound abspielen, wenn Sound eingeschaltet wird
        audioManager.play('click');
      }
    }
  };
  
  if (!mounted) return null;
  
  return (
    <>
      <main className="relative min-h-screen bg-background text-foreground font-terminal overflow-hidden">
        {loading ? (
          <BootSequence onComplete={handleBootComplete} />
        ) : (
          <>
            {/* Einfache CRT-Effekte */}
            <CRTEffect />
            <Noise />
            <SimpleCursor />
            
            {/* Einfache CSS-CRT-Effekte für Fallback/Verbesserung */}
            <div className="crt-overlay"></div>
            <div className="scanlines"></div>
            <div className="vignette"></div>
            <div className="pixel-grid"></div>
            <div className="scan-line"></div>
            
            {/* Hintergrund-Partikel */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
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
            
            {/* Sound-Steuerung */}
            <div className="fixed top-4 right-4 z-50">
              <button 
                onClick={toggleSound} 
                className="crt-button px-3 py-2 text-sm flex items-center"
                aria-label={isMuted ? "Sound einschalten" : "Sound ausschalten"}
              >
                <span className="mr-2">
                  {isMuted ? "🔇" : "🔊"}
                </span>
                <span>{isMuted ? "SOUND: AUS" : "SOUND: AN"}</span>
              </button>
            </div>
            
            {/* Einstellungen-Panel */}
            <div className="fixed bottom-4 right-4 z-50">
              <button 
                onClick={() => setShowSettings(!showSettings)}
                className="crt-button px-3 py-2 text-sm"
                aria-label="Einstellungen"
              >
                ⚙️ OPTIONEN
              </button>
              
              {showSettings && (
                <div className="absolute bottom-full right-0 mb-2 p-4 balatro-card w-64">
                  <h3 className="text-sm font-bold crt-text-red mb-4">EINSTELLUNGEN</h3>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Sound:</span>
                      <button 
                        onClick={toggleSound}
                        className="crt-button px-2 py-1 text-xs"
                      >
                        {isMuted ? "AUS" : "AN"}
                      </button>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm">CRT-Effekte:</span>
                      <button className="crt-button px-2 py-1 text-xs">
                        AN
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 text-center">
                    <button 
                      onClick={() => setShowSettings(false)}
                      className="crt-button px-2 py-1 text-xs w-full"
                    >
                      SCHLIESSEN
                    </button>
                  </div>
                </div>
              )}
            </div>
            
            {/* Tastatursteuerungs-Hinweis */}
            <div className="fixed left-4 bottom-4 z-50">
              <div className="balatro-card p-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="px-1 border border-[#ff0057]/50 rounded">↑↓</span>
                  <span className="text-[#2196f3]">Navigation</span>
                </div>
              </div>
            </div>
            
            {/* Hauptinhalt mit Einschaltanimation */}
            <div className="relative z-10 container mx-auto px-4 turn-on-animation">
              <Navbar />
              <HeroSection />
              <AboutSection />
              <TeamSection />
              <ContactSection />
            </div>
          </>
        )}
      </main>
    </>
  )
}