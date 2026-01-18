"use client"

import { useState, useEffect } from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import {
  HomeIcon, ActivityIcon, CalendarIcon, FoldersIcon,
  UserIcon, InfoIcon, VolumeIcon, VolumeXIcon, MenuIcon, XIcon
} from "raster-react"
import { CardCorners } from "@/components/ui/card-corners"
import { ScrollArea } from "@/components/ui/scroll-area"

interface NavbarProps {
  isMuted: boolean
  toggleSound: () => void
  reducedMotion: boolean
}

const NAV = [
  { label: "STARTSEITE", short: "START", href: "#", icon: HomeIcon },
  { label: "AKTIVITÄTEN", short: "AKTIV", href: "https://www.facebook.com/profile.php?id=61565503147498", ext: true, icon: ActivityIcon },
  { label: "VERANSTALTUNGEN", short: "EVENTS", href: "https://www.facebook.com/profile.php?id=61565503147498&sk=events", ext: true, icon: CalendarIcon },
  { label: "FOTOS", short: "FOTOS", href: "https://www.facebook.com/profile.php?id=61565503147498&sk=photos", ext: true, icon: FoldersIcon },
  { label: "MITGLIED WERDEN", short: "JOIN", href: "#member", icon: UserIcon },
  { label: "IMPRESSUM", short: "INFO", href: "#impressum", icon: InfoIcon },
]

function Logo({ reducedMotion }: { reducedMotion: boolean }) {
  const [flicker, setFlicker] = useState(-1)

  useEffect(() => {
    if (reducedMotion) return

    const id = setInterval(() => {
      if (Math.random() > 0.95) {
        setFlicker(Math.floor(Math.random() * 13))
        setTimeout(() => setFlicker(-1), 100)
      }
    }, 100)
    return () => clearInterval(id)
  }, [reducedMotion])

  return (
    <div className="text-2xl font-bold tracking-tighter arcade-text">
      {"GAME:changer".split('').map((c, i) => (
        <span
          key={i}
          className={flicker === i ? "opacity-0" : ""}
          style={{
            color: i < 5 ? "#ff0057" : "#2196f3",
            textShadow: i < 5 ? "0 0 5px rgba(255, 0, 87, 0.6)" : "0 0 5px rgba(33, 150, 243, 0.6)"
          }}
        >
          {c}
        </span>
      ))}
    </div>
  )
}

