"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDown, ChevronUp, Trophy, Users, Heart, Clock, Gamepad2, Zap } from "lucide-react"

// Audio-Hook für verschiedene Formate
const useAudio = (path: unknown) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    try {
      const audioTest = new Audio();
      
      if (audioTest.canPlayType('audio/ogg')) {
        setAudio(new Audio(`${path.replace('.wav', '.ogg')}`));
      } 
      else if (audioTest.canPlayType('audio/mpeg')) {
        setAudio(new Audio(`${path.replace('.wav', '.mp3')}`));
      }
      else {
        setAudio(new Audio(path));
      }
    } catch (e) {
      console.error("Audio konnte nicht geladen werden:", e);
    }
  }, [path]);
  
  const play = () => {
    if (audio) {
      audio.volume = 0.2;
      audio.currentTime = 0;
      audio.play().catch(e => console.log("Audio-Wiedergabe nicht möglich:", e));
    }
  }
  
  return { play };
}

// Features mit Icon, Titel und Beschreibung
const features = [
  {
    icon: <Users className="h-10 w-10" />,
    title: "Soziale Integration",
    description: "Wir schaffen eine inklusive und diverse eSports-Community für alle Interessierten, unabhängig von Alter, Erfahrung oder Fähigkeiten.",
    color: "#ff0057"
  },
  {
    icon: <Trophy className="h-10 w-10" />,
    title: "Talente fördern",
    description: "Wir bieten jungen Menschen Zugang zu Technologien und Bildungsressourcen im Gaming-Sektor für ihre persönliche und berufliche Entwicklung.",
    color: "#2196f3"
  },
  {
    icon: <Heart className="h-10 w-10" />,
    title: "Gemeinschaft stärken",
    description: "Wir organisieren Turniere und Wettkämpfe für gesellige Zusammenkünfte unter Gleichgesinnten und fördern so soziale Bindungen.",
    color: "#ff0057"
  }
]

// Zusätzliche Vereinsdetails
const additionalInfo = [
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Gegründet",
    detail: "April 2024",
    color: "#2196f3"
  },
  {
    icon: <Gamepad2 className="h-6 w-6" />,
    title: "Aktivitäten",
    detail: "Turniere, Workshops, LAN-Parties",
    color: "#ff0057"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Fokus",
    detail: "eSport, Gaming, Gemeinschaft",
    color: "#2196f3"
  }
]

// FAQ-Einträge
const faqItems = [
  {
    question: "Wie kann ich Mitglied werden?",
    answer: "Um Mitglied zu werden, fülle einfach das Anmeldeformular im Bereich 'Mitglied werden' aus oder kontaktiere uns direkt per E-Mail unter verein.gamechanger@gmail.com."
  },
  {
    question: "Gibt es eine Altersgrenze für die Teilnahme?",
    answer: "Es gibt keine strikte Altersgrenze. Wir heißen Gamer aller Altersstufen willkommen, wobei für Minderjährige die Zustimmung eines Erziehungsberechtigten erforderlich ist."
  },
  {
    question: "Welche Spiele werden hauptsächlich gespielt?",
    answer: "Wir decken eine breite Palette von Spielen ab, von kompetitiven eSport-Titeln bis hin zu kooperativen und Retro-Spielen. Die Auswahl richtet sich nach den Interessen unserer Mitglieder."
  },
  {
    question: "Muss ich eigene Hardware mitbringen?",
    answer: "Bei den meisten Veranstaltungen ist es empfehlenswert, eigene Hardware mitzubringen. Bei bestimmten Events stellen wir jedoch auch Geräte zur Verfügung."
  }
]

