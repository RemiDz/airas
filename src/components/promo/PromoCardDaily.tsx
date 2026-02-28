'use client'

import { useRef } from 'react'
import type { AirQualityResponse, Location, AqiScale } from '@/lib/types'
import { getAqiBand, getAqiBarPosition } from '@/lib/aqi-utils'
import { getPractitionerTagline } from '@/lib/aqi-utils'
import { downloadCard } from '@/lib/promo-utils'

interface Props {
  data: AirQualityResponse
  location: Location
  scale: AqiScale
}

export default function PromoCardDaily({ data, location, scale }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const aqi = scale === 'european' ? data.current.european_aqi : data.current.us_aqi
  const band = getAqiBand(aqi, scale)
  const position = getAqiBarPosition(aqi, scale)
  const tagline = getPractitionerTagline(data.current.european_aqi)

  return (
    <div>
      <div
        ref={ref}
        style={{ width: 540, height: 540, padding: 48, backgroundColor: '#06061A' }}
        className="relative overflow-hidden flex flex-col justify-between"
      >
        {/* Subtle gradient bg */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at 50% 30%, #0A0A2E, #06061A)' }} />

        <div className="relative z-10">
          <div className="font-data text-[10px] tracking-[0.25em] uppercase text-text-secondary/50 mb-1">
            Air Quality Report
          </div>
          <div className="font-body text-sm text-text-secondary/60">
            {location.name}{location.country ? `, ${location.country}` : ''}
          </div>
        </div>

        <div className="relative z-10 text-center py-8">
          <div
            className="font-data text-[96px] font-medium leading-none"
            style={{ color: band.colour, textShadow: `0 0 60px ${band.colour}30` }}
          >
            {Math.round(aqi)}
          </div>
          <div className="font-display text-2xl font-light mt-2" style={{ color: band.colour }}>
            {band.label}
          </div>
        </div>

        <div className="relative z-10">
          {/* AQI bar */}
          <div className="relative mb-3">
            <div
              className="h-1.5 w-full rounded-full"
              style={{ background: 'linear-gradient(90deg, #34D399 0%, #A8DADC 20%, #F59E0B 40%, #F97316 60%, #EF4444 80%, #991B1B 100%)' }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 h-3 w-3 rounded-full border-2"
              style={{ left: `${position}%`, backgroundColor: band.colour, borderColor: '#06061A' }}
            />
          </div>

          <div className="font-display text-sm italic text-text-secondary/60 text-center mb-4">
            &ldquo;{tagline}&rdquo;
          </div>

          <div className="font-data text-[9px] tracking-[0.2em] uppercase text-accent-primary/40 text-center">
            airas.app
          </div>
        </div>
      </div>

      <button
        onClick={() => ref.current && downloadCard(ref.current, `airas-daily-${Date.now()}.png`)}
        className="mt-3 glass-card px-4 py-2 font-data text-xs tracking-wider text-accent-primary hover:text-accent-secondary transition-colors"
      >
        Download
      </button>
    </div>
  )
}
