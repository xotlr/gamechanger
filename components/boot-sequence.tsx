"use client"

import { useState, useEffect, useRef } from "react"

// Boot-Sequenz im Balatro-Stil
function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [bootText, setBootText] = useState<string[]>([])
  const [showLogo, setShowLogo] = useState(false)
  const [textGlitch, setTextGlitch] = useState(-1)
  const logoRef = useRef<HTMLDivElement>(null)
  
  // Logo-Glitch-Effekt - subtiler gestaltet
  useEffect(() => {
    if (!showLogo || !logoRef.current) return
    
    const applyGlitchEffect = () => {
      if (!logoRef.current) return
      
      // Seltenere Glitch-Chance für subtileren Effekt
      if (Math.random() > 0.95) {
        const text = logoRef.current
        const originalText = "GAMECHANGER"
        
        // Glitch-Text erstellen
        const glitchText = originalText
          .split("")
          .map((char) => {
            if (Math.random() > 0.8) {
              const glitchChars = "!@#$%^&*_+-=<>?/|\\1234567890"
              return glitchChars[Math.floor(Math.random() * glitchChars.length)]
            }
            return char
          })
          .join("")
          
        text.innerText = glitchText
        
        // Nur horizontaler Versatz für Balatro-Stil
        if (Math.random() > 0.5) {
          text.style.transform = `translateX(${(Math.random() * 4) - 2}px)`
        }
        
        // Nach kurzer Verzögerung zurücksetzen
        setTimeout(() => {
          text.innerText = originalText
          text.style.transform = 'translateX(0)'
        }, 100)
      }
    }
    
    const intervalId = setInterval(applyGlitchEffect, 200)
    return () => clearInterval(intervalId)
  }, [showLogo])
  
  // Terminal-Text-Glitch-Effekt
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (bootText.length > 0 && Math.random() > 0.9) {
        // Zufällig eine der Boot-Zeilen glitchen
        setTextGlitch(Math.floor(Math.random() * bootText.length))
        
        // Glitch nach kurzer Zeit zurücksetzen
        setTimeout(() => {
          setTextGlitch(-1)
        }, 100)
      }
    }, 1000)
    
    return () => clearInterval(glitchInterval)
  }, [bootText])
  
  // Boot-Sequenz
  useEffect(() => {
    // Deutsche Boot-Nachrichten
    const bootMessages = [
      "System wird initialisiert...",
      "POST-Test läuft...",
      "Speicherprüfung: OK",
      "CPU: AMD Ryzen 64-bit",
      "RAM: 16GB DDR4 erkannt",
      "GPU: CRT-3090 Ultra erkannt",
      "Lade Kernel...",
      "Initialisiere Grafiksubsystem...",
      "Lade Pixel-Shader...",
      "Verbindung wird hergestellt...",
      "Lade Benutzeroberfläche...",
      "GAMECHANGER OS v2.5"
    ]
    
    let currentMessage = 0
    
    const interval = setInterval(() => {
      // Gelegentlich Terminal-Rauschen hinzufügen
      if (Math.random() > 0.85 && currentMessage > 0) {
        const noise = generateRandomTerminalNoise()
        setBootText(prev => [...prev, noise])
        // Mit leichter Verzögerung zur nächsten Nachricht übergehen
        setTimeout(() => {
          if (currentMessage < bootMessages.length) {
            setBootText(prev => [...prev, bootMessages[currentMessage]])
            currentMessage++
            setProgress(currentMessage / bootMessages.length * 100)
            
            // Logo gegen Ende anzeigen
            if (currentMessage === bootMessages.length - 2) {
              setShowLogo(true)
            }
          } else {
            clearInterval(interval)
            setTimeout(() => {
              onComplete()
            }, 1500)
          }
        }, 200)
      } else if (currentMessage < bootMessages.length) {
        setBootText(prev => [...prev, bootMessages[currentMessage]])
        currentMessage++
        setProgress(currentMessage / bootMessages.length * 100)
        
        // Logo gegen Ende anzeigen
        if (currentMessage === bootMessages.length - 2) {
          setShowLogo(true)
        }
      } else {
        clearInterval(interval)
        setTimeout(() => {
          onComplete()
        }, 1500)
      }
    }, 400)
    
    return () => clearInterval(interval)
  }, [onComplete])
  
  // Zufälliges Terminal-Rauschen generieren
  const generateRandomTerminalNoise = () => {
    const length = 5 + Math.floor(Math.random() * 30)
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=[]{}|;:,./<>?"
    let result = ''
    
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    
    return result
  }
  
  // Zeilenfarbe bestimmen (rot oder blau)
  const getLineColor = (index: number) => {
    // Farben abwechseln
    if (index % 3 === 0) return "text-[#ff0057]" 
    if (index % 3 === 1) return "text-[#2196f3]"
    return "text-white"
  }
  
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[#0a0a14] font-terminal p-8 relative overflow-hidden">
      {/* CRT-Effekte */}
      <div className="scanlines opacity-50"></div>
      <div className="vignette opacity-60"></div>
      <div className="pixel-grid"></div>
      <div className="scan-line"></div>
      
      <div className="w-full max-w-3xl z-10">
        {/* Titelzeile im Balatro-Stil */}
        <div className="mb-8 text-2xl font-bold">
          <span className="crt-text-red mr-2">SYSTEM</span>
          <span className="crt-text-blue">START</span>
        </div>
        
        {/* Terminal-Ausgabe */}
        <div className="mb-8 font-terminal bg-[#0a0a14]/80 p-4 border border-[#2196f3]/30">
          {bootText.map((text, i) => (
            <div 
              key={i} 
              className={`mb-2 ${getLineColor(i)} ${i === textGlitch ? 'opacity-50' : ''}`} 
              style={{
                transform: i === textGlitch ? `translateX(${(Math.random() * 6) - 3}px)` : 'none',
                transition: 'none', // Für den Balatro-Stil direkte Positionsänderungen ohne Animation
                textShadow: i === bootText.length - 1 ? '0 0 4px currentColor' : 'none' // Letzte Zeile hervorheben
              }}
            >
              <span className="mr-2 opacity-80">&gt;</span>
              {i === textGlitch ? generateRandomTerminalNoise() : text}
              {/* Blinkender Cursor an der letzten Zeile */}
              {i === bootText.length - 1 && (
                <span className="inline-block w-2 h-4 bg-[#ff0057] ml-1 animate-pulse"></span>
              )}
            </div>
          ))}
        </div>
        
        {/* Fortschrittsbalken im Balatro-Stil */}
        <div className="w-full h-4 bg-[#0a0a14] rounded-none overflow-hidden mb-2 border border-[#2196f3]/30 relative">
          <div 
            className="h-full bg-[#ff0057]"
            style={{ 
              width: `${progress}%`,
              transition: 'width 0.4s steps(10)'  // Schrittweise Animation für Pixel-Look
            }}
          />
          
          {/* Pixel-Overlay für Fortschrittsbalken */}
          <div className="absolute inset-0 pointer-events-none" 
               style={{ 
                 backgroundImage: 'linear-gradient(to right, transparent 50%, rgba(255,255,255,0.05) 50%)',
                 backgroundSize: '4px 100%'
               }}>
          </div>
        </div>
        
        <div className="text-right text-sm flex justify-between">
          <span className="text-[#2196f3]">LADEN...</span>
          <span className="text-[#ff0057]">{progress.toFixed(0)}%</span>
        </div>
        
        {showLogo && (
          <div className="mt-8 text-center">
            <div 
              ref={logoRef}
              className="inline-block arcade-text text-3xl md:text-5xl text-center"
              style={{
                background: 'linear-gradient(90deg, #ff0057, #2196f3)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 8px rgba(255, 0, 87, 0.4), 0 0 16px rgba(33, 150, 243, 0.2)'
              }}
            >
              GAMECHANGER
            </div>
            
            <div className="mt-4 text-sm crt-text opacity-70">
              DRÜCKE EINE TASTE ZUM FORTFAHREN
            </div>
          </div>
        )}
      </div>
      
      {/* Pixel-Partikel - subtiler im Balatro-Stil */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={i}
          className="absolute"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            width: `${3 + Math.random() * 3}px`,
            height: `${3 + Math.random() * 3}px`,
            backgroundColor: i % 2 === 0 ? '#ff0057' : '#2196f3',
            opacity: 0.1 + Math.random() * 0.15,
            boxShadow: '0 0 4px currentColor',
            transform: 'translate(-50%, -50%)'
          }}
        />
      ))}
      
      {/* Dunkle Ecken für Balatro-Look */}
      <div className="absolute inset-0 pointer-events-none" 
           style={{
             background: 'radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)'
           }}>
      </div>
    </div>
  )
}

export default BootSequence