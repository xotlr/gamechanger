"use client"

import { useState, useEffect, useRef } from "react"
import PixelBlast from "./pixel-blast"
import { PIXEL_BLAST_BLUE, PIXEL_BLAST_RED } from "@/lib/pixel-blast-config"

const BOOT_MSGS = [
  "System initialisiert...",
  "Verbindung zu Retz...",
  "Gaming-Netzwerk aktiv",
  "Interface bereit",
  "GAMECHANGER OS v2.5"
]

export default function BootSequence({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [lines, setLines] = useState<string[]>([])
  const [showLogo, setShowLogo] = useState(false)
  const [glitchLine, setGlitchLine] = useState(-1)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showLogo || !logoRef.current) return
    const id = setInterval(() => {
      if (Math.random() > 0.95 && logoRef.current) {
        const original = "GAMECHANGER"
        const chars = "!@#$%^&*_+-=<>?/|\\1234567890"
        const glitched = original.split("").map(c =>
          Math.random() > 0.8 ? chars[Math.floor(Math.random() * chars.length)] : c
        ).join("")
        logoRef.current.innerText = glitched
        logoRef.current.style.transform = `translateX(${(Math.random() * 4) - 2}px)`
        setTimeout(() => {
          if (logoRef.current) {
            logoRef.current.innerText = original
            logoRef.current.style.transform = 'translateX(0)'
          }
        }, 100)
      }
    }, 200)
    return () => clearInterval(id)
  }, [showLogo])

  useEffect(() => {
    const id = setInterval(() => {
      if (lines.length > 0 && Math.random() > 0.9) {
        setGlitchLine(Math.floor(Math.random() * lines.length))
        setTimeout(() => setGlitchLine(-1), 100)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [lines])

  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      if (i < BOOT_MSGS.length) {
        setLines(prev => [...prev, BOOT_MSGS[i]])
        i++
        setProgress(i / BOOT_MSGS.length * 100)
        if (i === BOOT_MSGS.length - 1) setShowLogo(true)
      } else {
        clearInterval(id)
        setTimeout(onComplete, 1500)
      }
    }, 400)
    return () => clearInterval(id)
  }, [onComplete])

  const noise = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()"
    return Array.from({ length: 10 + Math.floor(Math.random() * 20) }, () =>
      chars[Math.floor(Math.random() * chars.length)]
    ).join("")
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      <div className="absolute inset-0">
        <PixelBlast {...PIXEL_BLAST_BLUE} />
      </div>
      <div className="absolute inset-0">
        <PixelBlast {...PIXEL_BLAST_RED} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center h-full font-terminal p-8 pointer-events-none">
        <div className="w-full max-w-3xl">
          <div className="mb-8 text-2xl font-bold">
            <span className="text-[#ff0057] mr-2" style={{ textShadow: '0 0 10px rgba(255,0,87,0.5)' }}>SYSTEM</span>
            <span className="text-[#2196f3]" style={{ textShadow: '0 0 10px rgba(33,150,243,0.5)' }}>START</span>
          </div>

          <div className="mb-8 font-terminal bg-black/60 backdrop-blur-sm p-4 border border-[#2196f3]/50 rounded">
            {lines.map((text, i) => (
              <div
                key={i}
                className={`mb-2 ${i % 2 === 0 ? 'text-[#ff0057]' : 'text-[#2196f3]'} ${i === glitchLine ? 'opacity-50' : ''}`}
                style={{
                  transform: i === glitchLine ? `translateX(${(Math.random() * 6) - 3}px)` : 'none',
                  textShadow: i === lines.length - 1 ? '0 0 6px currentColor' : 'none'
                }}
              >
                <span className="mr-2 opacity-80">&gt;</span>
                {i === glitchLine ? noise() : text}
                {i === lines.length - 1 && <span className="inline-block w-2 h-4 bg-[#ff0057] ml-1 animate-pulse" />}
              </div>
            ))}
          </div>

          <div className="w-full h-4 bg-black/60 overflow-hidden mb-2 border border-[#2196f3]/50 rounded relative">
            <div
              className="h-full"
              style={{
                width: `${progress}%`,
                background: 'linear-gradient(90deg, #ff0057, #2196f3)',
                transition: 'width 0.4s steps(10)',
                boxShadow: '0 0 10px rgba(255,0,87,0.5)'
              }}
            />
          </div>

          <div className="text-sm flex justify-between">
            <span className="text-[#2196f3]">RETZ, AUSTRIA</span>
            <span className="text-[#ff0057]">{progress.toFixed(0)}%</span>
          </div>
        </div>
      </div>
    </div>
  )
}
