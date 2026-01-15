"use client"

import { useState, useEffect, useCallback } from "react"
import { audioManager } from "@/lib/audio-manager"

export function useAudio() {
  const [isMuted, setIsMuted] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMuted(audioManager.isMuted())
    }
  }, [])

  const toggleSound = useCallback(() => {
    const muted = audioManager.toggleMute()
    setIsMuted(muted)
    if (!muted) {
      audioManager.init().then(() => audioManager.playSelect())
    }
  }, [])

  const playHover = useCallback(() => {
    if (!audioManager.isMuted()) {
      audioManager.playHover()
    }
  }, [])

  const playSelect = useCallback(() => {
    if (!audioManager.isMuted()) {
      audioManager.init().then(() => audioManager.playSelect())
    }
  }, [])

  const playStartup = useCallback(() => {
    audioManager.playStartup()
  }, [])

  return {
    isMuted,
    toggleSound,
    playHover,
    playSelect,
    playStartup,
  }
}
