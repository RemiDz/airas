'use client'

import { useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { AirQualityResponse } from '@/lib/types'
import { extractPollenHourly } from '@/lib/pollen-utils'

interface PollenTrendProps {
  data: AirQualityResponse
}

const POLLEN_COLOURS: Record<string, { colour: string; label: string }> = {
  alder_pollen:   { colour: '#34D399', label: 'Alder' },
  birch_pollen:   { colour: '#A8DADC', label: 'Birch' },
  olive_pollen:   { colour: '#3B82F6', label: 'Olive' },
  grass_pollen:   { colour: '#FFD166', label: 'Grass' },
  mugwort_pollen: { colour: '#F97316', label: 'Mugwort' },
  ragweed_pollen: { colour: '#EF4444', label: 'Ragweed' },
}

interface ChartRow {
  label: string
  [key: string]: number | string | null
}

export default function PollenTrend({ data }: PollenTrendProps) {
  const [hidden, setHidden] = useState<Set<string>>(new Set())

  const { chartData, activeKeys } = useMemo(() => {
    const hourly = extractPollenHourly(data)
    const rows: ChartRow[] = []

    // Sample every 3 hours so chart isn't too dense
    for (let i = 0; i < hourly.time.length; i += 3) {
      const t = new Date(hourly.time[i])
      const dayLabel = t.toLocaleDateString('en-GB', { weekday: 'short' })
      const hourLabel = t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })

      const row: ChartRow = { label: `${dayLabel} ${hourLabel}` }
      for (const [key, values] of Object.entries(hourly.series)) {
        row[key] = values[i] ?? 0
      }
      rows.push(row)
    }

    // Determine which pollen types have any non-null, non-zero data
    const active = Object.keys(hourly.series).filter(key =>
      hourly.series[key].some(v => v !== null && v > 0)
    )

    return { chartData: rows, activeKeys: active }
  }, [data])

  if (activeKeys.length === 0) return null

  const toggleKey = (key: string) => {
    setHidden(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  return (
    <motion.div
      className="glass-card p-5 sm:p-6 mt-4"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50 mb-4">
        5-Day Pollen Trend
      </div>

      {/* Legend toggles */}
      <div className="flex flex-wrap gap-2 mb-4">
        {activeKeys.map(key => {
          const cfg = POLLEN_COLOURS[key]
          const isHidden = hidden.has(key)
          return (
            <button
              key={key}
              onClick={() => toggleKey(key)}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-data tracking-wider border transition-all duration-200 ${
                isHidden
                  ? 'border-white/[0.04] text-text-secondary/30'
                  : 'border-white/[0.08] text-text-secondary/70'
              }`}
            >
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{
                  backgroundColor: cfg.colour,
                  opacity: isHidden ? 0.2 : 1,
                }}
              />
              {cfg.label}
            </button>
          )
        })}
      </div>

      <div className="h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <XAxis
              dataKey="label"
              tick={{ fontSize: 9, fill: 'rgba(200, 196, 220, 0.3)', fontFamily: 'var(--font-jetbrains), monospace' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={80}
            />
            <YAxis hide />
            <Tooltip content={<PollenTooltip />} />
            <Legend content={() => null} />

            {activeKeys.filter(k => !hidden.has(k)).map(key => {
              const cfg = POLLEN_COLOURS[key]
              return (
                <Area
                  key={key}
                  type="monotone"
                  dataKey={key}
                  name={cfg.label}
                  stackId="pollen"
                  stroke={cfg.colour}
                  strokeWidth={1.5}
                  strokeOpacity={0.7}
                  fill={cfg.colour}
                  fillOpacity={0.15}
                  animationDuration={800}
                />
              )
            })}
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function PollenTooltip({ active, payload, label }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null

  return (
    <div className="glass-card px-3 py-2 text-xs">
      <div className="font-data text-text-secondary/70 mb-1">{label}</div>
      {payload.map((entry: { name: string; value: number; color: string }, i: number) => (
        <div key={i} className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-text-secondary/60">{entry.name}</span>
          <span className="font-data font-medium text-text-primary/80 ml-auto">
            {Math.round(entry.value)}
          </span>
        </div>
      ))}
    </div>
  )
}
