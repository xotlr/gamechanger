"use client"

import { useState, useEffect } from "react"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion, AnimatePresence } from "framer-motion"

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const [flickerChar, setFlickerChar] = useState(-1)
  
  const menuItems = [
    { name: "Home", href: "#" },
    { name: "Aktivitäten", href: "https://www.facebook.com/profile.php?id=61565503147498", external: true },
    {
      name: "Veranstaltungen",
      href: "https://www.facebook.com/profile.php?id=61565503147498&sk=events",
      external: true,
    },
    { name: "Fotos", href: "https://www.facebook.com/profile.php?id=61565503147498&sk=photos", external: true },
    { name: "Mitglied werden", href: "#member" },
    { name: "Impressum", href: "#impressum" },
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
    <nav className="py-6 relative">
      
      <div className="flex justify-between items-center px-4">
        {renderLogo()}
        
        <div className="hidden md:flex space-x-6">
          {menuItems.map((item, index) => (
            <a
              key={item.name}
              href={item.href}
              target={item.external ? "_blank" : undefined}
              rel={item.external ? "noopener noreferrer" : undefined}
              className="nav-link hover:text-[#ff0057] transition-colors relative group"
              style={{ 
                color: index % 2 === 0 ? "#2196f3" : "#ff0057",
                textShadow: index % 2 === 0 
                  ? "0 0 5px rgba(33, 150, 243, 0.4)" 
                  : "0 0 5px rgba(255, 0, 87, 0.4)"
              }}
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#ff0057] transition-all group-hover:w-full"></span>
            </a>
          ))}
        </div>
        
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden hover:bg-[#ff0057]/10" 
          onClick={() => setIsOpen(true)}
        >
          <Menu className="h-6 w-6 text-[#2196f3]" />
          <span className="sr-only">Open menu</span>
        </Button>
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black z-50 p-6"
          >
            {/* CRT effects for mobile menu */}
            <div className="scanlines opacity-30"></div>
            <div className="vignette opacity-50"></div>
            
            <div className="flex justify-end">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => setIsOpen(false)}
                className="hover:bg-[#ff0057]/10"
              >
                <X className="h-6 w-6 text-[#ff0057]" />
                <span className="sr-only">Close menu</span>
              </Button>
            </div>
            
            <div className="flex flex-col items-center justify-center h-full space-y-8">
              {menuItems.map((item, index) => (
                <a
                  key={item.name}
                  href={item.href}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  className={index % 2 === 0 ? "text-2xl crt-text-blue hover:text-[#ff0057] transition-colors" : "text-2xl crt-text-red hover:text-[#2196f3] transition-colors"}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}