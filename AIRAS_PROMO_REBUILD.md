# Airas.app — Promo Page Rebuild (/promo)

## Instructions for Claude Code

The current `/promo` page is too basic and not usable. **Completely rebuild it** to match the quality and functionality of the shumann.app Content Studio. This is a daily marketing tool — it must generate beautiful, download-ready social media cards with live air quality data.

**CRITICAL: Study how shumann.app/promo works before building.** Navigate to the main app's code to understand the data hooks and design system, then build the promo page to the exact specification below.

---

## Page Layout (Top to Bottom)

### 1. Header Bar

```
┌──────────────────────────────────────────────────────────────┐
│  🌬️ AIRAS CONTENT STUDIO              28 Feb 2026           │
│                                                              │
│  AQI: 31 (Good)  ·  PM2.5: 5  ·  UV: 4  ·  Pollen: Mod    │
└──────────────────────────────────────────────────────────────┘
```

- Glass card with current date and live quick stats
- Data pulled from the same hooks as the main app
- Location name shown

---

### 2. Shareable Image Cards — THE MOST IMPORTANT SECTION

This is the core of the promo page. Build **5 shareable cards** that form an Instagram Story sequence. Each card:

- Is rendered as a styled div (the "card")
- Is displayed inside a **phone mockup frame** (dark phone bezel/frame around the card for visual context)
- Has a **format toggle**: Post (1080×1080) / Story (1080×1920)
- Has a **"Download PNG"** button that captures the card using `html-to-image` (preferred) or `html2canvas`
- Also shows the captured image as a visible `<img>` below the card with note: "Long-press to save on mobile"
- Uses **pure SVG/CSS for any charts** inside cards (NOT Recharts — Recharts doesn't render in html2canvas properly)

Cards are shown in a **horizontal tab/carousel selector** — user clicks Card 1, Card 2, etc. to switch between them. Also provide a **"Download All"** button that saves all 5 as separate PNGs.

#### Card 1 — The Hook (Daily AQI)

```
┌─────────────────────────────────────┐
│                                     │
│     ○ Gateshead, GB                 │
│                                     │
│              31                     │
│             Good                    │
│                                     │
│  ═══════●══════════════════════     │
│  0            AQI             100+  │
│                                     │
│  "Perfect conditions for            │
│   outdoor breathwork"               │
│                                     │
│  PM2.5: 5  ·  O₃: 77  ·  UV: 4    │
│                                     │
│         airas.app                   │
│    Air Intelligence for             │
│        Practitioners                │
│                                     │
│         28 February 2026            │
│                                     │
└─────────────────────────────────────┘
```

- Dark background matching app's Stratosphere Black (#06061A)
- Large AQI number in JetBrains Mono with colour glow matching AQI band
- AQI gradient bar (pure CSS gradient, NOT Recharts) with dot indicator
- Practitioner tagline from session guidance logic
- Key pollutant values
- App branding and date

#### Card 2 — The Science (24h AQI Trend)

```
┌─────────────────────────────────────┐
│                                     │
│     24H AIR QUALITY TREND           │
│     Gateshead, GB                   │
│                                     │
│  ┌──────────────────────────────┐   │
│  │     ╱╲__                     │   │
│  │    ╱    ╲___╱╲               │   │
│  │___╱              ╲___        │   │
│  │                       ╲___   │   │
│  └──────────────────────────────┘   │
│  00:00    06:00   12:00   18:00     │
│                                     │
│  Peak: 42 at 14:00                  │
│  Current: 31 (Good)                 │
│                                     │
│  Track your air → airas.app         │
│                                     │
└─────────────────────────────────────┘
```

- Pure SVG area chart of last 24h AQI (NOT Recharts)
- Colour-coded fill gradient matching AQI levels
- Peak highlight dot with label
- Current value callout

#### Card 3 — How It Affects Your Practice (Modality Checklist)

```
┌─────────────────────────────────────┐
│                                     │
│  TODAY'S BREATHWORK                 │
│  CONDITIONS                         │
│                                     │
│  AQI: 31 · UV: 4 · Pollen: Mod     │
│                                     │
│  ✅ Pranayama                       │
│  ✅ Sound Bath (Outdoor)            │
│  ✅ Outdoor Yoga                    │
│  ✅ Walking Meditation              │
│  ⚠️ Holotropic Breathwork           │
│     (moderate pollen — check        │
│      client sensitivities)          │
│  ✅ Wim Hof Method                  │
│                                     │
│  "Conditions support most outdoor   │
│   modalities today"                 │
│                                     │
│         airas.app                   │
│                                     │
└─────────────────────────────────────┘
```

- Modality checklist with ✅/⚠️/❌ icons based on live conditions
- Each modality shows a note if there's a concern
- Overall guidance sentence
- Uses the practitioner.ts logic from the main app

#### Card 4 — Pollen & UV Report

```
┌─────────────────────────────────────┐
│                                     │
│  POLLEN & UV REPORT                 │
│  28 February 2026                   │
│                                     │
│  ☀️ UV Index: 4 (Moderate)          │
│  Safe outdoor time: ~40 min         │
│                                     │
│  🌳 Tree Pollen                     │
│  Alder     ████░░░░  12 grains/m³  │
│  Birch     ██████░░  28 grains/m³  │
│                                     │
│  🌾 Grass Pollen                    │
│  Grass     ████████  45 grains/m³  │
│                                     │
│  🫁 Moderate pollen — ask clients   │
│     about hay fever before          │
│     outdoor sessions                │
│                                     │
│         airas.app                   │
│                                     │
└─────────────────────────────────────┘
```

- UV index with colour bar and safe exposure time
- Pollen breakdown with visual bars (pure CSS, not Recharts)
- Only show pollen types that have data (skip nulls)
- If NO pollen data available, replace with atmospheric composition (CO₂, Dust, Aerosol)
- Practitioner interpretation note

#### Card 5 — The CTA (5-Day Forecast)

```
┌─────────────────────────────────────┐
│                                     │
│  YOUR 5-DAY AIR FORECAST            │
│                                     │
│  Today  Mon   Tue   Wed   Thu       │
│   🟢    🟢    🟡    🟢    🟢        │
│   31    28    42    22    18        │
│  Good  Good  Mod   Good  Good      │
│                                     │
│  🌟 Best window:                    │
│  Thursday morning — AQI 18          │
│  Perfect for outdoor sound bath     │
│                                     │
│  ─────────────────────────          │
│                                     │
│  Plan sessions with the             │
│  atmosphere, not against it.        │
│                                     │
│  airas.app                          │
│  Free · No signup · Live data       │
│                                     │
└─────────────────────────────────────┘
```

- 5-day forecast strip with colour dots and AQI values
- Best session window highlight
- Strong CTA with app URL
- Tagline

### Card Design Rules (ALL Cards)

- **Background**: #06061A (Stratosphere Black) — NOT transparent, NOT white
- **Typography**: Cormorant Garamond for headings, Lato for body, JetBrains Mono for data
- **Colours**: Use the app's Celestial Breath palette (Zephyr Teal #A8DADC, Cirrus White #F0EEF8, Mist Silver #C8C4DC, status colours for AQI)
- **Border**: Subtle 1px rgba(200,196,220,0.08) border
- **Padding**: Generous — at least 40px on all sides for Story format, 32px for Post
- **Branding**: "airas.app" in every card, subtle but present
- **Date**: Current date on each card
- **ALL charts/bars must be pure SVG or CSS** — html-to-image/html2canvas cannot capture Recharts canvas elements

---

### 3. Opening Hooks

Below the cards section. Organised by AQI level. User clicks a hook → it flows into all caption templates.

**5 hooks per AQI level (25 total):**

#### Good (0–20)
1. "AQI is {value} right now — perfect conditions for outdoor breathwork 🌬️"
2. "The air is crystal clear today. Your outdoor sound bath just got nature's green light."
3. "Today's air quality: {value} (Good). Deep breathing outdoors is calling."
4. "Nature is offering you clean air today — AQI just {value}. Time for pranayama in the garden."
5. "The atmosphere is pristine today. AQI at {value}. Breathe deep, breathe free."

#### Fair (20–40)
1. "AQI at {value} — solid day for outdoor practice. Ease into the deep breathing."
2. "Fair air today ({value}). Gentle outdoor sessions are good to go."
3. "Not perfect, but perfectly workable. AQI {value} — your practice won't suffer."
4. "The atmosphere is offering a fair window today. Make the most of it."
5. "AQI {value} — outdoor sessions are a go. Just keep an eye on sensitive clients."

#### Moderate (40–60)
1. "AQI has crept to {value}. Consider moving breathwork indoors today."
2. "Moderate air quality: AQI {value}. Gentle outdoor yoga is fine, skip deep breathing outside."
3. "Sensitive clients will feel today's air ({value}). Indoor sessions are the compassionate choice."
4. "The atmosphere is heavy today — AQI {value}. Perfect excuse for an indoor sound journey."
5. "AQI {value}: not dangerous, but not ideal for pranayama outdoors. Listen to the air."

#### Poor (60–80)
1. "AQI {value} — move all breathwork indoors today. Your lungs deserve clean air."
2. "Poor air quality alert. AQI {value}. Not the day for outdoor sound baths."
3. "The air is speaking clearly: stay indoors. AQI {value}."
4. "Elevated pollutants today (AQI {value}). Indoor sessions only."
5. "AQI {value}: Cancel outdoor plans. Indoor sound healing is what today calls for."

#### Very Poor (80+)
1. "AQI hit {value} — minimise all deep breathing. Keep sessions gentle and indoors."
2. "Air quality warning: {value}. Even indoors, consider an air purifier."
3. "Be gentle today. AQI {value} means less breathwork, more restorative sound."
4. "Serious air quality concern ({value}). Prioritise your health — stay inside."
5. "AQI {value}. Protect your instrument. Gentle indoor practice only."

Include **Shuffle** button and individual **Copy** buttons.

---

### 4. Ready-to-Copy Captions

Four platform-specific templates. The selected hook auto-populates into each. Each has a **Copy** button with animated "Copied ✓" feedback.

#### Instagram
```
{selected_hook}

📊 Today's Air Quality Report ({location}):
🌬️ AQI: {value} ({level})
💨 PM2.5: {pm25} μg/m³
☀️ UV Index: {uv} ({uv_level})
🌿 Pollen: {pollen_summary}

{session_guidance_sentence}

Whether you're a breathwork facilitator, sound healer, or yoga teacher — knowing your air quality helps you serve your clients better.

Check live conditions → link in bio 🔗

#AirQuality #Breathwork #SoundHealing #PranayamaPractice #HolisticHealth #WellnessPractitioner #OutdoorYoga #BreathworkFacilitator #SoundBath #PollenForecast #UVIndex #Airas #HarmonicWaves #WellnessTools #MindBodySpirit #EnergyHealing #YogaTeacher #ConsciousLiving #NaturalHealth #CleanAir
```

#### Twitter/X
```
{selected_hook}

AQI: {value} ({level}) · PM2.5: {pm25} · UV: {uv}
{session_guidance_short}

Live air intelligence for practitioners → airas.app

#AirQuality #Breathwork #SoundHealing
```

#### TikTok
```
{selected_hook}

POV: You're a breathwork facilitator who actually checks the air before running a session 🫁

Today's AQI: {value} ({level})
✅ or ❌ for each modality:
{modality_checklist_short}

Free tool → airas.app (link in bio)

#AirQuality #Breathwork #SoundHealing #Pranayama #WellnessTok #HolisticHealth #YogaTeacher #BreathworkCoach #FYP #CleanAir #OutdoorYoga
```

#### WhatsApp/DM
```
Hey! Just checked today's air quality — AQI is {value} ({level}).

{session_guidance_sentence}

I check this free tool before every outdoor session: airas.app

Shows pollutants, pollen, UV, and tells you which breathwork modalities are safe today. Thought you'd find it useful! 🌬️
```

---

### 5. Content Calendar

Best posting times per platform:
- Instagram: 11am, 2pm, 7pm
- Twitter/X: 8am, 12pm, 5pm
- TikTok: 7am, 12pm, 7pm

Plus contextual content ideas based on current conditions:
- If pollen high → "Post about indoor alternatives for hay fever season"
- If UV extreme → "Post about morning session scheduling"
- If AQI very good → "Post about taking practice outdoors"
- If AQI poor → "Post about air quality awareness for practitioners"

---

## Technical Requirements

- **Code-split**: `React.lazy()` — only loads when visiting /promo
- **Data**: Uses the SAME data hooks as the main app — no duplicate API calls
- **NOT linked** from main app navigation — direct URL only
- **Design**: Match the app's Celestial Breath design system exactly (glass cards, dark background, Zephyr Teal accents, correct fonts)
- **Charts in cards**: Pure SVG or CSS only — NO Recharts inside downloadable cards
- **Image export**: Use `html-to-image` (toJpeg or toPng). If not installed: `npm install html-to-image`
- **Mobile fallback**: After generating each card image, display it as a visible `<img>` element so iOS users can long-press to save
- **Phone mockup**: Display each card inside a dark phone bezel/frame for visual context on the page (the download captures just the card content, not the mockup)
- **Responsive**: Optimised for desktop (this is a creator tool) but usable on tablet

---

## Commit

```bash
git commit -m "Rebuild /promo — full social content studio with 5 story cards, hooks, captions"
```
