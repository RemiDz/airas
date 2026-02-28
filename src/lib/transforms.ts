import type { AirQualityResponse, PollutantData, HourlyDataPoint } from './types'
import { getPollutantBand } from './aqi-utils'

export function extractLast24Hours(data: AirQualityResponse): HourlyDataPoint[] {
  const now = new Date()
  const hours24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const points: HourlyDataPoint[] = []

  for (let i = 0; i < data.hourly.time.length; i++) {
    const time = new Date(data.hourly.time[i])
    if (time >= hours24Ago && time <= now) {
      points.push({
        time: data.hourly.time[i],
        european_aqi: data.hourly.european_aqi[i] ?? 0,
        us_aqi: data.hourly.us_aqi[i] ?? 0,
        pm2_5: data.hourly.pm2_5[i] ?? 0,
        pm10: data.hourly.pm10[i] ?? 0,
        ozone: data.hourly.ozone[i] ?? 0,
        nitrogen_dioxide: data.hourly.nitrogen_dioxide[i] ?? 0,
      })
    }
  }

  return points
}

export function extractPollutants(data: AirQualityResponse): PollutantData[] {
  const last24h = extractLast24HourlyValues(data)

  return [
    {
      name: 'PM2.5',
      formula: 'PM₂.₅',
      value: data.current.pm2_5,
      unit: 'μg/m³',
      status: getPollutantBand('pm2_5', data.current.pm2_5),
      history: last24h.pm2_5,
      min24h: Math.min(...last24h.pm2_5.filter(v => v > 0), data.current.pm2_5),
      max24h: Math.max(...last24h.pm2_5, data.current.pm2_5),
      practitionerNote: 'Fine particles — most critical for breath practices',
    },
    {
      name: 'PM10',
      formula: 'PM₁₀',
      value: data.current.pm10,
      unit: 'μg/m³',
      status: getPollutantBand('pm10', data.current.pm10),
      history: last24h.pm10,
      min24h: Math.min(...last24h.pm10.filter(v => v > 0), data.current.pm10),
      max24h: Math.max(...last24h.pm10, data.current.pm10),
      practitionerNote: 'Coarse particles — outdoor session planning',
    },
    {
      name: 'NO₂',
      formula: 'NO₂',
      value: data.current.nitrogen_dioxide,
      unit: 'μg/m³',
      status: getPollutantBand('nitrogen_dioxide', data.current.nitrogen_dioxide),
      history: last24h.nitrogen_dioxide,
      min24h: Math.min(...last24h.nitrogen_dioxide.filter(v => v > 0), data.current.nitrogen_dioxide),
      max24h: Math.max(...last24h.nitrogen_dioxide, data.current.nitrogen_dioxide),
      practitionerNote: 'Traffic-related — urban session awareness',
    },
    {
      name: 'Ozone',
      formula: 'O₃',
      value: data.current.ozone,
      unit: 'μg/m³',
      status: getPollutantBand('ozone', data.current.ozone),
      history: last24h.ozone,
      min24h: Math.min(...last24h.ozone.filter(v => v > 0), data.current.ozone),
      max24h: Math.max(...last24h.ozone, data.current.ozone),
      practitionerNote: 'Peaks in afternoon — plan sessions accordingly',
    },
    {
      name: 'SO₂',
      formula: 'SO₂',
      value: data.current.sulphur_dioxide,
      unit: 'μg/m³',
      status: getPollutantBand('sulphur_dioxide', data.current.sulphur_dioxide),
      history: last24h.sulphur_dioxide,
      min24h: Math.min(...last24h.sulphur_dioxide.filter(v => v > 0), data.current.sulphur_dioxide),
      max24h: Math.max(...last24h.sulphur_dioxide, data.current.sulphur_dioxide),
      practitionerNote: 'Industrial area indicator',
    },
    {
      name: 'CO',
      formula: 'CO',
      value: data.current.carbon_monoxide,
      unit: 'μg/m³',
      status: getPollutantBand('carbon_monoxide', data.current.carbon_monoxide),
      history: last24h.carbon_monoxide,
      min24h: Math.min(...last24h.carbon_monoxide.filter(v => v > 0), data.current.carbon_monoxide),
      max24h: Math.max(...last24h.carbon_monoxide, data.current.carbon_monoxide),
      practitionerNote: 'Indoor ventilation indicator',
    },
  ]
}

function extractLast24HourlyValues(data: AirQualityResponse) {
  const now = new Date()
  const hours24Ago = new Date(now.getTime() - 24 * 60 * 60 * 1000)

  const indices: number[] = []
  for (let i = 0; i < data.hourly.time.length; i++) {
    const time = new Date(data.hourly.time[i])
    if (time >= hours24Ago && time <= now) {
      indices.push(i)
    }
  }

  return {
    pm2_5: indices.map(i => data.hourly.pm2_5[i] ?? 0),
    pm10: indices.map(i => data.hourly.pm10[i] ?? 0),
    nitrogen_dioxide: indices.map(i => data.hourly.nitrogen_dioxide[i] ?? 0),
    ozone: indices.map(i => data.hourly.ozone[i] ?? 0),
    sulphur_dioxide: indices.map(i => data.hourly.sulphur_dioxide[i] ?? 0),
    carbon_monoxide: indices.map(i => data.hourly.carbon_monoxide[i] ?? 0),
  }
}

export function formatTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}

export function formatTimeShort(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
}
