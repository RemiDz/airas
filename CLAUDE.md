# 🌬️ AIRAS.APP — Claude Code Build Specification
## The Air Element | Harmonic Waves Ecosystem
### Version 1.0 — Complete Build Guide

---

## Table of Contents

1. [Vision & Identity](#1-vision--identity)
2. [Tech Stack & Project Setup](#2-tech-stack--project-setup)
3. [Design System — "Celestial Breath"](#3-design-system--celestial-breath)
4. [Data Architecture & API](#4-data-architecture--api)
5. [Phase 1 — Foundation & Hero](#phase-1--foundation--hero)
6. [Phase 2 — Core Data Sections](#phase-2--core-data-sections)
7. [Phase 3 — Practitioner Intelligence Layer](#phase-3--practitioner-intelligence-layer)
8. [Phase 4 — Pollen & Allergen Radar](#phase-4--pollen--allergen-radar)
9. [Phase 5 — Atmospheric Deep Dive](#phase-5--atmospheric-deep-dive)
10. [Phase 6 — 5-Day Forecast & Session Planner](#phase-6--5-day-forecast--session-planner)
11. [Phase 7 — Location, Settings & PWA](#phase-7--location-settings--pwa)
12. [Phase 8 — Promo Content Studio](#phase-8--promo-content-studio)
13. [Phase 9 — Polish, Animation & Performance](#phase-9--polish-animation--performance)
14. [Phase 10 — SEO, Analytics & Deployment](#phase-10--seo-analytics--deployment)
15. [File Architecture](#file-architecture)
16. [Quality Benchmarks](#quality-benchmarks)

---

## 1. Vision & Identity

### What is Airas?

Airas is the **Air element** in the Harmonic Waves ecosystem of sound healing and wellness applications:

| Element | App | Domain | Focus |
|---------|-----|--------|-------|
| 🌍 Earth | Earth Pulse | shumann.app | Schumann Resonance, geomagnetic activity |
| 🌊 Water | Tidara | tidara.app | Ocean tides, tidal rhythms |
| 🌙 Cosmic | Lunata | lunata.app | Lunar phases, moon intelligence |
| 🌬️ **Air** | **Airas** | **airas.app** | **Air quality, pollen, UV, atmospheric conditions** |
| 🔥 Fire | (Planned) | — | Solar activity, fire ceremonies |

### Core Promise

*"Know what you're breathing. Plan sessions with the atmosphere, not against it."*

### Who is this for?

- Sound healing practitioners running outdoor sessions
- Breathwork facilitators (pranayama, holotropic, Wim Hof)
- Yoga teachers planning outdoor classes
- Holistic wellness practitioners advising clients
- Anyone conscious about the air they breathe

### What makes Airas different from every other air quality app?

Every air quality app speaks to commuters, joggers, and asthmatics. Airas speaks to **practitioners**. It translates raw atmospheric data into **session guidance**: when to practise outdoors, when to move inside, which breathwork modalities are appropriate for today's conditions, and how pollen, UV, and pollutants affect subtle energy work.

The **Practitioner Intelligence Layer** is what transforms this from "yet another AQI app" into something practitioners will bookmark and check daily.

---

## 2. Tech Stack & Project Setup

### Stack

- **Next.js 14** — App Router, TypeScript, `output: 'export'` (fully static)
- **Tailwind CSS** — with custom design tokens
- **Framer Motion** — scroll reveals, card entrances, breathing animations
- **Recharts** — charts and trend visualisations
- **No backend. No database. No auth. No unnecessary dependencies.**

### Initialise

```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
npm install framer-motion recharts
```

### `next.config.ts`

```ts
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
}
export default nextConfig
```

### Fonts — load via `next/font/google` in `layout.tsx`

```ts
import { Cormorant_Garamond, Lato, JetBrains_Mono } from 'next/font/google'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-display',
})

const lato = Lato({
  subsets: ['latin'],
  weight: ['300', '400', '700'],
  variable: '--font-body',
})

const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-mono',
})
```

Apply all three to `<body>` as CSS variable classes.

---

## 3. Design System — "Celestial Breath"

### Design Philosophy

Airas is the **Air element** — it must feel vast, open, atmospheric, and breathing. Think standing on a mountaintop at dawn, lungs full, seeing the atmosphere curve away to the horizon. Not clinical. Not dashboard-y. Alive.

This is the same universe as lunata.app and shumann.app — same design DNA, different personality. Users should recognise the family immediately but feel this is its own distinct world.

### Colour Palette

| Token | Hex | CSS Variable | Usage |
|-------|-----|-------------|-------|
| Stratosphere Black | `#06061A` | `--void` | Primary background |
| Deep Atmosphere | `#0A0A2E` | `--void-deep` | Secondary backgrounds, card fills |
| Zephyr Teal | `#A8DADC` | `--accent-primary` | Primary accent — Air element colour |
| Breath Cyan | `#4ECDC4` | `--accent-secondary` | Interactive states, live data highlights |
| Cirrus White | `#F0EEF8` | `--text-primary` | Primary text (Selenite equivalent) |
| Mist Silver | `#C8C4DC` | `--text-secondary` | Secondary text, labels (Moonsilver equivalent) |
| Aurora Green | `#34D399` | `--status-good` | Good AQI, healthy conditions |
| Amber Warning | `#F59E0B` | `--status-moderate` | Moderate conditions |
| Coral Alert | `#EF4444` | `--status-poor` | Poor/hazardous conditions |
| Pollen Gold | `#FFD166` | `--pollen` | Pollen data accent |
| UV Violet | `#8B5CF6` | `--uv` | UV index accent |
| Ozone Blue | `#3B82F6` | `--ozone` | Ozone data accent |

### AQI Gradient Scale

The AQI bar uses a continuous gradient that must be consistent everywhere:
```css
--aqi-gradient: linear-gradient(90deg, 
  #34D399 0%,      /* Good: 0-20 */
  #A8DADC 20%,     /* Fair: 20-40 */
  #F59E0B 40%,     /* Moderate: 40-60 */
  #F97316 60%,     /* Poor: 60-80 */
  #EF4444 80%,     /* Very Poor: 80-100 */
  #991B1B 100%     /* Extremely Poor: 100+ */
);
```

### Typography

| Role | Font | Weight | Size Range |
|------|------|--------|------------|
| Display / Hero | Cormorant Garamond | 300, 500 | 48–72px |
| Section Headings | Cormorant Garamond | 500, 600 | 24–36px |
| Body / UI | Lato | 300, 400, 700 | 14–18px |
| Data / Numbers | JetBrains Mono | 400, 500 | 12–48px |
| Labels / Tags | JetBrains Mono | 400 | 10–12px, tracking 0.2em |

### Glass Card System

Every card uses the ecosystem's glass morphism DNA:

```css
.glass-card {
  background: linear-gradient(
    135deg,
    rgba(240, 238, 248, 0.03) 0%,
    rgba(200, 196, 220, 0.01) 100%
  );
  backdrop-filter: blur(16px) saturate(1.15);
  border: 1px solid rgba(200, 196, 220, 0.08);
  border-radius: 16px;
  box-shadow:
    0 4px 24px rgba(0, 0, 0, 0.2),
    0 1px 2px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(240, 238, 248, 0.04);
}
```

### Animation Philosophy

- **Everything breathes.** The air element is about flow, expansion, contraction.
- Primary easing: `cubic-bezier(0.16, 1, 0.3, 1)` — the ecosystem spring
- Breathing animations: `4s ease-in-out infinite` for ambient pulsing
- Scroll reveals: staggered fade-up at 24px offset, 0.8s duration
- Data transitions: 0.6s smooth interpolation when values update
- Wind particle effects in hero background (subtle, performant, canvas-based)

### Background Atmosphere

The background should feel like deep atmosphere at night with subtle movement:

- Base: radial gradient from `#0A0A2E` centre to `#06061A` edges
- Layered: very subtle animated aurora/cloud wisps (CSS or canvas)
- Particles: tiny floating dust/air particles, very slow drift (canvas overlay, low opacity)
- The overall feeling: vast, airy, nocturnal, serene

---

## 4. Data Architecture & API

### Data Source

**Open-Meteo Air Quality API** — free, no API key required, CORS-friendly.

**Endpoint:** `https://air-quality-api.open-meteo.com/v1/air-quality`

### API Call Structure

Build ONE comprehensive API call that fetches all needed data:

```
GET https://air-quality-api.open-meteo.com/v1/air-quality
  ?latitude={lat}
  &longitude={lon}
  &timezone=auto
  &forecast_days=5
  &current=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,uv_index_clear_sky,dust,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen
  &hourly=european_aqi,us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone,uv_index,uv_index_clear_sky,dust,aerosol_optical_depth,alder_pollen,birch_pollen,grass_pollen,mugwort_pollen,olive_pollen,ragweed_pollen,carbon_dioxide,methane,ammonia
```

### API Response Shape

```typescript
interface AirQualityResponse {
  latitude: number
  longitude: number
  generationtime_ms: number
  utc_offset_seconds: number
  timezone: string
  timezone_abbreviation: string
  current_units: Record<string, string>
  current: {
    time: string                    // ISO 8601
    interval: number                // seconds
    european_aqi: number            // 0-100+
    us_aqi: number                  // 0-500
    pm10: number                    // μg/m³
    pm2_5: number                   // μg/m³
    carbon_monoxide: number         // μg/m³
    nitrogen_dioxide: number        // μg/m³
    sulphur_dioxide: number         // μg/m³
    ozone: number                   // μg/m³
    uv_index: number                // 0-11+
    uv_index_clear_sky: number      // 0-11+
    dust: number                    // μg/m³
    alder_pollen: number | null     // grains/m³ (null outside season/Europe)
    birch_pollen: number | null
    grass_pollen: number | null
    mugwort_pollen: number | null
    olive_pollen: number | null
    ragweed_pollen: number | null
  }
  hourly_units: Record<string, string>
  hourly: {
    time: string[]                  // ISO 8601 array (120 entries for 5 days)
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
    carbon_dioxide: number[]        // ppm
    methane: number[]               // μg/m³
    ammonia: (number | null)[]      // μg/m³ (Europe only)
  }
}
```

### Location Resolution

Use the **Open-Meteo Geocoding API** for location search:

```
GET https://geocoding-api.open-meteo.com/v1/search?name={query}&count=5&language=en&format=json
```

Response gives `name`, `country`, `latitude`, `longitude`, `admin1` (region/state).

### Data Fetching Strategy

```
src/lib/
  api.ts              — fetchAirQuality(lat, lon), fetchGeocode(query)
  types.ts            — Full TypeScript interfaces
  transforms.ts       — Raw API → display-ready data structures
  aqi-utils.ts        — AQI classification, colours, labels, thresholds
  practitioner.ts     — Session guidance logic (the unique layer)
```

**Fetching rules:**
- Fetch on page load after geolocation resolves
- Cache response in React state (no localStorage)
- Auto-refresh every 15 minutes (data updates hourly at source)
- Show loading skeletons during fetch (glass card outlines with shimmer)
- Graceful error handling: show last known data with "data may be outdated" note

### AQI Classification Tables

**European AQI** (primary for UK/EU users):

```typescript
const EU_AQI_BANDS = [
  { min: 0,   max: 20,  label: 'Good',           colour: '#34D399', emoji: '🟢' },
  { min: 20,  max: 40,  label: 'Fair',            colour: '#A8DADC', emoji: '🔵' },
  { min: 40,  max: 60,  label: 'Moderate',        colour: '#F59E0B', emoji: '🟡' },
  { min: 60,  max: 80,  label: 'Poor',            colour: '#F97316', emoji: '🟠' },
  { min: 80,  max: 100, label: 'Very Poor',       colour: '#EF4444', emoji: '🔴' },
  { min: 100, max: 999, label: 'Extremely Poor',  colour: '#991B1B', emoji: '⚫' },
]
```

**US AQI** (for international users):

```typescript
const US_AQI_BANDS = [
  { min: 0,   max: 50,  label: 'Good',                        colour: '#34D399' },
  { min: 51,  max: 100, label: 'Moderate',                    colour: '#F59E0B' },
  { min: 101, max: 150, label: 'Unhealthy for Sensitive',     colour: '#F97316' },
  { min: 151, max: 200, label: 'Unhealthy',                   colour: '#EF4444' },
  { min: 201, max: 300, label: 'Very Unhealthy',              colour: '#991B1B' },
  { min: 301, max: 500, label: 'Hazardous',                   colour: '#4C0519' },
]
```

### UV Index Scale

```typescript
const UV_BANDS = [
  { min: 0,  max: 2,  label: 'Low',       colour: '#34D399' },
  { min: 3,  max: 5,  label: 'Moderate',   colour: '#F59E0B' },
  { min: 6,  max: 7,  label: 'High',       colour: '#F97316' },
  { min: 8,  max: 10, label: 'Very High',  colour: '#EF4444' },
  { min: 11, max: 20, label: 'Extreme',    colour: '#8B5CF6' },
]
```

### Pollen Scale

```typescript
const POLLEN_BANDS = [
  { min: 0,   max: 10,  label: 'None/Low',  colour: '#34D399' },
  { min: 10,  max: 30,  label: 'Moderate',   colour: '#F59E0B' },
  { min: 30,  max: 60,  label: 'High',       colour: '#F97316' },
  { min: 60,  max: 999, label: 'Very High',  colour: '#EF4444' },
]
```

---

## Phase 1 — Foundation & Hero

### Goal
Set up the project skeleton, implement the animated background, build the hero section with live AQI display, and establish the data fetching pipeline.

### What to Build

#### 1.1 — Project Scaffold
- Next.js project with all dependencies
- Tailwind config with all custom design tokens (colours, fonts, spacing)
- Global CSS with glass card classes, animation keyframes, scrollbar styling
- Layout with font loading, metadata, body classes

#### 1.2 — Animated Background
- Full-viewport canvas element behind all content
- Subtle floating air particles — tiny dots drifting slowly (random velocity, very low opacity 0.03–0.08)
- Gentle gradient shifts — the background radial gradient centre slowly orbits (very subtle, 60s+ cycle)
- Performance: use `requestAnimationFrame`, limit to ~30fps, pause when tab not visible
- Do NOT use heavy effects. This must feel light and airy, never heavy.

#### 1.3 — Hero Section
The hero is the first thing users see. It must be breathtaking.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│                                                              │
│     ○ Gateshead, GB                        ↻ Updated 14:30  │
│                                                              │
│                          31                                  │
│                         Good                                 │
│                                                              │
│     ╔══════════════════════════════════════════════╗          │
│     ║  ●────────────────────────────────────────── ║          │
│     ╚══════════════════════════════════════════════╝          │
│     0                                              100+      │
│                                                              │
│              "Clear skies for deep breathing"                │
│                                                              │
│     ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │
│     │ PM2.5   │ │ PM10    │ │ NO₂     │ │ O₃      │        │
│     │   5     │ │  11     │ │   9     │ │  77     │        │
│     └─────────┘ └─────────┘ └─────────┘ └─────────┘        │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Hero Components:**

1. **Location Bar** — Top left: location name with pin icon. Top right: last updated time with refresh icon (clickable). The location name is clickable → opens location search modal.

2. **AQI Score** — Centre, massive. The number uses `JetBrains Mono` at 72–96px, weight 500. Below it, the label ("Good", "Fair", etc.) in `Cormorant Garamond` at 24px, weight 300. The number should have a subtle glow matching its AQI band colour. Animate the number counting up on load (0 → actual value, 1.2s, ease-out).

3. **AQI Gradient Bar** — Full width below the score. A smooth gradient from green to red (use `--aqi-gradient`). A glowing dot indicator positioned at the current AQI value. The dot pulses gently (breathing animation). Below bar: "0" on left, "100+" on right in mono font.

4. **Practitioner Tagline** — A single sentence of session guidance below the bar. `Cormorant Garamond` italic, 18px, `--text-secondary` colour. Examples:
   - AQI 0–20: "Perfect conditions for outdoor breathwork and sound healing"
   - AQI 20–40: "Clear skies for deep breathing — gentle practice recommended"
   - AQI 40–60: "Moderate air — consider indoor sessions for sensitive clients"
   - AQI 60–80: "Elevated pollutants — indoor practice strongly recommended"
   - AQI 80+: "Poor air quality — avoid outdoor breathwork today"

5. **Quick Stats Row** — 4 mini glass cards in a horizontal row: PM2.5, PM10, NO₂, O₃. Each shows the pollutant name (label style, mono), value (large mono), and a tiny colour dot indicating its individual status.

#### 1.4 — Data Fetching Pipeline
- Implement `src/lib/api.ts` with typed fetch functions
- Implement geolocation: try `navigator.geolocation` first, fall back to IP-based (Open-Meteo uses lat/lon so this is needed)
- Store location in React context
- Build loading skeleton that matches hero layout (glass card outlines with shimmer animation)
- Error state with retry button

### Commit Point
`git commit -m "Phase 1: Foundation, hero, data pipeline"`

---

## Phase 2 — Core Data Sections

### Goal
Build the 24-hour trend chart and the detailed pollutant breakdown cards.

### What to Build

#### 2.1 — 24-Hour AQI Trend Chart

A Recharts `AreaChart` showing the last 24 hours of AQI data.

**Design specs:**
- Glass card container with section label "24H AQI TREND" (mono, 10px, tracking 0.2em)
- Area fill: gradient from `--accent-primary` at 20% opacity to transparent
- Line stroke: `--accent-primary` at 80% opacity, 2px
- X-axis: time labels every 3 hours (mono font, secondary colour, 10px)
- Y-axis: hidden (values readable from tooltip)
- Grid lines: horizontal only, `rgba(200, 196, 220, 0.05)`
- Tooltip: glass card style with AQI value, time, and status label
- A vertical "now" indicator line (dashed, accent colour)
- Animate the line drawing on scroll-reveal

#### 2.2 — Pollutant Breakdown

A grid of 6 detailed pollutant cards (2 columns on desktop, 1 on mobile):

| Card | Data | Unit | What Practitioners Care About |
|------|------|------|------------------------------|
| PM2.5 | Fine particulate | μg/m³ | Deepest lung penetration, most relevant for breathwork |
| PM10 | Coarse particulate | μg/m³ | Outdoor session planning |
| NO₂ | Nitrogen dioxide | μg/m³ | Traffic-related, urban session planning |
| O₃ | Ozone | μg/m³ | Afternoon peak concern for outdoor sessions |
| SO₂ | Sulphur dioxide | μg/m³ | Industrial area awareness |
| CO | Carbon monoxide | μg/m³ | Indoor space ventilation indicator |

**Each card contains:**
- Pollutant name (display font) and chemical formula (mono, smaller)
- Current value (large mono number) with unit
- Status badge (colour-coded pill: Good / Fair / Moderate / Poor / Very Poor)
- Mini sparkline: last 24h trend (tiny Recharts LineChart, no axes, just the line)
- 24h min/max range in small text
- One-line practitioner note (e.g., "Fine particles — most critical for breath practices")

**Classification per pollutant** — use European AQI thresholds from the API docs:

| Pollutant | Good | Fair | Moderate | Poor | Very Poor |
|-----------|------|------|----------|------|-----------|
| PM2.5 (24h μg/m³) | 0–10 | 10–20 | 20–25 | 25–50 | 50–75 |
| PM10 (24h μg/m³) | 0–20 | 20–40 | 40–50 | 50–100 | 100–150 |
| NO₂ (1h μg/m³) | 0–40 | 40–90 | 90–120 | 120–230 | 230–340 |
| O₃ (1h μg/m³) | 0–50 | 50–100 | 100–130 | 130–240 | 240–380 |
| SO₂ (1h μg/m³) | 0–100 | 100–200 | 200–350 | 350–500 | 500–750 |
| CO (8h μg/m³) | 0–4400 | 4400–9400 | 9400–12400 | 12400–15400 | 15400+ |

#### 2.3 — Section Dividers

Between each major section, use a subtle horizontal line with a label:
```
─────────── POLLUTANT BREAKDOWN ───────────
```
Style: 1px line `rgba(200, 196, 220, 0.08)`, label in mono 10px, tracking 0.2em, `rgba(200, 196, 220, 0.4)`. Centre aligned.

### Commit Point
`git commit -m "Phase 2: 24h trend chart, pollutant breakdown cards"`

---

## Phase 3 — Practitioner Intelligence Layer

### Goal
This is the **unique selling point** of Airas. Build the interpretive layer that no other air quality app has.

### What to Build

#### 3.1 — Session Guidance Card

A prominent glass card (wider than the pollutant cards, positioned after the hero or after the trend chart) that provides real-time session guidance.

**Layout:**

```
┌──────────────────────────────────────────────────────────────┐
│  SESSION GUIDANCE                                    ○ Live  │
│                                                              │
│  🌬️  Outdoor Practice: Excellent                            │
│                                                              │
│  Current conditions support all outdoor modalities.          │
│  Air quality is clear with minimal particulate matter.       │
│  UV index is low — no sun protection concerns.               │
│                                                              │
│  ┌──────────────────┐  ┌──────────────────┐                  │
│  │ ✓ Pranayama      │  │ ✓ Sound Bath     │                  │
│  │ ✓ Holotropic     │  │ ✓ Outdoor Yoga   │                  │
│  │ ✓ Wim Hof        │  │ ✓ Walking Med.   │                  │
│  └──────────────────┘  └──────────────────┘                  │
│                                                              │
│  Next window: Conditions remain good until 18:00             │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

#### 3.2 — Guidance Logic

Implement in `src/lib/practitioner.ts`:

```typescript
interface SessionGuidance {
  overallRating: 'excellent' | 'good' | 'caution' | 'indoor-only' | 'avoid'
  outdoorSafe: boolean
  breathworkSafe: boolean
  summary: string           // 2-3 sentence description
  modalities: {
    name: string            // e.g., "Pranayama", "Sound Bath Outdoors"
    safe: boolean
    note?: string           // e.g., "Reduce intensity — moderate PM2.5"
  }[]
  factors: {
    label: string           // e.g., "PM2.5 elevated"
    severity: 'info' | 'caution' | 'warning'
    detail: string
  }[]
  nextWindow: string        // "Conditions improve after 14:00" or "Good conditions until 20:00"
}
```

**Decision matrix:**

| Condition | Overall Rating | Breathwork | Outdoor Sound |
|-----------|---------------|------------|---------------|
| AQI ≤ 20, UV ≤ 5, Pollen low | Excellent | ✓ All modalities | ✓ Unrestricted |
| AQI 20–40, UV ≤ 7, Pollen low-mod | Good | ✓ Standard practice | ✓ Recommended |
| AQI 40–60 OR UV 8–10 OR Pollen high | Caution | ⚠ Gentle only, no vigorous breathwork | ⚠ Shorter sessions |
| AQI 60–80 OR UV 11+ OR Pollen very high | Indoor Only | ✗ Outdoor breathwork not recommended | ✗ Move indoors |
| AQI > 80 | Avoid | ✗ Minimise all deep breathing | ✗ Cancel outdoor sessions |

**Modalities to assess:**

| Modality | AQI Threshold | UV Sensitivity | Pollen Sensitivity | Notes |
|----------|--------------|----------------|-------------------|-------|
| Pranayama (deep breathing) | Most sensitive — flag above 30 | Low | High | Deep inhalation amplifies exposure |
| Holotropic breathwork | Most sensitive — flag above 30 | Low | High | Rapid deep breathing, highest exposure |
| Wim Hof method | Sensitive — flag above 40 | Moderate | Moderate | Includes outdoor cold exposure |
| Sound bath (outdoor) | Moderate — flag above 50 | High (long sessions) | Moderate | Prolonged outdoor exposure |
| Outdoor yoga | Moderate — flag above 50 | High | Moderate | Physical exertion increases intake |
| Walking meditation | Less sensitive — flag above 60 | High | Low | Gentle breathing, lower intake |
| Indoor sound healing | Not AQI-affected | Not affected | Not affected | Always available |

#### 3.3 — Next Best Window

Scan the hourly forecast to find the next time period where conditions improve. Show:
- "Conditions remain excellent until {time}" (if currently good)
- "Air quality improves after {time}" (if currently poor but improving)
- "Best window tomorrow: {time range}" (if no good window today)

### Commit Point
`git commit -m "Phase 3: Practitioner intelligence layer — session guidance"`

---

## Phase 4 — Pollen & Allergen Radar

### Goal
Build the pollen tracking section — hugely relevant for practitioners running outdoor sessions, especially in spring/summer.

### What to Build

#### 4.1 — Pollen Overview Card

**Important:** Pollen data is only available in Europe and only during pollen season (roughly March–September). The app must handle null values gracefully.

If **all** pollen values are null → show a message: "Pollen data not available for this location or season."

If pollen data is available → show:

```
┌──────────────────────────────────────────────────────────────┐
│  POLLEN RADAR                                    Spring 2026 │
│                                                              │
│  Overall: Moderate                                           │
│                                                              │
│  🌳 Tree Pollen                    🌾 Grass & Weed           │
│  ┌────────────────────┐            ┌────────────────────┐    │
│  │ Alder      ██░░  12│            │ Grass      ████  45│    │
│  │ Birch      ███░  28│            │ Mugwort    ░░░░   2│    │
│  │ Olive      ░░░░   0│            │ Ragweed    ░░░░   0│    │
│  └────────────────────┘            └────────────────────┘    │
│                                                              │
│  🫁 Breathwork Impact: Moderate grass pollen — clients with  │
│     hay fever should consider indoor sessions                │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Each pollen type shows:**
- Name with icon (tree types get 🌳, grass/weed get 🌾)
- Horizontal bar (percentage of max scale, colour-coded by severity)
- Current value in grains/m³
- Colour: green (low) → yellow (moderate) → orange (high) → red (very high)

#### 4.2 — Pollen Trend Chart

If pollen data is available, show a 5-day stacked area chart with all active pollen types. Togglable legend to show/hide individual types. Each type uses a distinct colour from the pollen palette.

#### 4.3 — Practitioner Pollen Note

Below the pollen card, a brief interpretive note:
- Low pollen: "Pollen counts are low — outdoor breathwork is unaffected"
- Moderate: "Moderate pollen — ask clients about sensitivities before outdoor sessions"
- High: "High {type} pollen — consider indoor practice for sensitive clients"
- Very high: "Very high pollen alert — outdoor breathwork not recommended for allergy sufferers"

### Commit Point
`git commit -m "Phase 4: Pollen radar, allergen tracking"`

---

## Phase 5 — Atmospheric Deep Dive

### Goal
Build the UV, dust, greenhouse gas, and atmospheric composition sections for data-curious practitioners.

### What to Build

#### 5.1 — UV & Solar Card

```
┌──────────────────────────────────────────────────────────────┐
│  UV & SOLAR                                                  │
│                                                              │
│         UV Index: 4                                          │
│         ██████████░░░░░░░░░░░░  Moderate                    │
│                                                              │
│  Clear Sky UV: 5                                             │
│  (What UV would be without cloud cover)                      │
│                                                              │
│  ☀️ Outdoor session guidance:                                │
│  Up to 40 min without sun protection.                        │
│  Apply SPF 30+ for longer sessions.                          │
│                                                              │
│  ┌─ 24h UV Trend ──────────────────────────────────────┐     │
│  │  ╱╲                                                  │     │
│  │ ╱  ╲                                                 │     │
│  │╱    ╲                                               │     │
│  └──────────────────────────────────────────────────────┘     │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**UV exposure guidance:**

| UV Index | Exposure Time | Practitioner Note |
|----------|--------------|-------------------|
| 0–2 | Unlimited | No concerns for outdoor sessions |
| 3–5 | ~40 min safe | Apply sunscreen for extended sound baths |
| 6–7 | ~25 min safe | Seek shade for group sessions, hats recommended |
| 8–10 | ~15 min safe | Schedule sessions for morning/evening, avoid midday |
| 11+ | < 10 min safe | Outdoor sessions not advisable during peak UV |

#### 5.2 — Atmospheric Composition Card

A collapsible/expandable section (collapsed by default) with:

| Metric | Current Value | 24h Sparkline | What It Means |
|--------|--------------|---------------|---------------|
| CO₂ | {value} ppm | [sparkline] | Greenhouse gas concentration |
| CH₄ (Methane) | {value} μg/m³ | [sparkline] | Methane levels |
| Dust | {value} μg/m³ | [sparkline] | Saharan dust, wildfire particles |
| Aerosol Depth | {value} | [sparkline] | Atmospheric clarity / haze |
| NH₃ (Ammonia) | {value} μg/m³ | [sparkline] | Agricultural / industrial (EU only) |

Each metric uses a subtle glass sub-card. Keep this section minimal and data-focused — it's for the curious, not the casual user.

#### 5.3 — Air Clarity / Visibility Note

Based on Aerosol Optical Depth (AOD):
- AOD < 0.1: "Crystal clear atmosphere — exceptional visibility"
- AOD 0.1–0.3: "Clear skies — good conditions"
- AOD 0.3–0.5: "Slight haze — mild atmospheric particles"
- AOD > 0.5: "Hazy conditions — elevated particles in atmosphere"

This matters to practitioners doing outdoor work — visibility and atmospheric clarity affect the experience.

### Commit Point
`git commit -m "Phase 5: UV card, atmospheric composition, air clarity"`

---

## Phase 6 — 5-Day Forecast & Session Planner

### Goal
Enable practitioners to plan sessions ahead with a 5-day air quality forecast.

### What to Build

#### 6.1 — 5-Day Forecast Strip

A horizontal scrollable strip of day cards:

```
┌─── Today ────┐  ┌─── Mon ─────┐  ┌─── Tue ─────┐  ┌─── Wed ─────┐  ┌─── Thu ─────┐
│    ○ 31      │  │    ○ 28     │  │    ○ 42     │  │    ○ 22     │  │    ○ 18     │
│    Good      │  │    Good     │  │    Moderate │  │    Good     │  │    Good     │
│              │  │             │  │             │  │             │  │             │
│  ☀ UV: 4    │  │  ☀ UV: 3   │  │  ☀ UV: 5   │  │  ☀ UV: 2   │  │  ☀ UV: 3   │
│  🌿 Pol: Med│  │  🌿 Pol: Lo│  │  🌿 Pol: Hi│  │  🌿 Pol: Lo│  │  🌿 Pol: Lo│
│              │  │             │  │             │  │             │  │             │
│  ✓ Outdoor  │  │  ✓ Outdoor │  │  ⚠ Caution │  │  ✓ Outdoor │  │  ✓ Outdoor │
└──────────────┘  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘
```

**Each day card shows:**
- Day name (Today, Mon, Tue...)
- Average AQI with colour-coded dot
- AQI label
- Peak UV index
- Peak pollen level (if available)
- Session recommendation icon: ✓ / ⚠ / ✗

**Calculate daily aggregates** from hourly data:
- AQI: use the daily average (mean of 24 hourly values)
- UV: use the daily peak
- Pollen: use the daily peak of the highest pollen type

#### 6.2 — Best Session Windows

Below the forecast strip, a card that analyses the 5-day hourly data to find optimal session windows:

```
┌──────────────────────────────────────────────────────────────┐
│  BEST SESSION WINDOWS                                        │
│                                                              │
│  🌟 Tomorrow, 09:00–12:00                                   │
│     AQI 18 (Good) · UV 3 · Pollen Low                       │
│     Perfect for outdoor sound healing                        │
│                                                              │
│  🌟 Wednesday, 07:00–10:00                                  │
│     AQI 22 (Good) · UV 2 · Pollen Low                       │
│     Excellent early-morning breathwork window                │
│                                                              │
│  ⚠️  Tuesday afternoon elevated (AQI 42) — schedule morning │
│                                                              │
└──────────────────────────────────────────────────────────────┘
```

**Window detection logic:**
- Scan hourly data for consecutive periods where AQI < 30 AND UV < 8 AND pollen < moderate
- Rank windows by overall quality score
- Show top 3 windows with time, conditions, and recommendation
- Flag any upcoming poor periods as warnings

### Commit Point
`git commit -m "Phase 6: 5-day forecast, best session windows"`

---

## Phase 7 — Location, Settings & PWA

### Goal
Location search, AQI scale toggle, and progressive web app setup.

### What to Build

#### 7.1 — Location Search Modal

Triggered by clicking the location name in the hero.

**Design:**
- Full-screen overlay with glass morphism background blur
- Search input at top (auto-focus, Lato font, glass-styled)
- As user types (debounced 300ms), fetch from Open-Meteo Geocoding API
- Show results as a list of glass cards: city name, region, country, lat/lon
- Click a result → close modal, fetch new data, update location
- "Use my location" button at top to re-trigger browser geolocation

**Location persistence:**
- Store selected location in React state (NOT localStorage as per ecosystem rules)
- Default to browser geolocation on first visit
- If geolocation denied, default to London (51.5074, -0.1278)

#### 7.2 — Settings

A small settings icon (⚙) in the header that opens a minimal settings panel:

- **AQI Scale toggle:** European AQI (default) / US AQI
- **Temperature unit:** Celsius (default) / Fahrenheit (reserved for future weather integration)
- **Auto-refresh toggle:** On (15 min) / Off

#### 7.3 — PWA Configuration

```json
// public/manifest.json
{
  "name": "Airas — Air Intelligence",
  "short_name": "Airas",
  "description": "Air quality intelligence for breathwork practitioners",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#06061A",
  "theme_color": "#A8DADC",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

Create app icons: a stylised "A" or wind symbol in Zephyr Teal on Stratosphere Black. Keep it simple, elegant, recognisable at small sizes.

### Commit Point
`git commit -m "Phase 7: Location search, settings, PWA manifest"`

---

## Phase 8 — Promo Content Studio

### Goal
Build a hidden `/promo` route for generating daily social media content — following the proven pattern from shumann.app and tidara.app.

### What to Build

#### 8.1 — Route: `/promo`

Hidden page (not in navigation). Accessible only via direct URL.

**Content generated using current live data:**

##### Social Media Cards (downloadable as images via html2canvas or dom-to-image):

1. **Daily AQI Card** (1080×1080)
   - Current AQI score, location, gradient bar
   - Session recommendation
   - "airas.app" watermark
   - Glass morphism style matching the main app

2. **Breathwork Advisory** (1080×1350 — Instagram story)
   - "Today's Breathwork Conditions" heading
   - AQI, Pollen, UV summary
   - Modality checklist (✓/✗ for each type)
   - Practitioner guidance sentence

3. **Weekly Forecast Card** (1200×628 — Twitter/LinkedIn)
   - 5-day AQI strip
   - Best session windows highlighted
   - "Plan your week with the atmosphere" tagline

4. **Pollen Alert** (1080×1080) — only generate when pollen is moderate+
   - Pollen type breakdown
   - "Hay Fever Alert for Practitioners" headline
   - Indoor session recommendation

##### Caption Generator

For each card, generate 3 caption variants:
- **Educational:** Informative, data-focused
- **Practitioner-focused:** Speaking to healers and facilitators
- **Engagement:** Question-based, community-oriented

Include relevant hashtags: #AirQuality #Breathwork #SoundHealing #PranayamaPractice #HolisticHealth #WellnessPractitioner #OutdoorYoga #Airas

#### 8.2 — Card Generation

Use the same approach as your other promo pages:
- Render cards as styled divs
- "Download" button triggers `html-to-image` capture
- "Copy Caption" button copies text to clipboard
- Cards refresh automatically with live data

### Commit Point
`git commit -m "Phase 8: Promo content studio at /promo"`

---

## Phase 9 — Polish, Animation & Performance

### Goal
The difference between a good app and an outstanding one is in the polish. This phase is about making every interaction feel crafted.

### What to Build

#### 9.1 — Scroll Reveal Animations

Every section and card should animate into view on scroll:

```typescript
// Use Framer Motion's whileInView
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1], // ecosystem spring
    },
  },
}

// Stagger children within sections
const containerVariants = {
  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}
```

#### 9.2 — Data Loading States

- **Skeleton screens:** Glass card outlines with shimmer animation (not spinners)
- **Number transitions:** When data refreshes, numbers should animate from old value to new (count up/down)
- **Chart transitions:** Lines should animate drawing from left to right on initial reveal

#### 9.3 — Micro-Interactions

- AQI dot on gradient bar: gentle pulse (scale 1 → 1.3, opacity breathing)
- Pollutant cards: subtle glow on hover matching their status colour
- Settings icon: slow rotation on hover
- Location pin: gentle bounce on data refresh
- "Live" indicator: pulsing green dot

#### 9.4 — Responsive Design

| Breakpoint | Layout |
|------------|--------|
| < 640px (mobile) | Single column, hero AQI smaller (56px), cards stack, forecast horizontal scroll |
| 640–1024px (tablet) | 2-column pollutant grid, hero full-width |
| > 1024px (desktop) | 2-column pollutants, forecast visible without scroll, max-width 1200px container |

#### 9.5 — Performance

- Lazy load below-fold sections with `React.lazy` + `Suspense` or Framer Motion viewport detection
- Debounce API calls (no double-fetching on rapid location changes)
- Canvas background: throttle to ~30fps, pause on `visibilitychange`
- Target: Lighthouse 95+ Performance, 100 Accessibility

### Commit Point
`git commit -m "Phase 9: Animation polish, responsive design, performance"`

---

## Phase 10 — SEO, Analytics & Deployment

### Goal
Make the app discoverable, trackable, and live.

### What to Build

#### 10.1 — SEO Metadata

```typescript
// src/app/layout.tsx
export const metadata = {
  title: 'Airas — Air Quality Intelligence for Practitioners',
  description: 'Real-time air quality, pollen, and UV monitoring designed for breathwork facilitators, sound healers, and wellness practitioners. Know what you\'re breathing.',
  keywords: 'air quality, breathwork, pollen forecast, UV index, sound healing, pranayama, outdoor yoga, wellness practitioner, AQI',
  metadataBase: new URL('https://airas.app'),
  openGraph: {
    title: 'Airas — Air Quality Intelligence',
    description: 'Real-time air quality monitoring for breathwork and sound healing practitioners.',
    url: 'https://airas.app',
    siteName: 'Airas',
    locale: 'en_GB',
    type: 'website',
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'Airas — Air Quality Intelligence' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Airas — Air Quality Intelligence',
    description: 'Air quality monitoring designed for breathwork and sound healing practitioners.',
    images: ['/og-image.png'],
  },
}
```

#### 10.2 — Analytics

Add Plausible Analytics (consistent with the rest of the ecosystem):

```html
<script defer data-domain="airas.app" src="https://plausible.io/js/script.js"></script>
```

Track custom events:
- `Location Changed` — when user searches for a new location
- `Settings Changed` — when AQI scale toggled
- `Promo Card Downloaded` — when a card is captured on /promo

#### 10.3 — Favicon & Social Images

- `favicon.ico` — 32×32, wind/air symbol
- `icon-192.png` — PWA icon
- `icon-512.png` — PWA icon
- `apple-touch-icon.png` — 180×180
- `og-image.png` — 1200×630, app preview with glass morphism aesthetic

#### 10.4 — Footer

Minimal footer consistent with ecosystem:

```
Built by Remi — Sound Healer & Developer
Part of the Harmonic Waves ecosystem
airas.app · shumann.app · lunata.app · tidara.app · sonarus.app
```

Footer text in Lato 300, 12px, `--text-secondary` at 40% opacity. Links to sister apps.

#### 10.5 — Deployment

- **Vercel:** Connect `RemiDz/airas` repo, auto-detect Next.js static export
- **Domain:** Add `airas.app` as custom domain in Vercel dashboard
- **DNS:** Point domain to Vercel
- Every push to `main` auto-deploys

### Commit Point
`git commit -m "Phase 10: SEO, analytics, deployment config"`

---

## File Architecture

```
airas/
├── CLAUDE.md                          # This file
├── README.md                          # Project readme
├── next.config.ts                     # Static export config
├── tailwind.config.ts                 # Design tokens
├── tsconfig.json
├── package.json
├── public/
│   ├── manifest.json                  # PWA manifest
│   ├── favicon.ico
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── apple-touch-icon.png
│   └── og-image.png
├── src/
│   ├── app/
│   │   ├── layout.tsx                 # Root layout, fonts, metadata
│   │   ├── page.tsx                   # Main app page
│   │   ├── globals.css                # Global styles, glass cards, animations
│   │   └── promo/
│   │       └── page.tsx               # Hidden promo content studio
│   ├── components/
│   │   ├── background/
│   │   │   └── AtmosphericCanvas.tsx  # Animated particle background
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx        # AQI score, gradient bar, tagline
│   │   │   ├── AqiGradientBar.tsx     # Animated gradient with dot indicator
│   │   │   └── QuickStats.tsx         # PM2.5, PM10, NO₂, O₃ mini cards
│   │   ├── trend/
│   │   │   └── AqiTrendChart.tsx      # 24h Recharts area chart
│   │   ├── pollutants/
│   │   │   ├── PollutantGrid.tsx      # 2-column grid container
│   │   │   └── PollutantCard.tsx      # Individual pollutant detail card
│   │   ├── guidance/
│   │   │   ├── SessionGuidance.tsx    # Practitioner guidance card
│   │   │   └── ModalityChecklist.tsx  # Modality safety indicators
│   │   ├── pollen/
│   │   │   ├── PollenRadar.tsx        # Pollen overview card
│   │   │   ├── PollenBar.tsx          # Individual pollen type bar
│   │   │   └── PollenTrend.tsx        # 5-day pollen trend chart
│   │   ├── atmosphere/
│   │   │   ├── UvSolarCard.tsx        # UV index and exposure guidance
│   │   │   └── CompositionCard.tsx    # CO₂, CH₄, dust, aerosol, ammonia
│   │   ├── forecast/
│   │   │   ├── ForecastStrip.tsx      # 5-day horizontal forecast
│   │   │   ├── DayCard.tsx            # Individual day forecast card
│   │   │   └── BestWindows.tsx        # Optimal session window finder
│   │   ├── location/
│   │   │   └── LocationSearch.tsx     # Search modal with geocoding
│   │   ├── settings/
│   │   │   └── SettingsPanel.tsx      # AQI scale, units
│   │   ├── promo/
│   │   │   ├── PromoCardDaily.tsx     # Daily AQI social card
│   │   │   ├── PromoCardStory.tsx     # Instagram story card
│   │   │   ├── PromoCardForecast.tsx  # Weekly forecast card
│   │   │   ├── PromoCardPollen.tsx    # Pollen alert card
│   │   │   └── CaptionGenerator.tsx   # Social media caption generator
│   │   └── shared/
│   │       ├── GlassCard.tsx          # Reusable glass card wrapper
│   │       ├── SectionDivider.tsx     # Labelled section divider
│   │       ├── StatusBadge.tsx        # Colour-coded status pill
│   │       ├── Sparkline.tsx          # Mini trend line
│   │       ├── SkeletonCard.tsx       # Loading skeleton
│   │       └── AnimatedNumber.tsx     # Count-up number animation
│   ├── lib/
│   │   ├── api.ts                     # API fetch functions
│   │   ├── types.ts                   # TypeScript interfaces
│   │   ├── transforms.ts             # Raw → display data transforms
│   │   ├── aqi-utils.ts              # AQI bands, colours, labels
│   │   ├── uv-utils.ts               # UV bands, exposure guidance
│   │   ├── pollen-utils.ts           # Pollen bands, classification
│   │   ├── practitioner.ts           # Session guidance logic
│   │   └── constants.ts              # Design tokens as JS constants
│   └── hooks/
│       ├── useAirQuality.ts           # Data fetching hook with auto-refresh
│       ├── useGeolocation.ts          # Browser geolocation hook
│       └── useLocation.ts            # Location state management
```

---

## Quality Benchmarks

### Visual Quality

Reference apps for quality standard:
- **lunata.app** — the gold standard for glass morphism and typography
- **sonarus.app** — reference for data visualisation cards
- **lunar-practitioner.vercel.app** — reference for responsive layouts

Airas must meet or exceed these. Every pixel matters. Padding, easing curves, letter-spacing, opacity values, border radii — nothing is an afterthought.

### Performance Targets

| Metric | Target |
|--------|--------|
| Lighthouse Performance | 95+ |
| Lighthouse Accessibility | 100 |
| First Contentful Paint | < 1.5s |
| Largest Contentful Paint | < 2.5s |
| Total Bundle Size | < 200KB gzipped |
| API Response Handling | < 100ms transform time |

### Accessibility

- All colour combinations meet WCAG AA contrast
- All interactive elements have focus states
- Screen reader friendly labels on charts and data
- Keyboard navigable (Tab through cards, Enter to interact)

### Browser Support

- Chrome 90+, Firefox 90+, Safari 15+, Edge 90+
- Mobile: iOS Safari 15+, Chrome Android 90+
- Progressive enhancement: works without JS (static content), enhanced with JS (live data, animations)

---

## Final Notes for Claude Code

1. **Read this entire document before writing any code.** Understand the full scope before starting Phase 1.

2. **Build phase by phase.** Commit at the end of each phase. Don't skip ahead.

3. **The design must be stunning.** This is not a utility app — it's a wellness experience. Every card, every animation, every typographic choice should feel intentional and beautiful.

4. **The practitioner layer is the differentiator.** Spend extra time making the Session Guidance card and modality assessments feel thoughtful and accurate. This is what practitioners will come back for.

5. **Reference the design system from `../_shared/DESIGN_TOKENS.md`** if it exists in the project directory. Use it as a foundation but create Airas's own personality — same universe, different planet. Air should feel open, vast, and breathing.

6. **Test with real data.** The Open-Meteo API is free and doesn't need an API key. Use Gateshead, GB (54.96, -1.60) as the default test location.

7. **Zero infrastructure.** No backend, no database, no auth, no environment variables. Pure static Next.js. Everything runs in the browser.

8. **British English throughout.** "Colour" not "color" in UI text (CSS properties remain American as per standard). "Practise" (verb) vs "Practice" (noun).

---

*Built by Remi — Sound Healer & Developer*
*Part of the Harmonic Waves ecosystem*
*airas.app*
