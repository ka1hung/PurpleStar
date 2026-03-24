/**
 * Zi Wei Dou Shu Calculation Engine
 * Main entry point for chart calculations
 * Now powered by iztro library
 */

import { calculateChartWithIztro, getHoroscope } from './iztroAdapter'
import type { BirthData, Chart } from '../../types'

/**
 * Calculate a complete Zi Wei Dou Shu chart using iztro library
 */
export function calculateChart(birthData: BirthData): Chart {
  return calculateChartWithIztro(birthData)
}

/**
 * Get horoscope (運限) data for a chart
 */
export { getHoroscope }

// Re-export modules (legacy, for backward compatibility)
export * from './calendar'
export * from './trueSolarTime'
export * from './palace'
export * from './stars'
export * from './constants'
export * from './iztroAdapter'
