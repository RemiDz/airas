Rebuild the /promo shareable cards. The current 5 cards are too sparse and empty — most have just a few lines of text with huge blank space. Replace them with 2-3 information-dense cards that look professional and provide real value.



\## Card 1 — "Daily Air Intelligence" (the main card, used daily)



This is the workhorse card. Pack it with ALL the key data in a beautiful layout:



Top section:

\- Location name and date

\- Large AQI number with colour glow + label (Good/Fair/Moderate etc.)

\- AQI gradient bar with dot indicator (pure CSS)



Middle section — data grid (2 columns):

\- PM2.5: value + status dot

\- PM10: value + status dot  

\- O₃: value + status dot

\- NO₂: value + status dot

\- UV Index: value + level label

\- Pollen: summary level (if available, otherwise show Dust or CO₂)



24h trend — small SVG area chart showing last 24 hours of AQI (pure SVG, NOT Recharts)



Bottom section:

\- Practitioner guidance sentence ("Perfect for outdoor breathwork" etc.)

\- Modality quick-check: 3-4 key modalities with ✅/⚠️/❌ inline

\- "airas.app" branding



This card should feel PACKED with useful information — like a professional weather report card. No empty space. Every pixel earns its place.



\## Card 2 — "Breathwork Advisory" (practitioner-focused)



Top:

\- "TODAY'S BREATHWORK CONDITIONS" heading

\- Date and location

\- Overall rating badge: "Excellent" / "Good" / "Caution" / "Indoor Only"



Main section — Full modality checklist:

\- Pranayama: ✅/⚠️/❌ + one-line note

\- Sound Bath (Outdoor): ✅/⚠️/❌ + note

\- Outdoor Yoga: ✅/⚠️/❌ + note

\- Holotropic Breathwork: ✅/⚠️/❌ + note

\- Wim Hof Method: ✅/⚠️/❌ + note

\- Walking Meditation: ✅/⚠️/❌ + note



Side panel or bottom:

\- UV exposure time ("Safe outdoor time: ~40 min")

\- Top pollen concern (if any)

\- Best window today: "09:00-12:00 — cleanest air"



Branding: "airas.app — Air Intelligence for Practitioners"



\## Card 3 — "Weekly Forecast" (optional, for planning posts)



Only show if 5-day data is meaningful. Compact 5-day strip:

\- Day names with colour-coded AQI dots and values

\- Best session window of the week highlighted

\- Pollen trend indicator (rising/falling/stable)

\- "Plan your week with the atmosphere" tagline

\- "airas.app" branding



\## Design rules for ALL cards:

\- DENSE. No large empty spaces. Fill the card edge to edge with useful data.

\- Use a tight grid layout — think infographic, not slide deck

\- Background: #06061A with subtle glass card sections within the card

\- Use visual hierarchy: large AQI number draws the eye, then data grid, then guidance

\- Colour-code everything — green/teal for good, amber for moderate, red for poor

\- All charts/bars: pure SVG or CSS only (NO Recharts — it won't render in html-to-image)

\- Typography: Cormorant Garamond headings, JetBrains Mono for data, Lato for body

\- Both Post (1080x1080) and Story (1080x1920) formats — the layout should adapt, not just stretch

\- The Story format should use vertical stacking, the Post format should use a tighter grid



Delete the old 5 sparse cards entirely. Replace with these 2-3 dense ones.



Commit: git commit -m "Rebuild promo cards — fewer but denser, information-rich"

