// Web Audio API based sound system for retro game sounds
// No external files needed - generates sounds programmatically

class WebAudioManager {
  private audioContext: AudioContext | null = null;
  private muted: boolean = true;
  private initialized: boolean = false;

  constructor() {
    this.muted = true; // Start muted to avoid autoplay issues
    
    // Try to get muted state from localStorage
    if (typeof window !== 'undefined') {
      const savedMuted = localStorage.getItem('soundMuted');
      if (savedMuted) {
        this.muted = savedMuted === 'true';
      }
    }
  }

  private async initializeAudio(): Promise<void> {
    if (this.initialized || typeof window === 'undefined') return;
    
    try {
      // Create AudioContext only when needed (after user interaction)
      this.audioContext = new (window.AudioContext || (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext)();
      this.initialized = true;
    } catch (error) {
      console.warn('Audio not supported in this browser:', error);
    }
  }

  private async ensureAudioContext(): Promise<AudioContext | null> {
    if (!this.initialized) {
      await this.initializeAudio();
    }
    
    if (this.audioContext && this.audioContext.state === 'suspended') {
      try {
        await this.audioContext.resume();
      } catch (error) {
        console.warn('Could not resume audio context:', error);
      }
    }
    
    return this.audioContext;
  }

  // Generate a simple beep sound
  private createBeep(frequency: number, duration: number, volume: number = 0.1): void {
    if (this.muted) return;
    
    this.ensureAudioContext().then(audioContext => {
      if (!audioContext) return;

      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = 'square'; // Retro sound

      gainNode.gain.setValueAtTime(0, audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(volume, audioContext.currentTime + 0.01);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + duration);
    }).catch(error => {
      console.warn('Audio playback failed:', error);
    });
  }

  // Generate a more complex sound with multiple frequencies
  private createComplexSound(frequencies: number[], duration: number, volume: number = 0.05): void {
    if (this.muted) return;
    
    this.ensureAudioContext().then(audioContext => {
      if (!audioContext) return;

      frequencies.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = freq;
        oscillator.type = index % 2 === 0 ? 'square' : 'triangle';

        const startTime = audioContext.currentTime + (index * 0.05); // Reduced delay
        const endTime = startTime + (duration / frequencies.length); // Shorter individual durations

        gainNode.gain.setValueAtTime(0, startTime);
        gainNode.gain.linearRampToValueAtTime(volume / frequencies.length, startTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, endTime);

        oscillator.start(startTime);
        oscillator.stop(endTime);
      });
    }).catch(error => {
      console.warn('Audio playback failed:', error);
    });
  }

  // Public methods for different sound effects
  public playHover(): void {
    // Quick high-pitched beep for hover
    this.createBeep(800, 0.1, 0.03);
  }

  public playSelect(): void {
    // Quick ascending beep for selection
    this.createComplexSound([400, 600], 0.15, 0.04);
  }

  public playConfirm(): void {
    // Quick success sound
    this.createComplexSound([523, 784], 0.2, 0.05);
  }

  public playError(): void {
    // Quick error sound
    this.createComplexSound([400, 200], 0.2, 0.06);
  }

  public playGlitch(): void {
    // Quick glitch sound
    this.createComplexSound([200, 800, 150], 0.1, 0.03);
  }

  public playSecret(): void {
    // Quick secret sound
    this.createComplexSound([262, 523, 784], 0.25, 0.04);
  }

  public playStartup(): void {
    // Quick startup sound
    this.createComplexSound([220, 440, 880], 0.3, 0.05);
  }

  public toggleMute(): boolean {
    this.muted = !this.muted;
    
    // Save to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('soundMuted', this.muted.toString());
    }
    
    return this.muted;
  }

  public isMuted(): boolean {
    return this.muted;
  }

  // Initialize audio context on user interaction
  public async initializeOnUserAction(): Promise<void> {
    if (!this.initialized) {
      await this.initializeAudio();
    }
  }
}

// Create singleton instance
export const audioManager = new WebAudioManager();

// Hook for React components
export const useWebAudio = () => {
  return {
    playHover: () => audioManager.playHover(),
    playSelect: () => audioManager.playSelect(),
    playConfirm: () => audioManager.playConfirm(),
    playError: () => audioManager.playError(),
    playGlitch: () => audioManager.playGlitch(),
    playSecret: () => audioManager.playSecret(),
    playStartup: () => audioManager.playStartup(),
    toggleMute: () => audioManager.toggleMute(),
    isMuted: () => audioManager.isMuted(),
    initializeOnUserAction: () => audioManager.initializeOnUserAction(),
  };
};