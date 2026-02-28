import type { AqiBand } from './types'

export const UV_BANDS: AqiBand[] = [
  { min: 0, max: 3, label: 'Low', colour: '#34D399' },
  { min: 3, max: 6, label: 'Moderate', colour: '#F59E0B' },
  { min: 6, max: 8, label: 'High', colour: '#F97316' },
  { min: 8, max: 11, label: 'Very High', colour: '#EF4444' },
  { min: 11, max: 20, label: 'Extreme', colour: '#8B5CF6' },
]

export function getUvBand(value: number): AqiBand {
  return UV_BANDS.find(b => value >= b.min && value < b.max) ?? UV_BANDS[UV_BANDS.length - 1]
}

export function getUvBarPosition(value: number): number {
  return Math.min((value / 14) * 100, 100)
}

export interface UvExposureGuidance {
  safeMinutes: string
  practitionerNote: string
}

export function getUvExposureGuidance(uv: number): UvExposureGuidance {
  if (uv < 3) {
    return {
      safeMinutes: 'Unlimited',
      practitionerNote: 'No concerns for outdoor sessions.',
    }
  }
  if (uv < 6) {
    return {
      safeMinutes: '~40 min',
      practitionerNote: 'Apply sunscreen for extended sound baths.',
    }
  }
  if (uv < 8) {
    return {
      safeMinutes: '~25 min',
      practitionerNote: 'Seek shade for group sessions, hats recommended.',
    }
  }
  if (uv < 11) {
    return {
      safeMinutes: '~15 min',
      practitionerNote: 'Schedule sessions for morning/evening, avoid midday.',
    }
  }
  return {
    safeMinutes: '< 10 min',
    practitionerNote: 'Outdoor sessions not advisable during peak UV.',
  }
}

export function getAirClarityNote(aod: number): string {
  if (aod < 0.1) return 'Crystal clear atmosphere — exceptional visibility'
  if (aod < 0.3) return 'Clear skies — good conditions'
  if (aod < 0.5) return 'Slight haze — mild atmospheric particles'
  return 'Hazy conditions — elevated particles in atmosphere'
}
