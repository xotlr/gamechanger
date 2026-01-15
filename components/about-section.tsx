"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronDownIcon, ChevronUpIcon, UserIcon, HeartIcon, ClockIcon, GamepadIcon, ThunderIcon } from "raster-react"
import { useWebAudio } from "@/lib/audio-manager"
import { Panel } from "./ui/panel"
import { CardCorners } from "./ui/card-corners"

const FEATURES = [
  {
    icon: UserIcon,
    title: "Soziale Integration",
    text: "Wir schaffen eine inklusive und diverse eSports-Community für alle Interessierten, unabhängig von Alter, Erfahrung oder Fähigkeiten.",
    color: "#ff0057"
  },
  {
    icon: ThunderIcon,
    title: "Talente fördern",
    text: "Wir bieten jungen Menschen Zugang zu Technologien und Bildungsressourcen im Gaming-Sektor für ihre persönliche und berufliche Entwicklung.",
    color: "#2196f3"
  },
  {
    icon: HeartIcon,
    title: "Gemeinschaft stärken",
    text: "Wir organisieren Turniere und Wettkämpfe für gesellige Zusammenkünfte unter Gleichgesinnten und fördern so soziale Bindungen.",
    color: "#ff0057"
  }
]

const INFO = [
  { icon: ClockIcon, label: "Gegründet", value: "April 2024", color: "#2196f3" },
  { icon: GamepadIcon, label: "Aktivitäten", value: "Turniere, Workshops, LAN-Parties", color: "#ff0057" },
  { icon: ThunderIcon, label: "Fokus", value: "eSport, Gaming, Gemeinschaft", color: "#2196f3" }
]

const FAQ = [
  { q: "Wie kann ich Mitglied werden?", a: "Fülle das Anmeldeformular im Bereich 'Mitglied werden' aus oder kontaktiere uns per E-Mail unter verein.gamechanger@gmail.com." },
  { q: "Gibt es eine Altersgrenze für die Teilnahme?", a: "Nein. Wir heißen Gamer aller Altersstufen willkommen. Für Minderjährige ist die Zustimmung eines Erziehungsberechtigten erforderlich." },
  { q: "Welche Spiele werden hauptsächlich gespielt?", a: "Von kompetitiven eSport-Titeln bis hin zu kooperativen und Retro-Spielen. Die Auswahl richtet sich nach den Interessen unserer Mitglieder." },
  { q: "Muss ich eigene Hardware mitbringen?", a: "Bei den meisten Veranstaltungen ist es empfehlenswert. Bei bestimmten Events stellen wir auch Geräte zur Verfügung." }
]


export default function AboutSection() {
  const [hovered, setHovered] = useState<number | null>(null)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [glitch, setGlitch] = useState(false)
  const { playHover, playSelect, playGlitch } = useWebAudio()

  useEffect(() => {
    const id = setInterval(() => {
      if (Math.random() > 0.9) {
        setGlitch(true)
        playGlitch()
        setTimeout(() => setGlitch(false), 150)
      }
    }, 5000)
    return () => clearInterval(id)
  }, [playGlitch])

  return (
    <section className="py-20 relative" id="about">
      {glitch && <div className="scan-line" />}

      <div className="max-w-5xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6 glitch-text" data-text="ÜBER UNS">
            ÜBER UNS
          </h2>

          <Panel className="p-5">
            <p className="text-lg max-w-3xl mx-auto mb-3">
              Der gemeinnützige Verein &ldquo;GAME:changer&rdquo;, entstand erst im April 2024 durch die beiden Vereinsgründer David
              Brandhuber und Michael Wojnar. Den Vereinsvorstand freut es besonders, dass bereits viele Mitglieder seit
              Gründung rekrutiert werden konnten und allgemein viel Zuspruch und Begeisterung für diesen jungen Verein
              gewonnen werden konnte.
            </p>

            <div className="flex flex-wrap justify-center gap-6 mt-6">
              {INFO.map((item, i) => (
                <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-[#090a12] border border-[#2196f3]/20">
                  <item.icon size={20} strokeWidth={1} radius={1} style={{ color: item.color }} />
                  <div>
                    <div className="text-xs text-gray-400">{item.label}</div>
                    <div className="text-sm font-bold" style={{ color: item.color }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              viewport={{ once: true }}
              className={`bg-[#0a0a14] border-2 transition-all relative p-5 ${hovered === i ? `border-[${f.color}]` : 'border-[#2196f3]/20'}`}
              onMouseEnter={() => { setHovered(i); playHover() }}
              onMouseLeave={() => setHovered(null)}
            >
              <motion.div
                className="mb-4"
                animate={hovered === i && glitch ? { x: [-2, 2, 0] } : {}}
                style={{ color: f.color }}
              >
                <f.icon size={32} strokeWidth={1} radius={1} style={{ color: f.color }} />
              </motion.div>
              <h3 className="text-xl font-bold mb-3" style={{ color: f.color }}>{f.title}</h3>
              <p className="text-gray-300">{f.text}</p>
              {hovered === i && <CardCorners color={f.color} />}
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
          className="mb-16"
        >
          <Panel className="p-5">
            <p className="text-lg max-w-3xl mx-auto">
              Die GAME:changer widmen sich der Förderung des eSports in unserer Region. Der Vereinssitz ist in Pleissing
              und bezweckt gesellige Zusammenkünfte unter &ldquo;Gleichgesinnten&rdquo;. Weiters werden Turniere und Wettkämpfe
              ausgetragen - welche vorwiegend Online via Multiplayer-Modus oder im Old-School-Setting einer klassischen
              LAN-Party gespielt werden.
            </p>
          </Panel>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h3 className="text-2xl font-bold mb-6 text-center" style={{ textShadow: "0 0 8px rgba(33, 150, 243, 0.5)" }}>
            HÄUFIG GESTELLTE FRAGEN
          </h3>

          <div className="space-y-4">
            {FAQ.map((item, i) => (
              <div key={i} className={`bg-[#0a0a14] border transition-colors ${openFaq === i ? 'border-[#ff0057]' : 'border-[#2196f3]/20'}`}>
                <button
                  className="w-full px-5 py-3 text-left flex justify-between items-center"
                  onClick={() => { playSelect(); setOpenFaq(openFaq === i ? null : i) }}
                  onMouseEnter={() => playHover()}
                >
                  <span className={`font-bold ${openFaq === i ? 'text-[#ff0057]' : 'text-white'}`}>{item.q}</span>
                  {openFaq === i
                    ? <ChevronUpIcon size={16} strokeWidth={1} radius={1} style={{ color: "#ff0057" }} />
                    : <ChevronDownIcon size={16} strokeWidth={1} radius={1} style={{ color: "#2196f3" }} />
                  }
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 py-3 border-t border-[#2196f3]/20 text-gray-300">{item.a}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-[#ff0057]/30" />
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-[#2196f3]/30" />
      <div className="absolute top-1/2 left-3/4 w-2 h-2 bg-[#ff0057]/30" />
    </section>
  )
}
