# Airas Content Studio — /promo

Hidden route at [airas.app/promo](https://airas.app/promo) — a full social media content studio using live air quality data.

---

## Page Sections

### 1. Header Bar
Glass card with current date, location, and live quick stats (AQI, PM2.5, UV, Pollen).

### 2. Shareable Image Cards
5 cards displayed inside a phone mockup frame with tab selector:

| Card | Name | Content |
|------|------|---------|
| 1 | **The Hook** | Daily AQI score, gradient bar, practitioner tagline, quick stats |
| 2 | **The Science** | 24h AQI trend (pure SVG chart), peak highlight, current value |
| 3 | **Practice Guide** | Modality checklist with live safety assessment |
| 4 | **Pollen & UV** | UV index with exposure guidance, pollen breakdown (or atmospheric data fallback) |
| 5 | **Forecast CTA** | 5-day forecast strip, best session window, CTA with branding |

**Features:**
- Format toggle: Post (1080x1080) / Story (1080x1920)
- Download PNG button (captures at 2x resolution)
- Download All button (saves all 5 cards)
- Captured image preview below card for mobile long-press saving
- All charts use pure SVG/CSS (no Recharts) for reliable image capture

### 3. Opening Hooks
25 hooks organised by AQI level (5 per band: Good, Fair, Moderate, Poor, Very Poor).
- Current conditions band shown expanded, others collapsed
- Click a hook to select it (auto-populates into captions)
- Shuffle button for variety
- Individual Copy buttons

### 4. Ready-to-Copy Captions
4 platform-specific templates with selected hook auto-populated:

| Platform | Format |
|----------|--------|
| Instagram | Full report with hashtags, link in bio CTA |
| Twitter/X | Concise stats with key hashtags |
| TikTok | POV format with modality checklist |
| WhatsApp/DM | Casual share with app recommendation |

Each has a Copy button with animated "Copied ✓" feedback.

### 5. Content Calendar
- Best posting times per platform (Instagram, Twitter/X, TikTok)
- Contextual content ideas based on current conditions (high pollen, extreme UV, good/poor AQI)

---

## Technical Notes

- Cards render as inline-styled divs captured via `html-to-image` (`toPng`) at 2x pixel ratio
- Background forced to `#06061A` (Stratosphere Black)
- Uses same data hooks as main app — no duplicate API calls
- Not linked from main app navigation — direct URL only
- Downloads tracked via Plausible analytics (`Promo Card Downloaded` event)
