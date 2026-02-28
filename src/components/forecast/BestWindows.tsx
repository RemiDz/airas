'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { AirQualityResponse } from '@/lib/types'
import { findBestWindows, findUpcomingWarnings } from '@/lib/forecast-utils'
import { getAqiBand } from '@/lib/aqi-utils'

interface BestWindowsProps {
  data: AirQualityResponse
}

export default function BestWindows({ data }: BestWindowsProps) {
  const windows = useMemo(() => findBestWindows(data), [data])
  const warnings = useMemo(() => findUpcomingWarnings(data), [data])

  if (windows.length === 0 && warnings.length === 0) return null

  return (
    <motion.div
      className="glass-card p-5 sm:p-6 mt-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50 mb-5">
        Best Session Windows
      </div>

      {/* Windows */}
      <div className="space-y-4">
        {windows.map((w, i) => {
          const band = getAqiBand(w.avgAqi)
          const now = new Date()
          const isToday = w.start.toDateString() === now.toDateString()
          const dayLabel = isToday
            ? 'Today'
            : w.start.toLocaleDateString('en-GB', { weekday: 'long' })
          const startTime = w.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
          const endTime = w.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

          const pollenLabel = w.peakPollen !== null
            ? (w.peakPollen < 10 ? 'Low' : w.peakPollen < 30 ? 'Mod' : 'High')
            : '—'

          return (
            <motion.div
              key={i}
              className="flex items-start gap-3"
              initial={{ opacity: 0, x: -8 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{
                duration: 0.5,
                delay: i * 0.1,
                ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
              }}
            >
              <span className="text-lg mt-0.5">🌟</span>
              <div className="min-w-0">
                <div className="font-body text-sm text-text-primary font-medium">
                  {dayLabel}, {startTime}–{endTime}
                </div>
                <div className="flex items-center gap-2 mt-1 flex-wrap">
                  <span
                    className="font-data text-[10px] tracking-wider"
                    style={{ color: band.colour }}
                  >
                    AQI {w.avgAqi} ({band.label})
                  </span>
                  <span className="text-text-secondary/20">·</span>
                  <span className="font-data text-[10px] tracking-wider text-text-secondary/50">
                    UV {Math.round(w.peakUv)}
                  </span>
                  <span className="text-text-secondary/20">·</span>
                  <span className="font-data text-[10px] tracking-wider text-text-secondary/50">
                    Pollen {pollenLabel}
                  </span>
                </div>
                <div className="font-body text-xs text-text-secondary/50 italic mt-1">
                  {w.recommendation}
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>

      {/* Warnings */}
      {warnings.length > 0 && (
        <div className="mt-5 pt-4 border-t border-white/[0.06] space-y-2">
          {warnings.map((w, i) => (
            <div key={i} className="flex items-start gap-2">
              <span className="text-sm mt-0.5">⚠️</span>
              <span className="font-body text-sm text-status-moderate/80">
                {w}
              </span>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
