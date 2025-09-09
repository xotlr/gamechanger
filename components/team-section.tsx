"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWebAudio } from "@/lib/audio-manager"

// Teammitglieder-Daten
const teamMembers = [
  {
    id: 1,
    name: "David Brandhuber",
    role: "Vereinsgründer",
    spezialität: "Strategie & Event-Management",
    power: 85,
    geschwindigkeit: 70,
    technik: 90,
    image: "/images/team/david.jpg", // Platzhalter - Pfad anpassen
    beschreibung: "Gründer und Stratege des Vereins mit Schwerpunkt auf Community-Aufbau und strategische Planung."
  },
  {
    id: 2,
    name: "Michael Wojnar",
    role: "Vereinsgründer",
    spezialität: "Organisation & Finanzen",
    power: 75,
    geschwindigkeit: 80,
    technik: 85,
    image: "/images/team/michael.jpg", // Platzhalter - Pfad anpassen
    beschreibung: "Mitbegründer mit besonderem Talent für Organisation und finanzielle Planung."
  },
  {
    id: 3,
    name: "Iris Brandhuber",
    role: "Design & Illustration",
    spezialität: "Kreatives Design",
    power: 70,
    geschwindigkeit: 90,
    technik: 85,
    image: "/images/team/iris.jpg", // Platzhalter - Pfad anpassen
    beschreibung: "Verantwortlich für die künstlerische Gestaltung und visuelle Identität des Vereins."
  },
  {
    id: 4,
    name: "Katrin Brandhuber",
    role: "Social Media",
    spezialität: "Community Management",
    power: 75,
    geschwindigkeit: 95,
    technik: 70,
    image: "/images/team/katrin.jpg", // Platzhalter - Pfad anpassen
    beschreibung: "Expertin für Social-Media-Strategien und Online-Community-Aufbau."
  },
  {
    id: 5,
    name: "Ronald Bauer",
    role: "Webentwicklung",
    spezialität: "Technische Umsetzung",
    power: 65,
    geschwindigkeit: 85,
    technik: 95,
    image: "/images/team/ronald.jpg", // Platzhalter - Pfad anpassen
    beschreibung: "Technischer Experte für Webentwicklung und digitale Implementierung."
  },
]


