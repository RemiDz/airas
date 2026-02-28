'use client'

import { useMemo } from 'react'
import { useLocation } from '@/hooks/useLocation'
import { useAirQuality } from '@/hooks/useAirQuality'
import { generateSessionGuidance } from '@/lib/practitioner'
import { computeDailyForecasts } from '@/lib/forecast-utils'
import {
  generateDailyCaptions,
  generateBreathworkCaptions,
  generateForecastCaptions,
  generatePollenCaptions,
} from '@/lib/promo-utils'
import { getAqiBand } from '@/lib/aqi-utils'
import { hasPollenData, extractPollenTypes, getOverallPollenLevel } from '@/lib/pollen-utils'
import PromoCardDaily from '@/components/promo/PromoCardDaily'
import PromoCardStory from '@/components/promo/PromoCardStory'
import PromoCardForecast from '@/components/promo/PromoCardForecast'
import PromoCardPollen from '@/components/promo/PromoCardPollen'
import CaptionGenerator from '@/components/promo/CaptionGenerator'

export default function PromoPage() {
  const { location } = useLocation()
  const { data, loading, error } = useAirQuality(location)

  const guidance = useMemo(() => data ? generateSessionGuidance(data) : null, [data])
  const forecasts = useMemo(() => data ? computeDailyForecasts(data) : [], [data])

  if (loading || !data) {
    return (
      <div className="min-h-screen atmospheric-bg flex items-center justify-center">
        <div className="font-body text-sm text-text-secondary/50">Loading data...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen atmospheric-bg flex items-center justify-center">
        <div className="font-body text-sm text-status-poor/70">{error}</div>
      </div>
    )
  }

  const aqi = data.current.european_aqi
  const band = getAqiBand(aqi)
  const locationName = `${location.name}${location.country ? `, ${location.country}` : ''}`

  // Caption data
  const dailyCaptions = generateDailyCaptions(aqi, band.label, locationName)

  const safeModalities = guidance?.modalities.filter(m => m.safe).map(m => m.name) ?? []
  const unsafeModalities = guidance?.modalities.filter(m => !m.safe).map(m => m.name) ?? []
  const breathworkCaptions = generateBreathworkCaptions(aqi, safeModalities, unsafeModalities)

  const bestDay = forecasts.reduce((a, b) => (a.avgAqi < b.avgAqi ? a : b), forecasts[0])
  const worstDay = forecasts.reduce((a, b) => (a.avgAqi > b.avgAqi ? a : b), forecasts[0])
  const forecastCaptions = generateForecastCaptions(
    bestDay?.dayLabel ?? 'Today',
    worstDay && worstDay.avgAqi > 40 ? worstDay.dayLabel : ''
  )

  const pollenAvailable = hasPollenData(data)
  const pollenTypes = extractPollenTypes(data)
  const activePollenTypes = pollenTypes.filter(t => t.currentValue !== null && t.currentValue > 0)
  const highestPollen = activePollenTypes.length > 0
    ? activePollenTypes.reduce((a, b) => (a.currentValue! > b.currentValue! ? a : b))
    : null
  const overallPollen = getOverallPollenLevel(data)

  return (
    <div className="min-h-screen atmospheric-bg">
      <div className="mx-auto max-w-5xl px-6 py-12">
        {/* Header */}
        <div className="mb-12">
          <div className="font-display text-3xl font-light text-text-primary mb-2">
            Promo Content Studio
          </div>
          <div className="font-body text-sm text-text-secondary/50">
            Generate social media cards with live data from {locationName}
          </div>
        </div>

        {/* Daily AQI Card */}
        <section className="mb-16">
          <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40 mb-4">
            Daily AQI Card — 1080×1080
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-shrink-0">
              <PromoCardDaily data={data} location={location} scale="european" />
            </div>
            <div className="flex-1 min-w-0">
              <CaptionGenerator label="Daily AQI" captions={dailyCaptions} />
            </div>
          </div>
        </section>

        {/* Breathwork Advisory — Story */}
        <section className="mb-16">
          <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40 mb-4">
            Breathwork Advisory — 1080×1350 (Story)
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-shrink-0">
              <PromoCardStory data={data} location={location} />
            </div>
            <div className="flex-1 min-w-0">
              <CaptionGenerator label="Breathwork Advisory" captions={breathworkCaptions} />
            </div>
          </div>
        </section>

        {/* Weekly Forecast Card */}
        <section className="mb-16">
          <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40 mb-4">
            Weekly Forecast — 1200×628 (Twitter/LinkedIn)
          </div>
          <div className="flex flex-col gap-6 lg:flex-row">
            <div className="flex-shrink-0">
              <PromoCardForecast data={data} location={location} />
            </div>
            <div className="flex-1 min-w-0">
              <CaptionGenerator label="Weekly Forecast" captions={forecastCaptions} />
            </div>
          </div>
        </section>

        {/* Pollen Alert — only when moderate+ */}
        {pollenAvailable && highestPollen && overallPollen && overallPollen.label !== 'None/Low' && (
          <section className="mb-16">
            <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40 mb-4">
              Pollen Alert — 1080×1080
            </div>
            <div className="flex flex-col gap-6 lg:flex-row">
              <div className="flex-shrink-0">
                <PromoCardPollen data={data} location={location} />
              </div>
              <div className="flex-1 min-w-0">
                <CaptionGenerator
                  label="Pollen Alert"
                  captions={generatePollenCaptions(highestPollen.name, overallPollen.label)}
                />
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
