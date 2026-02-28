'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { AirQualityResponse, Location } from '@/lib/types'
import { fetchAirQuality } from '@/lib/api'
import { REFRESH_INTERVAL } from '@/lib/constants'

interface AirQualityState {
  data: AirQualityResponse | null
  loading: boolean
  error: string | null
  lastUpdated: Date | null
  refresh: () => void
}

export function useAirQuality(location: Location): AirQualityState {
  const [data, setData] = useState<AirQualityResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchAirQuality(location.latitude, location.longitude)
      setData(result)
      setLastUpdated(new Date())
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch air quality data')
    } finally {
      setLoading(false)
    }
  }, [location.latitude, location.longitude])

  useEffect(() => {
    fetchData()

    // Auto-refresh
    intervalRef.current = setInterval(fetchData, REFRESH_INTERVAL)

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [fetchData])

  return {
    data,
    loading,
    error,
    lastUpdated,
    refresh: fetchData,
  }
}
