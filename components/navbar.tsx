"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  HomeIcon, 
  ActivityIcon, 
  CalendarIcon, 
  FoldersIcon, 
  UserIcon, 
  InfoIcon, 
  VolumeIcon, 
  VolumeXIcon, 
  MenuIcon,
  XIcon 
} from "raster-react"

interface NavbarProps {
  isMuted: boolean
  toggleSound: () => void
}

export default function Navbar({ isMuted, toggleSound }: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [flickerChar, setFlickerChar] = useState(-1)
  
  const menuItems = [
    { name: "STARTSEITE", shortName: "START", href: "#", icon: HomeIcon },
    { name: "AKTIVITÄTEN", shortName: "AKTIV", href: "https://www.facebook.com/profile.php?id=61565503147498", external: true, icon: ActivityIcon },
    {
      name: "VERANSTALTUNGEN",
      shortName: "EVENTS", 
      href: "https://www.facebook.com/profile.php?id=61565503147498&sk=events",
      external: true,
      icon: CalendarIcon
    },
    { name: "FOTOS", shortName: "FOTOS", href: "https://www.facebook.com/profile.php?id=61565503147498&sk=photos", external: true, icon: FoldersIcon },
    { name: "MITGLIED WERDEN", shortName: "BEITRETEN", href: "#member", icon: UserIcon },
    { name: "IMPRESSUM", shortName: "INFO", href: "#impressum", icon: InfoIcon },
  ]
  
  // Text flicker effect for logo
  useEffect(() => {
    const flickerInterval = setInterval(() => {
      if (Math.random() > 0.95) {
        // Set random character position to flicker
        const randomCharPos = Math.floor(Math.random() * 13) // "GAME:changer" has 13 chars
        setFlickerChar(randomCharPos)
        
        // Clear flicker after short delay
        setTimeout(() => setFlickerChar(-1), 100)
      } else {
        setFlickerChar(-1)
      }
    }, 100)
    
    return () => clearInterval(flickerInterval)
  }, [])
  
  // Render logo with character flicker
  const renderLogo = () => {
    const logo = "GAME:changer"
    return (
      <div className="text-2xl font-bold tracking-tighter arcade-text">
        {logo.split('').map((char, i) => (
          <span 
            key={i} 
            className={i === flickerChar ? "opacity-0" : ""}
            style={{ 
              color: i < 5 ? "#ff0057" : "#2196f3",
              textShadow: i < 5 
                ? "0 0 5px rgba(255, 0, 87, 0.6), 0 0 10px rgba(255, 0, 87, 0.3)" 
                : "0 0 5px rgba(33, 150, 243, 0.6), 0 0 10px rgba(33, 150, 243, 0.3)"
            }}
          >
            {char}
          </span>
        ))}
      </div>
    )
  }

  return (
    <nav 
      className="py-4 sticky top-0 z-50 border-b border-white/20" 
      style={{
        backgroundColor: 'rgba(30, 30, 50, 0.85)',
        backdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: '0 4px 0 rgba(0, 0, 0, 0.4), inset 0 0 10px rgba(255, 255, 255, 0.1)'
      }}
    >
      
      <div className="max-w-6xl mx-auto px-4 flex justify-between items-center">
        {renderLogo()}
        
        <div className="hidden lg:flex items-center space-x-3">
          {/* Sound Toggle Button */}
          <button 
            onClick={toggleSound}
            className="group px-3 py-2 text-sm flex items-center space-x-2 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
            style={{
              color: "#ccc",
              backgroundColor: "rgba(255, 255, 255, 0.05)"
            }}
            aria-label={isMuted ? "Sound aktivieren" : "Sound deaktivieren"}
          >
            {isMuted ? (
              <VolumeXIcon size={16} strokeWidth={1} radius={1} />
            ) : (
              <VolumeIcon size={16} strokeWidth={1} radius={1} />
            )}
            <span className="text-xs">SOUND</span>
          </button>
          
          {menuItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group px-3 py-2 text-sm flex items-center space-x-2 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
              style={{
                color: "#ccc",
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              }}
            >
              <item.icon 
                size={14} 
                strokeWidth={1} 
                radius={1}
                className="transition-colors"
                style={{
                  color: index % 2 === 0 ? "#2196f3" : "#ff0057"
                }}
              />
              <span className="hidden xl:inline font-mono tracking-wider text-xs transition-colors group-hover:text-white">
                {item.shortName}
              </span>
            </a>
          ))}
          
          <div className="h-6 w-px bg-white/30 mr-2 ml-4"></div>
          
          <button 
            onClick={toggleSound} 
            className="group px-3 py-2 text-sm flex items-center space-x-2 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
            aria-label={isMuted ? "Sound einschalten" : "Sound ausschalten"}
            style={{ 
              color: "#ccc",
              backgroundColor: "rgba(255, 255, 255, 0.05)"
            }}
          >
            {isMuted ? (
              <VolumeXIcon 
                size={14} 
                strokeWidth={1} 
                radius={1}
                className="transition-colors"
                style={{ color: "#ff6b6b" }}
              />
            ) : (
              <VolumeIcon 
                size={14} 
                strokeWidth={1} 
                radius={1}
                className="transition-colors"
                style={{ color: "#51cf66" }}
              />
            )}
            <span className="hidden xl:inline font-mono tracking-wider text-xs group-hover:text-white transition-colors">{isMuted ? "AUS" : "AN"}</span>
          </button>
        </div>
        
        {/* Medium screens - compact icons */}
        <div className="hidden md:flex lg:hidden items-center space-x-2">
          {menuItems.slice(0, 4).map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="group px-2 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
              style={{ 
                color: "#ccc",
                backgroundColor: "rgba(255, 255, 255, 0.05)"
              }}
              title={item.name}
            >
              <item.icon 
                size={16} 
                strokeWidth={1} 
                radius={1}
                style={{
                  color: index % 2 === 0 ? "#2196f3" : "#ff0057"
                }}
              />
            </a>
          ))}
          
          <div className="h-6 w-px bg-white/30 mr-1 ml-3"></div>
          
          <button 
            onClick={toggleSound} 
            className="group px-2 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
            aria-label={isMuted ? "Sound einschalten" : "Sound ausschalten"}
            title={isMuted ? "Sound einschalten" : "Sound ausschalten"}
            style={{ 
              color: "#ccc",
              backgroundColor: "rgba(255, 255, 255, 0.05)"
            }}
          >
            {isMuted ? (
              <VolumeXIcon 
                size={16} 
                strokeWidth={1} 
                radius={1}
                style={{ color: "#ff6b6b" }}
              />
            ) : (
              <VolumeIcon 
                size={16} 
                strokeWidth={1} 
                radius={1}
                style={{ color: "#51cf66" }}
              />
            )}
          </button>
        </div>
        
        <button 
          className="md:hidden px-3 py-2 rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
          onClick={() => setIsOpen(true)}
          aria-label="Menü öffnen"
          style={{ 
            color: "#ccc",
            backgroundColor: "rgba(255, 255, 255, 0.05)"
          }}
        >
          <MenuIcon 
            size={16} 
            strokeWidth={1} 
            radius={1}
          />
        </button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50"
            style={{
              backgroundColor: 'rgba(10, 10, 20, 0.95)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* CRT effects for mobile menu */}
            <div className="scanlines opacity-20"></div>
            <div className="vignette opacity-40"></div>
            
            <div className="min-h-screen p-4 flex flex-col">
              <div className="flex justify-between items-center mb-6 pt-2">
                <div className="text-lg font-bold tracking-tighter arcade-text">
                  <span style={{ color: "#ff0057", textShadow: "0 0 6px rgba(255, 0, 87, 0.6)" }}>GAME:</span>
                  <span style={{ color: "#2196f3", textShadow: "0 0 6px rgba(33, 150, 243, 0.6)" }}>changer</span>
                </div>
                
                <button 
                  className="px-3 py-2 rounded-lg border border-white/20 hover:border-white/40 hover:bg-white/10 transition-all duration-200"
                  onClick={() => setIsOpen(false)}
                  aria-label="Menü schließen"
                  style={{
                    color: "#ff0057",
                    backgroundColor: "rgba(255, 255, 255, 0.05)"
                  }}
                >
                  <XIcon 
                    size={16} 
                    strokeWidth={1} 
                    radius={1}
                  />
                </button>
              </div>
              
              <div className="flex-1 flex flex-col justify-center space-y-2 px-4">
                {/* Mobile Sound Toggle */}
                <motion.button
                  onClick={toggleSound}
                  className="group px-4 py-3 text-base flex items-center space-x-3 w-full rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0 }}
                  style={{ 
                    color: "#ddd",
                    backgroundColor: "rgba(255, 255, 255, 0.05)"
                  }}
                  aria-label={isMuted ? "Sound aktivieren" : "Sound deaktivieren"}
                >
                  {isMuted ? (
                    <VolumeXIcon size={20} strokeWidth={1} radius={1} style={{ color: "#ff6b6b" }} />
                  ) : (
                    <VolumeIcon size={20} strokeWidth={1} radius={1} style={{ color: "#51cf66" }} />
                  )}
                  <span>SOUND: {isMuted ? "AUS" : "AN"}</span>
                </motion.button>
                
                {menuItems.map((item, index) => (
                  <motion.a
                    key={item.name}
                    href={item.href}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                    className="group px-4 py-3 text-base flex items-center space-x-3 w-full rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
                    onClick={() => setIsOpen(false)}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: (index + 1) * 0.1 }}
                    style={{ 
                      color: "#ddd",
                      backgroundColor: "rgba(255, 255, 255, 0.05)"
                    }}
                  >
                    <item.icon 
                      size={20} 
                      strokeWidth={1} 
                      radius={1}
                      style={{
                        color: index % 2 === 0 ? "#2196f3" : "#ff0057"
                      }}
                    />
                    <span className="font-mono tracking-wider text-sm">{item.name}</span>
                  </motion.a>
                ))}
                
                <div className="py-3">
                  <div className="h-px bg-white/20 w-full"></div>
                </div>
                
                <button 
                  onClick={toggleSound} 
                  className="group px-4 py-3 text-base flex items-center space-x-3 w-full rounded-lg border border-white/10 hover:border-white/30 transition-all duration-200 hover:bg-white/10"
                  aria-label={isMuted ? "Sound einschalten" : "Sound ausschalten"}
                  style={{ 
                    color: "#ddd",
                    backgroundColor: "rgba(255, 255, 255, 0.05)"
                  }}
                >
                  {isMuted ? (
                    <VolumeXIcon 
                      size={20} 
                      strokeWidth={1} 
                      radius={1}
                      style={{ color: "#ff6b6b" }}
                    />
                  ) : (
                    <VolumeIcon 
                      size={20} 
                      strokeWidth={1} 
                      radius={1}
                      style={{ color: "#51cf66" }}
                    />
                  )}
                  <span className="font-mono tracking-wider text-sm group-hover:text-white transition-colors">SOUND {isMuted ? "AUS" : "AN"}</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}