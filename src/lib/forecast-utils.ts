import type { AirQualityResponse } from './types'
import { getAqiBand } from './aqi-utils'
import { getUvBand } from './uv-utils'
import { getPollenBand } from './pollen-utils'

export interface DayForecast {
  date: Date
  dayLabel: string
  isToday: boolean
  avgAqi: number
  aqiBand: ReturnType<typeof getAqiBand>
  peakUv: number
  uvBand: ReturnType<typeof getUvBand>
  peakPollen: number | null
  pollenLabel: string
  sessionSafe: 'good' | 'caution' | 'poor'
}

export interface SessionWindow {
  start: Date
  end: Date
  avgAqi: number
  peakUv: number
  peakPollen: number | null
  quality: number // 0-100, higher is better
  recommendation: string
}

export function computeDailyForecasts(data: AirQualityResponse): DayForecast[] {
  const hourly = data.hourly
  const now = new Date()
  const todayStr = now.toISOString().slice(0, 10)

  // Group hourly indices by date
  const dayMap = new Map<string, number[]>()
  for (let i = 0; i < hourly.time.length; i++) {
    const dateStr = hourly.time[i].slice(0, 10)
    if (!dayMap.has(dateStr)) dayMap.set(dateStr, [])
    dayMap.get(dateStr)!.push(i)
  }

  const forecasts: DayForecast[] = []

  for (const [dateStr, indices] of dayMap) {
    const date = new Date(dateStr + 'T12:00:00')

    // Average AQI
    const aqiValues = indices.map(i => hourly.european_aqi[i]).filter((v): v is number => v != null && v > 0)
    const avgAqi = aqiValues.length > 0 ? Math.round(aqiValues.reduce((a, b) => a + b, 0) / aqiValues.length) : 0

    // Peak UV
    const uvValues = indices.map(i => hourly.uv_index[i]).filter((v): v is number => v != null)
    const peakUv = uvValues.length > 0 ? Math.max(...uvValues) : 0

    // Peak pollen (highest of any type)
    const pollenKeys = ['alder_pollen', 'birch_pollen', 'grass_pollen', 'mugwort_pollen', 'olive_pollen', 'ragweed_pollen'] as const
    let peakPollen: number | null = null
    for (const key of pollenKeys) {
      for (const i of indices) {
        const v = hourly[key][i]
        if (v !== null && v > 0) {
          peakPollen = Math.max(peakPollen ?? 0, v)
        }
      }
    }

    // Session recommendation
    let sessionSafe: 'good' | 'caution' | 'poor' = 'good'
    if (avgAqi > 60 || peakUv > 10 || (peakPollen !== null && peakPollen > 60)) {
      sessionSafe = 'poor'
    } else if (avgAqi > 40 || peakUv > 7 || (peakPollen !== null && peakPollen > 30)) {
      sessionSafe = 'caution'
    }

    const isToday = dateStr === todayStr
    const dayLabel = isToday
      ? 'Today'
      : date.toLocaleDateString('en-GB', { weekday: 'short' })

    const pollenBand = peakPollen !== null ? getPollenBand(peakPollen) : null
    const pollenLabel = pollenBand ? pollenBand.label.replace('None/', '') : '—'

    forecasts.push({
      date,
      dayLabel,
      isToday,
      avgAqi,
      aqiBand: getAqiBand(avgAqi),
      peakUv,
      uvBand: getUvBand(peakUv),
      peakPollen,
      pollenLabel,
      sessionSafe,
    })
  }

  return forecasts.slice(0, 5)
}

