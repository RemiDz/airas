'use client'

import { motion, AnimatePresence } from 'framer-motion'
import type { AqiScale } from '@/lib/types'
import { trackEvent } from '@/lib/analytics'

interface SettingsPanelProps {
  open: boolean
  onClose: () => void
  scale: AqiScale
  onScaleChange: (scale: AqiScale) => void
  autoRefresh: boolean
  onAutoRefreshChange: (enabled: boolean) => void
}

export default function SettingsPanel({
  open,
  onClose,
  scale,
  onScaleChange,
  autoRefresh,
  onAutoRefreshChange,
}: SettingsPanelProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
          style={{ backgroundColor: 'rgba(6, 6, 26, 0.6)' }}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-full max-w-xs glass-card rounded-none border-l border-white/[0.08] p-6"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <span className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/60">
                Settings
              </span>
              <button
                onClick={onClose}
                className="text-text-secondary/50 hover:text-text-primary transition-colors p-1"
                aria-label="Close settings"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* AQI Scale */}
            <div className="mb-8">
              <div className="font-body text-sm text-text-secondary/70 mb-3">AQI Scale</div>
              <div className="flex gap-2">
                <ToggleButton
                  active={scale === 'european'}
                  onClick={() => { trackEvent('Settings Changed', { setting: 'scale', value: 'european' }); onScaleChange('european') }}
                  label="European"
                />
                <ToggleButton
                  active={scale === 'us'}
                  onClick={() => { trackEvent('Settings Changed', { setting: 'scale', value: 'us' }); onScaleChange('us') }}
                  label="US"
                />
              </div>
              <p className="font-body text-[11px] text-text-secondary/35 mt-2">
                {scale === 'european'
                  ? 'European AQI: 0–100+ scale used in the UK and EU.'
                  : 'US AQI: 0–500 scale used in North America.'}
              </p>
            </div>

            {/* Auto-refresh */}
            <div className="mb-8">
              <div className="font-body text-sm text-text-secondary/70 mb-3">Auto-refresh</div>
              <div className="flex gap-2">
                <ToggleButton
                  active={autoRefresh}
                  onClick={() => onAutoRefreshChange(true)}
                  label="On (15 min)"
                />
                <ToggleButton
                  active={!autoRefresh}
                  onClick={() => onAutoRefreshChange(false)}
                  label="Off"
                />
              </div>
            </div>

            {/* Version */}
            <div className="absolute bottom-6 left-6 right-6">
              <div className="font-data text-[9px] tracking-wider text-text-secondary/20 text-center">
                Airas v1.0 · Harmonic Waves
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

function ToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean
  onClick: () => void
  label: string
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-xl px-4 py-2.5 font-data text-xs tracking-wider transition-all duration-200 border ${
        active
          ? 'bg-accent-primary/10 border-accent-primary/25 text-accent-primary'
          : 'bg-white/[0.02] border-white/[0.06] text-text-secondary/50 hover:border-white/[0.12]'
      }`}
    >
      {label}
    </button>
  )
}
