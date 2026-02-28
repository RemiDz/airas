'use client'

import type { AirQualityResponse } from '@/lib/types'
import { extractPollutants } from '@/lib/transforms'
import PollutantCard from './PollutantCard'

interface PollutantGridProps {
  data: AirQualityResponse
}

export default function PollutantGrid({ data }: PollutantGridProps) {
  const pollutants = extractPollutants(data)

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {pollutants.map((p, i) => (
        <PollutantCard key={p.name} pollutant={p} delay={i * 0.08} />
      ))}
    </div>
  )
}
