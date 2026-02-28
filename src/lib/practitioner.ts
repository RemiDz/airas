import type { AirQualityResponse } from './types'

export interface SessionGuidance {
  overallRating: 'excellent' | 'good' | 'caution' | 'indoor-only' | 'avoid'
  outdoorSafe: boolean
  breathworkSafe: boolean
  summary: string
  modalities: {
    name: string
    safe: boolean
    note?: string
  }[]
  factors: {
    label: string
    severity: 'info' | 'caution' | 'warning'
    detail: string
  }[]
  nextWindow: string
}

export function generateSessionGuidance(data: AirQualityResponse): SessionGuidance {
  const aqi = data.current.european_aqi
  const uv = data.current.uv_index
  const pollenMax = getMaxPollen(data)

  const rating = determineRating(aqi, uv, pollenMax)
  const modalities = assessModalities(aqi, uv, pollenMax)
  const factors = identifyFactors(aqi, uv, pollenMax, data)
  const nextWindow = findNextWindow(data)

  return {
    overallRating: rating,
    outdoorSafe: rating === 'excellent' || rating === 'good',
    breathworkSafe: rating !== 'avoid' && rating !== 'indoor-only',
    summary: generateSummary(rating, aqi, uv, pollenMax),
    modalities,
    factors,
    nextWindow,
  }
}

function determineRating(
  aqi: number,
  uv: number,
  pollenMax: number
): SessionGuidance['overallRating'] {
  if (aqi > 80) return 'avoid'
  if (aqi > 60 || uv > 10 || pollenMax > 60) return 'indoor-only'
  if (aqi > 40 || uv > 7 || pollenMax > 30) return 'caution'
  if (aqi > 20 || uv > 5 || pollenMax > 10) return 'good'
  return 'excellent'
}

function getMaxPollen(data: AirQualityResponse): number {
  const values = [
    data.current.alder_pollen,
    data.current.birch_pollen,
    data.current.grass_pollen,
    data.current.mugwort_pollen,
    data.current.olive_pollen,
    data.current.ragweed_pollen,
  ].filter((v): v is number => v !== null)

  return values.length > 0 ? Math.max(...values) : 0
}

function assessModalities(
  aqi: number,
  uv: number,
  pollenMax: number
): SessionGuidance['modalities'] {
  return [
    {
      name: 'Pranayama',
      safe: aqi <= 30 && pollenMax <= 30,
      note: aqi > 30 ? 'Reduce intensity — elevated air particles' : undefined,
    },
    {
      name: 'Holotropic Breathwork',
      safe: aqi <= 30 && pollenMax <= 30,
      note: aqi > 30 ? 'Rapid deep breathing not recommended — move indoors' : undefined,
    },
    {
      name: 'Wim Hof Method',
      safe: aqi <= 40,
      note: aqi > 40 ? 'Consider indoor cold exposure alternatives' : undefined,
    },
    {
      name: 'Sound Bath (Outdoor)',
      safe: aqi <= 50 && uv <= 7,
      note: uv > 7 ? 'Seek shade — high UV for prolonged sessions' : undefined,
    },
    {
      name: 'Outdoor Yoga',
      safe: aqi <= 50 && uv <= 7,
      note: aqi > 50 ? 'Physical exertion increases pollutant intake' : undefined,
    },
    {
      name: 'Walking Meditation',
      safe: aqi <= 60,
      note: aqi > 60 ? 'Gentle practice — consider shorter duration' : undefined,
    },
  ]
}

function identifyFactors(
  aqi: number,
  uv: number,
  pollenMax: number,
  data: AirQualityResponse
): SessionGuidance['factors'] {
  const factors: SessionGuidance['factors'] = []

  if (aqi > 40) {
    factors.push({
      label: `AQI elevated (${aqi})`,
      severity: aqi > 60 ? 'warning' : 'caution',
      detail: 'Air quality is affecting breathwork safety',
    })
  }

  if (uv > 5) {
    factors.push({
      label: `UV index ${uv}`,
      severity: uv > 8 ? 'warning' : 'caution',
      detail: 'Sun protection needed for outdoor sessions',
    })
  }

  if (pollenMax > 30) {
    factors.push({
      label: 'Pollen elevated',
      severity: pollenMax > 60 ? 'warning' : 'caution',
      detail: 'Check with clients about allergies before outdoor sessions',
    })
  }

  if (data.current.pm2_5 > 20) {
    factors.push({
      label: `PM2.5 at ${data.current.pm2_5} μg/m³`,
      severity: data.current.pm2_5 > 50 ? 'warning' : 'caution',
      detail: 'Fine particles penetrate deepest during breathwork',
    })
  }

  return factors
}

function findNextWindow(data: AirQualityResponse): string {
  const now = new Date()
  const hourly = data.hourly

  // Find current hour index
  let currentIdx = 0
  for (let i = 0; i < hourly.time.length; i++) {
    if (new Date(hourly.time[i]) >= now) {
      currentIdx = i
      break
    }
  }

  const currentAqi = hourly.european_aqi[currentIdx] ?? 50

  // If currently good, find when it gets worse
  if (currentAqi <= 30) {
    for (let i = currentIdx; i < hourly.time.length; i++) {
      if ((hourly.european_aqi[i] ?? 0) > 30) {
        const time = new Date(hourly.time[i])
        return `Conditions remain good until ${time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
      }
    }
    return 'Good conditions expected to continue'
  }

  // If currently poor, find when it improves
  for (let i = currentIdx; i < hourly.time.length; i++) {
    if ((hourly.european_aqi[i] ?? 50) <= 30) {
      const time = new Date(hourly.time[i])
      const isToday = time.toDateString() === now.toDateString()
      if (isToday) {
        return `Air quality improves after ${time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
      }
      return `Best window tomorrow: ${time.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}`
    }
  }

  return 'Monitor conditions — check back for updates'
}

function generateSummary(
  rating: SessionGuidance['overallRating'],
  aqi: number,
  uv: number,
  pollenMax: number
): string {
  switch (rating) {
    case 'excellent':
      return 'Current conditions support all outdoor modalities. Air quality is clear with minimal particulate matter. UV index is low — no sun protection concerns.'
    case 'good':
      return `Air quality is fair (AQI ${aqi}). Standard outdoor practice is recommended. ${uv > 3 ? 'Apply sunscreen for longer sessions.' : 'UV levels are comfortable.'}`
    case 'caution':
      return `Moderate conditions detected. ${aqi > 40 ? 'Air quality is elevated — gentle practice only.' : ''} ${uv > 7 ? 'UV is high — seek shade.' : ''} ${pollenMax > 30 ? 'Pollen is notable — check client sensitivities.' : ''}`
    case 'indoor-only':
      return `Outdoor conditions are not ideal for practice. ${aqi > 60 ? 'Air quality is poor.' : ''} ${uv > 10 ? 'UV levels are extreme.' : ''} Move sessions indoors.`
    case 'avoid':
      return `Air quality is hazardous (AQI ${aqi}). All outdoor practice should be cancelled. Minimise deep breathing even indoors if poorly ventilated.`
  }
}
