/**
 * True Solar Time Calculation Module
 *
 * True solar time accounts for:
 * 1. Longitude difference from standard time meridian
 * 2. Equation of time (Earth's elliptical orbit)
 */

/**
 * Calculate the equation of time in minutes for a given date
 * This accounts for Earth's elliptical orbit
 */
export function getEquationOfTime(date: Date): number {
  const dayOfYear = getDayOfYear(date)
  const B = (2 * Math.PI * (dayOfYear - 81)) / 365

  // Equation of time in minutes
  const EoT =
    9.87 * Math.sin(2 * B) -
    7.53 * Math.cos(B) -
    1.5 * Math.sin(B)

  return EoT
}

/**
 * Get day of year (1-365/366)
 */
function getDayOfYear(date: Date): number {
  const start = new Date(date.getFullYear(), 0, 0)
  const diff = date.getTime() - start.getTime()
  const oneDay = 1000 * 60 * 60 * 24
  return Math.floor(diff / oneDay)
}

/**
 * Calculate longitude correction in minutes
 * Each degree of longitude = 4 minutes of time
 *
 * @param longitude - The longitude of the birth place
 * @param timezone - The timezone offset (e.g., 8 for UTC+8)
 * @returns Correction in minutes
 */
export function getLongitudeCorrection(longitude: number, timezone: number): number {
  // Standard meridian for the timezone
  const standardMeridian = timezone * 15

  // Longitude difference from standard meridian
  const longitudeDiff = longitude - standardMeridian

  // 4 minutes per degree
  return longitudeDiff * 4
}

/**
 * Calculate true solar time from standard time
 *
 * @param date - Date object with standard time
 * @param longitude - Longitude of birth place
 * @param timezone - Timezone offset (e.g., 8 for UTC+8)
 * @returns Object with corrected time info
 */
export function calculateTrueSolarTime(
  date: Date,
  longitude: number,
  timezone: number
): {
  originalTime: string
  trueSolarTime: string
  differenceMinutes: number
  hour: number
  minute: number
} {
  const originalHour = date.getHours()
  const originalMinute = date.getMinutes()

  // Get corrections
  const longitudeCorrection = getLongitudeCorrection(longitude, timezone)
  const equationOfTime = getEquationOfTime(date)

  // Total correction in minutes
  const totalCorrection = longitudeCorrection + equationOfTime

  // Calculate corrected time
  let totalMinutes = originalHour * 60 + originalMinute + totalCorrection

  // Handle day overflow
  while (totalMinutes < 0) totalMinutes += 24 * 60
  while (totalMinutes >= 24 * 60) totalMinutes -= 24 * 60

  const correctedHour = Math.floor(totalMinutes / 60)
  const correctedMinute = Math.round(totalMinutes % 60)

  return {
    originalTime: `${String(originalHour).padStart(2, '0')}:${String(originalMinute).padStart(2, '0')}`,
    trueSolarTime: `${String(correctedHour).padStart(2, '0')}:${String(correctedMinute).padStart(2, '0')}`,
    differenceMinutes: Math.round(totalCorrection),
    hour: correctedHour,
    minute: correctedMinute,
  }
}

/**
 * Format time difference for display
 */
export function formatTimeDifference(minutes: number): string {
  const absMinutes = Math.abs(minutes)
  const hours = Math.floor(absMinutes / 60)
  const mins = absMinutes % 60

  const sign = minutes >= 0 ? '+' : '-'

  if (hours > 0) {
    return `${sign}${hours}小時${mins}分鐘`
  }
  return `${sign}${mins}分鐘`
}

/**
 * Check if time correction crosses hour boundary (時辰)
 * This is important because it could change the entire chart
 */
export function checkHourBoundary(
  originalHour: number,
  correctedHour: number
): {
  crossed: boolean
  originalShichen: string
  correctedShichen: string
} {
  const getShichen = (hour: number): string => {
    const shichen = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
    const index = Math.floor(((hour + 1) % 24) / 2)
    return shichen[index] + '時'
  }

  const originalShichen = getShichen(originalHour)
  const correctedShichen = getShichen(correctedHour)

  return {
    crossed: originalShichen !== correctedShichen,
    originalShichen,
    correctedShichen,
  }
}
