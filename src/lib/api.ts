import type { AirQualityResponse, GeocodeResponse } from './types'

const AIR_QUALITY_BASE = 'https://air-quality-api.open-meteo.com/v1/air-quality'
const GEOCODE_BASE = 'https://geocoding-api.open-meteo.com/v1/search'

export async function fetchAirQuality(
  latitude: number,
  longitude: number
): Promise<AirQualityResponse> {
  const params = new URLSearchParams({
    latitude: latitude.toString(),
    longitude: longitude.toString(),
    timezone: 'auto',
    forecast_days: '5',
    current: [
      'european_aqi', 'us_aqi', 'pm10', 'pm2_5',
      'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone',
      'uv_index', 'uv_index_clear_sky', 'dust',
      'alder_pollen', 'birch_pollen', 'grass_pollen',
      'mugwort_pollen', 'olive_pollen', 'ragweed_pollen',
    ].join(','),
    hourly: [
      'european_aqi', 'us_aqi', 'pm10', 'pm2_5',
      'carbon_monoxide', 'nitrogen_dioxide', 'sulphur_dioxide', 'ozone',
      'uv_index', 'uv_index_clear_sky', 'dust', 'aerosol_optical_depth',
      'alder_pollen', 'birch_pollen', 'grass_pollen',
      'mugwort_pollen', 'olive_pollen', 'ragweed_pollen',
      'carbon_dioxide', 'methane', 'ammonia',
    ].join(','),
  })

  const response = await fetch(`${AIR_QUALITY_BASE}?${params}`)
  if (!response.ok) {
    throw new Error(`Air quality API error: ${response.status}`)
  }
  return response.json()
}

export async function fetchGeocode(query: string): Promise<GeocodeResponse> {
  const params = new URLSearchParams({
    name: query,
    count: '5',
    language: 'en',
    format: 'json',
  })

  const response = await fetch(`${GEOCODE_BASE}?${params}`)
  if (!response.ok) {
    throw new Error(`Geocoding API error: ${response.status}`)
  }
  return response.json()
}
