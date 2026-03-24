/**
 * Palace positioning and Five Element calculation
 * Based on ziwei_tool_spec.md
 */

import {
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  NAYIN_TABLE,
  FIVE_ELEMENTS,
  PALACE_NAMES,
  MINGZHU_TABLE,
  SHENZHU_TABLE,
} from './constants'

/**
 * Calculate Life Palace position (命宮)
 * 口訣：寅宮起正月，逆數至生月，再順數生時
 *
 * @param lunarMonth - Lunar month (1-12)
 * @param hourIndex - Hour index (0=子, 1=丑, 2=寅, ...)
 * @returns Palace position as earthly branch index (0=子, 1=丑, 2=寅, ...)
 */
export function calcMingGong(lunarMonth: number, hourIndex: number): number {
  // Step 1: 從寅宮(index=2)逆數 (lunarMonth - 1) 步
  // 寅=2, going backward: 2 -> 1 -> 0 -> 11 -> 10 -> ...
  const monthPosition = (2 - (lunarMonth - 1) + 12) % 12

  // Step 2: 再順數生時 (hourIndex) 步
  const mingGong = (monthPosition + hourIndex) % 12

  return mingGong
}

/**
 * Calculate Body Palace position (身宮)
 * 口訣：寅宮起正月，順數至生月，再順數生時
 * (與命宮類似，但月份是順數而非逆數)
 *
 * @param lunarMonth - Lunar month (1-12)
 * @param hourIndex - Hour index (0=子, 1=丑, 2=寅, ...)
 * @returns Body palace position (0-11)
 */
export function calcShenGong(lunarMonth: number, hourIndex: number): number {
  // 從寅宮(2)順數(月-1)步，再順數時辰步
  const monthPosition = (2 + (lunarMonth - 1)) % 12
  const shenGong = (monthPosition + hourIndex) % 12
  return shenGong
}

/**
 * Get the heavenly stem for the life palace using 五虎遁
 * 甲己年寅宮起丙, 乙庚年寅宮起戊, 丙辛年寅宮起庚, 丁壬年寅宮起壬, 戊癸年寅宮起甲
 *
 * @param yearStem - Year's heavenly stem
 * @param palaceIndex - Palace's earthly branch index (0-11)
 * @returns Palace's heavenly stem
 */
export function calcPalaceTianGan(yearStem: string, palaceIndex: number): string {
  // 五虎遁起始天干 (寅宮的天干)
  const wuhuStart: Record<string, number> = {
    '甲': 2, '己': 2,  // 丙
    '乙': 4, '庚': 4,  // 戊
    '丙': 6, '辛': 6,  // 庚
    '丁': 8, '壬': 8,  // 壬
    '戊': 0, '癸': 0,  // 甲
  }

  const startIndex = wuhuStart[yearStem] ?? 0
  // 從寅宮(index=2)開始，計算到目標宮位的天干
  const offset = (palaceIndex - 2 + 12) % 12
  const stemIndex = (startIndex + offset) % 10

  return HEAVENLY_STEMS[stemIndex]
}

/**
 * Calculate Five Element (五行局)
 * 依命宮天干地支的納音五行決定
 *
 * @param yearStem - Year's heavenly stem
 * @param mingGong - Life palace position (0-11)
 * @returns Five element number (2, 3, 4, 5, or 6)
 */
export function calcWuXingJu(yearStem: string, mingGong: number): number {
  const palaceStem = calcPalaceTianGan(yearStem, mingGong)
  const palaceBranch = EARTHLY_BRANCHES[mingGong]
  const key = palaceStem + palaceBranch

  return NAYIN_TABLE[key] ?? 3
}

/**
 * Get Five Element name
 */
export function getWuXingJuName(wuXingJu: number): string {
  return FIVE_ELEMENTS[wuXingJu as keyof typeof FIVE_ELEMENTS] ?? '木三局'
}

/**
 * Get Ming Zhu (命主) - based on life palace branch
 */
export function getMingZhu(mingGong: number): string {
  const branch = EARTHLY_BRANCHES[mingGong]
  return MINGZHU_TABLE[branch] ?? '貪狼'
}

/**
 * Get Shen Zhu (身主) - based on year branch
 */
export function getShenZhu(yearBranch: string): string {
  return SHENZHU_TABLE[yearBranch] ?? '火星'
}

/**
 * Get earthly branch name for a position
 */
export function getBranchForPosition(position: number): string {
  return EARTHLY_BRANCHES[(position + 12) % 12]
}

/**
 * Get palace name for a position (relative to life palace)
 */
export function getPalaceNameForPosition(position: number, mingGong: number): string {
  // Palace names start from 命宮 and go counterclockwise
  const relativePosition = (position - mingGong + 12) % 12
  return PALACE_NAMES[relativePosition]
}

/**
 * Create all 12 palaces with their names, branches, and stems
 */
export function createPalaces(
  mingGong: number,
  yearStem: string
): Array<{
  position: number
  branch: string
  stem: string
  name: string
}> {
  const palaces = []

  for (let i = 0; i < 12; i++) {
    const branch = EARTHLY_BRANCHES[i]
    const stem = calcPalaceTianGan(yearStem, i)
    const name = getPalaceNameForPosition(i, mingGong)

    palaces.push({
      position: i,
      branch,
      stem,
      name,
    })
  }

  return palaces
}

/**
 * Determine if year is Yang (陽年) or Yin (陰年)
 * Yang years: 甲丙戊庚壬 (even index in HEAVENLY_STEMS)
 * Yin years: 乙丁己辛癸 (odd index in HEAVENLY_STEMS)
 */
export function isYangYear(yearStem: string): boolean {
  const index = HEAVENLY_STEMS.indexOf(yearStem)
  return index % 2 === 0
}

/**
 * Determine Da Xian (大限) direction
 * 陽年男命、陰年女命 → 順行 (clockwise)
 * 陰年男命、陽年女命 → 逆行 (counterclockwise)
 */
export function isDaXianForward(yearStem: string, gender: 'male' | 'female'): boolean {
  const isYang = isYangYear(yearStem)
  const isMale = gender === 'male'
  return isYang === isMale
}
