'use client'

import { useRef, useMemo } from 'react'
import type { AirQualityResponse, Location } from '@/lib/types'
import { hasPollenData, extractPollenTypes, getOverallPollenLevel, getPollenBand } from '@/lib/pollen-utils'
import { downloadCard } from '@/lib/promo-utils'

interface Props {
  data: AirQualityResponse
  location: Location
}

export default function PromoCardPollen({ data, location }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const pollenAvailable = hasPollenData(data)
  const types = useMemo(() => extractPollenTypes(data), [data])
  const overall = useMemo(() => getOverallPollenLevel(data), [data])
  const activeTypes = types.filter(t => t.currentValue !== null && t.currentValue > 0)

  if (!pollenAvailable || !overall || overall.label === 'None/Low') return null

  return (
    <div>
      <div
        ref={ref}
        style={{ width: 540, height: 540, padding: 48, backgroundColor: '#06061A' }}
        className="relative overflow-hidden flex flex-col"
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, #0A0A2E, #06061A)' }} />

        <div className="relative z-10 flex-1 flex flex-col">
          <div className="mb-6">
            <div className="font-display text-xl font-light text-pollen mb-1">
              Hay Fever Alert for Practitioners
            </div>
            <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40">
              {location.name}{location.country ? `, ${location.country}` : ''}
            </div>
          </div>

          {/* Overall */}
          <div className="mb-5">
            <span className="font-body text-sm text-text-secondary/60">Overall Pollen: </span>
            <span className="font-body text-sm font-medium" style={{ color: overall.colour }}>
              {overall.label}
            </span>
          </div>

          {/* Pollen bars */}
          <div className="flex-1 space-y-3 mb-6">
            {activeTypes.map(t => {
              const band = getPollenBand(t.currentValue!)
              const pct = Math.min((t.currentValue! / 80) * 100, 100)
              return (
                <div key={t.key} className="flex items-center gap-3">
                  <span className="text-sm">{t.icon}</span>
                  <span className="font-body text-sm text-text-secondary/70 w-20">{t.name}</span>
                  <div className="flex-1 h-2 rounded-full bg-white/[0.04] overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${pct}%`, backgroundColor: band.colour, opacity: 0.7 }}
                    />
                  </div>
                  <span className="font-data text-xs text-text-secondary/60 w-8 text-right">
                    {Math.round(t.currentValue!)}
                  </span>
                </div>
              )
            })}
          </div>

          {/* Recommendation */}
          <div className="mt-auto">
            <div className="rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 mb-4">
              <div className="font-body text-sm text-text-secondary/60 italic">
                🫁 Indoor sessions recommended for clients with pollen sensitivities
              </div>
            </div>
            <div className="font-data text-[9px] tracking-[0.2em] uppercase text-accent-primary/40 text-center">
              airas.app
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => ref.current && downloadCard(ref.current, `airas-pollen-${Date.now()}.png`)}
        className="mt-3 glass-card px-4 py-2 font-data text-xs tracking-wider text-accent-primary hover:text-accent-secondary transition-colors"
      >
        Download
      </button>
    </div>
  )
}
