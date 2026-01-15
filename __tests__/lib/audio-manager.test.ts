import { describe, it, expect, vi, beforeEach } from 'vitest'
import { AudioManager } from '@/lib/audio-manager'

describe('AudioManager', () => {
  let audioManager: AudioManager

  beforeEach(() => {
    vi.clearAllMocks()
    // Reset localStorage mock
    vi.mocked(localStorage.getItem).mockReturnValue(null)
    audioManager = new AudioManager()
  })

  describe('initialization', () => {
    it('starts muted by default', () => {
      expect(audioManager.isMuted()).toBe(true)
    })

    it('reads mute state from localStorage', () => {
      vi.mocked(localStorage.getItem).mockReturnValue('false')
      const manager = new AudioManager()
      expect(manager.isMuted()).toBe(false)
    })
  })

  describe('toggleMute', () => {
    it('toggles mute state', () => {
      expect(audioManager.isMuted()).toBe(true)
      audioManager.toggleMute()
      expect(audioManager.isMuted()).toBe(false)
      audioManager.toggleMute()
      expect(audioManager.isMuted()).toBe(true)
    })

    it('persists mute state to localStorage', () => {
      audioManager.toggleMute()
      expect(localStorage.setItem).toHaveBeenCalledWith('soundMuted', 'false')
    })
  })


  describe('init', () => {
    it('returns a promise', async () => {
      const result = audioManager.init()
      expect(result).toBeInstanceOf(Promise)
      await result
    })
  })
})
