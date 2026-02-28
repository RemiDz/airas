'use client'

import { forwardRef } from 'react'
import type { AirQualityResponse, Location } from '@/lib/types'
import { getAqiBand, getPractitionerTagline, getPollutantBand } from '@/lib/aqi-utils'
import { getUvBand, getUvExposureGuidance } from '@/lib/uv-utils'
import { generateSessionGuidance } from '@/lib/practitioner'
import { hasPollenData, extractPollenTypes, getOverallPollenLevel, getPollenBand } from '@/lib/pollen-utils'
import { computeDailyForecasts, findBestWindows } from '@/lib/forecast-utils'

// ── Types ──

type CardFormat = 'post' | 'story'

// ── Shared card shell ──

function CardShell({ format, children }: { format: CardFormat; children: React.ReactNode }) {
  const h = format === 'post' ? 1080 : 1920
  return (
    <div
      style={{
        width: 360,
        height: h / 3,
        backgroundColor: '#06061A',
        border: '1px solid rgba(200,196,220,0.08)',
        borderRadius: 8,
        padding: format === 'post' ? 11 : 14,
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

// ── Shared helpers ──

function AqiBar({ value }: { value: number }) {
  const pos = Math.min((value / 100) * 100, 100)
  return (
    <div style={{ position: 'relative', width: '100%', height: 5, borderRadius: 3 }}>
      <div style={{ width: '100%', height: '100%', borderRadius: 3, background: 'linear-gradient(90deg, #34D399 0%, #A8DADC 20%, #F59E0B 40%, #F97316 60%, #EF4444 80%, #991B1B 100%)' }} />
      <div style={{ position: 'absolute', left: `${pos}%`, top: '50%', transform: 'translate(-50%, -50%)', width: 9, height: 9, borderRadius: '50%', backgroundColor: '#fff', boxShadow: '0 0 6px rgba(168,218,220,0.6)' }} />
    </div>
  )
}

function StatusDot({ colour }: { colour: string }) {
  return <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', backgroundColor: colour, flexShrink: 0 }} />
}

function GlassSection({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return (
    <div style={{ background: 'rgba(200,196,220,0.03)', border: '1px solid rgba(200,196,220,0.05)', borderRadius: 6, padding: 8, ...style }}>
      {children}
    </div>
  )
}

function dotColour(aqi: number): string {
  if (aqi <= 20) return '#34D399'
  if (aqi <= 40) return '#A8DADC'
  if (aqi <= 60) return '#F59E0B'
  if (aqi <= 80) return '#F97316'
  return '#EF4444'
}

// ════════════════════════════════════════════════
// CARD 1 — DAILY AIR INTELLIGENCE (the workhorse)
// ════════════════════════════════════════════════

export const Card1Daily = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; location: Location; format: CardFormat }
>(function Card1Daily({ data, location, format }, ref) {
  const aqi = data.current.european_aqi
  const band = getAqiBand(aqi)
  const tagline = getPractitionerTagline(aqi)
  const guidance = generateSessionGuidance(data)
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const locName = `${location.name}${location.country ? `, ${location.country}` : ''}`

  // Pollutant data with status
  const pollutants = [
    { label: 'PM2.5', value: data.current.pm2_5, key: 'pm2_5', unit: 'μg/m³' },
    { label: 'PM10', value: data.current.pm10, key: 'pm10', unit: 'μg/m³' },
    { label: 'O₃', value: Math.round(data.current.ozone), key: 'ozone', unit: 'μg/m³' },
    { label: 'NO₂', value: Math.round(data.current.nitrogen_dioxide), key: 'nitrogen_dioxide', unit: 'μg/m³' },
  ]

  // UV + Pollen row
  const uv = data.current.uv_index
  const uvBand = getUvBand(uv)
  const pollenLevel = getOverallPollenLevel(data)

  // 24h trend SVG
  const now = new Date()
  const hourly = data.hourly
  let endIdx = 0
  for (let i = 0; i < hourly.time.length; i++) {
    if (new Date(hourly.time[i]) >= now) { endIdx = i; break }
  }
  const startIdx = Math.max(0, endIdx - 24)
  const slice = hourly.european_aqi.slice(startIdx, endIdx + 1)
  const chartW = 300
  const chartH = 50
  const maxVal = Math.max(60, ...slice)
  const points = slice.map((v, i) => ({
    x: (i / Math.max(slice.length - 1, 1)) * chartW,
    y: chartH - (v / maxVal) * chartH,
  }))
  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${chartW},${chartH} L0,${chartH} Z`
  let peakVal = 0, peakIdx = 0
  slice.forEach((v, i) => { if (v > peakVal) { peakVal = v; peakIdx = i } })

  // Key modalities (top 4 for inline display)
  const keyMods = guidance.modalities.slice(0, 4)

  const isStory = format === 'story'
  const gap = isStory ? 10 : 6

  return (
    <div ref={ref}>
      <CardShell format={format}>
        {/* ── Top: Location + Date ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: gap }}>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#C8C4DC', opacity: 0.7 }}>○ {locName}</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#C8C4DC', opacity: 0.35 }}>{dateStr}</div>
        </div>

        {/* ── AQI Hero ── */}
        <GlassSection style={{ textAlign: 'center', marginBottom: gap, padding: isStory ? 14 : 10 }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: isStory ? 52 : 42, fontWeight: 500, color: band.colour, lineHeight: 1, textShadow: `0 0 24px ${band.colour}35` }}>
            {aqi}
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: isStory ? 16 : 14, fontWeight: 300, color: band.colour, marginTop: 2, marginBottom: isStory ? 8 : 6 }}>
            {band.label}
          </div>
          <AqiBar value={aqi} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.3, marginTop: 2 }}>
            <span>0</span><span>AQI</span><span>100+</span>
          </div>
        </GlassSection>

        {/* ── Data Grid (2x3) ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: gap }}>
          {pollutants.map(p => {
            const pBand = getPollutantBand(p.key, p.value)
            return (
              <GlassSection key={p.label} style={{ padding: '5px 7px', display: 'flex', alignItems: 'center', gap: 5 }}>
                <StatusDot colour={pBand.colour} />
                <div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.5, letterSpacing: 0.5 }}>{p.label}</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 500, color: '#F0EEF8', lineHeight: 1.1 }}>{p.value}</div>
                </div>
              </GlassSection>
            )
          })}
          {/* UV */}
          <GlassSection style={{ padding: '5px 7px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <StatusDot colour={uvBand.colour} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.5, letterSpacing: 0.5 }}>UV</div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 500, color: '#F0EEF8', lineHeight: 1.1 }}>{uv} <span style={{ fontSize: 7, opacity: 0.5 }}>{uvBand.label}</span></div>
            </div>
          </GlassSection>
          {/* Pollen or Dust */}
          <GlassSection style={{ padding: '5px 7px', display: 'flex', alignItems: 'center', gap: 5 }}>
            <StatusDot colour={pollenLevel?.colour ?? '#34D399'} />
            <div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.5, letterSpacing: 0.5 }}>
                {pollenLevel ? 'POLLEN' : 'DUST'}
              </div>
              <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 12, fontWeight: 500, color: '#F0EEF8', lineHeight: 1.1 }}>
                {pollenLevel ? pollenLevel.label : `${data.current.dust?.toFixed(0) ?? '—'}`}
                {!pollenLevel && <span style={{ fontSize: 7, opacity: 0.5 }}> μg/m³</span>}
              </div>
            </div>
          </GlassSection>
        </div>

        {/* ── 24h Trend SVG ── */}
        <GlassSection style={{ marginBottom: gap, padding: '6px 6px 4px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.4, letterSpacing: 1, textTransform: 'uppercase' }}>24h Trend</span>
            <span style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#F59E0B' }}>Peak: {peakVal}</span>
          </div>
          <svg viewBox={`0 0 ${chartW} ${chartH}`} style={{ width: '100%', height: isStory ? 60 : 40 }} preserveAspectRatio="none">
            <defs>
              <linearGradient id="cf1" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#A8DADC" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#A8DADC" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={areaPath} fill="url(#cf1)" />
            <path d={linePath} fill="none" stroke="#A8DADC" strokeWidth="1.2" strokeLinejoin="round" />
            {points[peakIdx] && <circle cx={points[peakIdx].x} cy={points[peakIdx].y} r="2.5" fill="#F59E0B" stroke="#06061A" strokeWidth="0.8" />}
          </svg>
        </GlassSection>

        {/* ── Guidance + Modalities ── */}
        <GlassSection style={{ marginBottom: gap, padding: '6px 8px' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 11, fontStyle: 'italic', color: '#C8C4DC', opacity: 0.8, lineHeight: 1.3, marginBottom: 5 }}>
            &ldquo;{tagline}&rdquo;
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px 8px' }}>
            {keyMods.map(m => (
              <span key={m.name} style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: m.safe ? '#34D399' : '#F59E0B', whiteSpace: 'nowrap' }}>
                {m.safe ? '✓' : '⚠'} {m.name}
              </span>
            ))}
          </div>
        </GlassSection>

        {/* Story spacer */}
        {isStory && <div style={{ flex: 1, minHeight: 4 }} />}

        {/* ── Branding ── */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontWeight: 500, color: '#A8DADC', letterSpacing: 1 }}>airas.app</div>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#C8C4DC', opacity: 0.4 }}>Air Intelligence for Practitioners</div>
          </div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.25 }}>
            Live data
          </div>
        </div>
      </CardShell>
    </div>
  )
})

// ════════════════════════════════════════════════
// CARD 2 — BREATHWORK ADVISORY (practitioner-focused)
// ════════════════════════════════════════════════

export const Card2Advisory = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; location: Location; format: CardFormat }
>(function Card2Advisory({ data, location, format }, ref) {
  const aqi = data.current.european_aqi
  const uv = data.current.uv_index
  const uvBand = getUvBand(uv)
  const uvGuidance = getUvExposureGuidance(uv)
  const guidance = generateSessionGuidance(data)
  const pollenLevel = getOverallPollenLevel(data)
  const pollenTypes = extractPollenTypes(data)
  const activePollen = pollenTypes.filter(t => t.currentValue !== null && t.currentValue > 0)
  const topPollen = activePollen.length > 0 ? activePollen.reduce((a, b) => (a.currentValue! > b.currentValue! ? a : b)) : null
  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  const locName = `${location.name}${location.country ? `, ${location.country}` : ''}`

  const ratingConfig: Record<string, { label: string; colour: string }> = {
    excellent: { label: 'Excellent', colour: '#34D399' },
    good: { label: 'Good', colour: '#A8DADC' },
    caution: { label: 'Caution', colour: '#F59E0B' },
    'indoor-only': { label: 'Indoor Only', colour: '#F97316' },
    avoid: { label: 'Avoid Outdoor', colour: '#EF4444' },
  }
  const rating = ratingConfig[guidance.overallRating] ?? ratingConfig.good

  const isStory = format === 'story'
  const gap = isStory ? 10 : 6

  return (
    <div ref={ref}>
      <CardShell format={format}>
        {/* ── Header ── */}
        <div style={{ marginBottom: gap }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#C8C4DC', opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
            Today&apos;s Breathwork Conditions
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#C8C4DC', opacity: 0.6 }}>{locName} · {dateStr}</div>
            {/* Rating badge */}
            <div style={{
              fontFamily: 'JetBrains Mono, monospace', fontSize: 9, fontWeight: 500,
              color: rating.colour, backgroundColor: `${rating.colour}12`,
              border: `1px solid ${rating.colour}30`, borderRadius: 6, padding: '2px 8px',
            }}>
              {rating.label}
            </div>
          </div>
        </div>

        {/* ── Full Modality Checklist ── */}
        <GlassSection style={{ marginBottom: gap, padding: isStory ? 10 : 8 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: isStory ? 7 : 5 }}>
            {guidance.modalities.map(m => (
              <div key={m.name} style={{ display: 'flex', alignItems: 'flex-start', gap: 6 }}>
                <span style={{ fontSize: 11, lineHeight: 1.2, flexShrink: 0 }}>
                  {m.safe ? '✅' : m.note ? '⚠️' : '❌'}
                </span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#F0EEF8', lineHeight: 1.2 }}>{m.name}</div>
                  {m.note && (
                    <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#C8C4DC', opacity: 0.5, lineHeight: 1.3, marginTop: 1 }}>{m.note}</div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </GlassSection>

        {/* ── Info strip: UV + Pollen + Best Window ── */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, marginBottom: gap }}>
          {/* UV */}
          <GlassSection style={{ padding: '6px 7px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.4, letterSpacing: 0.5, marginBottom: 2 }}>☀️ UV EXPOSURE</div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 14, fontWeight: 500, color: uvBand.colour, lineHeight: 1 }}>{uv}</div>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 8, color: '#C8C4DC', opacity: 0.5, marginTop: 2 }}>Safe: {uvGuidance.safeMinutes}</div>
          </GlassSection>

          {/* Pollen */}
          <GlassSection style={{ padding: '6px 7px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.4, letterSpacing: 0.5, marginBottom: 2 }}>🌿 TOP POLLEN</div>
            {topPollen ? (
              <>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#F0EEF8', lineHeight: 1.2 }}>{topPollen.name}</div>
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: pollenLevel?.colour ?? '#C8C4DC', marginTop: 1 }}>
                  {topPollen.currentValue} grains/m³ ({pollenLevel?.label ?? '—'})
                </div>
              </>
            ) : (
              <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 11, color: '#34D399', lineHeight: 1.2 }}>None active</div>
            )}
          </GlassSection>
        </div>

        {/* Best window */}
        <GlassSection style={{ marginBottom: gap, padding: '6px 8px' }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.4, letterSpacing: 0.5, marginBottom: 2 }}>🌟 BEST WINDOW TODAY</div>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#A8DADC', lineHeight: 1.3 }}>{guidance.nextWindow}</div>
        </GlassSection>

        {isStory && <div style={{ flex: 1, minHeight: 4 }} />}

        {/* ── Branding ── */}
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 13, fontWeight: 500, color: '#A8DADC', letterSpacing: 1 }}>airas.app</div>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#C8C4DC', opacity: 0.4 }}>Air Intelligence for Practitioners</div>
        </div>
      </CardShell>
    </div>
  )
})

// ════════════════════════════════════════════════
// CARD 3 — WEEKLY FORECAST (planning card)
// ════════════════════════════════════════════════

export const Card3Forecast = forwardRef<
  HTMLDivElement,
  { data: AirQualityResponse; location: Location; format: CardFormat }
>(function Card3Forecast({ data, location, format }, ref) {
  const forecasts = computeDailyForecasts(data)
  const windows = findBestWindows(data)
  const best = windows[0]
  const locName = `${location.name}${location.country ? `, ${location.country}` : ''}`

  // Pollen trend indicator
  const pollenTypes = extractPollenTypes(data)
  const hasPollen = hasPollenData(data)
  const pollenLevel = getOverallPollenLevel(data)

  const isStory = format === 'story'
  const gap = isStory ? 10 : 6

  return (
    <div ref={ref}>
      <CardShell format={format}>
        {/* ── Header ── */}
        <div style={{ marginBottom: gap }}>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 8, color: '#C8C4DC', opacity: 0.4, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 2 }}>
            5-Day Air Forecast
          </div>
          <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: '#C8C4DC', opacity: 0.6 }}>{locName}</div>
        </div>

        {/* ── Forecast strip — each day as a column ── */}
        <GlassSection style={{ marginBottom: gap, padding: isStory ? 12 : 8 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
            {forecasts.map((f, i) => (
              <div key={i} style={{ flex: 1 }}>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 9, color: '#C8C4DC', opacity: 0.6, marginBottom: 4 }}>{f.dayLabel}</div>
                <div style={{ width: 14, height: 14, borderRadius: '50%', backgroundColor: dotColour(f.avgAqi), margin: '0 auto 4px', boxShadow: `0 0 8px ${dotColour(f.avgAqi)}40` }} />
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: isStory ? 18 : 15, fontWeight: 500, color: '#F0EEF8' }}>{f.avgAqi}</div>
                <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 7, color: '#C8C4DC', opacity: 0.5, marginTop: 1 }}>{f.aqiBand.label}</div>
                {/* UV + session icon */}
                <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.35, marginTop: 3 }}>UV {f.peakUv}</div>
                <div style={{ fontSize: 10, marginTop: 2 }}>
                  {f.sessionSafe === 'good' ? '✓' : f.sessionSafe === 'caution' ? '⚠' : '✗'}
                </div>
              </div>
            ))}
          </div>
        </GlassSection>

        {/* ── Best session window ── */}
        {best && (
          <GlassSection style={{ marginBottom: gap, padding: '8px 10px' }}>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.4, letterSpacing: 0.5, marginBottom: 3 }}>🌟 BEST SESSION WINDOW</div>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 12, color: '#A8DADC', marginBottom: 2 }}>
              {best.start.toLocaleDateString('en-GB', { weekday: 'long' })} {best.start.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}–{best.end.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 9, color: '#C8C4DC', opacity: 0.5 }}>
              AQI {best.avgAqi} · UV {best.peakUv} · {best.recommendation}
            </div>
          </GlassSection>
        )}

        {/* ── Pollen trend ── */}
        <GlassSection style={{ marginBottom: gap, padding: '6px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.4, letterSpacing: 0.5 }}>🌿 POLLEN</div>
            <div style={{ fontFamily: 'Lato, sans-serif', fontSize: 10, color: pollenLevel?.colour ?? '#34D399', marginTop: 1 }}>
              {pollenLevel?.label ?? (hasPollen ? 'Low' : 'N/A')}
            </div>
          </div>
          {/* Mini forecast bar visual */}
          <div style={{ display: 'flex', gap: 2, alignItems: 'flex-end' }}>
            {forecasts.map((f, i) => (
              <div key={i} style={{ width: 8, height: Math.max(4, (f.avgAqi / 80) * 24), borderRadius: 2, backgroundColor: dotColour(f.avgAqi), opacity: 0.6 }} />
            ))}
          </div>
        </GlassSection>

        {isStory && <div style={{ flex: 1, minHeight: 4 }} />}

        {/* ── CTA ── */}
        <div style={{ textAlign: 'center', borderTop: '1px solid rgba(200,196,220,0.06)', paddingTop: 8 }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 12, fontStyle: 'italic', color: '#C8C4DC', opacity: 0.7, lineHeight: 1.3, marginBottom: 6 }}>
            Plan sessions with the atmosphere, not against it.
          </div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 14, fontWeight: 500, color: '#A8DADC', letterSpacing: 1 }}>airas.app</div>
          <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: 7, color: '#C8C4DC', opacity: 0.3, marginTop: 2 }}>Free · No signup · Live data</div>
        </div>
      </CardShell>
    </div>
  )
})
