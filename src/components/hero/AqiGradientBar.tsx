'use client'

import { getAqiBarPosition } from '@/lib/aqi-utils'
import type { AqiScale } from '@/lib/types'

interface AqiGradientBarProps {
  value: number
  scale?: AqiScale
  colour: string
}

export default function AqiGradientBar({ value, scale = 'european', colour }: AqiGradientBarProps) {
  const position = getAqiBarPosition(value, scale)
  const maxLabel = scale === 'european' ? '100+' : '300+'

  return (
    <div className="w-full px-1">
      <div className="relative">
        {/* Gradient bar */}
        <div className="aqi-bar w-full" />

        {/* Glowing dot indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 aqi-dot"
          style={{ left: `${position}%` }}
        >
          <div
            className="h-4 w-4 rounded-full border-2 border-void"
            style={{
              backgroundColor: colour,
              boxShadow: `0 0 8px ${colour}, 0 0 16px ${colour}40`,
            }}
          />
        </div>
      </div>

      {/* Scale labels */}
      <div className="mt-2 flex justify-between">
        <span className="font-data text-[10px] text-text-secondary/60">0</span>
        <span className="font-data text-[10px] text-text-secondary/60">{maxLabel}</span>
      </div>
    </div>
  )
}
