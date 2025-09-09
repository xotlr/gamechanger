"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"
import { UserIcon, NetworkIcon } from "raster-react"

export default function HeroSection() {
  const textRef = useRef<HTMLHeadingElement>(null)
  const sectionRef = useRef<HTMLElement>(null)
  const [glitchActive, setGlitchActive] = useState(false)
  const [showEffect, setShowEffect] = useState(false)
  
  // Zufällige Glitch-Effekte in Intervallen statt konstanter Animation
  useEffect(() => {
    // Initial delay before showing effects
    const initialTimer = setTimeout(() => {
      setShowEffect(true);
    }, 800);
    
    // Zufällige Glitch-Effekte alle 5-10 Sekunden
    const randomGlitchInterval = setInterval(() => {
      if (Math.random() > 0.5) { // 50% Chance für einen Glitch
        setGlitchActive(true);
        
        // Kurzer Glitch, dann zurücksetzen
        setTimeout(() => {
          setGlitchActive(false);
        }, 100 + Math.random() * 300); // 100-400ms Glitch-Dauer
      }
    }, 5000 + Math.random() * 5000); // Alle 5-10 Sekunden
    
    return () => {
      clearTimeout(initialTimer);
      clearInterval(randomGlitchInterval);
    }
  }, []);


  return (
    <section 
      ref={sectionRef} 
      className="min-h-screen h-screen flex flex-col items-center justify-center text-center relative px-4 sm:px-6 lg:px-8" 
      id="hero"
    >
      {/* Statische CRT-Elemente */}
      <div className="scanlines opacity-40 pointer-events-none"></div>
      <div className="vignette opacity-60 pointer-events-none"></div>
      <div className="pixel-grid opacity-20 pointer-events-none"></div>
      
      {/* Gelegentlicher Scan-Line-Effekt */}
      <AnimatePresence>
        {glitchActive && (
          <motion.div 
            className="fixed inset-0 pointer-events-none z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
          >
            <div className="scan-line"></div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <div className="max-w-4xl mx-auto w-full relative z-10">
        {/* Logo mit Glitch-Effekt - nur bei aktivem Glitch */}
        <motion.div 
          className="mb-8 relative inline-block"
          animate={glitchActive ? {
            x: [0, -2, 3, -1, 0],
            filter: ["blur(0px)", "blur(1px)", "blur(0px)"]
          } : {}}
          transition={{ duration: 0.2 }}
        >
          <h1 
            ref={textRef} 
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter arcade-text"
            style={{ 
              textShadow: glitchActive 
                ? "2px 0 #ff0057, -2px 0 #2196f3" 
                : "0 0 10px #ff0057, 0 0 20px #2196f3" 
            }}
          >
            GAME:changer
          </h1>
          
          {/* Red/Blue Split-Effekt für Text */}
          <AnimatePresence>
            {glitchActive && (
              <>
                <motion.span 
                  className="absolute inset-0 arcade-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#ff0057]"
                  initial={{ opacity: 0, x: -4 }}
                  animate={{ opacity: 0.8, x: -2 }}
                  exit={{ opacity: 0 }}
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                >
                  GAME:changer
                </motion.span>
                <motion.span 
                  className="absolute inset-0 arcade-text text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter text-[#2196f3]"
                  initial={{ opacity: 0, x: 4 }}
                  animate={{ opacity: 0.8, x: 2 }}
                  exit={{ opacity: 0 }}
                  style={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                >
                  GAME:changer
                </motion.span>
              </>
            )}
          </AnimatePresence>
          
          {/* Pixelrahmen um das Logo */}
          <div className="absolute -inset-2 border-2 border-dashed border-[#ff0057]/30 -z-10"></div>
          
          {/* Ecken-Indikatoren */}
          <span className="absolute -top-1 -left-1 w-2 h-2 bg-[#ff0057]"></span>
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#2196f3]"></span>
          <span className="absolute -bottom-1 -left-1 w-2 h-2 bg-[#2196f3]"></span>
          <span className="absolute -bottom-1 -right-1 w-2 h-2 bg-[#ff0057]"></span>
        </motion.div>
        
        {/* Subtitle mit Balatro-Stil */}
        <motion.div
          className="mb-12 bg-[#0a0a14] p-4 border border-[#2196f3]/30 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showEffect ? 1 : 0, y: showEffect ? 0 : 20 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <p className="text-lg sm:text-xl md:text-2xl crt-text-blue">
            Wir sind ein gemeinnütziger Verein, um gesellige Zusammenkünfte mit &ldquo;gleichgesinnten&rdquo; rund ums Thema eSport zu forcieren
          </p>
          
          {/* Pixelecken für Balatro-Stil */}
          <span className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#ff0057]"></span>
          <span className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#ff0057]"></span>
          <span className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#ff0057]"></span>
          <span className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#ff0057]"></span>
        </motion.div>
        
        {/* Buttons mit Hover-Effekten */}
        <motion.div 
          className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-12 sm:mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: showEffect ? 1 : 0, y: showEffect ? 0 : 20 }}
          transition={{ delay: 0.6, duration: 0.5 }}
        >
          <Button 
            className="crt-button relative overflow-hidden w-full sm:w-auto sm:px-8 group"
            asChild
          >
            <a href="#member">
              <span className="relative z-10">Mitglied werden</span>
              
              {/* Red-Blue Shine-Effekt bei Hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#ff005722] to-[#2196f322] transition-opacity duration-500"></span>
              
              {/* Balatro-Stil Eckpunkte */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff0057] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff0057] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff0057] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff0057] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              
              <UserIcon 
                size={16} 
                strokeWidth={1} 
                radius={1}
                className="ml-2 inline-block" 
                style={{ color: "#ff0057" }}
              />
            </a>
          </Button>
          
          <Button 
            className="crt-button border-[#2196f3] text-[#2196f3] hover:bg-[#2196f3]/10 relative overflow-hidden w-full sm:w-auto sm:px-8 group"
            asChild
          >
            <a 
              href="https://www.facebook.com/profile.php?id=61565503147498"
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="relative z-10">Facebook besuchen</span>
              
              {/* Blue-Red Shine-Effekt bei Hover */}
              <span className="absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-r from-[#2196f322] to-[#ff005722] transition-opacity duration-500"></span>
              
              {/* Balatro-Stil Eckpunkte */}
              <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#2196f3] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#2196f3] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#2196f3] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#2196f3] opacity-0 group-hover:opacity-100 transition-opacity"></span>
              
              <NetworkIcon 
                size={16} 
                strokeWidth={1} 
                radius={1}
                className="ml-2 inline-block" 
                style={{ color: "#2196f3" }}
              />
            </a>
          </Button>
        </motion.div>
    
      </div>
      
      {/* Statische Partikel mit Balatro-Stil statt animierter Partikel */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Partikel sind jetzt statisch positioniert */}
        <div className="w-2 h-2 bg-[#ff0057]/30 absolute top-1/4 left-1/5"></div>
        <div className="w-2 h-2 bg-[#2196f3]/30 absolute top-3/4 left-1/3"></div>
        <div className="w-4 h-4 bg-[#ff0057]/20 absolute top-1/3 right-1/4"></div>
        <div className="w-3 h-3 bg-[#2196f3]/20 absolute bottom-1/4 right-1/3"></div>
        <div className="w-2 h-2 bg-[#ff0057]/30 absolute bottom-1/3 left-1/4"></div>
      </div>
      
    </section>
  )
}