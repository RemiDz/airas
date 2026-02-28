'use client'

import { useState, useEffect, useCallback } from 'react'
import type { Location } from '@/lib/types'
import { DEFAULT_LOCATION } from '@/lib/constants'
import { useGeolocation } from './useGeolocation'

interface LocationState {
  location: Location
  setLocation: (location: Location) => void
  isDefault: boolean
}

export function useLocation(): LocationState {
  const geo = useGeolocation()
  const [location, setLocationState] = useState<Location>(DEFAULT_LOCATION)
  const [isDefault, setIsDefault] = useState(true)

  useEffect(() => {
    if (geo.latitude && geo.longitude && isDefault) {
      setLocationState({
        name: 'Current Location',
        country: '',
        latitude: geo.latitude,
        longitude: geo.longitude,
      })
    }
  }, [geo.latitude, geo.longitude, isDefault])

  const setLocation = useCallback((loc: Location) => {
    setLocationState(loc)
    setIsDefault(false)
  }, [])

  return { location, setLocation, isDefault }
}
