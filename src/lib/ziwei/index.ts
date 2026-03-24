/**
 * Zi Wei Dou Shu Calculation Engine
 * Main entry point for chart calculations
 */

import { solarToLunar, getHourIndex, getYearGan, getYearBranch } from './calendar'
import { calculateTrueSolarTime, checkHourBoundary } from './trueSolarTime'
import {
  getLifePalacePosition,
  getBodyPalacePosition,
  getFiveElement,
  createPalaces,
  getBranchForPosition,
} from './palace'
import {
  getZiweiPosition,
  getMainStarPositions,
  getAuxiliaryStarPositions,
  getHarmfulStarPositions,
  getTransformations,
  getMiscStarPositions,
  createStar,
} from './stars'
import { PALACE_NAMES } from './constants'
import type { BirthData, Chart, Palace, Star } from '../../types'

/**
 * Calculate a complete Zi Wei Dou Shu chart
 */
export function calculateChart(birthData: BirthData): Chart {
  const {
    birthDate,
    birthTime,
    gender,
    longitude,
    timezone,
  } = birthData

  // Parse birth time
  const [hourStr, minuteStr] = birthTime.split(':')
  const hour = parseInt(hourStr, 10)
  const minute = parseInt(minuteStr, 10)

  // Calculate true solar time
  const trueSolarTimeResult = calculateTrueSolarTime(
    new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate(), hour, minute),
    longitude,
    timezone
  )

  // Use corrected hour for calculations
  const correctedHour = trueSolarTimeResult.hour
  const hourIndex = getHourIndex(correctedHour)

  // Convert to lunar date
  const lunarDate = solarToLunar(
    birthDate.getFullYear(),
    birthDate.getMonth() + 1,
    birthDate.getDate(),
    correctedHour,
    trueSolarTimeResult.minute
  )

  // Get year stem and branch
  const yearStem = getYearGan(lunarDate.year)
  const yearBranch = getYearBranch(lunarDate.year)

  // Calculate life palace position
  const lifePalacePosition = getLifePalacePosition(lunarDate.month, hourIndex)

  // Calculate body palace position
  const bodyPalacePosition = getBodyPalacePosition(lunarDate.month, hourIndex)

  // Calculate five element
  const fiveElement = getFiveElement(yearStem, lifePalacePosition)

  // Calculate Zi Wei position
  const ziweiPosition = getZiweiPosition(fiveElement, lunarDate.day)

  // Get all star positions
  const mainStarPositions = getMainStarPositions(ziweiPosition)
  const auxiliaryStarPositions = getAuxiliaryStarPositions(yearStem, hourIndex, lunarDate.month)
  const harmfulStarPositions = getHarmfulStarPositions(yearBranch, hourIndex)
  const miscStarPositions = getMiscStarPositions(lunarDate.month, lunarDate.day, hourIndex, yearBranch)

  // Get transformations
  const transformations = getTransformations(yearStem)

  // Create palaces with stars
  const basePalaces = createPalaces(lifePalacePosition)
  const palaces: Palace[] = basePalaces.map((p) => {
    const mainStars: Star[] = []
    const auxiliaryStars: Star[] = []
    const harmfulStars: Star[] = []
    const miscStars: Star[] = []

    // Add main stars to this palace
    for (const [starName, position] of Object.entries(mainStarPositions)) {
      if (position === p.position) {
        mainStars.push(createStar(starName, 'main', transformations[starName]))
      }
    }

    // Add auxiliary stars
    for (const [starName, position] of Object.entries(auxiliaryStarPositions)) {
      if (position === p.position) {
        auxiliaryStars.push(createStar(starName, 'auxiliary', transformations[starName]))
      }
    }

    // Add harmful stars
    for (const [starName, position] of Object.entries(harmfulStarPositions)) {
      if (position === p.position) {
        harmfulStars.push(createStar(starName, 'harmful', transformations[starName]))
      }
    }

    // Add misc stars
    for (const [starName, position] of Object.entries(miscStarPositions)) {
      if (position === p.position) {
        miscStars.push(createStar(starName, 'misc', transformations[starName]))
      }
    }

    return {
      name: p.name,
      position: p.position,
      branch: p.branch,
      mainStars,
      auxiliaryStars,
      harmfulStars,
      miscStars,
    }
  })

  // Create chart
  const chart: Chart = {
    id: generateChartId(),
    birthData,
    lunarDate,
    fiveElement: fiveElement as Chart['fiveElement'],
    lifePalacePosition,
    bodyPalacePosition,
    palaces,
    trueSolarTime: {
      original: trueSolarTimeResult.originalTime,
      corrected: trueSolarTimeResult.trueSolarTime,
      difference: trueSolarTimeResult.differenceMinutes,
    },
    createdAt: new Date(),
  }

  return chart
}

/**
 * Generate unique chart ID
 */
function generateChartId(): string {
  return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

// Re-export all modules
export * from './calendar'
export * from './trueSolarTime'
export * from './palace'
export * from './stars'
export * from './constants'
