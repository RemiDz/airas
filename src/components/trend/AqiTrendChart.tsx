'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import type { AirQualityResponse, AqiScale } from '@/lib/types'
import { getAqiBand } from '@/lib/aqi-utils'

interface AqiTrendChartProps {
  data: AirQualityResponse
  scale: AqiScale
}

interface ChartPoint {
  time: string
  label: string
  aqi: number
  isNow: boolean
}

export default function AqiTrendChart({ data, scale }: AqiTrendChartProps) {
  const chartData = useMemo(() => {
    const now = new Date()
    const hours24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000)
    const points: ChartPoint[] = []
    let nowIdx = -1

    for (let i = 0; i < data.hourly.time.length; i++) {
      const t = new Date(data.hourly.time[i])
      if (t < hours24Ago) continue
      if (t > now) break

      const aqi = scale === 'european'
        ? data.hourly.european_aqi[i]
        : data.hourly.us_aqi[i]

      if (aqi == null) continue

      const label = t.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
      points.push({ time: data.hourly.time[i], label, aqi, isNow: false })
      nowIdx = points.length - 1
    }

    if (nowIdx >= 0) points[nowIdx].isNow = true
    return points
  }, [data, scale])

  const nowPoint = chartData.find(p => p.isNow)

  return (
    <motion.div
      className="glass-card p-5 sm:p-6"
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] }}
    >
      <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/50 mb-4">
        24H AQI Trend
      </div>

      <div className="h-48 sm:h-56">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
            <defs>
              <linearGradient id="aqiGradientFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A8DADC" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#A8DADC" stopOpacity={0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              horizontal={true}
              vertical={false}
              stroke="rgba(200, 196, 220, 0.05)"
            />

            <XAxis
              dataKey="label"
              tick={{ fontSize: 10, fill: 'rgba(200, 196, 220, 0.4)', fontFamily: 'var(--font-jetbrains), monospace' }}
              axisLine={false}
              tickLine={false}
              interval="preserveStartEnd"
              minTickGap={50}
            />

            <YAxis hide />

            <Tooltip content={<CustomTooltip scale={scale} />} />

            {nowPoint && (
              <ReferenceLine
                x={nowPoint.label}
                stroke="rgba(168, 218, 220, 0.3)"
                strokeDasharray="4 4"
                strokeWidth={1}
              />
            )}

            <Area
              type="monotone"
              dataKey="aqi"
              stroke="#A8DADC"
              strokeWidth={2}
              strokeOpacity={0.8}
              fill="url(#aqiGradientFill)"
              animationDuration={1200}
              animationEasing="ease-out"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CustomTooltip({ active, payload, scale }: { active?: boolean; payload?: any[]; label?: string; scale: AqiScale }) {
  if (!active || !payload?.length) return null

  const entry = payload[0]
  const value = entry.value as number
  const band = getAqiBand(value, scale)
  const point = (entry.payload ?? {}) as ChartPoint

  return (
    <div className="glass-card px-3 py-2 text-xs">
      <div className="font-data text-text-secondary/70 mb-0.5">{point.label}</div>
      <div className="flex items-center gap-2">
        <span
          className="h-1.5 w-1.5 rounded-full"
          style={{ backgroundColor: band.colour }}
        />
        <span className="font-data font-medium" style={{ color: band.colour }}>
          {Math.round(value)}
        </span>
        <span className="text-text-secondary/50">{band.label}</span>
      </div>
    </div>
  )
}
