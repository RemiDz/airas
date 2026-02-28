'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { AirQualityResponse } from '@/lib/types'
import { generateSessionGuidance } from '@/lib/practitioner'
import ModalityChecklist from './ModalityChecklist'

interface SessionGuidanceCardProps {
  data: AirQualityResponse
}

const RATING_CONFIG = {
  excellent: { label: 'Excellent', icon: '🌬️', colour: '#34D399' },
  good:      { label: 'Good',      icon: '🌬️', colour: '#A8DADC' },
  caution:   { label: 'Caution',   icon: '⚠️', colour: '#F59E0B' },
  'indoor-only': { label: 'Indoor Only', icon: '🏠', colour: '#F97316' },
  avoid:     { label: 'Avoid Outdoor', icon: '⛔', colour: '#EF4444' },
} as const

export default function SessionGuidanceCard({ data }: SessionGuidanceCardProps) {
  const guidance = useMemo(() => generateSessionGuidance(data), [data])
  const config = RATING_CONFIG[guidance.overallRating]

  return (
    <motion.div
      className="glass-card p-5 sm:p-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <span className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50">
          Session Guidance
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-status-good animate-live-pulse" />
          <span className="font-data text-[10px] tracking-wider text-text-secondary/40">
            Live
          </span>
        </span>
      </div>

      {/* Overall rating */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-2xl">{config.icon}</span>
        <div>
          <div className="font-body text-sm text-text-secondary/60">
            Outdoor Practice:
          </div>
          <div
            className="font-display text-xl font-medium"
            style={{ color: config.colour }}
          >
            {config.label}
          </div>
        </div>
      </div>

      {/* Summary */}
      <p className="font-body text-sm leading-relaxed text-text-secondary/70 mb-6">
        {guidance.summary}
      </p>

      {/* Factors */}
      {guidance.factors.length > 0 && (
        <div className="mb-5 space-y-2">
          {guidance.factors.map((f, i) => (
            <div
              key={i}
              className="flex items-start gap-2 rounded-lg bg-white/[0.02] px-3 py-2 border border-white/[0.04]"
            >
              <span className={`mt-0.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                f.severity === 'warning' ? 'bg-status-poor' :
                f.severity === 'caution' ? 'bg-status-moderate' :
                'bg-accent-primary'
              }`} />
              <div>
                <span className="font-data text-xs text-text-primary/80">{f.label}</span>
                <span className="font-body text-xs text-text-secondary/45 ml-2">{f.detail}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modality checklist */}
      <ModalityChecklist modalities={guidance.modalities} />

      {/* Next window */}
      <div className="mt-5 pt-4 border-t border-white/[0.06]">
        <div className="flex items-center gap-2">
          <svg className="h-3.5 w-3.5 text-accent-primary/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
          </svg>
          <span className="font-body text-sm text-text-secondary/60">
            {guidance.nextWindow}
          </span>
        </div>
      </div>
    </motion.div>
  )
}
