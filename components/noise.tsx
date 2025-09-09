"use client"

import { useEffect, useState } from "react"

export function Noise() {
  const [opacity, setOpacity] = useState(0.04)
  
  // Random noise fluctuation effect
  useEffect(() => {
    const interval = setInterval(() => {
      // Randomly fluctuate opacity between 0.03 and 0.06
      const randomOpacity = 0.03 + Math.random() * 0.03
      setOpacity(randomOpacity)
    }, 1000)
    
    return () => clearInterval(interval)
  }, [])

  // Create dynamic noise SVG with random values
  const generateNoiseSVG = () => {
    // Base64 encoding of a simple noise SVG
    return `data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E`
  }

  // Occasional "interference" effect
  useEffect(() => {
    const triggerInterference = () => {
      // Random chance to trigger interference
      if (Math.random() > 0.7) {
        setOpacity(0.15) // Higher opacity for interference
        
        // Return to normal after a short duration
        setTimeout(() => {
          setOpacity(0.04)
        }, 150)
      }
    }
    
    // Check for interference every 3-8 seconds
    const interval = setInterval(() => {
      triggerInterference()
    }, 3000 + Math.random() * 5000)
    
    return () => clearInterval(interval)
  }, [])

  return (
    <div 
      className="noise fixed inset-0 pointer-events-none z-[100]" 
      style={{ 
        opacity, 
        backgroundImage: `url("${generateNoiseSVG()}")`,
        transition: 'opacity 0.5s ease'
      }}
    />
  )
}