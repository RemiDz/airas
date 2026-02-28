# 🌬️ Airas — Air Quality Intelligence for Practitioners

Real-time air quality, pollen, and UV monitoring designed for breathwork facilitators, sound healers, and wellness practitioners.

**Know what you're breathing. Plan sessions with the atmosphere, not against it.**

[airas.app](https://airas.app)

---

## The Air Element

Airas is the Air element in the [Harmonic Waves](https://github.com/RemiDz) ecosystem of sound healing and wellness applications:

| Element | App | Focus |
|---------|-----|-------|
| 🌍 Earth | [shumann.app](https://shumann.app) | Schumann Resonance & geomagnetic activity |
| 🌊 Water | [tidara.app](https://tidara.app) | Ocean tides & tidal rhythms |
| 🌙 Cosmic | [lunata.app](https://lunata.app) | Lunar phases & moon intelligence |
| 🌬️ Air | [airas.app](https://airas.app) | Air quality, pollen & atmospheric conditions |

---

## What Makes Airas Different

Every air quality app speaks to commuters and joggers. Airas speaks to **practitioners**.

It translates raw atmospheric data into **session guidance** — when to practise outdoors, when to move inside, which breathwork modalities are appropriate for today's conditions, and how pollen, UV, and pollutants affect your work.

---

## Features

- **Live AQI Monitoring** — Real-time European and US Air Quality Index with pollutant breakdown
- **Practitioner Intelligence** — Session guidance for pranayama, sound baths, outdoor yoga, and breathwork
- **Pollen Radar** — 6-type pollen tracking with practitioner impact assessment (Europe, seasonal)
- **UV & Solar Guidance** — Exposure time recommendations for outdoor sessions
- **5-Day Forecast** — Plan your week with best session windows highlighted
- **Atmospheric Deep Dive** — CO₂, methane, dust, aerosol optical depth
- **Social Content Studio** — Generate daily promotional cards and captions

---

## Tech Stack

- **Next.js 14** — App Router, TypeScript, static export
- **Tailwind CSS** — Custom design system ("Celestial Breath")
- **Framer Motion** — Scroll reveals, breathing animations
- **Recharts** — Data visualisation
- **Open-Meteo API** — Free, no API key, CORS-friendly

---

## Getting Started

```bash
git clone https://github.com/RemiDz/airas.git
cd airas
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Data Source

Air quality data from [Open-Meteo Air Quality API](https://open-meteo.com/en/docs/air-quality-api), powered by CAMS (Copernicus Atmosphere Monitoring Service) European and global atmospheric forecasts.

---

## Privacy

Airas processes everything in your browser:

- ❌ No data sent to any server (beyond the Open-Meteo API call)
- ❌ No cookies or tracking
- ❌ No account required
- ✅ Fully client-side processing
- ✅ Works offline after first load (PWA)

---

## Licence

MIT

---

## Author

Built by [Remigijus Dzingelevičius](https://github.com/RemiDz) — sound healer & developer.

Part of the [Harmonic Waves](https://github.com/RemiDz) ecosystem of sound healing tools.
