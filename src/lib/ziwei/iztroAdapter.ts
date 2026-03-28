/**
 * iztro Adapter Layer
 * Converts iztro library output to our Chart type format
 */

import { astro } from 'iztro'
import type { BirthData, Chart, Palace, Star, LunarDate, TransformationType } from '../../types'

// Earthly branches mapping (地支 index)
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// Harmful star names for classification
const HARMFUL_STAR_NAMES = ['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫']

// Convert hour (0-23) to Chinese time index (0-12)
// 0: 子時早 (23:00-01:00), 1: 丑時 (01:00-03:00), etc.
function getTimeIndex(hour: number): number {
  // 23:00-00:59 → 0 (early 子時)
  // 01:00-02:59 → 1 (丑時)
  // ...
  // 23:00 specifically is late 子時 (12) but we'll use early for simplicity
  if (hour >= 23 || hour < 1) return 0
  return Math.floor((hour + 1) / 2)
}

// Get earthly branch index from name
function getBranchIndex(branchName: string): number {
  const index = EARTHLY_BRANCHES.indexOf(branchName)
  return index >= 0 ? index : 0
}

// Convert iztro mutagen to our TransformationType
function convertMutagen(mutagen?: string): TransformationType | undefined {
  if (!mutagen) return undefined
  const mutagenMap: Record<string, TransformationType> = {
    '祿': '化祿',
    '權': '化權',
    '科': '化科',
    '忌': '化忌',
    '化祿': '化祿',
    '化權': '化權',
    '化科': '化科',
    '化忌': '化忌',
  }
  return mutagenMap[mutagen]
}

// Convert iztro star to our Star type
function convertStar(iztroStar: { name: string; mutagen?: string; brightness?: string }, type: Star['type']): Star {
  return {
    name: iztroStar.name,
    type,
    transformation: convertMutagen(iztroStar.mutagen),
    brightness: iztroStar.brightness as Star['brightness'],
  }
}

// Check if a star is a harmful star
function isHarmfulStar(starName: string): boolean {
  return HARMFUL_STAR_NAMES.some(name => starName.includes(name))
}

/**
 * Calculate chart using iztro library
 */
export function calculateChartWithIztro(birthData: BirthData): Chart {
  const { birthDate, birthTime, gender } = birthData

  // Parse birth time
  const [hourStr, minuteStr] = birthTime.split(':')
  const hour = parseInt(hourStr, 10)

  // Format date for iztro (YYYY-M-D)
  const year = birthDate.getFullYear()
  const month = birthDate.getMonth() + 1
  const day = birthDate.getDate()
  const dateStr = `${year}-${month}-${day}`

  // Get time index for iztro
  const timeIndex = getTimeIndex(hour)

  // Convert gender
  const genderStr = gender === 'male' ? '男' : '女'

  // Call iztro to generate astrolabe
  const astrolabe = astro.bySolar(dateStr, timeIndex, genderStr, true, 'zh-TW')

  // Get life palace and body palace positions
  const lifePalacePosition = getBranchIndex(astrolabe.earthlyBranchOfSoulPalace)
  const bodyPalacePosition = getBranchIndex(astrolabe.earthlyBranchOfBodyPalace)

  // Convert palaces
  const palaces: Palace[] = astrolabe.palaces.map((iztoPalace) => {
    const position = iztoPalace.index

    // Convert main stars (majorStars)
    const mainStars: Star[] = iztoPalace.majorStars.map(s => convertStar(s, 'main'))

    // Convert auxiliary stars (minorStars) - excluding harmful stars
    const auxiliaryStars: Star[] = iztoPalace.minorStars
      .filter(s => !isHarmfulStar(s.name))
      .map(s => convertStar(s, 'auxiliary'))

    // Extract harmful stars from minorStars
    const harmfulStars: Star[] = iztoPalace.minorStars
      .filter(s => isHarmfulStar(s.name))
      .map(s => convertStar(s, 'harmful'))

    // Convert misc stars (adjectiveStars)
    const miscStars: Star[] = iztoPalace.adjectiveStars.map(s => convertStar(s, 'misc'))

    return {
      name: iztoPalace.name,
      position,
      branch: iztoPalace.earthlyBranch,
      stem: iztoPalace.heavenlyStem,
      mainStars,
      auxiliaryStars,
      harmfulStars,
      miscStars,
      // Additional iztro data
      decadal: iztoPalace.decadal,
      ages: iztoPalace.ages,
      isBodyPalace: iztoPalace.isBodyPalace,
    }
  })

  // Parse lunar date from iztro
  const rawLunar = astrolabe.rawDates.lunarDate
  const rawChinese = astrolabe.rawDates.chineseDate

  const lunarDate: LunarDate = {
    year: rawLunar.lunarYear,
    month: rawLunar.lunarMonth,
    day: rawLunar.lunarDay,
    isLeapMonth: rawLunar.isLeap,
    yearGanZhi: `${rawChinese.yearly[0]}${rawChinese.yearly[1]}`,
    monthGanZhi: `${rawChinese.monthly[0]}${rawChinese.monthly[1]}`,
    dayGanZhi: `${rawChinese.daily[0]}${rawChinese.daily[1]}`,
    hourGanZhi: `${rawChinese.hourly[0]}${rawChinese.hourly[1]}`,
  }

  // Create chart
  const chart: Chart = {
    id: generateChartId(),
    birthData,
    lunarDate,
    fiveElement: astrolabe.fiveElementsClass as Chart['fiveElement'],
    lifePalacePosition,
    bodyPalacePosition,
    palaces,
    mingZhu: astrolabe.soul,
    shenZhu: astrolabe.body,
    createdAt: new Date(),
    // Additional iztro data
    zodiac: astrolabe.zodiac,
    sign: astrolabe.sign,
    chineseDate: astrolabe.chineseDate,
    time: astrolabe.time,
    timeRange: astrolabe.timeRange,
    // Keep reference to original astrolabe for advanced features
    _astrolabe: astrolabe,
  }

  return chart
}

/**
 * Generate unique chart ID
 */
function generateChartId(): string {
  return `chart_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Get horoscope (運限) data for a specific date
 */
export function getHoroscope(chart: Chart, targetDate?: Date, timeIndex?: number) {
  const astrolabe = (chart as any)._astrolabe
  if (!astrolabe || typeof astrolabe.horoscope !== 'function') {
    return null
  }
  return astrolabe.horoscope(targetDate, timeIndex)
}
