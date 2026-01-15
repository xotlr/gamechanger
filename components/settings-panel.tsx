"use client"

import { motion, AnimatePresence } from "framer-motion"
import { SettingsIcon, VolumeIcon, VolumeXIcon, EyeIcon } from "raster-react"

interface SettingsPanelProps {
  showSettings: boolean
  setShowSettings: (show: boolean) => void
  isMuted: boolean
  toggleSound: () => void
  crtEffectsEnabled: boolean
  setCrtEffectsEnabled: (enabled: boolean) => void
  highContrast: boolean
  setHighContrast: (enabled: boolean) => void
  reducedMotion: boolean
  setReducedMotion: (enabled: boolean) => void
}

export default function SettingsPanel({
  showSettings,
  setShowSettings,
  isMuted,
  toggleSound,
  crtEffectsEnabled,
  setCrtEffectsEnabled,
  highContrast,
  setHighContrast,
  reducedMotion,
  setReducedMotion,
}: SettingsPanelProps) {
  return (
    <div className="fixed bottom-4 right-4 z-[60] pointer-events-auto">
      <motion.button
        onClick={() => setShowSettings(!showSettings)}
        className={`crt-button px-4 py-3 text-sm flex items-center space-x-2 ${
          showSettings
            ? 'bg-[#ff0057]/20 border-[#ff0057]'
            : 'bg-white/5 border-white/20 hover:bg-white/10 hover:border-white/30'
        } transition-colors duration-200`}
        aria-label={showSettings ? "Einstellungen schließen" : "Einstellungen öffnen"}
        aria-expanded={showSettings}
        aria-haspopup="dialog"
        initial={false}
        animate={{
          boxShadow: showSettings
            ? '0 0 20px rgba(255,0,87,0.6), 0 0 40px rgba(255,0,87,0.3)'
            : '0 0 0px rgba(255,0,87,0)'
        }}
        whileHover={reducedMotion ? {} : { scale: 1.02 }}
        whileTap={reducedMotion ? {} : { scale: 0.98 }}
        transition={{
          duration: reducedMotion ? 0.1 : 0.3,
          ease: "easeInOut"
        }}
      >
        <motion.span
          animate={showSettings && !reducedMotion ? { opacity: [1, 0.5, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <SettingsIcon size={16} strokeWidth={1} radius={1} />
        </motion.span>
        <span className="hidden sm:inline">OPTIONEN</span>
      </motion.button>

      <AnimatePresence>
        {showSettings && (
          <>
            <motion.div
              className="fixed inset-0 z-[70]"
              onClick={() => setShowSettings(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.div
              className={`absolute bottom-full right-0 mb-2 p-6 w-80 max-w-sm z-[80] pointer-events-auto border ${
                highContrast
                  ? 'bg-black/95 border-[#ff0057] shadow-[0_0_20px_rgba(255,0,87,0.3)]'
                  : 'bg-[#0a0a14]/95 border-[#2196f3]/30'
              }`}
              style={{
                backdropFilter: 'blur(10px)',
                pointerEvents: 'auto'
              }}
              role="dialog"
              aria-modal="true"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{
                duration: reducedMotion ? 0.1 : 0.2,
                ease: "easeOut"
              }}
            >
              <span className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-[#ff0057]" />
              <span className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-[#ff0057]" />
              <span className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-[#ff0057]" />
              <span className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-[#ff0057]" />
              <div className="space-y-6">
                <SettingToggle
                  label="Sound"
                  icon={isMuted
                    ? <VolumeXIcon size={16} strokeWidth={1} radius={1} style={{ color: "#ff6b6b" }} />
                    : <VolumeIcon size={16} strokeWidth={1} radius={1} style={{ color: "#51cf66" }} />
                  }
                  enabled={!isMuted}
                  onToggle={toggleSound}
                  highContrast={highContrast}
                  ariaLabel={isMuted ? "Sound aktivieren" : "Sound deaktivieren"}
                />

                <SettingToggle
                  label="CRT-Effekte"
                  icon={<EyeIcon size={16} strokeWidth={1} radius={1} style={{ color: "#2196f3" }} />}
                  enabled={crtEffectsEnabled}
                  onToggle={() => setCrtEffectsEnabled(!crtEffectsEnabled)}
                  highContrast={highContrast}
                  ariaLabel={crtEffectsEnabled ? "CRT-Effekte deaktivieren" : "CRT-Effekte aktivieren"}
                />

                <SettingToggle
                  label="Hoher Kontrast"
                  enabled={highContrast}
                  onToggle={() => setHighContrast(!highContrast)}
                  highContrast={highContrast}
                  ariaLabel={highContrast ? "Hohen Kontrast deaktivieren" : "Hohen Kontrast aktivieren"}
                />

                <SettingToggle
                  label="Weniger Animationen"
                  enabled={reducedMotion}
                  onToggle={() => setReducedMotion(!reducedMotion)}
                  highContrast={highContrast}
                  ariaLabel={reducedMotion ? "Animationen aktivieren" : "Animationen reduzieren"}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

interface SettingToggleProps {
  label: string
  icon?: React.ReactNode
  enabled: boolean
  onToggle: () => void
  highContrast: boolean
  ariaLabel: string
}

function SettingToggle({ label, icon, enabled, onToggle, highContrast, ariaLabel }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        {icon}
        <span className="text-sm font-medium">{label}:</span>
      </div>
      <button
        onClick={onToggle}
        className={`px-3 py-2 text-xs min-w-[60px] rounded border transition-all duration-150 ${
          enabled
            ? 'border-green-500/70 bg-green-500/15 text-green-300 hover:bg-green-500/25'
            : 'border-red-500/70 bg-red-500/15 text-red-300 hover:bg-red-500/25'
        } ${highContrast ? 'border-2 font-semibold' : ''}`}
        aria-label={ariaLabel}
        style={{ pointerEvents: 'auto', position: 'relative', zIndex: 90 }}
      >
        {enabled ? "AN" : "AUS"}
      </button>
    </div>
  )
}
