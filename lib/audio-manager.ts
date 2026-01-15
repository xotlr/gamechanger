type OscType = 'square' | 'triangle'

export class AudioManager {
  private ctx: AudioContext | null = null
  private muted = true
  private ready = false

  constructor() {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('soundMuted')
      if (saved) this.muted = saved === 'true'
    }
  }

  private async setup() {
    if (this.ready || typeof window === 'undefined') return
    try {
      const AC = window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      this.ctx = new AC()
      this.ready = true
    } catch (e) {
      console.warn('Audio not supported:', e)
    }
  }

  private async getContext() {
    if (!this.ready) await this.setup()
    if (this.ctx?.state === 'suspended') {
      await this.ctx.resume().catch(() => {})
    }
    return this.ctx
  }

  private beep(freq: number, duration: number, vol = 0.1) {
    if (this.muted) return
    this.getContext().then(ctx => {
      if (!ctx) return
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.frequency.value = freq
      osc.type = 'square'
      gain.gain.setValueAtTime(0, ctx.currentTime)
      gain.gain.linearRampToValueAtTime(vol, ctx.currentTime + 0.01)
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration)
      osc.start(ctx.currentTime)
      osc.stop(ctx.currentTime + duration)
    }).catch(() => {})
  }

  private tones(freqs: number[], duration: number, vol = 0.05) {
    if (this.muted) return
    this.getContext().then(ctx => {
      if (!ctx) return
      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator()
        const gain = ctx.createGain()
        osc.connect(gain)
        gain.connect(ctx.destination)
        osc.frequency.value = freq
        osc.type = (i % 2 === 0 ? 'square' : 'triangle') as OscType
        const start = ctx.currentTime + i * 0.05
        const end = start + duration / freqs.length
        gain.gain.setValueAtTime(0, start)
        gain.gain.linearRampToValueAtTime(vol / freqs.length, start + 0.01)
        gain.gain.exponentialRampToValueAtTime(0.001, end)
        osc.start(start)
        osc.stop(end)
      })
    }).catch(() => {})
  }

  playHover() { this.beep(800, 0.1, 0.03) }
  playSelect() { this.tones([400, 600], 0.15, 0.04) }
  playConfirm() { this.tones([523, 784], 0.2, 0.05) }
  playError() { this.tones([400, 200], 0.2, 0.06) }
  playGlitch() { this.tones([200, 800, 150], 0.1, 0.03) }
  playSecret() { this.tones([262, 523, 784], 0.25, 0.04) }
  playStartup() { this.tones([220, 440, 880], 0.3, 0.05) }

  toggleMute() {
    this.muted = !this.muted
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundMuted', String(this.muted))
    }
    return this.muted
  }

  isMuted() { return this.muted }

  async init() {
    if (!this.ready) await this.setup()
  }
}

export const audioManager = new AudioManager()

export const useWebAudio = () => ({
  playHover: () => audioManager.playHover(),
  playSelect: () => audioManager.playSelect(),
  playConfirm: () => audioManager.playConfirm(),
  playError: () => audioManager.playError(),
  playGlitch: () => audioManager.playGlitch(),
  playSecret: () => audioManager.playSecret(),
  playStartup: () => audioManager.playStartup(),
  toggleMute: () => audioManager.toggleMute(),
  isMuted: () => audioManager.isMuted(),
  init: () => audioManager.init(),
})
