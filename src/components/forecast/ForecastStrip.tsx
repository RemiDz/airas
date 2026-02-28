'use client'

import { useMemo } from 'react'
import type { AirQualityResponse } from '@/lib/types'
import { computeDailyForecasts } from '@/lib/forecast-utils'
import DayCard from './DayCard'

interface ForecastStripProps {
  data: AirQualityResponse
}

export default function ForecastStrip({ data }: ForecastStripProps) {
  const forecasts = useMemo(() => computeDailyForecasts(data), [data])

  return (
    <div className="overflow-x-auto scroll-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
      <div className="flex gap-3 min-w-max sm:min-w-0 sm:grid sm:grid-cols-5">
        {forecasts.map((day, i) => (
          <DayCard key={day.dayLabel} day={day} delay={i * 0.07} />
        ))}
      </div>
    </div>
  )
}
