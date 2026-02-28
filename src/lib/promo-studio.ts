import type { AirQualityResponse } from './types'
import { getAqiBand } from './aqi-utils'
import { getUvBand, getUvExposureGuidance } from './uv-utils'
import { getOverallPollenLevel } from './pollen-utils'
import { generateSessionGuidance } from './practitioner'

// ── Opening Hooks (5 per AQI band, 25 total) ──

export interface HookSet {
  level: string
  hooks: string[]
}

export function getOpeningHooks(aqi: number): HookSet[] {
  return [
    {
      level: 'Good (0–20)',
      hooks: [
        `AQI is ${aqi} right now — perfect conditions for outdoor breathwork 🌬️`,
        'The air is crystal clear today. Your outdoor sound bath just got nature\'s green light.',
        `Today's air quality: ${aqi} (Good). Deep breathing outdoors is calling.`,
        `Nature is offering you clean air today — AQI just ${aqi}. Time for pranayama in the garden.`,
        `The atmosphere is pristine today. AQI at ${aqi}. Breathe deep, breathe free.`,
      ],
    },
    {
      level: 'Fair (20–40)',
      hooks: [
        `AQI at ${aqi} — solid day for outdoor practice. Ease into the deep breathing.`,
        `Fair air today (${aqi}). Gentle outdoor sessions are good to go.`,
        `Not perfect, but perfectly workable. AQI ${aqi} — your practice won't suffer.`,
        'The atmosphere is offering a fair window today. Make the most of it.',
        `AQI ${aqi} — outdoor sessions are a go. Just keep an eye on sensitive clients.`,
      ],
    },
    {
      level: 'Moderate (40–60)',
      hooks: [
        `AQI has crept to ${aqi}. Consider moving breathwork indoors today.`,
        `Moderate air quality: AQI ${aqi}. Gentle outdoor yoga is fine, skip deep breathing outside.`,
        `Sensitive clients will feel today's air (${aqi}). Indoor sessions are the compassionate choice.`,
        `The atmosphere is heavy today — AQI ${aqi}. Perfect excuse for an indoor sound journey.`,
        `AQI ${aqi}: not dangerous, but not ideal for pranayama outdoors. Listen to the air.`,
      ],
    },
    {
      level: 'Poor (60–80)',
      hooks: [
        `AQI ${aqi} — move all breathwork indoors today. Your lungs deserve clean air.`,
        `Poor air quality alert. AQI ${aqi}. Not the day for outdoor sound baths.`,
        `The air is speaking clearly: stay indoors. AQI ${aqi}.`,
        `Elevated pollutants today (AQI ${aqi}). Indoor sessions only.`,
        `AQI ${aqi}: Cancel outdoor plans. Indoor sound healing is what today calls for.`,
      ],
    },
    {
      level: 'Very Poor (80+)',
      hooks: [
        `AQI hit ${aqi} — minimise all deep breathing. Keep sessions gentle and indoors.`,
        `Air quality warning: ${aqi}. Even indoors, consider an air purifier.`,
        `Be gentle today. AQI ${aqi} means less breathwork, more restorative sound.`,
        `Serious air quality concern (${aqi}). Prioritise your health — stay inside.`,
        `AQI ${aqi}. Protect your instrument. Gentle indoor practice only.`,
      ],
    },
  ]
}

export function getActiveHookSet(aqi: number): HookSet {
  const all = getOpeningHooks(aqi)
  if (aqi <= 20) return all[0]
  if (aqi <= 40) return all[1]
  if (aqi <= 60) return all[2]
  if (aqi <= 80) return all[3]
  return all[4]
}

// ── Caption Templates ──

export interface CaptionData {
  hook: string
  location: string
  aqi: number
  level: string
  pm25: number
  uv: number
  uvLevel: string
  pollenSummary: string
  guidanceSentence: string
  guidanceShort: string
  modalityChecklist: string
}

export function buildCaptionData(data: AirQualityResponse, locationName: string, hook: string): CaptionData {
  const aqi = data.current.european_aqi
  const band = getAqiBand(aqi)
  const uvBand = getUvBand(data.current.uv_index)
  const pollenLevel = getOverallPollenLevel(data)
  const guidance = generateSessionGuidance(data)

  const modalityLines = guidance.modalities.map(m =>
    `${m.safe ? '✅' : '❌'} ${m.name}`
  ).join('\n')

  return {
    hook,
    location: locationName,
    aqi,
    level: band.label,
    pm25: data.current.pm2_5,
    uv: data.current.uv_index,
    uvLevel: uvBand.label,
    pollenSummary: pollenLevel ? pollenLevel.label : 'N/A',
    guidanceSentence: guidance.summary,
    guidanceShort: guidance.outdoorSafe ? 'Outdoor practice recommended' : 'Indoor sessions advised',
    modalityChecklist: modalityLines,
  }
}

