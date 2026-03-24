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
 * Using 五虎遁 to get life palace's heavenly stem, then lookup 納音
 */
export function getFiveElement(
  yearStem: string,
  lifePalacePosition: number
): string {
  const palaceBranch = PALACE_BRANCHES[lifePalacePosition - 1]

  // Step 1: 五虎遁 - find life palace's heavenly stem
  // 甲己年寅宮起丙, 乙庚年寅宮起戊, 丙辛年寅宮起庚, 丁壬年寅宮起壬, 戊癸年寅宮起甲
  const wuhuStart: Record<string, number> = {
    '甲': 2, '己': 2,  // 丙
    '乙': 4, '庚': 4,  // 戊
    '丙': 6, '辛': 6,  // 庚
    '丁': 8, '壬': 8,  // 壬
    '戊': 0, '癸': 0,  // 甲
  }

  const startStemIndex = wuhuStart[yearStem] ?? 0
  // PALACE_BRANCHES starts from 寅, so position offset from 寅
  const palaceStemIndex = (startStemIndex + lifePalacePosition - 1) % 10
  const palaceStem = HEAVENLY_STEMS[palaceStemIndex]

  // Step 2: Get 納音五行 from stem+branch combination
  // 納音表 maps stem+branch to five element
  const nayinTable: Record<string, string> = {
    // 甲子乙丑 海中金
    '甲子': '金四局', '乙丑': '金四局',
    // 丙寅丁卯 爐中火
    '丙寅': '火六局', '丁卯': '火六局',
    // 戊辰己巳 大林木
    '戊辰': '木三局', '己巳': '木三局',
    // 庚午辛未 路旁土
    '庚午': '土五局', '辛未': '土五局',
    // 壬申癸酉 劍鋒金
    '壬申': '金四局', '癸酉': '金四局',
    // 甲戌乙亥 山頭火
    '甲戌': '火六局', '乙亥': '火六局',
    // 丙子丁丑 澗下水
    '丙子': '水二局', '丁丑': '水二局',
    // 戊寅己卯 城頭土
    '戊寅': '土五局', '己卯': '土五局',
    // 庚辰辛巳 白蠟金
    '庚辰': '金四局', '辛巳': '金四局',
    // 壬午癸未 楊柳木
    '壬午': '木三局', '癸未': '木三局',
    // 甲申乙酉 泉中水
    '甲申': '水二局', '乙酉': '水二局',
    // 丙戌丁亥 屋上土
    '丙戌': '土五局', '丁亥': '土五局',
    // 戊子己丑 霹靂火
    '戊子': '火六局', '己丑': '火六局',
    // 庚寅辛卯 松柏木
    '庚寅': '木三局', '辛卯': '木三局',
    // 壬辰癸巳 長流水
    '壬辰': '水二局', '癸巳': '水二局',
    // 甲午乙未 砂中金
    '甲午': '金四局', '乙未': '金四局',
    // 丙申丁酉 山下火
    '丙申': '火六局', '丁酉': '火六局',
    // 戊戌己亥 平地木
    '戊戌': '木三局', '己亥': '木三局',
    // 庚子辛丑 壁上土
    '庚子': '土五局', '辛丑': '土五局',
    // 壬寅癸卯 金箔金
    '壬寅': '金四局', '癸卯': '金四局',
    // 甲辰乙巳 覆燈火
    '甲辰': '火六局', '乙巳': '火六局',
    // 丙午丁未 天河水
    '丙午': '水二局', '丁未': '水二局',
    // 戊申己酉 大驛土
    '戊申': '土五局', '己酉': '土五局',
    // 庚戌辛亥 釵釧金
    '庚戌': '金四局', '辛亥': '金四局',
    // 壬子癸丑 桑柘木
    '壬子': '木三局', '癸丑': '木三局',
    // 甲寅乙卯 大溪水
    '甲寅': '水二局', '乙卯': '水二局',
    // 丙辰丁巳 沙中土
    '丙辰': '土五局', '丁巳': '土五局',
    // 戊午己未 天上火
    '戊午': '火六局', '己未': '火六局',
    // 庚申辛酉 石榴木
    '庚申': '木三局', '辛酉': '木三局',
    // 壬戌癸亥 大海水
    '壬戌': '水二局', '癸亥': '水二局',
  }

  const key = palaceStem + palaceBranch
  return nayinTable[key] || '水二局'
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
