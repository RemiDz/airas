'use client'

import { useState, useEffect, useRef, lazy, Suspense } from 'react'
import type { AqiScale } from '@/lib/types'
import { REFRESH_INTERVAL } from '@/lib/constants'
import { useLocation } from '@/hooks/useLocation'
import { useAirQuality } from '@/hooks/useAirQuality'
import AtmosphericCanvas from '@/components/background/AtmosphericCanvas'
import HeroSection from '@/components/hero/HeroSection'
import HeroSkeleton from '@/components/hero/HeroSkeleton'
import SectionDivider from '@/components/shared/SectionDivider'
import SkeletonCard from '@/components/shared/SkeletonCard'
import Footer from '@/components/shared/Footer'
import LocationSearch from '@/components/location/LocationSearch'
import SettingsPanel from '@/components/settings/SettingsPanel'

// Lazy load below-fold sections
const SessionGuidanceCard = lazy(() => import('@/components/guidance/SessionGuidanceCard'))
const AqiTrendChart = lazy(() => import('@/components/trend/AqiTrendChart'))
const PollutantGrid = lazy(() => import('@/components/pollutants/PollutantGrid'))
const PollenRadar = lazy(() => import('@/components/pollen/PollenRadar'))
const UvSolarCard = lazy(() => import('@/components/atmosphere/UvSolarCard'))
const CompositionCard = lazy(() => import('@/components/atmosphere/CompositionCard'))
const ForecastStrip = lazy(() => import('@/components/forecast/ForecastStrip'))
const BestWindows = lazy(() => import('@/components/forecast/BestWindows'))

function SectionFallback() {
  return <SkeletonCard className="h-48" />
}

export default function Home() {
  const { location, setLocation } = useLocation()
  const { data, loading, error, lastUpdated, refresh } = useAirQuality(location)
  const [scale, setScale] = useState<AqiScale>('european')
  const [autoRefresh, setAutoRefresh] = useState(true)
  const [locationSearchOpen, setLocationSearchOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const autoRefreshRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Manage auto-refresh toggle
  useEffect(() => {
    if (autoRefreshRef.current) clearInterval(autoRefreshRef.current)
    if (autoRefresh) {
      autoRefreshRef.current = setInterval(refresh, REFRESH_INTERVAL)
    }
    return () => {
      if (autoRefreshRef.current) clearInterval(autoRefreshRef.current)
    }
  }, [autoRefresh, refresh])

  return (
    <>
      <AtmosphericCanvas />

      <main className="relative min-h-screen">
        {loading && !data ? (
          <HeroSkeleton />
        ) : error && !data ? (
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="glass-card p-8 text-center max-w-md">
              <div className="font-display text-2xl font-light text-text-primary mb-3">
                Unable to Load Data
              </div>
              <p className="font-body text-sm text-text-secondary/70 mb-6">
                {error}
              </p>
              <button
                onClick={refresh}
                className="glass-card px-6 py-2.5 font-data text-xs tracking-[0.15em] uppercase text-accent-primary hover:text-accent-secondary transition-colors duration-300"
              >
                Retry
              </button>
            </div>
          </div>
        ) : data ? (
          <>
            <HeroSection
              data={data}
              location={location}
              lastUpdated={lastUpdated}
              scale={scale}
              onLocationClick={() => setLocationSearchOpen(true)}
              onRefresh={refresh}
              onSettingsClick={() => setSettingsOpen(true)}
            />

            <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 pb-8">
              <SectionDivider label="Session Guidance" />
              <Suspense fallback={<SectionFallback />}>
                <SessionGuidanceCard data={data} />
              </Suspense>

              <SectionDivider label="24H AQI Trend" />
              <Suspense fallback={<SectionFallback />}>
                <AqiTrendChart data={data} scale={scale} />
              </Suspense>

              <SectionDivider label="Pollutant Breakdown" />
              <Suspense fallback={<SectionFallback />}>
                <PollutantGrid data={data} />
              </Suspense>

              <SectionDivider label="Pollen Radar" />
              <Suspense fallback={<SectionFallback />}>
                <PollenRadar data={data} />
              </Suspense>

              <SectionDivider label="UV & Solar" />
              <Suspense fallback={<SectionFallback />}>
                <UvSolarCard data={data} />
              </Suspense>

              <SectionDivider label="Atmosphere" />
              <Suspense fallback={<SectionFallback />}>
                <CompositionCard data={data} />
              </Suspense>

              <SectionDivider label="5-Day Forecast" />
              <Suspense fallback={<SectionFallback />}>
                <ForecastStrip data={data} />
                <BestWindows data={data} />
              </Suspense>
            </div>

            <Footer />
          </>
        ) : null}
      </main>

      {/* Modals */}
      <LocationSearch
        open={locationSearchOpen}
        onClose={() => setLocationSearchOpen(false)}
        onSelect={(loc) => {
          setLocation(loc)
          setLocationSearchOpen(false)
        }}
      />

      <SettingsPanel
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        scale={scale}
        onScaleChange={setScale}
        autoRefresh={autoRefresh}
        onAutoRefreshChange={setAutoRefresh}
      />
    </>
  )
}
