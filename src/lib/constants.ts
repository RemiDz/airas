export const DEFAULT_LOCATION = {
  name: 'Gateshead',
  country: 'GB',
  latitude: 54.96,
  longitude: -1.60,
  admin1: 'England',
}

export const REFRESH_INTERVAL = 15 * 60 * 1000 // 15 minutes

export const COLOURS = {
  void: '#06061A',
  voidDeep: '#0A0A2E',
  accentPrimary: '#A8DADC',
  accentSecondary: '#4ECDC4',
  textPrimary: '#F0EEF8',
  textSecondary: '#C8C4DC',
  statusGood: '#34D399',
  statusModerate: '#F59E0B',
  statusPoor: '#EF4444',
  pollen: '#FFD166',
  uv: '#8B5CF6',
  ozone: '#3B82F6',
} as const
