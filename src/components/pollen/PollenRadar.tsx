'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import type { AirQualityResponse } from '@/lib/types'
import {
  hasPollenData,
  extractPollenTypes,
  getOverallPollenLevel,
  getPollenPractitionerNote,
} from '@/lib/pollen-utils'
import PollenBar from './PollenBar'
import PollenTrend from './PollenTrend'

interface PollenRadarProps {
  data: AirQualityResponse
}

export default function PollenRadar({ data }: PollenRadarProps) {
  const pollenAvailable = hasPollenData(data)
  const types = useMemo(() => extractPollenTypes(data), [data])
  const overallBand = useMemo(() => getOverallPollenLevel(data), [data])
  const practitionerNote = useMemo(() => getPollenPractitionerNote(data), [data])

  const treeTypes = types.filter(t => t.category === 'tree')
  const grassTypes = types.filter(t => t.category === 'grass')

  const season = new Date().toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })

  // Compute a shared max for the bars so they're proportional
  const allValues = types.map(t => t.currentValue ?? 0)
  const maxScale = Math.max(80, ...allValues)

  return (
    <>
      <motion.div
        className="glass-card p-5 sm:p-6"
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-40px' }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <span className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50">
            Pollen Radar
          </span>
          <span className="font-data text-[10px] tracking-wider text-text-secondary/30">
            {season}
          </span>
        </div>

        {!pollenAvailable ? (
          <p className="font-body text-sm text-text-secondary/50 italic py-4">
            Pollen data not available for this location or season.
          </p>
        ) : (
          <>
            {/* Overall level */}
            {overallBand && (
              <div className="mb-5">
                <span className="font-body text-sm text-text-secondary/60">Overall: </span>
                <span className="font-body text-sm font-medium" style={{ color: overallBand.colour }}>
                  {overallBand.label}
                </span>
              </div>
            )}

            {/* Two-column pollen breakdown */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-5">
              {/* Tree pollen */}
              <div>
                <div className="font-data text-[10px] tracking-[0.15em] uppercase text-text-secondary/40 mb-3">
                  🌳 Tree Pollen
                </div>
                <div className="space-y-2.5">
                  {treeTypes.map(t => (
                    <PollenBar
                      key={t.key}
                      name={t.name}
                      icon={t.icon}
                      value={t.currentValue}
                      maxScale={maxScale}
                    />
                  ))}
                </div>
              </div>

              {/* Grass & weed pollen */}
              <div>
                <div className="font-data text-[10px] tracking-[0.15em] uppercase text-text-secondary/40 mb-3">
                  🌾 Grass &amp; Weed
                </div>
                <div className="space-y-2.5">
                  {grassTypes.map(t => (
                    <PollenBar
                      key={t.key}
                      name={t.name}
                      icon={t.icon}
                      value={t.currentValue}
                      maxScale={maxScale}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Practitioner note */}
            <div className="flex items-start gap-2 pt-4 border-t border-white/[0.06]">
              <span className="text-sm mt-0.5">🫁</span>
              <p className="font-body text-sm text-text-secondary/60 italic leading-relaxed">
                <span className="text-text-secondary/80 not-italic font-medium">Breathwork Impact:</span>{' '}
                {practitionerNote}
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* 5-day pollen trend chart */}
      {pollenAvailable && <PollenTrend data={data} />}
    </>
  )
}
