import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import SettingsPanel from '@/components/settings-panel'

describe('SettingsPanel', () => {
  const defaultProps = {
    showSettings: true,
    setShowSettings: vi.fn(),
    isMuted: false,
    toggleSound: vi.fn(),
    crtEffectsEnabled: true,
    setCrtEffectsEnabled: vi.fn(),
    highContrast: false,
    setHighContrast: vi.fn(),
    reducedMotion: false,
    setReducedMotion: vi.fn(),
  }

  it('renders settings button', () => {
    render(<SettingsPanel {...defaultProps} showSettings={false} />)
    expect(screen.getByRole('button', { name: /einstellungen öffnen/i })).toBeInTheDocument()
  })

  it('shows settings panel when showSettings is true', () => {
    render(<SettingsPanel {...defaultProps} />)
    expect(screen.getByRole('dialog')).toBeInTheDocument()
  })

  it('toggles sound when sound button is clicked', () => {
    render(<SettingsPanel {...defaultProps} />)
    const soundButton = screen.getByRole('button', { name: /sound deaktivieren/i })
    fireEvent.click(soundButton)
    expect(defaultProps.toggleSound).toHaveBeenCalled()
  })

  it('toggles CRT effects when button is clicked', () => {
    render(<SettingsPanel {...defaultProps} />)
    const crtButton = screen.getByRole('button', { name: /crt-effekte deaktivieren/i })
    fireEvent.click(crtButton)
    expect(defaultProps.setCrtEffectsEnabled).toHaveBeenCalledWith(false)
  })

  it('toggles high contrast when button is clicked', () => {
    render(<SettingsPanel {...defaultProps} />)
    const contrastButton = screen.getByRole('button', { name: /hohen kontrast aktivieren/i })
    fireEvent.click(contrastButton)
    expect(defaultProps.setHighContrast).toHaveBeenCalledWith(true)
  })

  it('toggles reduced motion when button is clicked', () => {
    render(<SettingsPanel {...defaultProps} />)
    const motionButton = screen.getByRole('button', { name: /animationen reduzieren/i })
    fireEvent.click(motionButton)
    expect(defaultProps.setReducedMotion).toHaveBeenCalledWith(true)
  })

  it('calls setShowSettings when settings button is clicked', () => {
    render(<SettingsPanel {...defaultProps} showSettings={false} />)
    const settingsButton = screen.getByRole('button', { name: /einstellungen öffnen/i })
    fireEvent.click(settingsButton)
    expect(defaultProps.setShowSettings).toHaveBeenCalledWith(true)
  })

  it('displays correct button states based on props', () => {
    render(<SettingsPanel {...defaultProps} isMuted={true} crtEffectsEnabled={false} />)
    expect(screen.getByRole('button', { name: /sound aktivieren/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /crt-effekte aktivieren/i })).toBeInTheDocument()
  })
})
