"use client"

import { useState, useEffect } from "react"

export function useAccessibility() {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)

  useEffect(() => {
    // Check system preference for reduced motion
    if (typeof window !== 'undefined') {
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
      setReducedMotion(prefersReducedMotion.matches)

      const handleChange = (e: MediaQueryListEvent) => {
        setReducedMotion(e.matches)
      }

      prefersReducedMotion.addEventListener('change', handleChange)
      return () => prefersReducedMotion.removeEventListener('change', handleChange)
    }
  }, [])

  return {
    highContrast,
    setHighContrast,
    reducedMotion,
    setReducedMotion,
  }
}
