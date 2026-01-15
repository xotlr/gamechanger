"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Panel } from "@/components/ui/panel"
import { motion, AnimatePresence } from "framer-motion"
import { UserIcon, NetworkIcon } from "raster-react"

export default function HeroSection() {
  const textRef = useRef<HTMLHeadingElement>(null)
  const [glitch, setGlitch] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    setTimeout(() => setReady(true), 800)
    const id = setInterval(() => {
      if (Math.random() > 0.5) {
        setGlitch(true)
        setTimeout(() => setGlitch(false), 100 + Math.random() * 300)
      }
    }, 5000 + Math.random() * 5000)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="min-h-screen h-screen flex flex-col items-center justify-center text-center relative px-4 sm:px-8" id="hero">
      <div className="scanlines opacity-40 pointer-events-none" />
      <div className="vignette opacity-60 pointer-events-none" />
      <div className="pixel-grid opacity-20 pointer-events-none" />

      <AnimatePresence>
        {glitch && (
          <motion.div
            className="fixed inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="scan-line" />
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto w-full relative z-10">
        <motion.div
          className="mb-8 relative inline-block"
          animate={glitch ? { x: [0, -2, 3, -1, 0], filter: ["blur(0px)", "blur(1px)", "blur(0px)"] } : {}}
          transition={{ duration: 0.2 }}
        >
          <h1
            ref={textRef}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter arcade-text"
            style={{ textShadow: glitch ? "2px 0 #ff0057, -2px 0 #2196f3" : "0 0 10px #ff0057, 0 0 20px #2196f3" }}
          >
            GAME:changer
          </h1>

          <AnimatePresence>
            {glitch && (
              <>
                <motion.span
                  className="absolute inset-0 arcade-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#ff0057]"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 0.8, x: -2 }}
                  exit={{ opacity: 0 }}
                >
                  GAME:changer
                </motion.span>
                <motion.span
                  className="absolute inset-0 arcade-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#2196f3]"
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 0.8, x: 2 }}
                  exit={{ opacity: 0 }}
                >
                  GAME:changer
                </motion.span>
              </>
            )}
          </AnimatePresence>

          <div className="absolute -inset-2 border-2 border-dashed border-[#ff0057]/30 -z-10" />
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#ff0057]" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2196f3]" />
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#2196f3]" />
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#ff0057]" />
        </motion.div>

        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Panel className="p-4" borderColor="red">
            <p className="text-lg sm:text-xl md:text-2xl crt-text-blue">
              Wir sind ein gemeinnütziger Verein, um gesellige Zusammenkünfte mit &ldquo;gleichgesinnten&rdquo; rund ums Thema eSport zu forcieren
            </p>
          </Panel>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: ready ? 1 : 0, y: ready ? 0 : 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button className="crt-button relative overflow-hidden w-full sm:w-auto sm:px-8 group" asChild>
            <a href="#member">
              <span className="relative z-10">Mitglied werden</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#ff005722] to-[#2196f322] transition-opacity duration-500" />
              <UserIcon size={16} strokeWidth={1} radius={1} className="ml-2 inline-block" style={{ color: "#ff0057" }} />
            </a>
          </Button>

          <Button className="crt-button border-[#2196f3] text-[#2196f3] hover:bg-[#2196f3]/10 relative overflow-hidden w-full sm:w-auto sm:px-8 group" asChild>
            <a href="https://www.facebook.com/profile.php?id=61565503147498" target="_blank" rel="noopener noreferrer">
              <span className="relative z-10">Facebook besuchen</span>
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#2196f322] to-[#ff005722] transition-opacity duration-500" />
              <NetworkIcon size={16} strokeWidth={1} radius={1} className="ml-2 inline-block" style={{ color: "#2196f3" }} />
            </a>
          </Button>
        </motion.div>
      </div>

      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="w-2 h-2 bg-[#ff0057]/30 absolute top-1/4 left-1/5" />
        <div className="w-2 h-2 bg-[#2196f3]/30 absolute top-3/4 left-1/3" />
        <div className="w-4 h-4 bg-[#ff0057]/20 absolute top-1/3 right-1/4" />
        <div className="w-3 h-3 bg-[#2196f3]/20 absolute bottom-1/4 right-1/3" />
      </div>
    </section>
  )
}
