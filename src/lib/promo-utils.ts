import { toPng } from 'html-to-image'
import { trackEvent } from './analytics'

export async function downloadCard(element: HTMLElement, filename: string) {
  const dataUrl = await toPng(element, {
    pixelRatio: 2,
    backgroundColor: '#06061A',
  })
  const link = document.createElement('a')
  link.download = filename
  link.href = dataUrl
  link.click()
  trackEvent('Promo Card Downloaded', { card: filename })
}

export function copyToClipboard(text: string): Promise<void> {
  return navigator.clipboard.writeText(text)
}

export const HASHTAGS =
  '#AirQuality #Breathwork #SoundHealing #PranayamaPractice #HolisticHealth #WellnessPractitioner #OutdoorYoga #Airas'

export interface CaptionSet {
  educational: string
  practitioner: string
  engagement: string
}

export function generateDailyCaptions(
  aqi: number,
  label: string,
  location: string
): CaptionSet {
  return {
    educational: `Air Quality Index in ${location}: ${aqi} (${label}). Understanding the air you breathe is the first step to safer breathwork practice. Monitor conditions at airas.app\n\n${HASHTAGS}`,
    practitioner: `Today's AQI in ${location} is ${aqi} — ${label.toLowerCase()}. ${
      aqi <= 20
        ? 'Perfect conditions for all outdoor modalities. Get out there!'
        : aqi <= 40
        ? 'Good conditions for standard practice. Enjoy the fresh air.'
        : 'Consider adjusting your session plan based on current conditions.'
    } Check the full breakdown at airas.app\n\n${HASHTAGS}`,
    engagement: `What's the air quality like where you practise today? ${location} is sitting at AQI ${aqi} (${label.toLowerCase()}). Drop your location below! 🌬️\n\nCheck yours at airas.app\n\n${HASHTAGS}`,
  }
}

export function generateBreathworkCaptions(
  aqi: number,
  safeModalities: string[],
  unsafeModalities: string[]
): CaptionSet {
  const safeList = safeModalities.join(', ')
  return {
    educational: `Today's breathwork conditions report: AQI ${aqi}. ${safeModalities.length} of 6 modalities are clear for outdoor practice. Air quality directly affects how deeply and safely you can breathe. Know before you practise.\n\n${HASHTAGS}`,
    practitioner: `Practitioner update: ${
      unsafeModalities.length === 0
        ? `All clear! ${safeList} — every modality is safe for outdoor sessions today.`
        : `${safeList} are safe outdoors. ${unsafeModalities.join(', ')} — consider moving indoors.`
    } Full conditions at airas.app\n\n${HASHTAGS}`,
    engagement: `How do you check air quality before running breathwork sessions? 🫁\n\nToday ${safeModalities.length}/6 modalities are safe outdoors. What's your go-to breathwork practice?\n\nairas.app\n\n${HASHTAGS}`,
  }
}

export function generateForecastCaptions(bestDay: string, worstDay: string): CaptionSet {
  return {
    educational: `5-day air quality forecast: Best conditions on ${bestDay}. Plan your outdoor sessions with atmospheric data, not guesswork. Weekly planning at airas.app\n\n${HASHTAGS}`,
    practitioner: `Planning your week? ${bestDay} looks ideal for outdoor sessions. ${worstDay ? `Watch out for ${worstDay} — may need indoor alternatives. ` : ''}Full 5-day forecast at airas.app\n\n${HASHTAGS}`,
    engagement: `Do you plan your healing sessions around the weather and air quality? 🌬️\n\nThis week's best day for outdoor practice: ${bestDay}. How far ahead do you plan?\n\nairas.app\n\n${HASHTAGS}`,
  }
}

export function generatePollenCaptions(highestType: string, level: string): CaptionSet {
  return {
    educational: `Pollen alert: ${highestType} pollen is ${level.toLowerCase()} today. For practitioners running outdoor sessions, pollen counts directly impact breathwork safety — especially for clients with allergies.\n\n${HASHTAGS}`,
    practitioner: `${level} ${highestType.toLowerCase()} pollen today. ${
      level === 'High' || level === 'Very High'
        ? 'Check with clients about sensitivities before outdoor sessions. Indoor alternatives recommended for allergy sufferers.'
        : 'Most clients should be fine outdoors, but always ask about allergies first.'
    } Full pollen radar at airas.app\n\n${HASHTAGS}`,
    engagement: `Do you check pollen levels before outdoor breathwork? 🌿\n\n${highestType} pollen is ${level.toLowerCase()} today. How do you adapt your sessions for clients with hay fever?\n\nairas.app\n\n${HASHTAGS}`,
  }
}
