"use client"

import { useState, useEffect, useCallback } from "react"

export function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [visible, setVisible] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isClicking, setIsClicking] = useState(false)
  const [cursorGlitch, setCursorGlitch] = useState(false)
  const [cursorSize, setCursorSize] = useState({ width: 24, height: 24 })
  const [hasInitialized, setHasInitialized] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Initialisierung nur auf Client-Seite
  useEffect(() => {
    setHasInitialized(true)
    
    // Prüfen, ob es sich um ein Mobilgerät handelt
    const checkMobile = () => {
      setIsMobile(
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768
      )
    }
    
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Position mit höherer Präzision verfolgen
  const updatePosition = useCallback((e: MouseEvent) => {
    setPosition({ x: e.clientX, y: e.clientY })
    setVisible(true)
  }, [])

  // Verbesserte Erkennung von interaktiven Elementen
  const checkHover = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement
    
    // Umfassendere Liste interaktiver Elemente
    const isInteractive = 
      target.tagName.toLowerCase() === 'a' || 
      target.tagName.toLowerCase() === 'button' ||
      target.closest('button') !== null ||
      target.closest('a') !== null ||
      target.tagName.toLowerCase() === 'input' ||
      target.tagName.toLowerCase() === 'textarea' ||
      target.tagName.toLowerCase() === 'select' ||
      target.closest('[role="button"]') !== null ||
      target.closest('.interactive') !== null ||
      target.classList.contains('interactive') ||
      !!target.closest('.crt-button') ||
      !!target.closest('.button-hover-effect') ||
      !!target.closest('.balatro-card') ||
      !!target.closest('.game-card') ||
      !!target.closest('.character-card')
    
    setIsHovering(isInteractive)
    
    // Cursor-Größe basierend auf Element anpassen
    if (isInteractive) {
      if (target.closest('.balatro-card') || target.closest('.game-card') || target.closest('.character-card')) {
        setCursorSize({ width: 30, height: 30 })
      } else {
        setCursorSize({ width: 24, height: 24 })
      }
    } else {
      setCursorSize({ width: 24, height: 24 })
    }
  }, [])

  // Mouse-Events
  useEffect(() => {
    if (!hasInitialized || isMobile) return
    
    const handleMouseEnter = () => setVisible(true)
    const handleMouseLeave = () => setVisible(false)
    const handleMouseDown = () => setIsClicking(true)
    const handleMouseUp = () => setIsClicking(false)
    
    // Zufälligen Glitch auf den Cursor anwenden
    const applyRandomGlitch = () => {
      if (Math.random() > 0.97) {
        setCursorGlitch(true)
        setTimeout(() => setCursorGlitch(false), 100)
      }
    }
    
    // Glitch-Intervall
    const glitchInterval = setInterval(applyRandomGlitch, 1000)
    
    // Event-Listener hinzufügen
    document.addEventListener("mousemove", updatePosition, { passive: true })
    document.addEventListener("mousemove", checkHover, { passive: true })
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)
    document.addEventListener("mousedown", handleMouseDown)
    document.addEventListener("mouseup", handleMouseUp)
    
    // Standard-Cursor verstecken
    try {
      document.documentElement.style.cursor = "none"
      document.body.style.cursor = "none"
      
      // Auf alle häufigen interaktiven Elemente anwenden
      const cursorStyles = document.createElement('style')
      cursorStyles.innerHTML = `
        a, button, input, textarea, select, [role="button"], .interactive, .crt-button, .button-hover-effect, .balatro-card, .game-card, .character-card {
          cursor: none !important;
        }
      `
      document.head.appendChild(cursorStyles)
    } catch (e) {
      console.error("Fehler beim Verstecken des Standard-Cursors:", e)
    }
    
    // Bereinigungsfunktion
    return () => {
      document.removeEventListener("mousemove", updatePosition)
      document.removeEventListener("mousemove", checkHover)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
      document.removeEventListener("mousedown", handleMouseDown)
      document.removeEventListener("mouseup", handleMouseUp)
      clearInterval(glitchInterval)
      
      // Standard-Cursor wiederherstellen
      try {
        document.documentElement.style.cursor = "auto"
        document.body.style.cursor = "auto"
      } catch (e) {
        console.error("Fehler beim Wiederherstellen des Standard-Cursors:", e)
      }
    }
  }, [updatePosition, checkHover, hasInitialized, isMobile])

  // Nicht auf Mobilgeräten anzeigen
  if (isMobile || !hasInitialized || !visible) return null

  return (
    <>
      {/* Äußerer Ring mit rotem Glühen - verbesserte Sichtbarkeit */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: `${cursorSize.width}px`,
          height: `${cursorSize.height}px`,
          transform: `translate(-50%, -50%) ${isHovering ? 'scale(1.5)' : ''} ${isClicking ? 'scale(0.8)' : ''} ${cursorGlitch ? 'translateX(3px)' : ''}`,
          border: '2px solid rgba(255, 0, 87, 0.9)',
          boxShadow: '0 0 10px rgba(255, 0, 87, 0.7), 0 0 20px rgba(255, 0, 87, 0.3)',
          borderRadius: '50%',
          backgroundColor: isHovering ? 'rgba(255, 0, 87, 0.15)' : 'transparent',
          opacity: cursorGlitch ? 0.7 : 1,
          pointerEvents: 'none',
          zIndex: 9999,
          mixBlendMode: 'lighten',
          transition: 'transform 0.1s ease-out, width 0.2s, height 0.2s',
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Innerer Punkt mit blauem Glühen */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '6px',
          height: '6px',
          transform: `translate(-50%, -50%) ${cursorGlitch ? 'translateX(-2px)' : ''}`,
          borderRadius: '50%',
          backgroundColor: '#2196f3',
          boxShadow: '0 0 10px #2196f3, 0 0 20px rgba(33, 150, 243, 0.5)',
          opacity: cursorGlitch ? 0.8 : 1,
          pointerEvents: 'none',
          zIndex: 9999,
          willChange: 'transform, opacity'
        }}
      />
      
      {/* Cursor-Spur - nur kurz sichtbar beim Bewegen */}
      <div
        style={{
          position: 'fixed',
          left: `${position.x}px`,
          top: `${position.y}px`,
          width: '14px',
          height: '14px',
          transform: 'translate(-50%, -50%)',
          borderRadius: '50%',
          backgroundColor: 'rgba(33, 150, 243, 0.3)',
          opacity: 0.4,
          pointerEvents: 'none',
          zIndex: 9998,
          transition: 'opacity 0.15s',
          willChange: 'opacity'
        }}
      />
      
      {/* Klick-Indikator */}
      {isClicking && (
        <div
          style={{
            position: 'fixed',
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: '40px',
            height: '40px',
            transform: 'translate(-50%, -50%)',
            borderRadius: '50%',
            border: '2px solid rgba(255, 0, 87, 0.3)',
            pointerEvents: 'none',
            zIndex: 9997,
            animation: 'cursorClick 0.5s forwards',
            willChange: 'transform, opacity'
          }}
        />
      )}
      
      {/* CSS für Klick-Animation */}
      <style jsx global>{`
        @keyframes cursorClick {
          0% { transform: translate(-50%, -50%) scale(0.5); opacity: 1; }
          100% { transform: translate(-50%, -50%) scale(1.5); opacity: 0; }
        }
      `}</style>
    </>
  )
}