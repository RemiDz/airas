'use client'

import { forwardRef } from 'react'
import type { AirQualityResponse, Location } from '@/lib/types'
import { getAqiBand, getAqiBarPosition, getPractitionerTagline } from '@/lib/aqi-utils'
import { getUvBand, getUvExposureGuidance } from '@/lib/uv-utils'
import { generateSessionGuidance } from '@/lib/practitioner'
import { hasPollenData, extractPollenTypes, getOverallPollenLevel, getPollenBand } from '@/lib/pollen-utils'
import { computeDailyForecasts, findBestWindows } from '@/lib/forecast-utils'

// ── Shared card wrapper ──

type CardFormat = 'post' | 'story'

function CardShell({
  format,
  children,
}: {
  format: CardFormat
  children: React.ReactNode
}) {
  const w = format === 'post' ? 1080 : 1080
  const h = format === 'post' ? 1080 : 1920
  const pad = format === 'post' ? 32 : 40

  return (
    <div
      style={{
        width: w / 3,
        height: h / 3,
        backgroundColor: '#06061A',
        border: '1px solid rgba(200,196,220,0.08)',
        borderRadius: 8,
        padding: pad / 3,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {children}
    </div>
  )
}

// ── Pure CSS AQI gradient bar (NOT Recharts) ──

function AqiBar({ value }: { value: number }) {
  const pos = Math.min((value / 100) * 100, 100)
  return (
    <div style={{ position: 'relative', width: '100%', height: 6, borderRadius: 3, marginTop: 4, marginBottom: 4 }}>
      <div
        style={{
          width: '100%',
          height: '100%',
          borderRadius: 3,
          background: 'linear-gradient(90deg, #34D399 0%, #A8DADC 20%, #F59E0B 40%, #F97316 60%, #EF4444 80%, #991B1B 100%)',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: `${pos}%`,
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: 10,
          height: 10,
          borderRadius: '50%',
          backgroundColor: '#fff',
          boxShadow: '0 0 6px rgba(168,218,220,0.6)',
        }}
      />
    </div>
  )
}

// ── Pure SVG pollen bar ──

function PollenBarSvg({ value, maxVal = 80, colour }: { value: number; maxVal?: number; colour: string }) {
  const pct = Math.min((value / maxVal) * 100, 100)
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
      <div style={{ width: '100%', height: 6, borderRadius: 3, background: 'rgba(200,196,220,0.08)' }}>
        <div style={{ width: `${pct}%`, height: '100%', borderRadius: 3, background: colour, transition: 'width 0.3s' }} />
      </div>
    </div>
  )
}

// ── Card 1: The Hook (Daily AQI) ──

export const Card1Daily = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; location: Location; format: CardFormat }
>(function Card1Daily({ data, location, format }, ref) {
  const aqi = data.current.european_aqi
  const band = getAqiBand(aqi)
  const tagline = getPractitionerTagline(aqi)
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
  const locName = `${location.name}${location.country ? `, ${location.country}` : ''}`

  return (
    <div ref={ref}>
      <CardShell format={format}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
          {/* Location */}
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#C8C4DC', opacity: 0.7, marginBottom: format === 'story' ? 24 : 12 }}>
            ○ {locName}
          </div>

          {/* AQI Number */}
          <div
            style={{
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: format === 'story' ? 72 : 56,
              fontWeight: 500,
              color: band.colour,
              lineHeight: 1,
              textShadow: `0 0 30px ${band.colour}40`,
            }}
          >
            {aqi}
          </div>

          {/* Label */}
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: format === 'story' ? 22 : 18,
              fontWeight: 300,
              color: band.colour,
              marginTop: 4,
              marginBottom: format === 'story' ? 20 : 12,
            }}
          >
            {band.label}
          </div>

          {/* AQI Bar */}
          <div style={{ width: '80%', marginBottom: 4 }}>
            <AqiBar value={aqi} />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#C8C4DC', opacity: 0.4 }}>
              <span>0</span>
              <span>AQI</span>
              <span>100+</span>
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 12,
              fontStyle: 'italic',
              color: '#C8C4DC',
              opacity: 0.8,
              marginTop: format === 'story' ? 16 : 10,
              marginBottom: format === 'story' ? 20 : 12,
              maxWidth: '85%',
              lineHeight: 1.4,
            }}
          >
            &ldquo;{tagline}&rdquo;
          </div>

          {/* Quick stats */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#C8C4DC', opacity: 0.6 }}>
            PM2.5: {data.current.pm2_5} · O₃: {Math.round(data.current.ozone)} · UV: {data.current.uv_index}
          </div>

          {/* Spacer for story */}
          {format === 'story' && <div style={{ flex: 1, minHeight: 20 }} />}

          {/* Branding */}
          <div style={{ marginTop: format === 'story' ? 0 : 16 }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontWeight: 500, color: '#A8DADC', letterSpacing: 1 }}>
              airas.app
            </div>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', opacity: 0.5, marginTop: 2 }}>
              Air Intelligence for Practitioners
            </div>
          </div>

          {/* Date */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#C8C4DC', opacity: 0.3, marginTop: 8 }}>
            {dateStr}
          </div>
        </div>
      </CardShell>
    </div>
  )
})

