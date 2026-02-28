'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'
import type { AirQualityResponse } from '@/lib/types'
import { getUvBand, getUvBarPosition, getUvExposureGuidance } from '@/lib/uv-utils'

interface UvSolarCardProps {
  data: AirQualityResponse
}

export default function UvSolarCard({ data }: UvSolarCardProps) {
  const uv = data.current.uv_index
  const uvClearSky = data.current.uv_index_clear_sky
  const band = getUvBand(uv)
  const position = getUvBarPosition(uv)
  const guidance = getUvExposureGuidance(uv)

  const trendData = useMemo(() => {
    const now = new Date()
    const hours24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const points: { label: string; uv: number }[] = []

    for (let i = 0; i < data.hourly.time.length; i++) {
      const t = new Date(data.hourly.time[i])
      if (t < hours24Ago) continue
      if (t > now) break
      points.push({
        label: t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
        uv: data.hourly.uv_index[i] ?? 0,
      })
    }
    return points
  }, [data])

  return (
    <motion.div
      className="glass-card p-5 sm:p-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      {/* Header */}
      <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50 mb-5">
        UV &amp; Solar
      </div>

      {/* UV Index display */}
      <div className="flex items-baseline gap-3 mb-1">
        <span className="font-body text-sm text-text-secondary/60">UV Index:</span>
        <span className="font-data text-3xl font-medium" style={{ color: band.colour }}>
          {Math.round(uv * 10) / 10}
        </span>
      </div>

      {/* UV gradient bar */}
      <div className="relative mb-4">
        <div
          className="h-1.5 w-full rounded-full"
          style={{
            background: 'linear-gradient(90deg, #34D399 0%, #F59E0B 30%, #F97316 50%, #EF4444 70%, #8B5CF6 100%)',
          }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
          style={{ left: `${position}%` }}
        >
          <div
            className="h-3 w-3 rounded-full border-2 border-void"
            style={{ backgroundColor: band.colour }}
          />
        </div>
        <div className="flex justify-between mt-1">
          <span className="font-data text-[9px] text-text-secondary/30">0</span>
          <span
            className="font-data text-[10px] tracking-wider"
            style={{ color: band.colour }}
          >
            {band.label}
          </span>
          <span className="font-data text-[9px] text-text-secondary/30">11+</span>
        </div>
      </div>

      {/* Clear sky comparison */}
      <div className="flex items-center gap-2 mb-5 text-sm">
        <span className="font-body text-text-secondary/50">Clear Sky UV:</span>
        <span className="font-data text-text-secondary/70">{Math.round(uvClearSky * 10) / 10}</span>
        <span className="font-body text-[11px] text-text-secondary/35 italic">
          (what UV would be without cloud cover)
        </span>
      </div>

      {/* Exposure guidance */}
      <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] p-4 mb-5">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-sm">☀️</span>
          <span className="font-body text-sm text-text-secondary/70 font-medium">
            Outdoor session guidance:
          </span>
        </div>
        <p className="font-body text-sm text-text-secondary/60 leading-relaxed ml-6">
          Up to <span className="font-data text-text-primary/80">{guidance.safeMinutes}</span> without sun protection.{' '}
          {guidance.practitionerNote}
        </p>
      </div>

      {/* 24h UV Trend */}
      {trendData.length > 0 && (
        <div>
          <div className="font-data text-[10px] tracking-[0.15em] uppercase text-text-secondary/35 mb-2">
            24h UV Trend
          </div>
          <div className="h-28">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
                <defs>
                  <linearGradient id="uvGradientFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 9, fill: 'rgba(200, 196, 220, 0.3)', fontFamily: 'var(--font-jetbrains), monospace' }}
                  axisLine={false}
                  tickLine={false}
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis hide />
                <Tooltip content={<UvTooltip />} />
                <Area
                  type="monotone"
                  dataKey="uv"
                  stroke="#8B5CF6"
                  strokeWidth={1.5}
                  strokeOpacity={0.7}
                  fill="url(#uvGradientFill)"
                  animationDuration={800}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </motion.div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function UvTooltip({ active, payload }: { active?: boolean; payload?: any[]; label?: string }) {
  if (!active || !payload?.length) return null

  const value = payload[0].value as number
  const band = getUvBand(value)
  const point = payload[0].payload as { label: string }

  return (
    <div className="glass-card px-3 py-2 text-xs">
      <div className="font-data text-text-secondary/70 mb-0.5">{point.label}</div>
      <div className="flex items-center gap-2">
        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: band.colour }} />
        <span className="font-data font-medium" style={{ color: band.colour }}>
          {Math.round(value * 10) / 10}
        </span>
        <span className="text-text-secondary/50">{band.label}</span>
      </div>
    </div>
  )
}
