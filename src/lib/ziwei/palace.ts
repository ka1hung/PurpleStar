/**
 * Palace positioning and Five Element calculation
 */

import { PALACE_BRANCHES, EARTHLY_BRANCHES, HEAVENLY_STEMS, PALACE_NAMES } from './constants'

/**
 * Calculate Life Palace position (命宮)
 * Based on lunar month and hour
 *
 * Formula: Start from 寅 (position 1), count months forward, then count hours backward
 */
export function getLifePalacePosition(lunarMonth: number, hourIndex: number): number {
  // Start from 寅宮 (index 0 in PALACE_BRANCHES, which represents position 1)
  // Add (month - 1) to get to the starting position
  // Then subtract hourIndex

  // Month counting: 正月(1) starts at 寅, 二月(2) at 卯, etc.
  // Hour counting: 子時(0) goes back 0, 丑時(1) goes back 1, etc.

  let position = (lunarMonth - 1) - hourIndex

  // Normalize to 0-11 range
  while (position < 0) position += 12
  position = position % 12

  // Convert to 1-12 range
  return position + 1
}

/**
 * Calculate Body Palace position (身宮)
 * Based on lunar month and hour
 *
 * Formula: Start from 寅, count months forward, then count hours forward
 */
export function getBodyPalacePosition(lunarMonth: number, hourIndex: number): number {
  // Similar to life palace but hours count forward
  let position = (lunarMonth - 1) + hourIndex

  // Normalize to 0-11 range
  position = position % 12

  // Convert to 1-12 range
  return position + 1
}

/**
 * Calculate Five Element (五行局)
 * Based on year stem, month, and life palace branch
 */
export function getFiveElement(
  yearStem: string,
  lifePalacePosition: number
): string {
  const stemIndex = HEAVENLY_STEMS.indexOf(yearStem)
  const palaceBranch = PALACE_BRANCHES[lifePalacePosition - 1]
  const branchIndex = EARTHLY_BRANCHES.indexOf(palaceBranch)

  // 納音五行局表
  // This is a simplified version - the full table is complex
  // Based on 天干 and 命宮地支 combination

  const fiveElementTable: Record<string, Record<string, string>> = {
    // 甲己 配合各地支
    '甲': { '子': '金四局', '丑': '金四局', '寅': '水二局', '卯': '水二局', '辰': '火六局', '巳': '火六局',
            '午': '木三局', '未': '木三局', '申': '土五局', '酉': '土五局', '戌': '金四局', '亥': '金四局' },
    '己': { '子': '金四局', '丑': '金四局', '寅': '水二局', '卯': '水二局', '辰': '火六局', '巳': '火六局',
            '午': '木三局', '未': '木三局', '申': '土五局', '酉': '土五局', '戌': '金四局', '亥': '金四局' },
    // 乙庚
    '乙': { '子': '火六局', '丑': '火六局', '寅': '土五局', '卯': '土五局', '辰': '金四局', '巳': '金四局',
            '午': '水二局', '未': '水二局', '申': '木三局', '酉': '木三局', '戌': '火六局', '亥': '火六局' },
    '庚': { '子': '火六局', '丑': '火六局', '寅': '土五局', '卯': '土五局', '辰': '金四局', '巳': '金四局',
            '午': '水二局', '未': '水二局', '申': '木三局', '酉': '木三局', '戌': '火六局', '亥': '火六局' },
    // 丙辛
    '丙': { '子': '木三局', '丑': '木三局', '寅': '金四局', '卯': '金四局', '辰': '水二局', '巳': '水二局',
            '午': '土五局', '未': '土五局', '申': '火六局', '酉': '火六局', '戌': '木三局', '亥': '木三局' },
    '辛': { '子': '木三局', '丑': '木三局', '寅': '金四局', '卯': '金四局', '辰': '水二局', '巳': '水二局',
            '午': '土五局', '未': '土五局', '申': '火六局', '酉': '火六局', '戌': '木三局', '亥': '木三局' },
    // 丁壬
    '丁': { '子': '土五局', '丑': '土五局', '寅': '火六局', '卯': '火六局', '辰': '木三局', '巳': '木三局',
            '午': '金四局', '未': '金四局', '申': '水二局', '酉': '水二局', '戌': '土五局', '亥': '土五局' },
    '壬': { '子': '土五局', '丑': '土五局', '寅': '火六局', '卯': '火六局', '辰': '木三局', '巳': '木三局',
            '午': '金四局', '未': '金四局', '申': '水二局', '酉': '水二局', '戌': '土五局', '亥': '土五局' },
    // 戊癸
    '戊': { '子': '水二局', '丑': '水二局', '寅': '木三局', '卯': '木三局', '辰': '土五局', '巳': '土五局',
            '午': '火六局', '未': '火六局', '申': '金四局', '酉': '金四局', '戌': '水二局', '亥': '水二局' },
    '癸': { '子': '水二局', '丑': '水二局', '寅': '木三局', '卯': '木三局', '辰': '土五局', '巳': '土五局',
            '午': '火六局', '未': '火六局', '申': '金四局', '酉': '金四局', '戌': '水二局', '亥': '水二局' },
  }

  return fiveElementTable[yearStem]?.[palaceBranch] || '木三局'
}

/**
 * Get the Five Element number from string
 */
export function getFiveElementNumber(fiveElement: string): number {
  const map: Record<string, number> = {
    '水二局': 2,
    '木三局': 3,
    '金四局': 4,
    '土五局': 5,
    '火六局': 6,
  }
  return map[fiveElement] || 3
}

/**
 * Get branch for a palace position
 */
export function getBranchForPosition(position: number): string {
  return PALACE_BRANCHES[(position - 1 + 12) % 12]
}

/**
 * Get palace name for a position (relative to life palace)
 */
export function getPalaceNameForPosition(position: number, lifePalacePosition: number): string {
  const relativePosition = (position - lifePalacePosition + 12) % 12
  return PALACE_NAMES[relativePosition]
}

/**
 * Create the 12 palaces with their names and branches
 */
export function createPalaces(lifePalacePosition: number): Array<{
  position: number
  branch: string
  name: string
}> {
  const palaces = []

  for (let i = 0; i < 12; i++) {
    const position = i + 1
    const branch = PALACE_BRANCHES[i]
    const name = getPalaceNameForPosition(position, lifePalacePosition)

    palaces.push({ position, branch, name })
  }

  return palaces
}
