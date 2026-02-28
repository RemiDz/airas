'use client'

import { useState, useRef, useMemo, useCallback } from 'react'
import { toPng } from 'html-to-image'
import { useLocation } from '@/hooks/useLocation'
import { useAirQuality } from '@/hooks/useAirQuality'
import { getAqiBand } from '@/lib/aqi-utils'
import { getUvBand } from '@/lib/uv-utils'
import { getOverallPollenLevel } from '@/lib/pollen-utils'
import { trackEvent } from '@/lib/analytics'
import {
  getActiveHookSet,
  getOpeningHooks,
  buildCaptionData,
  generateInstagramCaption,
  generateTwitterCaption,
  generateTikTokCaption,
  generateWhatsAppCaption,
  getContentIdeas,
  POSTING_TIMES,
} from '@/lib/promo-studio'
import {
  Card1Daily,
  Card2Trend,
  Card3Modalities,
  Card4PollenUv,
  Card5Forecast,
} from '@/components/promo/StudioCards'

type CardFormat = 'post' | 'story'

const CARD_LABELS = [
  'Card 1 — The Hook',
  'Card 2 — The Science',
  'Card 3 — Practice Guide',
  'Card 4 — Pollen & UV',
  'Card 5 — Forecast CTA',
]

export default function PromoStudioPage() {
  const { location } = useLocation()
  const { data, loading, error } = useAirQuality(location)

  const [activeCard, setActiveCard] = useState(0)
  const [format, setFormat] = useState<CardFormat>('story')
  const [selectedHook, setSelectedHook] = useState('')
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [capturedImages, setCapturedImages] = useState<(string | null)[]>([null, null, null, null, null])
  const [downloading, setDownloading] = useState(false)

  const cardRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])

  const setCardRef = useCallback((idx: number) => (el: HTMLDivElement | null) => {
    cardRefs.current[idx] = el
  }, [])

  // ── Data derivations ──

  const locName = useMemo(() => {
    if (!location) return ''
    return `${location.name}${location.country ? `, ${location.country}` : ''}`
  }, [location])

  const quickStats = useMemo(() => {
    if (!data) return null
    const aqi = data.current.european_aqi
    const band = getAqiBand(aqi)
    const uvBand = getUvBand(data.current.uv_index)
    const pollenLevel = getOverallPollenLevel(data)
    return { aqi, band, uv: data.current.uv_index, uvBand, pm25: data.current.pm2_5, pollenLevel }
  }, [data])

  const hookSet = useMemo(() => {
    if (!quickStats) return null
    return getActiveHookSet(quickStats.aqi)
  }, [quickStats])

  const allHooks = useMemo(() => {
    if (!quickStats) return []
    return getOpeningHooks(quickStats.aqi)
  }, [quickStats])

  // Initialise selected hook
  useMemo(() => {
    if (hookSet && !selectedHook) {
      setSelectedHook(hookSet.hooks[0])
    }
  }, [hookSet, selectedHook])

  const captionData = useMemo(() => {
    if (!data) return null
    return buildCaptionData(data, locName, selectedHook)
  }, [data, locName, selectedHook])

  const contentIdeas = useMemo(() => {
    if (!data) return []
    return getContentIdeas(data)
  }, [data])

  // ── Actions ──

  async function captureCard(idx: number) {
    const el = cardRefs.current[idx]
    if (!el) return null
    const dataUrl = await toPng(el, { pixelRatio: 2, backgroundColor: '#06061A' })
    const next = [...capturedImages]
    next[idx] = dataUrl
    setCapturedImages(next)
    return dataUrl
  }

  async function downloadCard(idx: number) {
    setDownloading(true)
    try {
      const dataUrl = await captureCard(idx)
      if (!dataUrl) return
      const link = document.createElement('a')
      link.download = `airas-card-${idx + 1}-${format}.png`
      link.href = dataUrl
      link.click()
      trackEvent('Promo Card Downloaded', { card: `card-${idx + 1}` })
    } finally {
      setDownloading(false)
    }
  }

  async function downloadAll() {
    setDownloading(true)
    try {
      for (let i = 0; i < 5; i++) {
        // Briefly switch to each card to render it, then capture
        setActiveCard(i)
        await new Promise(r => setTimeout(r, 100))
        const dataUrl = await captureCard(i)
        if (dataUrl) {
          const link = document.createElement('a')
          link.download = `airas-card-${i + 1}-${format}.png`
          link.href = dataUrl
          link.click()
          await new Promise(r => setTimeout(r, 200))
        }
      }
      trackEvent('Promo Card Downloaded', { card: 'all-cards' })
    } finally {
      setDownloading(false)
    }
  }

  function copyText(text: string, id: string) {
    navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  function shuffleHook() {
    if (!hookSet) return
    const others = hookSet.hooks.filter(h => h !== selectedHook)
    if (others.length > 0) {
      setSelectedHook(others[Math.floor(Math.random() * others.length)])
    }
  }

  // ── Loading / Error ──

  if (loading || !data) {
    return (
      <div className="min-h-screen atmospheric-bg flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="h-5 w-5 rounded-full border-2 border-accent-primary/30 border-t-accent-primary animate-spin mx-auto mb-4" />
          <div className="font-body text-sm text-text-secondary/50">Loading air quality data...</div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen atmospheric-bg flex items-center justify-center">
        <div className="glass-card p-8 text-center">
          <div className="font-body text-sm text-status-poor/70">{error}</div>
        </div>
      </div>
    )
  }

  const dateStr = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })

  return (
    <div className="min-h-screen atmospheric-bg">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 py-8 sm:py-12">

        {/* ═══════════════════════════════════════════
            1. HEADER BAR
        ═══════════════════════════════════════════ */}
        <div className="glass-card p-5 sm:p-6 mb-10">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="text-lg">🌬️</span>
              <span className="font-display text-lg sm:text-xl font-light text-text-primary tracking-wide">
                Airas Content Studio
              </span>
            </div>
            <div className="font-data text-[10px] tracking-wider text-text-secondary/40">
              {dateStr}
            </div>
          </div>
          <div className="font-data text-xs text-text-secondary/50 flex flex-wrap gap-x-4 gap-y-1">
            {quickStats && (
              <>
                <span>
                  AQI: <span style={{ color: quickStats.band.colour }}>{quickStats.aqi}</span> ({quickStats.band.label})
                </span>
                <span>PM2.5: {quickStats.pm25}</span>
                <span>UV: {quickStats.uv}</span>
                <span>Pollen: {quickStats.pollenLevel?.label ?? 'N/A'}</span>
                <span className="text-text-secondary/30">· {locName}</span>
              </>
            )}
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            2. SHAREABLE IMAGE CARDS
        ═══════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40 mb-5">
            Shareable Image Cards
          </div>

          {/* Tab selector */}
          <div className="flex flex-wrap gap-2 mb-5">
            {CARD_LABELS.map((label, i) => (
              <button
                key={i}
                onClick={() => setActiveCard(i)}
                className={`px-3 py-1.5 rounded-lg font-data text-[10px] tracking-wider border transition-all duration-200 ${
                  activeCard === i
                    ? 'bg-accent-primary/10 border-accent-primary/25 text-accent-primary'
                    : 'bg-white/[0.02] border-white/[0.06] text-text-secondary/50 hover:border-white/[0.12]'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Format toggle + actions */}
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <div className="flex gap-1.5">
              <button
                onClick={() => setFormat('post')}
                className={`px-3 py-1.5 rounded-lg font-data text-[10px] tracking-wider border transition-all duration-200 ${
                  format === 'post'
                    ? 'bg-accent-primary/10 border-accent-primary/25 text-accent-primary'
                    : 'bg-white/[0.02] border-white/[0.06] text-text-secondary/50 hover:border-white/[0.12]'
                }`}
              >
                Post (1080x1080)
              </button>
              <button
                onClick={() => setFormat('story')}
                className={`px-3 py-1.5 rounded-lg font-data text-[10px] tracking-wider border transition-all duration-200 ${
                  format === 'story'
                    ? 'bg-accent-primary/10 border-accent-primary/25 text-accent-primary'
                    : 'bg-white/[0.02] border-white/[0.06] text-text-secondary/50 hover:border-white/[0.12]'
                }`}
              >
                Story (1080x1920)
              </button>
            </div>

            <button
              onClick={() => downloadCard(activeCard)}
              disabled={downloading}
              className="px-4 py-1.5 rounded-lg font-data text-[10px] tracking-wider bg-accent-primary/15 border border-accent-primary/30 text-accent-primary hover:bg-accent-primary/25 transition-all duration-200 disabled:opacity-40"
            >
              {downloading ? 'Capturing...' : 'Download PNG'}
            </button>

            <button
              onClick={downloadAll}
              disabled={downloading}
              className="px-4 py-1.5 rounded-lg font-data text-[10px] tracking-wider bg-white/[0.03] border border-white/[0.08] text-text-secondary/60 hover:border-white/[0.15] transition-all duration-200 disabled:opacity-40"
            >
              Download All (5)
            </button>
          </div>

          {/* Phone mockup with card */}
          <div className="flex flex-col items-center">
            {/* Phone bezel */}
            <div
              className="rounded-[28px] p-3 sm:p-4"
              style={{
                background: 'linear-gradient(145deg, #1a1a2e 0%, #0d0d1a 100%)',
                boxShadow: '0 8px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                border: '1px solid rgba(200,196,220,0.06)',
              }}
            >
              {/* Notch */}
              <div className="w-20 h-1.5 rounded-full bg-white/[0.06] mx-auto mb-3" />

              {/* Card render area */}
              <div className="relative">
                {/* Only render the active card */}
                <div style={{ display: activeCard === 0 ? 'block' : 'none' }}>
                  <Card1Daily ref={setCardRef(0)} data={data} location={location} format={format} />
                </div>
                <div style={{ display: activeCard === 1 ? 'block' : 'none' }}>
                  <Card2Trend ref={setCardRef(1)} data={data} location={location} format={format} />
                </div>
                <div style={{ display: activeCard === 2 ? 'block' : 'none' }}>
                  <Card3Modalities ref={setCardRef(2)} data={data} format={format} />
                </div>
                <div style={{ display: activeCard === 3 ? 'block' : 'none' }}>
                  <Card4PollenUv ref={setCardRef(3)} data={data} format={format} />
                </div>
                <div style={{ display: activeCard === 4 ? 'block' : 'none' }}>
                  <Card5Forecast ref={setCardRef(4)} data={data} format={format} />
                </div>
              </div>

              {/* Home indicator */}
              <div className="w-16 h-1 rounded-full bg-white/[0.08] mx-auto mt-3" />
            </div>

            {/* Captured image preview for mobile */}
            {capturedImages[activeCard] && (
              <div className="mt-6 w-full max-w-sm">
                <div className="font-data text-[9px] tracking-wider text-text-secondary/30 mb-2 text-center">
                  Long-press to save on mobile
                </div>
                <img
                  src={capturedImages[activeCard]!}
                  alt={`Card ${activeCard + 1} preview`}
                  className="w-full rounded-lg border border-white/[0.06]"
                />
              </div>
            )}
          </div>
        </section>

        {/* ═══════════════════════════════════════════
            3. OPENING HOOKS
        ═══════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="flex items-center justify-between mb-5">
            <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40">
              Opening Hooks
            </div>
            <button
              onClick={shuffleHook}
              className="px-3 py-1 rounded-lg font-data text-[10px] tracking-wider bg-white/[0.03] border border-white/[0.08] text-text-secondary/50 hover:border-white/[0.15] transition-all duration-200"
            >
              Shuffle
            </button>
          </div>

          {/* Active AQI band hooks */}
          {hookSet && (
            <div className="glass-card p-5 mb-4">
              <div className="font-data text-[9px] tracking-wider text-accent-primary/60 mb-3">
                {hookSet.level} — current conditions
              </div>
              <div className="space-y-2.5">
                {hookSet.hooks.map((hook, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
                      selectedHook === hook
                        ? 'bg-accent-primary/[0.06] border-accent-primary/20'
                        : 'bg-white/[0.01] border-white/[0.04] hover:border-white/[0.1]'
                    }`}
                    onClick={() => setSelectedHook(hook)}
                  >
                    <div className="flex-1 font-body text-sm text-text-primary/90 leading-relaxed">
                      {hook}
                    </div>
                    <button
                      onClick={(e) => { e.stopPropagation(); copyText(hook, `hook-${i}`) }}
                      className="flex-shrink-0 px-2.5 py-1 rounded-md font-data text-[9px] tracking-wider bg-white/[0.04] border border-white/[0.06] text-text-secondary/50 hover:text-accent-primary hover:border-accent-primary/20 transition-all duration-200"
                    >
                      {copiedId === `hook-${i}` ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Other AQI bands (collapsed) */}
          {allHooks.filter(h => h.level !== hookSet?.level).map((set, i) => (
            <details key={i} className="glass-card p-4 mb-3">
              <summary className="font-data text-[10px] tracking-wider text-text-secondary/40 cursor-pointer hover:text-text-secondary/60 transition-colors">
                {set.level}
              </summary>
              <div className="mt-3 space-y-2">
                {set.hooks.map((hook, j) => (
                  <div
                    key={j}
                    className="flex items-start gap-3 p-2.5 rounded-lg bg-white/[0.01] border border-white/[0.03]"
                  >
                    <div className="flex-1 font-body text-xs text-text-secondary/60 leading-relaxed">{hook}</div>
                    <button
                      onClick={() => { setSelectedHook(hook); copyText(hook, `other-${i}-${j}`) }}
                      className="flex-shrink-0 px-2 py-0.5 rounded font-data text-[8px] tracking-wider text-text-secondary/40 hover:text-accent-primary transition-colors"
                    >
                      {copiedId === `other-${i}-${j}` ? '✓' : 'Use'}
                    </button>
                  </div>
                ))}
              </div>
            </details>
          ))}
        </section>

        {/* ═══════════════════════════════════════════
            4. READY-TO-COPY CAPTIONS
        ═══════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40 mb-5">
            Ready-to-Copy Captions
          </div>

          {captionData && (
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Instagram */}
              <CaptionBlock
                platform="Instagram"
                emoji="📸"
                caption={generateInstagramCaption(captionData)}
                id="caption-ig"
                copiedId={copiedId}
                onCopy={copyText}
              />

              {/* Twitter/X */}
              <CaptionBlock
                platform="Twitter/X"
                emoji="🐦"
                caption={generateTwitterCaption(captionData)}
                id="caption-tw"
                copiedId={copiedId}
                onCopy={copyText}
              />

              {/* TikTok */}
              <CaptionBlock
                platform="TikTok"
                emoji="🎵"
                caption={generateTikTokCaption(captionData)}
                id="caption-tt"
                copiedId={copiedId}
                onCopy={copyText}
              />

              {/* WhatsApp/DM */}
              <CaptionBlock
                platform="WhatsApp/DM"
                emoji="💬"
                caption={generateWhatsAppCaption(captionData)}
                id="caption-wa"
                copiedId={copiedId}
                onCopy={copyText}
              />
            </div>
          )}
        </section>

        {/* ═══════════════════════════════════════════
            5. CONTENT CALENDAR
        ═══════════════════════════════════════════ */}
        <section className="mb-14">
          <div className="font-data text-[10px] tracking-[0.2em] uppercase text-text-secondary/40 mb-5">
            Content Calendar
          </div>

          {/* Best posting times */}
          <div className="glass-card p-5 mb-4">
            <div className="font-body text-sm text-text-secondary/60 mb-3">Best posting times</div>
            <div className="space-y-2">
              {POSTING_TIMES.map(p => (
                <div key={p.platform} className="flex items-center gap-3">
                  <span className="text-sm">{p.emoji}</span>
                  <span className="font-body text-xs text-text-primary/80 w-20">{p.platform}</span>
                  <div className="flex gap-2">
                    {p.times.map(t => (
                      <span key={t} className="font-data text-[10px] tracking-wider text-accent-primary/60 bg-accent-primary/[0.06] px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contextual content ideas */}
          {contentIdeas.length > 0 && (
            <div className="glass-card p-5">
              <div className="font-body text-sm text-text-secondary/60 mb-3">Today&apos;s content ideas</div>
              <div className="space-y-2.5">
                {contentIdeas.map((idea, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
                    <div className="flex-shrink-0 font-data text-[9px] tracking-wider text-accent-secondary/60 bg-accent-secondary/[0.06] px-2 py-0.5 rounded mt-0.5">
                      {idea.condition}
                    </div>
                    <div className="font-body text-xs text-text-primary/70 leading-relaxed">
                      {idea.idea}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

      </div>
    </div>
  )
}

// ── Caption Block component ──

function CaptionBlock({
  platform,
  emoji,
  caption,
  id,
  copiedId,
  onCopy,
}: {
  platform: string
  emoji: string
  caption: string
  id: string
  copiedId: string | null
  onCopy: (text: string, id: string) => void
}) {
  return (
    <div className="glass-card p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm">{emoji}</span>
          <span className="font-data text-[10px] tracking-wider text-text-secondary/50">{platform}</span>
        </div>
        <button
          onClick={() => onCopy(caption, id)}
          className={`px-3 py-1 rounded-md font-data text-[9px] tracking-wider border transition-all duration-200 ${
            copiedId === id
              ? 'bg-accent-secondary/10 border-accent-secondary/25 text-accent-secondary'
              : 'bg-white/[0.04] border-white/[0.06] text-text-secondary/50 hover:text-accent-primary hover:border-accent-primary/20'
          }`}
        >
          {copiedId === id ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <pre className="font-body text-[11px] text-text-secondary/60 leading-relaxed whitespace-pre-wrap break-words max-h-48 overflow-y-auto">
        {caption}
      </pre>
    </div>
  )
}