export function findBestWindows(data: AirQualityResponse): SessionWindow[] {
  const hourly = data.hourly
  const now = new Date()
  const windows: SessionWindow[] = []

  // Scan for consecutive "good" hours
  let windowStart: number | null = null

  for (let i = 0; i < hourly.time.length; i++) {
    const t = new Date(hourly.time[i])
    if (t < now) continue // only future

    const aqi = hourly.european_aqi[i] ?? 50
    const uv = hourly.uv_index[i] ?? 0

    // Max pollen at this hour
    const pollenKeys = ['alder_pollen', 'birch_pollen', 'grass_pollen', 'mugwort_pollen', 'olive_pollen', 'ragweed_pollen'] as const
    let maxPollen: number | null = null
    for (const key of pollenKeys) {
      const v = hourly[key][i]
      if (v !== null && v > 0) maxPollen = Math.max(maxPollen ?? 0, v)
    }

    const isGood = aqi < 30 && uv < 8 && (maxPollen === null || maxPollen < 30)

    if (isGood && windowStart === null) {
      windowStart = i
    } else if (!isGood && windowStart !== null) {
      // End of a window — need at least 2 consecutive hours
      if (i - windowStart >= 2) {
        windows.push(buildWindow(hourly, windowStart, i - 1))
      }
      windowStart = null
    }
  }

  // Close trailing window
  if (windowStart !== null && hourly.time.length - windowStart >= 2) {
    windows.push(buildWindow(hourly, windowStart, hourly.time.length - 1))
  }

  // Sort by quality descending, take top 3
  return windows.sort((a, b) => b.quality - a.quality).slice(0, 3)
}

function buildWindow(
  hourly: AirQualityResponse['hourly'],
  startIdx: number,
  endIdx: number
): SessionWindow {
  const start = new Date(hourly.time[startIdx])
  const end = new Date(hourly.time[endIdx])

  let sumAqi = 0
  let count = 0
  let peakUv = 0
  let peakPollen: number | null = null

  const pollenKeys = ['alder_pollen', 'birch_pollen', 'grass_pollen', 'mugwort_pollen', 'olive_pollen', 'ragweed_pollen'] as const

  for (let i = startIdx; i <= endIdx; i++) {
    const aqi = hourly.european_aqi[i] ?? 0
    sumAqi += aqi
    count++
    peakUv = Math.max(peakUv, hourly.uv_index[i] ?? 0)
    for (const key of pollenKeys) {
      const v = hourly[key][i]
      if (v !== null && v > 0) peakPollen = Math.max(peakPollen ?? 0, v)
    }
  }

  const avgAqi = count > 0 ? Math.round(sumAqi / count) : 0

  // Quality score: lower AQI is better, longer duration is better, lower UV is better
  const aqiScore = Math.max(0, 100 - avgAqi * 3)
  const durationScore = Math.min(30, (endIdx - startIdx) * 3)
  const uvScore = Math.max(0, 20 - peakUv * 2)
  const quality = Math.round(aqiScore + durationScore + uvScore)

  // Recommendation text
  let recommendation: string
  if (avgAqi <= 15 && peakUv <= 3) {
    recommendation = 'Perfect for outdoor sound healing'
  } else if (avgAqi <= 20) {
    recommendation = 'Excellent for all breathwork modalities'
  } else {
    recommendation = 'Good conditions for outdoor practice'
  }

  // Prepend time-of-day context
  const hour = start.getHours()
  if (hour < 10) {
    recommendation = `Excellent early-morning window — ${recommendation.charAt(0).toLowerCase() + recommendation.slice(1)}`
  }

  return { start, end, avgAqi, peakUv, peakPollen, quality, recommendation }
}

export function findUpcomingWarnings(data: AirQualityResponse): string[] {
  const hourly = data.hourly
  const now = new Date()
  const warnings: string[] = []

  // Group future hours by date, find any with bad conditions
  const dayMap = new Map<string, number[]>()
  for (let i = 0; i < hourly.time.length; i++) {
    const t = new Date(hourly.time[i])
    if (t < now) continue
    const dateStr = hourly.time[i].slice(0, 10)
    if (!dayMap.has(dateStr)) dayMap.set(dateStr, [])
    dayMap.get(dateStr)!.push(i)
  }

  for (const [, indices] of dayMap) {
    for (const i of indices) {
      const aqi = hourly.european_aqi[i] ?? 0
      if (aqi >= 40) {
        const t = new Date(hourly.time[i])
        const dayName = t.toLocaleDateString('en-GB', { weekday: 'long' })
        const period = t.getHours() < 12 ? 'morning' : t.getHours() < 17 ? 'afternoon' : 'evening'
        const warn = `${dayName} ${period} elevated (AQI ${aqi}) — schedule around it`
        if (!warnings.includes(warn)) warnings.push(warn)
        break // one warning per day
      }
    }
  }

  return warnings.slice(0, 2)
}
