'use client'

import { motion } from 'framer-motion'
import type { DayForecast } from '@/lib/forecast-utils'

interface DayCardProps {
  day: DayForecast
  delay?: number
}

const SESSION_ICONS: Record<string, { icon: string; label: string }> = {
  good:    { icon: '✓', label: 'Outdoor' },
  caution: { icon: '⚠', label: 'Caution' },
  poor:    { icon: '✗', label: 'Indoor' },
}

export default function DayCard({ day, delay = 0 }: DayCardProps) {
  const session = SESSION_ICONS[day.sessionSafe]

  return (
    <motion.div
      className={`glass-card flex-shrink-0 w-36 p-4 text-center ${day.isToday ? 'border-accent-primary/20' : ''}`}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
      }}
    >
      {/* Day name */}
      <div className={`font-data text-[10px] tracking-[0.15em] uppercase mb-3 ${
        day.isToday ? 'text-accent-primary' : 'text-text-secondary/50'
      }`}>
        {day.dayLabel}
      </div>

      {/* AQI score */}
      <div className="flex items-center justify-center gap-1.5 mb-1">
        <span
          className="h-2 w-2 rounded-full"
          style={{ backgroundColor: day.aqiBand.colour }}
        />
        <span
          className="font-data text-2xl font-medium"
          style={{ color: day.aqiBand.colour }}
        >
          {day.avgAqi}
        </span>
      </div>
      <div
        className="font-body text-xs mb-3"
        style={{ color: day.aqiBand.colour }}
      >
        {day.aqiBand.label}
      </div>

      {/* UV & Pollen */}
      <div className="space-y-1.5 mb-3">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[11px]">☀</span>
          <span className="font-data text-[10px] text-text-secondary/60">
            UV: {Math.round(day.peakUv)}
          </span>
        </div>
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[11px]">🌿</span>
          <span className="font-data text-[10px] text-text-secondary/60">
            Pol: {day.pollenLabel}
          </span>
        </div>
      </div>

      {/* Session recommendation */}
      <div className={`font-data text-[10px] tracking-wider ${
        day.sessionSafe === 'good' ? 'text-status-good' :
        day.sessionSafe === 'caution' ? 'text-status-moderate' :
        'text-status-poor'
      }`}>
        {session.icon} {session.label}
      </div>
    </motion.div>
  )
}