export default function AboutSection() {
  const [activeFeature, setActiveFeature] = useState<number | null>(null)
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null)
  const [glitchActive, setGlitchActive] = useState(false)
  const [showSecret, setShowSecret] = useState(false)
  const secretCodeRef = useRef<string[]>([])
  const secretCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a']
  
  // Sound-Hooks
  const hoverSound = useAudio('/sounds/hover.wav')
  const selectSound = useAudio('/sounds/select.wav')
  const glitchSound = useAudio('/sounds/glitch.wav')
  const secretSound = useAudio('/sounds/secret.wav')

  // Gelegentlicher Glitch-Effekt
  useEffect(() => {
    const glitchInterval = setInterval(() => {
      if (Math.random() > 0.9) { // 10% Chance für einen Glitch
        setGlitchActive(true)
        glitchSound.play()
        
        setTimeout(() => {
          setGlitchActive(false)
        }, 150)
      }
    }, 5000)
    
    return () => clearInterval(glitchInterval)
  }, [])

  // Konami-Code-Detektor
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Aktuellen Tastendruck zur Sequenz hinzufügen
      secretCodeRef.current = [...secretCodeRef.current, e.key]
      
      // Sequenz auf die Länge des Secret Codes begrenzen
      if (secretCodeRef.current.length > secretCode.length) {
        secretCodeRef.current = secretCodeRef.current.slice(-secretCode.length)
      }
      
      // Prüfen, ob die Sequenz mit dem Secret Code übereinstimmt
      const isCodeCorrect = secretCodeRef.current.every((key, index) => key === secretCode[index])
      
      if (isCodeCorrect && secretCodeRef.current.length === secretCode.length) {
        if (!showSecret) {
          secretSound.play()
          setShowSecret(true)
        }
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [showSecret, secretSound])

  return (
    <section className="py-20 relative" id="about">
      {/* Gelegentlicher Glitch-Effekt */}
      {glitchActive && <div className="scan-line"></div>}
      
      <div className="max-w-5xl mx-auto px-4">
        {/* Sektionsüberschrift */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 
            className={`text-3xl md:text-4xl font-bold mb-6 ${glitchActive ? 'opacity-90' : ''}`}
            style={{
              textShadow: glitchActive 
                ? "2px 0 #ff0057, -2px 0 #2196f3"
                : "0 0 10px rgba(255, 0, 87, 0.6), 0 0 20px rgba(33, 150, 243, 0.3)"
            }}
          >
            ÜBER UNS
          </h2>
          
          {/* Hauptbeschreibungsbox im Balatro-Stil */}
          <div className="bg-[#0a0a14] p-5 border border-[#2196f3]/30 relative">
            <p className="text-lg max-w-3xl mx-auto mb-3">
              Der gemeinnützige Verein "GAME:changer", entstand erst im April 2024 durch die beiden Vereinsgründer David
              Brandhuber und Michael Wojnar. Den Vereinsvorstand freut es besonders, dass bereits viele Mitglieder seit
              Gründung rekrutiert werden konnten und allgemein viel Zuspruch und Begeisterung für diesen jungen Verein
              gewonnen werden konnte.
            </p>
            
            {/* Vereinsinfos im Balatro-Stil */}
            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {additionalInfo.map((info, index) => (
                <div key={index} className="flex items-center gap-2 px-3 py-1.5 bg-[#090a12] border border-[#2196f3]/20">
                  <div style={{ color: info.color }}>
                    {info.icon}
                  </div>
                  <div>
                    <div className="text-xs text-gray-400">{info.title}</div>
                    <div className="text-sm font-bold" style={{ color: info.color }}>{info.detail}</div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Balatro-Stil Ecken */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff0057]"></div>
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0057]"></div>
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff0057]"></div>
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff0057]"></div>
          </div>
          
          {/* Versteckter Konami-Code Hinweis */}
          <motion.p 
            className="text-xs mt-2 text-[#2196f3]/50 cursor-help"
            whileHover={{ opacity: 1 }}
            title="Geheimcode entdecken"
          >
            ↑↑↓↓←→←→BA
          </motion.p>
        </motion.div>
        
        {/* Feature-Karten im Balatro-Stil */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className={`bg-[#0a0a14] border-2 transition-all ${
                activeFeature === index 
                  ? 'border-[' + feature.color + ']' 
                  : 'border-[#2196f3]/20'
              } relative p-5`}
              onMouseEnter={() => {
                setActiveFeature(index)
                hoverSound.play()
              }}
              onMouseLeave={() => setActiveFeature(null)}
            >
              {/* Icon mit Glitch-Effekt */}
              <motion.div 
                className="mb-4 relative"
                animate={
                  activeFeature === index && glitchActive 
                    ? { x: [-2, 2, 0] } 
                    : {}
                }
                transition={{ duration: 0.2 }}
                style={{ color: feature.color }}
              >
                {feature.icon}
              </motion.div>
              
              <h3 className="text-xl font-bold mb-3" style={{ color: feature.color }}>
                {feature.title}
              </h3>
              
              <p className="text-gray-300">
                {feature.description}
              </p>
              
              {/* Balatro-Stil Ecken - nur sichtbar beim Hover */}
              {activeFeature === index && (
                <>
                  <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2" style={{ borderColor: feature.color }}></div>
                  <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2" style={{ borderColor: feature.color }}></div>
                  <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2" style={{ borderColor: feature.color }}></div>
                  <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2" style={{ borderColor: feature.color }}></div>
                </>
              )}
            </motion.div>
          ))}
        </div>
        
        {/* Untere Beschreibungsbox */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="bg-[#0a0a14] p-5 border border-[#2196f3]/30 relative mb-16"
        >
          <p className="text-lg max-w-3xl mx-auto">
            Die GAME:changer widmen sich der Förderung des eSports in unserer Region. Der Vereinssitz ist in Pleissing
            und bezweckt gesellige Zusammenkünfte unter "Gleichgesinnten". Weiters werden Turniere und Wettkämpfe
            ausgetragen - welche vorwiegend Online via Multiplayer-Modus oder im Old-School-Setting einer klassischen
            LAN-Party gespielt werden.
          </p>
          
          {/* Balatro-Stil Ecken */}
          <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff0057]"></div>
          <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0057]"></div>
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff0057]"></div>
          <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff0057]"></div>
        </motion.div>
        
        {/* FAQ-Bereich */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-center" style={{
            textShadow: "0 0 8px rgba(33, 150, 243, 0.5)"
          }}>
            HÄUFIG GESTELLTE FRAGEN
          </h3>
          
          <div className="space-y-4">
            {faqItems.map((item, index) => (
              <div 
                key={index} 
                className={`bg-[#0a0a14] border transition-colors ${
                  expandedFaq === index ? 'border-[#ff0057]' : 'border-[#2196f3]/20'
                }`}
              >
                <button
                  className="w-full px-5 py-3 text-left flex justify-between items-center"
                  onClick={() => {
                    selectSound.play()
                    setExpandedFaq(expandedFaq === index ? null : index)
                  }}
                  onMouseEnter={() => hoverSound.play()}
                >
                  <span className={`font-bold ${expandedFaq === index ? 'text-[#ff0057]' : 'text-white'}`}>
                    {item.question}
                  </span>
                  {expandedFaq === index ? (
                    <ChevronUp className="h-5 w-5 text-[#ff0057]" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-[#2196f3]" />
                  )}
                </button>
                
                <AnimatePresence>
                  {expandedFaq === index && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-3 border-t border-[#2196f3]/20 text-gray-300">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
        
        {/* Geheimer Bereich (via Konami-Code aktiviert) */}
        <AnimatePresence>
          {showSecret && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
              transition={{ type: 'spring', damping: 20 }}
              className="bg-[#0a0a14] border-2 border-[#ff0057] p-6 relative mt-8"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-[#ff0057]">
                  GEHEIMER BEREICH FREIGESCHALTET!
                </h3>
                <button 
                  onClick={() => setShowSecret(false)}
                  className="text-[#2196f3] hover:text-white px-2 py-1 border border-[#2196f3]/30"
                  onMouseEnter={() => hoverSound.play()}
                >
                  SCHLIESSEN
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-[#090a12] p-4 border border-[#2196f3]/30 relative">
                  <h4 className="text-lg font-bold text-[#2196f3] mb-2">Geheime Vereinsgeschichte</h4>
                  <p className="text-gray-300 mb-3">
                    Die wahre Geschichte unseres Vereins beginnt mit einem epischen 72-Stunden-Gaming-Marathon im Winter 2023. 
                    Was als freundschaftliches Treffen begann, entwickelte sich zu einem lokalen Gaming-Phänomen, das die Gründung 
                    von GAME:changer inspirierte.
                  </p>
                  
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff0057]"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff0057]"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff0057]"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff0057]"></div>
                </div>
                
                <div className="bg-[#090a12] p-4 border border-[#2196f3]/30 relative">
                  <h4 className="text-lg font-bold text-[#ff0057] mb-2">Exklusive Events</h4>
                  <ul className="space-y-2 text-gray-300">
                    <li className="flex items-center gap-2">
                      <span className="text-[#ff0057]">→</span> 
                      <span>Mitternachts-Arcade-Turniere (nur für Mitglieder)</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#2196f3]">→</span>
                      <span>Retro-Gaming-Meisterschaften</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="text-[#ff0057]">→</span>
                      <span>Geheime LAN-Partys an ungewöhnlichen Orten</span>
                    </li>
                  </ul>
                  
                  <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-[#ff0057]"></div>
                  <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#ff0057]"></div>
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#ff0057]"></div>
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-[#ff0057]"></div>
                </div>
              </div>
              
              <div className="mt-4 text-center">
                <p className="text-[#2196f3] mb-3">Nutze den Code "KONAMI2024" für einen speziellen Bonus bei deinem Beitritt!</p>
                <button 
                  className="bg-[#0f111a] border-2 border-[#ff0057] px-6 py-2 text-white hover:bg-[#ff0057]/10 transition-colors"
                  onClick={() => {
                    selectSound.play()
                    window.location.href = "#member"
                  }}
                  onMouseEnter={() => hoverSound.play()}
                >
                  JETZT BEITRETEN
                </button>
              </div>
              
              {/* Balatro-Stil Ecken - größer für besonderen Bereich */}
              <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-[#ff0057]"></div>
              <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-[#ff0057]"></div>
              <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-[#ff0057]"></div>
              <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-[#ff0057]"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Statische Partikel für minimale Animation */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#ff0057]/30 rounded-none"></div>
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-[#2196f3]/30 rounded-none"></div>
      <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-[#ff0057]/30 rounded-none"></div>
    </section>
  )
}