"use client"

import { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useWebAudio } from "@/lib/audio-manager"
import { CardCorners } from "./ui/card-corners"
import { Panel } from "./ui/panel"

const TEAM = [
  { name: "David Brandhuber", role: "Vereinsgründer", focus: "Strategie & Events", bio: "Gründer mit Schwerpunkt auf Community-Aufbau und strategische Planung.", initials: "DB" },
  { name: "Michael Wojnar", role: "Vereinsgründer", focus: "Organisation & Finanzen", bio: "Mitbegründer mit besonderem Talent für Organisation und finanzielle Planung.", initials: "MW" },
  { name: "Iris Brandhuber", role: "Design & Illustration", focus: "Kreatives Design", bio: "Verantwortlich für die künstlerische Gestaltung und visuelle Identität.", initials: "IB" },
  { name: "Katrin Brandhuber", role: "Social Media", focus: "Community Management", bio: "Expertin für Social-Media-Strategien und Online-Community-Aufbau.", initials: "KB" },
  { name: "Ronald Bauer", role: "Webentwicklung", focus: "Technische Umsetzung", bio: "Technischer Experte für Webentwicklung und digitale Implementierung.", initials: "RB" },
]

const GRID_COLS = 3

export default function TeamSection() {
  const [selected, setSelected] = useState<number | null>(null)
  const [hover, setHover] = useState<number>(0)
  const [ready, setReady] = useState(false)
  const { playHover, playConfirm } = useWebAudio()

  const select = useCallback((i: number) => {
    setSelected(i)
    setReady(true)
    playConfirm()
    setTimeout(() => setReady(false), 800)
  }, [playConfirm])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selected !== null) {
        if (e.key === 'Escape') setSelected(null)
        return
      }

      const isNavKey = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Enter', ' '].includes(e.key)
      if (!isNavKey) return

      e.preventDefault()

      const row = Math.floor(hover / GRID_COLS)
      const col = hover % GRID_COLS

      let next = hover
      if (e.key === 'ArrowRight') next = Math.min(TEAM.length - 1, hover + 1)
      else if (e.key === 'ArrowLeft') next = Math.max(0, hover - 1)
      else if (e.key === 'ArrowDown') {
        const newRow = Math.min(Math.ceil(TEAM.length / GRID_COLS) - 1, row + 1)
        next = Math.min(TEAM.length - 1, newRow * GRID_COLS + col)
      }
      else if (e.key === 'ArrowUp') {
        const newRow = Math.max(0, row - 1)
        next = newRow * GRID_COLS + col
      }
      else if (e.key === 'Enter' || e.key === ' ') {
        select(hover)
        return
      }

      if (next !== hover) {
        setHover(next)
        playHover()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [hover, selected, playHover, select])

  const member = selected !== null ? TEAM[selected] : null

  return (
    <section className="py-12 sm:py-20 relative" id="team">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-2xl sm:text-4xl font-bold mb-4 glitch-text" data-text="CHARAKTER AUSWAHL">
            CHARAKTER AUSWAHL
          </h2>
          <p className="text-xs sm:text-sm crt-text-blue">
            <span className="hidden sm:inline">← → ↑ ↓ NAVIGIEREN · ENTER AUSWÄHLEN</span>
            <span className="sm:hidden">TIPPE ZUM AUSWÄHLEN</span>
          </p>
        </motion.div>

        <div className="relative">
          {/* P1 Indicator */}
          <div className="absolute -top-2 left-4 z-20">
            <div className="bg-[#ff0057] px-3 py-1 text-xs font-bold text-white border-2 border-white">
              1P
            </div>
          </div>

          {/* Character Grid */}
          <Panel className="p-4 sm:p-6" variant="solid" borderColor="blue">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
              {TEAM.map((m, i) => (
                <motion.button
                  key={i}
                  onClick={() => select(i)}
                  onMouseEnter={() => { setHover(i); playHover() }}
                  className={`relative aspect-square bg-[#090a12] border-2 transition-colors ${
                    hover === i ? 'border-[#ff0057]' : 'border-[#2196f3]/30'
                  } ${selected === i ? 'border-[#2196f3]' : ''}`}
                  animate={{
                    boxShadow: hover === i
                      ? '0 0 20px rgba(255,0,87,0.5), inset 0 0 30px rgba(255,0,87,0.1)'
                      : selected === i
                        ? '0 0 25px rgba(33,150,243,0.6)'
                        : 'none'
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Character Portrait */}
                  <div className="absolute inset-2 flex flex-col items-center justify-center">
                    <span
                      className={`text-4xl sm:text-5xl font-bold transition-colors ${
                        hover === i ? 'text-[#ff0057]' : selected === i ? 'text-[#2196f3]' : 'text-white/30'
                      }`}
                      style={{ textShadow: hover === i ? '0 0 20px rgba(255,0,87,0.8)' : 'none' }}
                    >
                      {m.initials}
                    </span>
                  </div>

                  {/* Name Bar */}
                  <div className={`absolute bottom-0 left-0 right-0 py-1.5 px-2 text-center transition-colors ${
                    hover === i ? 'bg-[#ff0057]' : selected === i ? 'bg-[#2196f3]' : 'bg-[#0a0a14]'
                  }`}>
                    <span className="text-[10px] sm:text-xs font-bold text-white truncate block">
                      {m.name.split(' ')[0].toUpperCase()}
                    </span>
                  </div>

                  {/* Hover Corners */}
                  {hover === i && <CardCorners color="#ff0057" />}
                  {selected === i && <CardCorners color="#2196f3" />}

                  {/* Selected Indicator */}
                  {selected === i && (
                    <motion.div
                      className="absolute -top-1 -right-1 bg-[#2196f3] px-1.5 py-0.5 text-[8px] font-bold text-white"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      ✓
                    </motion.div>
                  )}
                </motion.button>
              ))}

              {/* VS Slot */}
              <div className="relative aspect-square bg-[#090a12] border-2 border-[#2196f3]/10 flex items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-[#2196f3]/20">VS</span>
              </div>
            </div>
          </Panel>

          {/* Ready Banner */}
          <AnimatePresence>
            {ready && (
              <motion.div
                className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none"
                initial={{ opacity: 0, scale: 1.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                <div className="bg-[#ff0057] px-8 py-3 border-4 border-white">
                  <span className="text-2xl sm:text-4xl font-bold text-white" style={{ textShadow: '2px 2px 0 #000' }}>
                    READY!
                  </span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Character Info Panel */}
        <AnimatePresence>
          {member && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6"
            >
              <Panel className="p-4 sm:p-6" borderColor="red">
                <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                  {/* Portrait */}
                  <div className="sm:w-32 flex-shrink-0">
                    <div className="aspect-square bg-gradient-to-br from-[#141428] to-[#111138] border-2 border-[#2196f3] flex items-center justify-center relative">
                      <span className="text-5xl font-bold text-[#2196f3]" style={{ textShadow: '0 0 20px rgba(33,150,243,0.5)' }}>
                        {member.initials}
                      </span>
                      <CardCorners color="#ff0057" size="sm" />
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-bold text-[#ff0057]">{member.name}</h3>
                        <p className="text-sm text-[#2196f3]">{member.role}</p>
                      </div>
                      <button
                        onClick={() => setSelected(null)}
                        className="text-[#ff0057] hover:text-white px-2 py-1 border border-[#ff0057]/50 text-xs"
                        onMouseEnter={() => playHover()}
                      >
                        ESC
                      </button>
                    </div>

                    <div className="bg-[#090a12] p-3 border border-[#2196f3]/30 mb-3">
                      <div className="text-xs text-[#2196f3] mb-1">SPEZIALISIERUNG</div>
                      <div className="text-sm text-white">{member.focus}</div>
                    </div>

                    <p className="text-sm text-gray-300">{member.bio}</p>
                  </div>
                </div>
              </Panel>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Prompt */}
        {!selected && (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="text-center mt-6"
          >
            <span className="text-sm text-[#ff0057] font-bold">
              WÄHLE DEINEN CHARAKTER
            </span>
          </motion.div>
        )}
      </div>
    </section>
  )
}
