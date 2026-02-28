'use client'

import { motion } from 'framer-motion'
import type { AirQualityResponse } from '@/lib/types'
import { getPollutantBand } from '@/lib/aqi-utils'

interface QuickStatsProps {
  data: AirQualityResponse
}

const stats = [
  { key: 'pm2_5', label: 'PM2.5', field: 'pm2_5' as const },
  { key: 'pm10', label: 'PM10', field: 'pm10' as const },
  { key: 'no2', label: 'NO₂', field: 'nitrogen_dioxide' as const },
  { key: 'o3', label: 'O₃', field: 'ozone' as const },
]

const containerVariants = {
  visible: {
    transition: { staggerChildren: 0.08 },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
    },
  },
}

export default function QuickStats({ data }: QuickStatsProps) {
  return (
    <motion.div
      className="grid grid-cols-4 gap-3"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {stats.map(({ key, label, field }) => {
        const value = data.current[field]
        const band = getPollutantBand(
          field === 'nitrogen_dioxide' ? 'nitrogen_dioxide' :
          field === 'ozone' ? 'ozone' : field,
          value
        )

        return (
          <motion.div
            key={key}
            className="glass-card p-3 text-center"
            variants={itemVariants}
          >
            <div className="font-data text-[10px] tracking-[0.15em] uppercase text-text-secondary/70 mb-1">
              {label}
            </div>
            <div className="font-data text-xl font-medium text-text-primary">
              {Math.round(value)}
            </div>
            <div
              className="mx-auto mt-1.5 h-1 w-1 rounded-full"
              style={{ backgroundColor: band.colour }}
            />
          </motion.div>
        )
      })}
    </motion.div>
  )
}
