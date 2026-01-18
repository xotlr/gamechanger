"use client"

import { useState, useEffect } from "react"

export function useAccessibility() {
  const [highContrast, setHighContrast] = useState(false)
  const [reducedMotion, setReducedMotion] = useState(false)
  const [dyslexiaMode, setDyslexiaMode] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return

    // Load saved preferences from localStorage
    const savedHighContrast = localStorage.getItem('accessibility-highContrast')
    const savedReducedMotion = localStorage.getItem('accessibility-reducedMotion')
    const savedDyslexiaMode = localStorage.getItem('accessibility-dyslexiaMode')

    // Check system preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const prefersContrast = window.matchMedia('(prefers-contrast: more)')

    // Initialize high contrast: localStorage > system preference > default
    if (savedHighContrast !== null) {
      setHighContrast(savedHighContrast === 'true')
    } else if (prefersContrast.matches) {
      setHighContrast(true)
    }

    // Initialize reduced motion: localStorage > system preference > default
    if (savedReducedMotion !== null) {
      setReducedMotion(savedReducedMotion === 'true')
    } else if (prefersReducedMotion.matches) {
      setReducedMotion(true)
    }

    // Initialize dyslexia mode from localStorage
    if (savedDyslexiaMode !== null) {
      setDyslexiaMode(savedDyslexiaMode === 'true')
    }

    // Listen for system preference changes
    const handleMotionChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't set a manual preference
      if (localStorage.getItem('accessibility-reducedMotion') === null) {
        setReducedMotion(e.matches)
      }
    }

    const handleContrastChange = (e: MediaQueryListEvent) => {
      // Only auto-update if user hasn't set a manual preference
      if (localStorage.getItem('accessibility-highContrast') === null) {
        setHighContrast(e.matches)
      }
    }

    prefersReducedMotion.addEventListener('change', handleMotionChange)
    prefersContrast.addEventListener('change', handleContrastChange)

    return () => {
      prefersReducedMotion.removeEventListener('change', handleMotionChange)
      prefersContrast.removeEventListener('change', handleContrastChange)
    }
  }, [])

  // Persist high contrast changes
  const handleSetHighContrast = (value: boolean) => {
    setHighContrast(value)
    localStorage.setItem('accessibility-highContrast', String(value))
  }

  // Persist reduced motion changes
  const handleSetReducedMotion = (value: boolean) => {
    setReducedMotion(value)
    localStorage.setItem('accessibility-reducedMotion', String(value))
  }

  // Persist dyslexia mode changes
  const handleSetDyslexiaMode = (value: boolean) => {
    setDyslexiaMode(value)
    localStorage.setItem('accessibility-dyslexiaMode', String(value))
  }

  return {
    highContrast,
    setHighContrast: handleSetHighContrast,
    reducedMotion,
    setReducedMotion: handleSetReducedMotion,
    dyslexiaMode,
    setDyslexiaMode: handleSetDyslexiaMode,
  }
}
