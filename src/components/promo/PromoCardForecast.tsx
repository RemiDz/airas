'use client'

import { useRef, useMemo } from 'react'
import type { AirQualityResponse, Location } from '@/lib/types'
import { computeDailyForecasts } from '@/lib/forecast-utils'
import { downloadCard } from '@/lib/promo-utils'

interface Props {
  data: AirQualityResponse
  location: Location
}

export default function PromoCardForecast({ data, location }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const forecasts = useMemo(() => computeDailyForecasts(data), [data])

  return (
    <div>
      <div
        ref={ref}
        style={{ width: 600, height: 314, padding: 36, backgroundColor: '#06061A' }}
        className="relative overflow-hidden flex flex-col"
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 40%, #0A0A2E, #06061A)' }} />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <div className="font-display text-lg font-light text-text-primary">
                5-Day Air Quality Forecast
              </div>
              <div className="font-data text-[9px] tracking-[0.2em] uppercase text-text-secondary/40">
                {location.name}{location.country ? `, ${location.country}` : ''}
              </div>
            </div>
            <div className="font-data text-[9px] tracking-[0.2em] uppercase text-accent-primary/40">
              airas.app
            </div>
          </div>

          {/* Forecast strip */}
          <div className="flex gap-3 flex-1">
            {forecasts.map(day => (
              <div
                key={day.dayLabel}
                className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center flex flex-col justify-between"
              >
                <div className="font-data text-[9px] tracking-wider text-text-secondary/50 mb-2">
                  {day.dayLabel}
                </div>
                <div>
                  <div className="flex items-center justify-center gap-1 mb-0.5">
                    <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: day.aqiBand.colour }} />
                    <span className="font-data text-xl font-medium" style={{ color: day.aqiBand.colour }}>
                      {day.avgAqi}
                    </span>
                  </div>
                  <div className="font-body text-[9px]" style={{ color: day.aqiBand.colour }}>
                    {day.aqiBand.label}
                  </div>
                </div>
                <div className={`font-data text-[8px] tracking-wider mt-2 ${
                  day.sessionSafe === 'good' ? 'text-status-good/70' :
                  day.sessionSafe === 'caution' ? 'text-status-moderate/70' :
                  'text-status-poor/70'
                }`}>
                  {day.sessionSafe === 'good' ? '✓' : day.sessionSafe === 'caution' ? '⚠' : '✗'}
                </div>
              </div>
            ))}
          </div>

          <div className="font-display text-xs italic text-text-secondary/40 text-center mt-3">
            Plan your week with the atmosphere, not against it
          </div>
        </div>
      </div>

      <button
        onClick={() => ref.current && downloadCard(ref.current, `airas-forecast-${Date.now()}.png`)}
        className="mt-3 glass-card px-4 py-2 font-data text-xs tracking-wider text-accent-primary hover:text-accent-secondary transition-colors"
      >
        Download
      </button>
    </div>
  )
}
