export interface AirQualityResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  current_units: Record<string, string>
  current: {
    time: string
    interval: number
    european_aqi: number
    us_aqi: number
    pm10: number
    pm2_5: number
    carbon_monoxide: number
    nitrogen_dioxide: number
    sulphur_dioxide: number
    ozone: number
    uv_index: number
    uv_index_clear_sky: number
    dust: number
    alder_pollen: number | null
    birch_pollen: number | null
    grass_pollen: number | null
    mugwort_pollen: number | null
    olive_pollen: number | null
    ragweed_pollen: number | null
  }
  hourly_units: Record<string, string>
  hourly: {
    time: string[]
    european_aqi: number[]
    us_aqi: number[]
    pm10: number[]
    pm2_5: number[]
    carbon_monoxide: number[]
    nitrogen_dioxide: number[]
    sulphur_dioxide: number[]
    ozone: number[]
    uv_index: number[]
    uv_index_clear_sky: number[]
    dust: number[]
    aerosol_optical_depth: number[]
    alder_pollen: (number | null)[]
    birch_pollen: (number | null)[]
    grass_pollen: (number | null)[]
    mugwort_pollen: (number | null)[]
    olive_pollen: (number | null)[]
    ragweed_pollen: (number | null)[]
    carbon_dioxide: number[]
    methane: number[]
    ammonia: (number | null)[]
  }
}

export interface GeocodeResult {
  id: number
  name: string
  latitude: number
  longitude: number
  country: string
  country_code: string
  admin1?: string
  elevation?: number
}

export interface GeocodeResponse {
  results?: GeocodeResult[]
}

export interface Location {
  name: string
  country: string
  latitude: number
  longitude: number
  admin1?: string
}

export interface AqiBand {
  min: number
  max: number
  label: string
  colour: string
}

export interface PollutantData {
  name: string
  formula: string
  value: number
  unit: string
  status: AqiBand
  history: number[]
  min24h: number
  max24h: number
  practitionerNote: string
}

export interface HourlyDataPoint {
  time: string
  european_aqi: number
  us_aqi: number
  pm2_5: number
  pm10: number
  ozone: number
  nitrogen_dioxide: number
}

export type AqiScale = 'european' | 'us'
