'use client'

import { useRef } from 'react'
import type { AirQualityResponse, Location } from '@/lib/types'
import { getAqiBand } from '@/lib/aqi-utils'
import { getUvBand } from '@/lib/uv-utils'
import { generateSessionGuidance } from '@/lib/practitioner'
import { downloadCard } from '@/lib/promo-utils'

interface Props {
  data: AirQualityResponse
  location: Location
}

export default function PromoCardStory({ data, location }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const aqi = data.current.european_aqi
  const band = getAqiBand(aqi)
  const uvBand = getUvBand(data.current.uv_index)
  const guidance = generateSessionGuidance(data)

  return (
    <div>
      <div
        ref={ref}
        style={{ width: 540, height: 675, padding: 48, backgroundColor: '#06061A' }}
        className="relative overflow-hidden flex flex-col"
      >
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 20%, #0A0A2E, #06061A)' }} />

        <div className="relative z-10 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-6">
            <div className="font-display text-xl font-light text-text-primary mb-1">
              Today&apos;s Breathwork Conditions
            </div>
            <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40">
              {location.name}{location.country ? `, ${location.country}` : ''}
            </div>
          </div>

          {/* Summary stats */}
          <div className="flex gap-4 mb-6">
            <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className="font-data text-[9px] tracking-wider text-text-secondary/40 mb-1">AQI</div>
              <div className="font-data text-2xl font-medium" style={{ color: band.colour }}>{Math.round(aqi)}</div>
              <div className="font-body text-[10px]" style={{ color: band.colour }}>{band.label}</div>
            </div>
            <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className="font-data text-[9px] tracking-wider text-text-secondary/40 mb-1">UV</div>
              <div className="font-data text-2xl font-medium" style={{ color: uvBand.colour }}>{Math.round(data.current.uv_index)}</div>
              <div className="font-body text-[10px]" style={{ color: uvBand.colour }}>{uvBand.label}</div>
            </div>
            <div className="flex-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-3 text-center">
              <div className="font-data text-[9px] tracking-wider text-text-secondary/40 mb-1">PM2.5</div>
              <div className="font-data text-2xl font-medium text-text-primary">{Math.round(data.current.pm2_5)}</div>
              <div className="font-body text-[10px] text-text-secondary/50">μg/m³</div>
            </div>
          </div>

          {/* Modality checklist */}
          <div className="mb-6">
            <div className="font-data text-[9px] tracking-[0.2em] uppercase text-text-secondary/40 mb-3">
              Modality Check
            </div>
            <div className="space-y-2">
              {guidance.modalities.map(m => (
                <div key={m.name} className="flex items-center gap-2">
                  <span className={`font-data text-xs ${m.safe ? 'text-status-good' : 'text-status-moderate'}`}>
                    {m.safe ? '✓' : '✗'}
                  </span>
                  <span className={`font-body text-sm ${m.safe ? 'text-text-primary/80' : 'text-text-secondary/50'}`}>
                    {m.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Guidance */}
          <div className="mt-auto">
            <div className="font-display text-sm italic text-text-secondary/50 leading-relaxed mb-4">
              {guidance.summary}
            </div>
            <div className="font-data text-[9px] tracking-[0.2em] uppercase text-accent-primary/40 text-center">
              airas.app
            </div>
          </div>
        </div>
      </div>

      <button
        onClick={() => ref.current && downloadCard(ref.current, `airas-story-${Date.now()}.png`)}
        className="mt-3 glass-card px-4 py-2 font-data text-xs tracking-wider text-accent-primary hover:text-accent-secondary transition-colors"
      >
        Download
      </button>
    </div>
  )
}
