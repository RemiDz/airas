import type { AqiBand, AqiScale } from './types'

export const EU_AQI_BANDS: AqiBand[] = [
  { min: 0, max: 20, label: 'Good', colour: '#34D399' },
  { min: 20, max: 40, label: 'Fair', colour: '#A8DADC' },
  { min: 40, max: 60, label: 'Moderate', colour: '#F59E0B' },
  { min: 60, max: 80, label: 'Poor', colour: '#F97316' },
  { min: 80, max: 100, label: 'Very Poor', colour: '#EF4444' },
  { min: 100, max: 999, label: 'Extremely Poor', colour: '#991B1B' },
]

export const US_AQI_BANDS: AqiBand[] = [
  { min: 0, max: 50, label: 'Good', colour: '#34D399' },
  { min: 51, max: 100, label: 'Moderate', colour: '#F59E0B' },
  { min: 101, max: 150, label: 'Unhealthy for Sensitive', colour: '#F97316' },
  { min: 151, max: 200, label: 'Unhealthy', colour: '#EF4444' },
  { min: 201, max: 300, label: 'Very Unhealthy', colour: '#991B1B' },
  { min: 301, max: 500, label: 'Hazardous', colour: '#4C0519' },
]

export function getAqiBand(value: number, scale: AqiScale = 'european'): AqiBand {
  const bands = scale === 'european' ? EU_AQI_BANDS : US_AQI_BANDS
  return bands.find(b => value >= b.min && value < b.max) ?? bands[bands.length - 1]
}

export function getAqiBarPosition(value: number, scale: AqiScale = 'european'): number {
  const maxVal = scale === 'european' ? 100 : 300
  return Math.min((value / maxVal) * 100, 100)
}

export function getPractitionerTagline(aqi: number): string {
  if (aqi <= 20) return 'Perfect conditions for outdoor breathwork and sound healing'
  if (aqi <= 40) return 'Clear skies for deep breathing — gentle practice recommended'
  if (aqi <= 60) return 'Moderate air — consider indoor sessions for sensitive clients'
  if (aqi <= 80) return 'Elevated pollutants — indoor practice strongly recommended'
  return 'Poor air quality — avoid outdoor breathwork today'
}

// Per-pollutant European AQI thresholds
export const POLLUTANT_THRESHOLDS: Record<string, AqiBand[]> = {
  pm2_5: [
    { min: 0, max: 10, label: 'Good', colour: '#34D399' },
    { min: 10, max: 20, label: 'Fair', colour: '#A8DADC' },
    { min: 20, max: 25, label: 'Moderate', colour: '#F59E0B' },
    { min: 25, max: 50, label: 'Poor', colour: '#F97316' },
    { min: 50, max: 75, label: 'Very Poor', colour: '#EF4444' },
    { min: 75, max: 999, label: 'Extremely Poor', colour: '#991B1B' },
  ],
  pm10: [
    { min: 0, max: 20, label: 'Good', colour: '#34D399' },
    { min: 20, max: 40, label: 'Fair', colour: '#A8DADC' },
    { min: 40, max: 50, label: 'Moderate', colour: '#F59E0B' },
    { min: 50, max: 100, label: 'Poor', colour: '#F97316' },
    { min: 100, max: 150, label: 'Very Poor', colour: '#EF4444' },
    { min: 150, max: 999, label: 'Extremely Poor', colour: '#991B1B' },
  ],
  nitrogen_dioxide: [
    { min: 0, max: 40, label: 'Good', colour: '#34D399' },
    { min: 40, max: 90, label: 'Fair', colour: '#A8DADC' },
    { min: 90, max: 120, label: 'Moderate', colour: '#F59E0B' },
    { min: 120, max: 230, label: 'Poor', colour: '#F97316' },
    { min: 230, max: 340, label: 'Very Poor', colour: '#EF4444' },
    { min: 340, max: 999, label: 'Extremely Poor', colour: '#991B1B' },
  ],
  ozone: [
    { min: 0, max: 50, label: 'Good', colour: '#34D399' },
    { min: 50, max: 100, label: 'Fair', colour: '#A8DADC' },
    { min: 100, max: 130, label: 'Moderate', colour: '#F59E0B' },
    { min: 130, max: 240, label: 'Poor', colour: '#F97316' },
    { min: 240, max: 380, label: 'Very Poor', colour: '#EF4444' },
    { min: 380, max: 999, label: 'Extremely Poor', colour: '#991B1B' },
  ],
  sulphur_dioxide: [
    { min: 0, max: 100, label: 'Good', colour: '#34D399' },
    { min: 100, max: 200, label: 'Fair', colour: '#A8DADC' },
    { min: 200, max: 350, label: 'Moderate', colour: '#F59E0B' },
    { min: 350, max: 500, label: 'Poor', colour: '#F97316' },
    { min: 500, max: 750, label: 'Very Poor', colour: '#EF4444' },
    { min: 750, max: 9999, label: 'Extremely Poor', colour: '#991B1B' },
  ],
  carbon_monoxide: [
    { min: 0, max: 4400, label: 'Good', colour: '#34D399' },
    { min: 4400, max: 9400, label: 'Fair', colour: '#A8DADC' },
    { min: 9400, max: 12400, label: 'Moderate', colour: '#F59E0B' },
    { min: 12400, max: 15400, label: 'Poor', colour: '#F97316' },
    { min: 15400, max: 99999, label: 'Very Poor', colour: '#EF4444' },
  ],
}

export function getPollutantBand(pollutant: string, value: number): AqiBand {
  const thresholds = POLLUTANT_THRESHOLDS[pollutant]
  if (!thresholds) return { min: 0, max: 999, label: 'Unknown', colour: '#C8C4DC' }
  return thresholds.find(b => value >= b.min && value < b.max) ?? thresholds[thresholds.length - 1]
}
