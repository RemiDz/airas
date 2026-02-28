import type { AqiBand, AirQualityResponse } from './types'

export const POLLEN_BANDS: AqiBand[] = [
  { min: 0, max: 10, label: 'None/Low', colour: '#34D399' },
  { min: 10, max: 30, label: 'Moderate', colour: '#F59E0B' },
  { min: 30, max: 60, label: 'High', colour: '#F97316' },
  { min: 60, max: 999, label: 'Very High', colour: '#EF4444' },
]

export interface PollenType {
  key: string
  name: string
  category: 'tree' | 'grass'
  icon: string
  currentValue: number | null
}

export function getPollenBand(value: number): AqiBand {
  return POLLEN_BANDS.find(b => value >= b.min && value < b.max) ?? POLLEN_BANDS[POLLEN_BANDS.length - 1]
}

export function getOverallPollenLevel(data: AirQualityResponse): AqiBand | null {
  const types = extractPollenTypes(data)
  const active = types.filter(t => t.currentValue !== null && t.currentValue > 0)
  if (active.length === 0) return null
  const maxVal = Math.max(...active.map(t => t.currentValue!))
  return getPollenBand(maxVal)
}

export function hasPollenData(data: AirQualityResponse): boolean {
  return [
    data.current.alder_pollen,
    data.current.birch_pollen,
    data.current.grass_pollen,
    data.current.mugwort_pollen,
    data.current.olive_pollen,
    data.current.ragweed_pollen,
  ].some(v => v !== null)
}

export function extractPollenTypes(data: AirQualityResponse): PollenType[] {
  return [
    { key: 'alder_pollen', name: 'Alder', category: 'tree', icon: '🌳', currentValue: data.current.alder_pollen },
    { key: 'birch_pollen', name: 'Birch', category: 'tree', icon: '🌳', currentValue: data.current.birch_pollen },
    { key: 'olive_pollen', name: 'Olive', category: 'tree', icon: '🌳', currentValue: data.current.olive_pollen },
    { key: 'grass_pollen', name: 'Grass', category: 'grass', icon: '🌾', currentValue: data.current.grass_pollen },
    { key: 'mugwort_pollen', name: 'Mugwort', category: 'grass', icon: '🌾', currentValue: data.current.mugwort_pollen },
    { key: 'ragweed_pollen', name: 'Ragweed', category: 'grass', icon: '🌾', currentValue: data.current.ragweed_pollen },
  ]
}

export function getPollenPractitionerNote(data: AirQualityResponse): string {
  if (!hasPollenData(data)) {
    return 'Pollen data not available for this location or season.'
  }

  const types = extractPollenTypes(data)
  const active = types.filter(t => t.currentValue !== null && t.currentValue > 0)
  if (active.length === 0) {
    return 'Pollen counts are low — outdoor breathwork is unaffected.'
  }

  const maxType = active.reduce((a, b) => (a.currentValue! > b.currentValue! ? a : b))
  const maxVal = maxType.currentValue!

  if (maxVal < 10) {
    return 'Pollen counts are low — outdoor breathwork is unaffected.'
  }
  if (maxVal < 30) {
    return 'Moderate pollen — ask clients about sensitivities before outdoor sessions.'
  }
  if (maxVal < 60) {
    return `High ${maxType.name.toLowerCase()} pollen — consider indoor practice for sensitive clients.`
  }
  return `Very high pollen alert — outdoor breathwork not recommended for allergy sufferers.`
}

export function extractPollenHourly(
  data: AirQualityResponse
): { time: string[]; series: Record<string, (number | null)[]> } {
  return {
    time: data.hourly.time,
    series: {
      alder_pollen: data.hourly.alder_pollen,
      birch_pollen: data.hourly.birch_pollen,
      olive_pollen: data.hourly.olive_pollen,
      grass_pollen: data.hourly.grass_pollen,
      mugwort_pollen: data.hourly.mugwort_pollen,
      ragweed_pollen: data.hourly.ragweed_pollen,
    },
  }
}