export default function TeamSection() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null)
  const [highlightedMember, setHighlightedMember] = useState<number | null>(null)
  const [showDetails, setShowDetails] = useState(false)
  const [glitchActive, setGlitchActive] = useState(false)
  const selectorRef = useRef<HTMLDivElement>(null)
  
  // Web Audio hooks
  const { playHover, playConfirm } = useWebAudio()

  // Teammitglied auswählen - define before useEffect that uses it
  const selectMember = useCallback((index: number) => {
    setSelectedMember(index)
    setShowDetails(true)
    playConfirm();
  }, [playConfirm])

  // Gelegentlicher Glitch-Effekt
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% Chance für einen Glitch
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 150);
      }
    }, 4000);
    
    return () => clearInterval(glitchInterval);
  }, []);

  // Effekt für Tastatursteuerung
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!showDetails) {
        // Navigationspfeile
        switch (e.key) {
          case 'ArrowRight':
            setHighlightedMember(prev => {
              const newIndex = prev === null ? 0 : Math.min((prev + 1), teamMembers.length - 1)
              playHover();
              return newIndex
            })
            break
          case 'ArrowLeft':
            setHighlightedMember(prev => {
              const newIndex = prev === null ? 0 : Math.max((prev - 1), 0)
              playHover();
              return newIndex
            })
            break
          case 'ArrowUp':
            setHighlightedMember(prev => {
              const newIndex = prev === null ? 0 : Math.max((prev - 3), 0)
              playHover();
              return newIndex
            })
            break
          case 'ArrowDown':
            setHighlightedMember(prev => {
              const newIndex = prev === null ? 0 : Math.min((prev + 3), teamMembers.length - 1)
              playHover();
              return newIndex
            })
            break
          case 'Enter':
          case ' ':
            if (highlightedMember !== null) {
              selectMember(highlightedMember)
            }
            break
          default:
            break
        }
      } else if (e.key === 'Escape') {
        setShowDetails(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [highlightedMember, showDetails, playHover, selectMember])

  // Scrollt zum ausgewählten Mitglied
  useEffect(() => {
    if (highlightedMember !== null && selectorRef.current) {
      const container = selectorRef.current
      const element = container.children[highlightedMember] as HTMLElement
      
      if (element) {
        // Berechne die Position für zentriertes Scrollen
        const containerWidth = container.offsetWidth
        const elementWidth = element.offsetWidth
        const elementLeft = element.offsetLeft
        
        container.scrollLeft = elementLeft - (containerWidth / 2) + (elementWidth / 2)
      }
    }
  }, [highlightedMember])


  return (
    <section className="py-12 sm:py-16 md:py-20 relative" id="team">
      {/* CRT-Scan-Line-Effekt */}
      {glitchActive && <div className="scan-line"></div>}
      
      <div className="max-w-6xl mx-auto px-3 sm:px-4">
        {/* Abschnitts-Titel mit gelegentlichem Glitch */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-14 md:mb-16"
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 glitch-text" data-text="CHARAKTERAUSWAHL">
            CHARAKTERAUSWAHL
          </h2>
          <div className="max-w-3xl mx-auto bg-[#0a0a14] p-3 sm:p-4 border border-[#2196f3]/30 relative">
            <p className="text-base sm:text-lg crt-text">
              Wähle ein Teammitglied, um mehr über seine Fähigkeiten und Spezialitäten zu erfahren. Jedes Mitglied bringt einzigartige Talente in unser eSport-Team ein.
            </p>
            
            {/* Balatro-Stil Ecken */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff0057]"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0057]"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff0057]"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff0057]"></div>
          </div>
          
          <p className="text-xs sm:text-sm mt-3 sm:mt-4 crt-text-blue">
            <span className="hidden sm:inline">STEUERUNG: ← → ↑ ↓ zum Navigieren, ENTER zum Auswählen</span>
            <span className="sm:hidden">Tippe zum Auswählen</span>
          </p>
        </motion.div>

        {/* Verbesserter Balatro-Stil Character-Auswahl-Bereich */}
        <div 
          className="relative mb-8 sm:mb-12 overflow-x-auto py-4 sm:py-6 px-2 sm:px-4 max-w-full hide-scrollbar bg-[#0a0a14]/80 border-t-2 border-b-2 border-[#ff0057]/50"
          ref={selectorRef}
        >
          <div className="flex space-x-3 sm:space-x-4 md:space-x-6 min-w-max">
            {teamMembers.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ scale: 0.95, opacity: 0.7 }}
                animate={{ 
                  scale: highlightedMember === index ? 1.05 : 1,
                  opacity: highlightedMember === index ? 1 : 0.8,
                  x: glitchActive && highlightedMember === index ? [-2, 2, 0] : 0
                }}
                transition={
                  glitchActive 
                    ? { x: { duration: 0.2 } }
                    : { type: 'spring', stiffness: 300, damping: 25 }
                }
                whileHover={{ scale: 1.05, opacity: 1 }}
                onClick={() => selectMember(index)}
                onMouseEnter={() => {
                  setHighlightedMember(index)
                  playHover();
                }}
                className="character-card cursor-pointer bg-[#0f111a] border-2 border-[#2196f3]/20 rounded-sm relative flex-shrink-0 w-44 h-72 sm:w-48 sm:h-80 md:w-52 md:h-80"
                style={{
                  boxShadow: highlightedMember === index 
                    ? '0 0 15px rgba(255, 0, 87, 0.5)' 
                    : 'none'
                }}
              >
                <div className="p-2 sm:p-3">
                  {/* Character Portrait mit Balatro-Stil */}
                  <div 
                    className="w-full h-28 sm:h-32 md:h-36 mb-2 sm:mb-3 overflow-hidden bg-[#090a12] relative border border-[#2196f3]/30"
                  >
                    {/* Platzhalter-Bild oder tatsächliches Bild */}
                    <div className="w-full h-full bg-gradient-to-br from-[#141428] to-[#111138] flex items-center justify-center">
                      {/* Icon/Initial wenn kein Bild vorhanden */}
                      <span className="text-3xl sm:text-4xl md:text-5xl crt-text-blue opacity-50 font-bold">
                        {member.name.charAt(0)}
                      </span>
                      
                      {/* Tatsächliches Bild (auskommentiert bis Bilder verfügbar) */}
                      {/* <Image 
                        src={member.image} 
                        alt={member.name} 
                        layout="fill" 
                        objectFit="cover"
                        className={highlightedMember === index ? 'opacity-100' : 'opacity-80'}
                      /> */}
                    </div>
                    
                    {/* Overlay für ausgewählten Charakter */}
                    {highlightedMember === index && (
                      <div className="absolute inset-0 bg-gradient-to-t from-[#ff0057]/20 to-transparent pointer-events-none"></div>
                    )}
                  </div>
                  
                  {/* Name und Rolle im Balatro-Stil */}
                  <div className="text-center mb-2">
                    <h3 className={`text-sm sm:text-base font-bold ${highlightedMember === index ? 'text-[#ff0057]' : 'text-white'} mb-0.5`}>
                      {member.name}
                    </h3>
                    <p className="text-xs text-[#2196f3]">{member.role}</p>
                  </div>
                  
                  {/* Stat-Balken im Balatro-Stil */}
                  <div className="mt-2 sm:mt-3 space-y-1 sm:space-y-2">
                    <div className="flex items-center text-xs">
                      <span className="w-16 sm:w-20 text-[#ff0057] mr-1">POWER</span>
                      <div className="h-2 bg-[#090a12] flex-grow rounded-none overflow-hidden border border-[#ff0057]/30">
                        <div 
                          className="h-full bg-[#ff0057]" 
                          style={{ 
                            width: `${member.power}%`,
                            boxShadow: '0 0 5px rgba(255, 0, 87, 0.5)'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="w-16 sm:w-20 text-[#2196f3] mr-1">SPEED</span>
                      <div className="h-2 bg-[#090a12] flex-grow rounded-none overflow-hidden border border-[#2196f3]/30">
                        <div 
                          className="h-full bg-[#2196f3]" 
                          style={{ 
                            width: `${member.geschwindigkeit}%`,
                            boxShadow: '0 0 5px rgba(33, 150, 243, 0.5)'
                          }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex items-center text-xs">
                      <span className="w-16 sm:w-20 text-[#f5c542] mr-1">TECHNIK</span>
                      <div className="h-2 bg-[#090a12] flex-grow rounded-none overflow-hidden border border-[#f5c542]/30">
                        <div 
                          className="h-full bg-[#f5c542]" 
                          style={{ 
                            width: `${member.technik}%`,
                            boxShadow: '0 0 5px rgba(245, 197, 66, 0.5)'
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Selektionsecken im Balatro-Stil */}
                {highlightedMember === index && (
                  <>
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff0057]"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0057]"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff0057]"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff0057]"></div>
                  </>
                )}
                
                {/* Statustext unter dem Charakter */}
                {highlightedMember === index && (
                  <div className="absolute -bottom-6 left-0 right-0 text-center">
                    <span className="text-xs text-[#ff0057]">AUSGEWÄHLT</span>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
          
          {/* Seitliche Schatten für besseres Scrollen */}
          <div className="absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#0a0a14] to-transparent pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[#0a0a14] to-transparent pointer-events-none"></div>
        </div>

        {/* Detailansicht im Balatro-Stil */}
        <AnimatePresence>
          {showDetails && selectedMember !== null && (
            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 25 }}
              className="bg-[#0a0a14] border-2 border-[#2196f3]/30 p-4 sm:p-6 relative mt-6 sm:mt-8"
            >
              <button 
                onClick={() => setShowDetails(false)} 
                className="absolute right-2 sm:right-4 top-2 sm:top-4 text-[#ff0057] hover:text-white px-3 py-2 sm:px-2 sm:py-1 border border-[#ff0057]/30 hover:border-[#ff0057] transition-colors text-sm flex items-center min-h-[44px] min-w-[44px] sm:min-h-auto sm:min-w-auto justify-center"
                onMouseEnter={() => playHover()}
              >
                <span className="mr-1 hidden sm:inline">ESC</span>
                <span className="sm:hidden">✕</span>
                <span className="hidden sm:inline">ZURÜCK</span>
              </button>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                <div className="md:col-span-1">
                  {/* Character Portrait im Balatro-Stil */}
                  <div 
                    className="bg-gradient-to-br from-[#141428] to-[#111138] w-full aspect-square flex items-center justify-center border-2 border-[#2196f3]/50 relative"
                  >
                    <span className="text-6xl sm:text-7xl md:text-8xl crt-text-blue opacity-70 font-bold">
                      {teamMembers[selectedMember].name.charAt(0)}
                    </span>
                    
                    {/* Ecken im Balatro-Stil */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff0057]"></div>
                    <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0057]"></div>
                    <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff0057]"></div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff0057]"></div>
                    
                    {/* Scanline-Effekt */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#ff0057]/10 to-transparent opacity-50 pointer-events-none"></div>
                  </div>
                  
                  <div className="mt-3 sm:mt-4 text-center">
                    <h3 className="text-xl sm:text-2xl text-[#ff0057] font-bold mb-2">
                      {teamMembers[selectedMember].name}
                    </h3>
                    <p className="text-base sm:text-lg text-white">{teamMembers[selectedMember].role}</p>
                    <p className="mt-2 text-sm text-[#2196f3]">
                      Spezialität: {teamMembers[selectedMember].spezialität}
                    </p>
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  {/* Charakterprofil im Balatro-Stil */}
                  <div className="mb-4 sm:mb-6 bg-[#090a12] p-3 sm:p-4 border border-[#2196f3]/30 relative">
                    <h4 className="text-lg sm:text-xl text-[#2196f3] mb-3 sm:mb-4 font-bold">CHARAKTERPROFIL</h4>
                    <p className="text-white">
                      {teamMembers[selectedMember].beschreibung}
                    </p>
                    
                    {/* Balatro-Stil Ecken */}
                    <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff0057]"></div>
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff0057]"></div>
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff0057]"></div>
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff0057]"></div>
                  </div>
                  
                  {/* Stats mit Animation */}
                  <div className="space-y-4 sm:space-y-6">
                    <div>
                      <h5 className="text-sm text-[#ff0057] mb-2 font-bold">POWER</h5>
                      <div className="h-4 bg-[#090a12] w-full rounded-none overflow-hidden relative border border-[#ff0057]/30">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${teamMembers[selectedMember].power}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                          className="h-full bg-gradient-to-r from-[#ff0057] to-[#ff2c74]"
                          style={{ boxShadow: '0 0 10px rgba(255, 0, 87, 0.5)' }}
                        />
                        <span className="absolute right-2 top-0 text-xs text-white">
                          {teamMembers[selectedMember].power}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm text-[#2196f3] mb-2 font-bold">GESCHWINDIGKEIT</h5>
                      <div className="h-4 bg-[#090a12] w-full rounded-none overflow-hidden relative border border-[#2196f3]/30">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${teamMembers[selectedMember].geschwindigkeit}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.2 }}
                          className="h-full bg-gradient-to-r from-[#2196f3] to-[#21bbf3]"
                          style={{ boxShadow: '0 0 10px rgba(33, 150, 243, 0.5)' }}
                        />
                        <span className="absolute right-2 top-0 text-xs text-white">
                          {teamMembers[selectedMember].geschwindigkeit}%
                        </span>
                      </div>
                    </div>
                    
                    <div>
                      <h5 className="text-sm text-[#f5c542] mb-2 font-bold">TECHNIK</h5>
                      <div className="h-4 bg-[#090a12] w-full rounded-none overflow-hidden relative border border-[#f5c542]/30">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${teamMembers[selectedMember].technik}%` }}
                          transition={{ duration: 1, ease: "easeOut", delay: 0.4 }}
                          className="h-full bg-gradient-to-r from-[#f5c542] to-[#f5d76e]"
                          style={{ boxShadow: '0 0 10px rgba(245, 197, 66, 0.5)' }}
                        />
                        <span className="absolute right-2 top-0 text-xs text-white">
                          {teamMembers[selectedMember].technik}%
                        </span>
                      </div>
                    </div>
                  </div>
                  
                  {/* Auswahl-Button im Balatro-Stil */}
                  <div className="mt-6 sm:mt-8 text-center">
                    <button 
                      onClick={() => setShowDetails(false)}
                      className="crt-button button-hover-effect px-6 sm:px-8 py-3 sm:py-3 bg-[#0f111a] border-2 border-[#ff0057] text-white relative overflow-hidden group min-h-[48px] w-full sm:w-auto"
                      onMouseEnter={() => playHover()}
                    >
                      <span className="relative z-10">CHARAKTER AUSWÄHLEN</span>
                      
                      {/* Hover-Effekt */}
                      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#ff005722] to-[#2196f322] transition-opacity duration-300"></span>
                      
                      {/* Ecken im Balatro-Stil */}
                      <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff0057]"></span>
                      <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff0057]"></span>
                      <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff0057]"></span>
                      <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff0057]"></span>
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Pixelrand im Balatro-Stil */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-[#ff0057]/50"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-[#ff0057]/50"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-[#ff0057]/50"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-[#ff0057]/50"></div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* "Drücke Start" Hinweis für mehr Balatro-Feeling */}
        {!showDetails && (
          <div className="text-center mt-4 sm:mt-6">
            <motion.p 
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="text-base sm:text-lg text-[#ff0057] font-bold tracking-wide"
            >
              <span className="hidden sm:inline">DRÜCKE EINE TASTE ZUR AUSWAHL</span>
              <span className="sm:hidden">TIPPE ZUR AUSWAHL</span>
            </motion.p>
          </div>
        )}
      </div>
      
      {/* CSS für versteckte Scrollbalken */}
      <style jsx global>{`
        /* Scrollbalken ausblenden aber Funktionalität beibehalten */
        .hide-scrollbar {
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none; /* IE and Edge */
        }
        .hide-scrollbar::-webkit-scrollbar {
          display: none; /* Chrome, Safari, Opera */
        }
      `}</style>
    </section>
  )
}