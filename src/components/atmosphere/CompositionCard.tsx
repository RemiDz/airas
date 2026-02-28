'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { AirQualityResponse } from '@/lib/types'
import { getAirClarityNote } from '@/lib/uv-utils'
import Sparkline from '@/components/shared/Sparkline'

interface CompositionCardProps {
  data: AirQualityResponse
}

interface MetricRow {
  label: string
  formula: string
  value: number | null
  unit: string
  description: string
  history: number[]
  colour: string
}

export default function CompositionCard({ data }: CompositionCardProps) {
  const [expanded, setExpanded] = useState(false)

  const metrics = useMemo<MetricRow[]>(() => {
    const now = new Date()
    const hours24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000)

    const indices: number[] = []
    for (let i = 0; i < data.hourly.time.length; i++) {
      const t = new Date(data.hourly.time[i])
      if (t >= hours24Ago && t <= now) indices.push(i)
    }

    const slice = (arr: (number | null)[]): number[] =>
      indices.map(i => arr[i] ?? 0)

    // Current CO₂ and CH₄ from latest hourly value
    const latestIdx = indices.length > 0 ? indices[indices.length - 1] : 0

    return [
      {
        label: 'CO₂',
        formula: 'Carbon Dioxide',
        value: data.hourly.carbon_dioxide[latestIdx] ?? null,
        unit: 'ppm',
        description: 'Greenhouse gas concentration',
        history: slice(data.hourly.carbon_dioxide),
        colour: '#A8DADC',
      },
      {
        label: 'CH₄',
        formula: 'Methane',
        value: data.hourly.methane[latestIdx] ?? null,
        unit: 'μg/m³',
        description: 'Methane levels',
        history: slice(data.hourly.methane),
        colour: '#4ECDC4',
      },
      {
        label: 'Dust',
        formula: 'Particulate Dust',
        value: data.current.dust,
        unit: 'μg/m³',
        description: 'Saharan dust, wildfire particles',
        history: slice(data.hourly.dust),
        colour: '#FFD166',
      },
      {
        label: 'AOD',
        formula: 'Aerosol Optical Depth',
        value: data.hourly.aerosol_optical_depth[latestIdx] ?? null,
        unit: '',
        description: 'Atmospheric clarity / haze',
        history: slice(data.hourly.aerosol_optical_depth),
        colour: '#3B82F6',
      },
      {
        label: 'NH₃',
        formula: 'Ammonia',
        value: data.hourly.ammonia[latestIdx] ?? null,
        unit: 'μg/m³',
        description: 'Agricultural / industrial (EU only)',
        history: slice(data.hourly.ammonia),
        colour: '#F59E0B',
      },
    ]
  }, [data])

  const aod = metrics.find(m => m.label === 'AOD')?.value ?? 0
  const clarityNote = getAirClarityNote(aod ?? 0)

  return (
    <motion.div
      className="glass-card p-5 sm:p-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {/* Header with expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between"
      >
        <span className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50">
          Atmospheric Composition
        </span>
        <motion.svg
          className="h-4 w-4 text-text-secondary/40"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
          animate={{ rotate: expanded ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
        </motion.svg>
      </button>

      {/* Air clarity note — always visible */}
      <div className="mt-4 flex items-center gap-2">
        <span className="text-sm">🌤️</span>
        <span className="font-body text-sm text-text-secondary/60 italic">
          {clarityNote}
        </span>
      </div>

      {/* Expandable metrics */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
            className="overflow-hidden"
          >
            <div className="mt-5 space-y-3">
              {metrics.map(m => (
                <div
                  key={m.label}
                  className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-3.5"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <span className="font-data text-sm text-text-primary/80">{m.label}</span>
                      <span className="font-body text-[11px] text-text-secondary/40 ml-2">
                        {m.formula}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="font-data text-lg font-medium text-text-primary">
                        {m.value !== null ? (
                          m.label === 'AOD'
                            ? (m.value).toFixed(3)
                            : m.label === 'CO₂'
                            ? Math.round(m.value).toLocaleString()
                            : Math.round(m.value * 10) / 10
                        ) : '—'}
                      </span>
                      {m.unit && (
                        <span className="font-data text-[10px] text-text-secondary/40 ml-1">
                          {m.unit}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sparkline */}
                  {m.history.length > 0 && (
                    <div className="mb-1.5">
                      <Sparkline data={m.history} colour={m.colour} height={24} />
                    </div>
                  )}

                  <div className="font-body text-[11px] text-text-secondary/35">
                    {m.description}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
