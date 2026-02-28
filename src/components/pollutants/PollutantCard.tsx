'use client'

import { motion } from 'framer-motion'
import type { PollutantData } from '@/lib/types'
import StatusBadge from '@/components/shared/StatusBadge'
import Sparkline from '@/components/shared/Sparkline'

interface PollutantCardProps {
  pollutant: PollutantData
  delay?: number
}

export default function PollutantCard({ pollutant, delay = 0 }: PollutantCardProps) {
  const { name, formula, value, unit, status, history, min24h, max24h, practitionerNote } = pollutant

  return (
    <motion.div
      className="glass-card glass-card-hover pollutant-glow p-5"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      whileHover={{ boxShadow: `0 8px 32px rgba(0,0,0,0.3), 0 0 20px ${status.colour}12` }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-display text-lg font-medium text-text-primary">
            {name}
          </div>
          <div className="font-data text-[10px] tracking-[0.15em] text-text-secondary/50">
            {formula}
          </div>
        </div>
        <StatusBadge band={status} />
      </div>

      {/* Value */}
      <div className="flex items-baseline gap-2 mb-3">
        <span className="font-data text-3xl font-medium text-text-primary">
          {name === 'CO' ? Math.round(value).toLocaleString() : Math.round(value * 10) / 10}
        </span>
        <span className="font-data text-xs text-text-secondary/50">
          {unit}
        </span>
      </div>

      {/* Sparkline */}
      {history.length > 0 && (
        <div className="mb-3">
          <Sparkline data={history} colour={status.colour} />
        </div>
      )}

      {/* 24h range */}
      <div className="flex items-center gap-3 mb-3">
        <span className="font-data text-[10px] text-text-secondary/40">
          24h range
        </span>
        <span className="font-data text-[10px] text-text-secondary/60">
          {name === 'CO'
            ? `${Math.round(min24h).toLocaleString()} – ${Math.round(max24h).toLocaleString()}`
            : `${Math.round(min24h * 10) / 10} – ${Math.round(max24h * 10) / 10}`
          }
        </span>
        <span className="font-data text-[10px] text-text-secondary/40">
          {unit}
        </span>
      </div>

      {/* Practitioner note */}
      <div className="text-xs font-body text-text-secondary/50 italic leading-relaxed">
        {practitionerNote}
      </div>
    </motion.div>
  )
}
