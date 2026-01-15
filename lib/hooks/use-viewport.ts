"use client"

import { useEffect } from "react"

export function useViewport() {
  useEffect(() => {
    const setVh = () => {
      document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`)
    }

    window.addEventListener('resize', setVh)
    setVh()

    return () => window.removeEventListener('resize', setVh)
  }, [])
}