export function generateInstagramCaption(d: CaptionData): string {
  return `${d.hook}

📊 Today's Air Quality Report (${d.location}):
🌬️ AQI: ${d.aqi} (${d.level})
💨 PM2.5: ${d.pm25} μg/m³
☀️ UV Index: ${d.uv} (${d.uvLevel})
🌿 Pollen: ${d.pollenSummary}

${d.guidanceSentence}

Whether you're a breathwork facilitator, sound healer, or yoga teacher — knowing your air quality helps you serve your clients better.

Check live conditions → link in bio 🔗

#AirQuality #Breathwork #SoundHealing #PranayamaPractice #HolisticHealth #WellnessPractitioner #OutdoorYoga #BreathworkFacilitator #SoundBath #PollenForecast #UVIndex #Airas #HarmonicWaves #WellnessTools #MindBodySpirit #EnergyHealing #YogaTeacher #ConsciousLiving #NaturalHealth #CleanAir`
}

export function generateTwitterCaption(d: CaptionData): string {
  return `${d.hook}

AQI: ${d.aqi} (${d.level}) · PM2.5: ${d.pm25} · UV: ${d.uv}
${d.guidanceShort}

Live air intelligence for practitioners → airas.app

#AirQuality #Breathwork #SoundHealing`
}

export function generateTikTokCaption(d: CaptionData): string {
  return `${d.hook}

POV: You're a breathwork facilitator who actually checks the air before running a session 🫁

Today's AQI: ${d.aqi} (${d.level})
✅ or ❌ for each modality:
${d.modalityChecklist}

Free tool → airas.app (link in bio)

#AirQuality #Breathwork #SoundHealing #Pranayama #WellnessTok #HolisticHealth #YogaTeacher #BreathworkCoach #FYP #CleanAir #OutdoorYoga`
}

export function generateWhatsAppCaption(d: CaptionData): string {
  return `Hey! Just checked today's air quality — AQI is ${d.aqi} (${d.level}).

${d.guidanceSentence}

I check this free tool before every outdoor session: airas.app

Shows pollutants, pollen, UV, and tells you which breathwork modalities are safe today. Thought you'd find it useful! 🌬️`
}

// ── Content Calendar ──

export interface ContentIdea {
  condition: string
  idea: string
}

export function getContentIdeas(data: AirQualityResponse): ContentIdea[] {
  const ideas: ContentIdea[] = []
  const aqi = data.current.european_aqi
  const uv = data.current.uv_index
  const pollenLevel = getOverallPollenLevel(data)

  if (aqi <= 20) {
    ideas.push({ condition: 'AQI is excellent', idea: 'Post about taking practice outdoors — celebrate the clean air' })
  } else if (aqi <= 40) {
    ideas.push({ condition: 'AQI is fair', idea: 'Share tips for making the most of decent air quality days' })
  } else if (aqi <= 60) {
    ideas.push({ condition: 'AQI is moderate', idea: 'Post about indoor alternatives and why air quality awareness matters' })
  } else {
    ideas.push({ condition: 'AQI is poor', idea: 'Post about air quality awareness for practitioners — why you check before every session' })
  }

  if (uv >= 8) {
    ideas.push({ condition: 'UV is very high', idea: 'Post about scheduling sessions in the morning or evening to avoid peak UV' })
  }

  if (pollenLevel && (pollenLevel.label === 'High' || pollenLevel.label === 'Very High')) {
    ideas.push({ condition: 'Pollen is high', idea: 'Post about indoor alternatives for hay fever season' })
  }

  return ideas
}

export const POSTING_TIMES = [
  { platform: 'Instagram', emoji: '📸', times: ['11am', '2pm', '7pm'] },
  { platform: 'Twitter/X', emoji: '🐦', times: ['8am', '12pm', '5pm'] },
  { platform: 'TikTok', emoji: '🎵', times: ['7am', '12pm', '7pm'] },
]