function NavLink({ item, i, compact = false }: { item: typeof NAV[0]; i: number; compact?: boolean }) {
  return (
    <a
      href={item.href}
      target={item.ext ? "_blank" : undefined}
      rel={item.ext ? "noopener noreferrer" : undefined}
      className="group px-3 py-2 flex items-center space-x-2 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all"
      style={{ color: "#ccc", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
      title={item.label}
    >
      <item.icon size={compact ? 16 : 14} strokeWidth={1} radius={1} style={{ color: i % 2 === 0 ? "#2196f3" : "#ff0057" }} />
      {!compact && <span className="hidden xl:inline font-mono tracking-wider text-xs group-hover:text-white">{item.short}</span>}
    </a>
  )
}

function SoundButton({ isMuted, toggleSound, size = 14 }: { isMuted: boolean; toggleSound: () => void; size?: number }) {
  return (
    <button
      onClick={toggleSound}
      className="group px-3 py-2 flex items-center space-x-2 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/10 transition-all"
      aria-label={isMuted ? "Sound einschalten" : "Sound ausschalten"}
      style={{ color: "#ccc", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
    >
      {isMuted
        ? <VolumeXIcon size={size} strokeWidth={1} radius={1} style={{ color: "#ff6b6b" }} />
        : <VolumeIcon size={size} strokeWidth={1} radius={1} style={{ color: "#51cf66" }} />
      }
      <span className="hidden xl:inline font-mono tracking-wider text-xs group-hover:text-white">{isMuted ? "AUS" : "AN"}</span>
    </button>
  )
}

export default function Navbar({ isMuted, toggleSound, reducedMotion }: NavbarProps) {
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      <nav
        className="py-4 sticky top-0 z-50 border-b border-white/20"
        style={{
          backgroundColor: 'rgba(30, 30, 50, 0.85)',
          backdropFilter: 'blur(40px) saturate(180%)',
          boxShadow: '0 4px 0 rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.1)'
        }}
      >
        <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
          <Logo reducedMotion={reducedMotion} />

          <div className="hidden lg:flex items-center space-x-3">
            {NAV.map((item, i) => <NavLink key={item.label} item={item} i={i} />)}
            <div className="h-6 w-px bg-white/30 ml-4 mr-2" />
            <SoundButton isMuted={isMuted} toggleSound={toggleSound} />
          </div>

          <div className="hidden md:flex lg:hidden items-center space-x-2">
            {NAV.slice(0, 4).map((item, i) => <NavLink key={item.label} item={item} i={i} compact />)}
            <div className="h-6 w-px bg-white/30 mx-2" />
            <SoundButton isMuted={isMuted} toggleSound={toggleSound} size={16} />
          </div>

          <button
            className="md:hidden px-3 py-2 rounded-lg border border-white/10 hover:border-white/30 hover:bg-white/10"
            onClick={() => setOpen(true)}
            aria-label="Menü öffnen"
            style={{ color: "#ccc", backgroundColor: "rgba(255, 255, 255, 0.05)" }}
          >
            <MenuIcon size={16} strokeWidth={1} radius={1} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Portal */}
      {mounted && open && createPortal(
        <ScrollArea
          className="fixed inset-0 z-[9999]"
          style={{ background: '#0a0a14' }}
        >
          {/* Backdrop with effects */}
          <div
            className="absolute inset-0 bg-[#0a0a14]"
            onClick={() => setOpen(false)}
            aria-label="Hintergrund schließen"
          />
          <div className="scanlines opacity-30 pointer-events-none" />
          <div className="vignette opacity-50 pointer-events-none" />

          {/* Menu Content */}
          <div className="relative min-h-full p-6 flex flex-col">
            {/* Header */}
            <motion.div
              className="flex justify-between items-center mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <div className="text-xl font-bold arcade-text">
                <span style={{ color: "#ff0057", textShadow: "0 0 10px rgba(255, 0, 87, 0.8)" }}>GAME:</span>
                <span style={{ color: "#2196f3", textShadow: "0 0 10px rgba(33, 150, 243, 0.8)" }}>changer</span>
              </div>
              <motion.button
                className="relative p-3 border-2 border-[#ff0057]/50 bg-[#090a12]"
                onClick={() => setOpen(false)}
                aria-label="Menü schließen"
                whileHover={{ scale: 1.05, borderColor: '#ff0057', boxShadow: '0 0 20px rgba(255,0,87,0.5)' }}
                whileTap={{ scale: 0.95 }}
              >
                <CardCorners color="#ff0057" size="sm" />
                <XIcon size={20} strokeWidth={1.5} radius={1} style={{ color: "#ff0057" }} />
              </motion.button>
            </motion.div>

            {/* Menu title */}
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <span className="text-xs font-mono text-[#2196f3]/70 tracking-[0.3em]">SELECT DESTINATION</span>
              <div className="h-px w-32 mx-auto mt-2 bg-gradient-to-r from-transparent via-[#2196f3]/50 to-transparent" />
            </motion.div>

            {/* Menu grid */}
            <div className="flex-1 grid grid-cols-2 gap-4 content-center max-w-md mx-auto w-full">
              {/* Sound toggle */}
              <motion.button
                onClick={toggleSound}
                className="relative aspect-square flex flex-col items-center justify-center p-4 border-2 border-[#2196f3]/40 bg-[#090a12]"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{
                  scale: 1.05,
                  borderColor: '#2196f3',
                  boxShadow: '0 0 30px rgba(33, 150, 243, 0.4)'
                }}
                whileTap={{ scale: 0.95 }}
              >
                <CardCorners color="#2196f3" size="sm" />
                {isMuted
                  ? <VolumeXIcon size={36} strokeWidth={1} radius={1} style={{ color: "#ff6b6b" }} />
                  : <VolumeIcon size={36} strokeWidth={1} radius={1} style={{ color: "#51cf66" }} />
                }
                <div className="mt-3 px-3 py-1.5 bg-black/60 border border-[#2196f3]/30">
                  <span className="font-mono text-xs text-white tracking-wider">
                    {isMuted ? "SOUND OFF" : "SOUND ON"}
                  </span>
                </div>
              </motion.button>

              {NAV.map((item, i) => {
                const isBlue = i % 2 === 0
                const color = isBlue ? '#2196f3' : '#ff0057'

                return (
                  <motion.a
                    key={item.label}
                    href={item.href}
                    target={item.ext ? "_blank" : undefined}
                    rel={item.ext ? "noopener noreferrer" : undefined}
                    className="relative aspect-square flex flex-col items-center justify-center p-4 border-2 bg-[#090a12]"
                    style={{ borderColor: `${color}40` }}
                    onClick={() => setOpen(false)}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (i + 1) * 0.05 }}
                    whileHover={{
                      scale: 1.05,
                      borderColor: color,
                      boxShadow: `0 0 30px ${isBlue ? 'rgba(33, 150, 243, 0.4)' : 'rgba(255, 0, 87, 0.4)'}`
                    }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <CardCorners color={color} size="sm" />
                    <item.icon size={36} strokeWidth={1} radius={1} style={{ color }} />
                    <div
                      className="mt-3 px-3 py-1.5 bg-black/60 border"
                      style={{ borderColor: `${color}30` }}
                    >
                      <span className="font-mono text-xs text-white tracking-wider">{item.short}</span>
                    </div>
                  </motion.a>
                )
              })}
            </div>

            {/* Footer hint */}
            <motion.div
              className="text-center mt-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <span className="text-xs font-mono text-white/40">TAP TO SELECT</span>
            </motion.div>

            {/* Large corner decorations */}
            <span className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-[#ff0057]" />
            <span className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-[#ff0057]" />
            <span className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-[#2196f3]" />
            <span className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-[#2196f3]" />
          </div>
        </ScrollArea>,
        document.body
      )}
    </>
  )
}