// ── Card 2: The Science (24h AQI Trend — pure SVG) ──

export const Card2Trend = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; location: Location; format: CardFormat }
>(function Card2Trend({ data, location, format }, ref) {
  const aqi = data.current.european_aqi
  const band = getAqiBand(aqi)
  const locName = `${location.name}${location.country ? `, ${location.country}` : ''}`

  // Extract last 24h of data
  const now = new Date()
  const hourly = data.hourly
  let endIdx = 0
  for (let i = 0; i < hourly.time.length; i++) {
    if (new Date(hourly.time[i]) >= now) { endIdx = i; break }
  }
  const startIdx = Math.max(0, endIdx - 24)
  const slice = hourly.european_aqi.slice(startIdx, endIdx + 1)
  const times = hourly.time.slice(startIdx, endIdx + 1)

  // Find peak
  let peakVal = 0
  let peakIdx = 0
  slice.forEach((v, i) => { if (v > peakVal) { peakVal = v; peakIdx = i } })
  const peakTime = times[peakIdx] ? new Date(times[peakIdx]).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }) : ''

  // Build SVG path
  const chartW = 240
  const chartH = 80
  const maxVal = Math.max(60, ...slice)
  const points = slice.map((v, i) => ({
    x: (i / Math.max(slice.length - 1, 1)) * chartW,
    y: chartH - (v / maxVal) * chartH,
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${chartW},${chartH} L0,${chartH} Z`

  return (
    <div ref={ref}>
      <CardShell format={format}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: format === 'story' ? 'center' : 'flex-start' }}>
          {/* Header */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#C8C4DC', opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 4 }}>
            24H Air Quality Trend
          </div>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#C8C4DC', opacity: 0.6, marginBottom: format === 'story' ? 24 : 16 }}>
            {locName}
          </div>

          {/* SVG Chart */}
          <div style={{ background: 'rgba(200,196,220,0.03)', borderRadius: 6, padding: '12px 8px', marginBottom: format === 'story' ? 24 : 12 }}>
            <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: 'auto' }} preserveAspectRatio="none">
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#A8DADC" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#A8DADC" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Grid lines */}
              {[0.25, 0.5, 0.75].map(p => (
                <line key={p} x1="0" y1={chartH * p} x2={chartW} y2={chartH * p} stroke="rgba(200,196,220,0.06)" strokeWidth="0.5" />
              ))}
              {/* Area fill */}
              <path d={areaPath} fill="url(#trendFill)" />
              {/* Line */}
              <path d={linePath} fill="none" stroke="#A8DADC" strokeWidth="1.5" strokeLinejoin="round" />
              {/* Peak dot */}
              {points[peakIdx] && (
                <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="3" fill="#F59E0B" stroke="#06061A" strokeWidth="1" />
              )}
            </svg>
            {/* Time labels */}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.35, marginTop: 4 }}>
              {[0, 6, 12, 18].map(h => (
                <span key={h}>{String(h).padStart(2, '0')}:00</span>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 10, color: '#C8C4DC', lineHeight: 1.8 }}>
            <div>Peak: <span style={{ color: '#F59E0B' }}>{peakVal}</span> at {peakTime}</div>
            <div>Current: <span style={{ color: band.colour }}>{aqi}</span> ({band.label})</div>
          </div>

          {format === 'story' && <div style={{ flex: 1, minHeight: 20 }} />}

          {/* CTA */}
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#A8DADC', marginTop: format === 'story' ? 0 : 16, opacity: 0.7 }}>
            Track your air → <span style={{ fontWeight: 700 }}>airas.app</span>
          </div>
        </div>
      </CardShell>
    </div>
  )
})

// ── Card 3: Modality Checklist ──

export const Card3Modalities = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; format: CardFormat }
>(function Card3Modalities({ data, format }, ref) {
  const aqi = data.current.european_aqi
  const uv = data.current.uv_index
  const pollenLevel = getOverallPollenLevel(data)
  const guidance = generateSessionGuidance(data)

  return (
    <div ref={ref}>
      <CardShell format={format}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: format === 'story' ? 'center' : 'flex-start' }}>
          {/* Header */}
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 500, color: '#F0EEF8', lineHeight: 1.2, marginBottom: 4 }}>
            Today&apos;s Breathwork
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 18, fontWeight: 500, color: '#F0EEF8', marginBottom: format === 'story' ? 20 : 12 }}>
            Conditions
          </div>

          {/* Quick stats */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#C8C4DC', opacity: 0.6, marginBottom: format === 'story' ? 24 : 14 }}>
            AQI: {aqi} · UV: {uv} · Pollen: {pollenLevel?.label ?? 'N/A'}
          </div>

          {/* Modality list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: format === 'story' ? 10 : 6, marginBottom: format === 'story' ? 24 : 14 }}>
            {guidance.modalities.map((m) => (
              <div key={m.name}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                  <span style={{ fontSize: 12, lineHeight: 1.4 }}>{m.safe ? '✅' : m.note ? '⚠️' : '❌'}</span>
                  <div>
                    <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#F0EEF8', lineHeight: 1.3 }}>
                      {m.name}
                    </div>
                    {m.note && (
                      <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', opacity: 0.5, marginTop: 1, lineHeight: 1.3 }}>
                        {m.note}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 11,
              fontStyle: 'italic',
              color: '#C8C4DC',
              opacity: 0.7,
              lineHeight: 1.4,
              borderTop: '1px solid rgba(200,196,220,0.08)',
              paddingTop: 10,
            }}
          >
            &ldquo;{guidance.summary.split('.')[0]}.&rdquo;
          </div>

          {format === 'story' && <div style={{ flex: 1, minHeight: 20 }} />}

          {/* Branding */}
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontWeight: 500, color: '#A8DADC', marginTop: format === 'story' ? 0 : 12, letterSpacing: 1 }}>
            airas.app
          </div>
        </div>
      </CardShell>
    </div>
  )
})

// ── Card 4: Pollen & UV Report ──

export const Card4PollenUv = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; format: CardFormat }
>(function Card4PollenUv({ data, format }, ref) {
  const uv = data.current.uv_index
  const uvBand = getUvBand(uv)
  const uvGuidance = getUvExposureGuidance(uv)
  const pollenAvailable = hasPollenData(data)
  const pollenTypes = extractPollenTypes(data)
  const overallPollen = getOverallPollenLevel(data)
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  const treePollen = pollenTypes.filter(t => t.category === 'tree' && t.currentValue !== null && t.currentValue > 0)
  const grassPollen = pollenTypes.filter(t => t.category === 'grass' && t.currentValue !== null && t.currentValue > 0)

  // Fallback: atmospheric data
  const showAtmospheric = !pollenAvailable

  return (
    <div ref={ref}>
      <CardShell format={format}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: format === 'story' ? 'center' : 'flex-start' }}>
          {/* Header */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#C8C4DC', opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
            {showAtmospheric ? 'Atmospheric Report' : 'Pollen & UV Report'}
          </div>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#C8C4DC', opacity: 0.4, marginBottom: format === 'story' ? 24 : 14 }}>
            {dateStr}
          </div>

          {/* UV Section */}
          <div style={{ marginBottom: format === 'story' ? 20 : 12 }}>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#F0EEF8', marginBottom: 4 }}>
              ☀️ UV Index: <span style={{ color: uvBand.colour, fontFamily: 'JetBrains Mono, monospace', fontWeight: 500 }}>{uv}</span> ({uvBand.label})
            </div>
            {/* UV bar */}
            <div style={{ width: '100%', height: 5, borderRadius: 3, background: 'rgba(200,196,220,0.08)', marginBottom: 4 }}>
              <div style={{ width: `${Math.min((uv / 14) * 100, 100)}%`, height: '100%', borderRadius: 3, background: `linear-gradient(90deg, #34D399, ${uvBand.colour})` }} />
            </div>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', opacity: 0.5 }}>
              Safe outdoor time: {uvGuidance.safeMinutes}
            </div>
          </div>

          {/* Pollen Section or Atmospheric fallback */}
          {!showAtmospheric ? (
            <div>
              {treePollen.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#F0EEF8', marginBottom: 6 }}>🌳 Tree Pollen</div>
                  {treePollen.map(t => {
                    const band = getPollenBand(t.currentValue!)
                    return (
                      <div key={t.key} style={{ marginBottom: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', marginBottom: 2 }}>
                          <span>{t.name}</span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', opacity: 0.6 }}>{t.currentValue} grains/m³</span>
                        </div>
                        <PollenBarSvg value={t.currentValue!} colour={band.colour} />
                      </div>
                    )
                  })}
                </div>
              )}

              {grassPollen.length > 0 && (
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#F0EEF8', marginBottom: 6 }}>🌾 Grass & Weed Pollen</div>
                  {grassPollen.map(t => {
                    const band = getPollenBand(t.currentValue!)
                    return (
                      <div key={t.key} style={{ marginBottom: 4 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', marginBottom: 2 }}>
                          <span>{t.name}</span>
                          <span style={{ fontFamily: 'JetBrains Mono, monospace', opacity: 0.6 }}>{t.currentValue} grains/m³</span>
                        </div>
                        <PollenBarSvg value={t.currentValue!} colour={band.colour} />
                      </div>
                    )
                  })}
                </div>
              )}

              {/* Practitioner note */}
              {overallPollen && (
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', opacity: 0.6, borderTop: '1px solid rgba(200,196,220,0.08)', paddingTop: 8, lineHeight: 1.4 }}>
                  🫁 {overallPollen.label === 'None/Low'
                    ? 'Low pollen — outdoor breathwork unaffected'
                    : overallPollen.label === 'Moderate'
                    ? 'Moderate pollen — ask clients about hay fever before outdoor sessions'
                    : 'High pollen — consider indoor alternatives for allergy sufferers'}
                </div>
              )}
            </div>
          ) : (
            <div>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#F0EEF8', marginBottom: 8 }}>🌍 Atmospheric Composition</div>
              {[
                { label: 'CO₂', value: data.hourly.carbon_dioxide?.[0], unit: 'ppm' },
                { label: 'Dust', value: data.current.dust, unit: 'μg/m³' },
                { label: 'Aerosol Depth', value: data.hourly.aerosol_optical_depth?.[0], unit: '' },
              ].map(item => (
                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#C8C4DC', marginBottom: 4 }}>
                  <span style={{ opacity: 0.6 }}>{item.label}</span>
                  <span>{item.value != null ? `${typeof item.value === 'number' ? item.value.toFixed(1) : item.value} ${item.unit}` : '—'}</span>
                </div>
              ))}
            </div>
          )}

          {format === 'story' && <div style={{ flex: 1, minHeight: 20 }} />}

          {/* Branding */}
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontWeight: 500, color: '#A8DADC', marginTop: format === 'story' ? 0 : 14, letterSpacing: 1, textAlign: 'center' }}>
            airas.app
          </div>
        </div>
      </CardShell>
    </div>
  )
})

// ── Card 5: The CTA (5-Day Forecast) ──

export const Card5Forecast = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; format: CardFormat }
>(function Card5Forecast({ data, format }, ref) {
  const forecasts = computeDailyForecasts(data)
  const windows = findBestWindows(data)
  const best = windows[0]

  // Status dot colour helper
  function dotColour(aqi: number): string {
    if (aqi <= 20) return '#34D399'
    if (aqi <= 40) return '#A8DADC'
    if (aqi <= 60) return '#F59E0B'
    if (aqi <= 80) return '#F97316'
    return '#EF4444'
  }

  return (
    <div ref={ref}>
      <CardShell format={format}>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: format === 'story' ? 'center' : 'flex-start' }}>
          {/* Header */}
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#C8C4DC', opacity: 0.5, letterSpacing: 2, textTransform: 'uppercase', marginBottom: format === 'story' ? 24 : 14 }}>
            Your 5-Day Air Forecast
          </div>

          {/* Forecast strip */}
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: format === 'story' ? 24 : 14, textAlign: 'center' }}>
            {forecasts.map((f, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', opacity: 0.6, marginBottom: 4 }}>{f.dayLabel}</div>
                <div style={{ width: 12, height: 12, borderRadius: '50%', backgroundColor: dotColour(f.avgAqi), margin: '0 auto 4px', boxShadow: `0 0 6px ${dotColour(f.avgAqi)}40` }} />
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: '#F0EEF8' }}>{f.avgAqi}</div>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#C8C4DC', opacity: 0.5, marginTop: 2 }}>{f.aqiBand.label}</div>
              </div>
            ))}
          </div>

          {/* Best window */}
          {best && (
            <div style={{ background: 'rgba(168,218,220,0.05)', borderRadius: 8, padding: '10px 12px', marginBottom: format === 'story' ? 24 : 14 }}>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#F0EEF8', marginBottom: 4 }}>
                🌟 Best window:
              </div>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#A8DADC' }}>
                {best.start.toLocaleDateString('en-GB', { weekday: 'long' })} {best.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}–{best.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })} — AQI {best.avgAqi}
              </div>
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', opacity: 0.5, marginTop: 2 }}>
                {best.recommendation}
              </div>
            </div>
          )}

          {/* Divider */}
          <div style={{ width: '60%', height: 1, background: 'rgba(200,196,220,0.08)', margin: '0 auto', marginBottom: format === 'story' ? 20 : 12 }} />

          {format === 'story' && <div style={{ flex: 1, minHeight: 20 }} />}

          {/* CTA */}
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontStyle: 'italic', color: '#C8C4DC', opacity: 0.7, lineHeight: 1.4, marginBottom: 10 }}>
              Plan sessions with the<br />atmosphere, not against it.
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 15, fontWeight: 500, color: '#A8DADC', letterSpacing: 1 }}>
              airas.app
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#C8C4DC', opacity: 0.35, marginTop: 4 }}>
              Free · No signup · Live data
            </div>
          </div>
        </div>
      </CardShell>
    </div>
  )
})
