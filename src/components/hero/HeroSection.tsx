'use client'

import { motion } from 'framer-motion'
import type { AirQualityResponse, Location, AqiScale } from '@/lib/types'
import { getAqiBand, getPractitionerTagline } from '@/lib/aqi-utils'
import AnimatedNumber from '@/components/shared/AnimatedNumber'
import AqiGradientBar from './AqiGradientBar'
import QuickStats from './QuickStats'

interface HeroSectionProps {
  data: AirQualityResponse
  location: Location
  lastUpdated: Date | null
  scale: AqiScale
  onLocationClick: () => void
  onRefresh: () => void
  onSettingsClick: () => void
}

export default function HeroSection({
  data,
  location,
  lastUpdated,
  scale,
  onLocationClick,
  onRefresh,
  onSettingsClick,
}: HeroSectionProps) {
  const aqi = scale === 'european' ? data.current.european_aqi : data.current.us_aqi
  const band = getAqiBand(aqi, scale)
  const tagline = getPractitionerTagline(data.current.european_aqi)

  const updatedTime = lastUpdated
    ? lastUpdated.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '—'

  return (
    <section className="relative px-4 pt-8 pb-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl">
        {/* Location bar */}
        <motion.div
          className="flex items-center justify-between mb-10"
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <button
            onClick={onLocationClick}
            className="flex items-center gap-2 text-text-secondary hover:text-text-primary transition-colors duration-300"
          >
            <svg
              className="h-4 w-4 animate-float"
              style={{ animationDuration: '4s' }}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 0 1 15 0Z"
              />
            </svg>
            <span className="font-body text-sm font-light">
              {location.name}{location.country ? `, ${location.country}` : ''}
            </span>
          </button>

          <div className="flex items-center gap-3">
            <button
              onClick={onSettingsClick}
              className="p-1 text-text-secondary/40 hover:text-text-secondary/70 hover:rotate-45 transition-all duration-500"
              aria-label="Settings"
            >
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
              </svg>
            </button>
            <button
              onClick={onRefresh}
              className="flex items-center gap-1.5 text-text-secondary/60 hover:text-text-secondary transition-colors duration-300"
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0 3.181 3.183a8.25 8.25 0 0 0 13.803-3.7M4.031 9.865a8.25 8.25 0 0 1 13.803-3.7l3.181 3.182"
                />
              </svg>
              <span className="font-data text-[10px] tracking-wider">
                Updated {updatedTime}
              </span>
            </button>
          </div>
        </motion.div>

        {/* AQI Score */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            className="font-data text-[56px] sm:text-[72px] lg:text-[96px] font-medium leading-none"
            style={{
              color: band.colour,
              textShadow: `0 0 40px ${band.colour}30, 0 0 80px ${band.colour}15`,
            }}
          >
            <AnimatedNumber value={aqi} duration={1200} />
          </div>
          <div
            className="font-display text-2xl font-light mt-2"
            style={{ color: band.colour }}
          >
            {band.label}
          </div>
        </motion.div>

        {/* AQI Gradient Bar */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <AqiGradientBar value={aqi} scale={scale} colour={band.colour} />
        </motion.div>

        {/* Practitioner Tagline */}
        <motion.p
          className="text-center font-display text-lg italic text-text-secondary/80 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          &ldquo;{tagline}&rdquo;
        </motion.p>

        {/* Quick Stats */}
        <QuickStats data={data} />
      </div>
    </section>
  )
}
