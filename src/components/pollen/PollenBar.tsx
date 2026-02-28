'use client'

import { getPollenBand } from '@/lib/pollen-utils'

interface PollenBarProps {
  name: string
  icon: string
  value: number | null
  maxScale?: number
}

export default function PollenBar({ name, icon, value, maxScale = 80 }: PollenBarProps) {
  const displayValue = value ?? 0
  const band = getPollenBand(displayValue)
  const widthPct = Math.min((displayValue / maxScale) * 100, 100)

  return (
    <div className="flex items-center gap-3">
      <span className="text-sm flex-shrink-0">{icon}</span>
      <span className="font-body text-sm text-text-secondary/70 w-20 flex-shrink-0">
        {name}
      </span>
      <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{
            width: `${widthPct}%`,
            backgroundColor: band.colour,
            opacity: displayValue > 0 ? 0.7 : 0.15,
          }}
        />
      </div>
      <span className="font-data text-xs text-text-secondary/60 w-8 text-right flex-shrink-0">
        {value !== null ? Math.round(displayValue) : '—'}
      </span>
    </div>
  )
}
