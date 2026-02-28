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
        {/* Settings gear */}
        <button
          onClick={() => setSettingsOpen(true)}
          className="fixed top-4 right-4 z-40 p-2 text-text-secondary/40 hover:text-text-secondary/70 hover:rotate-45 transition-all duration-500"
          aria-label="Settings"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
          </svg>
        </button>

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
