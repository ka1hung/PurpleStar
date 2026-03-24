/**
 * Star placement calculations for Zi Wei Dou Shu
 */

import {
  PALACE_BRANCHES,
  EARTHLY_BRANCHES,
  HEAVENLY_STEMS,
  ZIWEI_POSITION_TABLE,
  TRANSFORMATION_TABLE,
} from './constants'
import type { Star, TransformationType } from '../../types'
import { getFiveElementNumber } from './palace'

/**
 * Calculate Zi Wei (紫微) star position
 * Based on Five Element and lunar day
 */
export function getZiweiPosition(fiveElement: string, lunarDay: number): number {
  const elementNumber = getFiveElementNumber(fiveElement)
  const dayIndex = Math.min(lunarDay - 1, 29) // Cap at 30 days

  // Get position from table (1-12)
  const positions = ZIWEI_POSITION_TABLE[elementNumber]
  if (!positions) return 1

  return ((positions[dayIndex] - 1) % 12) + 1
}

/**
 * Get positions of all main stars based on Zi Wei position
 * The 14 main stars have fixed relationships to Zi Wei
 */
export function getMainStarPositions(ziweiPosition: number): Record<string, number> {
  // Zi Wei star group (紫微星系) - counterclockwise from Zi Wei
  // 紫微 -> 天機(-1) -> 空(-1) -> 太陽(-1) -> 武曲(-1) -> 天同(-1) -> 空(-1) -> 廉貞(-1)
  const ziweiGroup: Record<string, number> = {
    '紫微': 0,
    '天機': -1,
    '太陽': -3,
    '武曲': -4,
    '天同': -5,
    '廉貞': -7,
  }

  // Tian Fu star group (天府星系) - clockwise from Tian Fu
  // Tian Fu position is calculated from Zi Wei position
  const tianfuPos = getTianfuPosition(ziweiPosition)

  // 天府 -> 太陰(+1) -> 貪狼(+1) -> 巨門(+1) -> 天相(+1) -> 天梁(+1) -> 七殺(+1) -> 空(+1) -> 空(+1) -> 空(+1) -> 破軍(+1)
  const tianfuGroup: Record<string, number> = {
    '天府': 0,
    '太陰': 1,
    '貪狼': 2,
    '巨門': 3,
    '天相': 4,
    '天梁': 5,
    '七殺': 6,
    '破軍': 10,
  }

  const positions: Record<string, number> = {}

  // Calculate Zi Wei group positions
  for (const [star, offset] of Object.entries(ziweiGroup)) {
    positions[star] = normalizePosition(ziweiPosition + offset)
  }

  // Calculate Tian Fu group positions
  for (const [star, offset] of Object.entries(tianfuGroup)) {
    positions[star] = normalizePosition(tianfuPos + offset)
  }

  return positions
}

/**
 * Calculate Tian Fu (天府) position from Zi Wei position
 */
function getTianfuPosition(ziweiPosition: number): number {
  // Tian Fu is symmetric to Zi Wei around the 寅-申 axis
  // 寅 is position 1, 申 is position 7
  // If Zi Wei is at position X, Tian Fu is at position (14 - X) mod 12

  // The relationship: 紫微在某宮，天府在對面（以寅申為軸對稱）
  const tianfuPos = (12 - ziweiPosition + 4) % 12
  return tianfuPos === 0 ? 12 : tianfuPos
}

/**
 * Get auxiliary star positions (輔星)
 */
export function getAuxiliaryStarPositions(
  yearStem: string,
  hourIndex: number,
  lunarMonth: number
): Record<string, number> {
  const positions: Record<string, number> = {}

  // 文昌 - based on hour (時支)
  // 文昌位置表：子10, 丑9, 寅8, 卯7, 辰6, 巳5, 午4, 未3, 申2, 酉1, 戌12, 亥11
  const wenchangTable = [10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 12, 11]
  positions['文昌'] = wenchangTable[hourIndex]

  // 文曲 - based on hour (opposite direction from 文昌)
  const wenquTable = [4, 5, 6, 7, 8, 9, 10, 11, 12, 1, 2, 3]
  positions['文曲'] = wenquTable[hourIndex]

  // 左輔 - based on lunar month (from 辰 position)
  positions['左輔'] = normalizePosition(4 + lunarMonth - 1)

  // 右弼 - based on lunar month (from 戌 position, going backward)
  positions['右弼'] = normalizePosition(10 - lunarMonth + 1)

  // 天魁 - based on year stem
  const tiankuiTable: Record<string, number> = {
    '甲': 1, '戊': 1, '庚': 1,  // 丑
    '乙': 12, '己': 12,         // 子
    '丙': 11, '丁': 11,         // 亥
    '辛': 6,                     // 午
    '壬': 3, '癸': 3,           // 卯
  }
  positions['天魁'] = tiankuiTable[yearStem] || 1

  // 天鉞 - based on year stem
  const tianyueTable: Record<string, number> = {
    '甲': 7, '戊': 7, '庚': 7,  // 未
    '乙': 8, '己': 8,           // 申
    '丙': 9, '丁': 9,           // 酉
    '辛': 3,                     // 寅
    '壬': 5, '癸': 5,           // 巳
  }
  positions['天鉞'] = tianyueTable[yearStem] || 7

  return positions
}

/**
 * Get harmful star positions (煞星)
 */
export function getHarmfulStarPositions(
  yearBranch: string,
  hourIndex: number
): Record<string, number> {
  const positions: Record<string, number> = {}
  const branchIndex = EARTHLY_BRANCHES.indexOf(yearBranch)

  // 擎羊 - based on year branch
  // 子年在卯(3), 丑年在辰(4), etc. (follows a pattern)
  const qingyangTable = [3, 4, 5, 6, 5, 6, 7, 8, 9, 10, 9, 10]
  positions['擎羊'] = qingyangTable[branchIndex]

  // 陀羅 - one position before 擎羊
  positions['陀羅'] = normalizePosition(positions['擎羊'] - 2)

  // 火星 - based on year branch and hour
  // Simplified: uses year branch group
  const huoxingBase = [2, 3, 1, 9, 10, 8, 2, 3, 1, 9, 10, 8]
  positions['火星'] = normalizePosition(huoxingBase[branchIndex] + hourIndex)

  // 鈴星 - based on year branch and hour
  const lingxingBase = [10, 10, 10, 3, 3, 3, 10, 10, 10, 3, 3, 3]
  positions['鈴星'] = normalizePosition(lingxingBase[branchIndex] + hourIndex)

  // 地空 - based on hour (from 亥 position)
  positions['地空'] = normalizePosition(11 - hourIndex)

  // 地劫 - based on hour (from 亥 position, opposite direction)
  positions['地劫'] = normalizePosition(11 + hourIndex)

  return positions
}

/**
 * Get four transformations (四化)
 */
export function getTransformations(yearStem: string): Record<string, TransformationType> {
  const transformationStars = TRANSFORMATION_TABLE[yearStem]
  if (!transformationStars) return {}

  const transformations: Record<string, TransformationType> = {}
  const transformationTypes: TransformationType[] = ['化祿', '化權', '化科', '化忌']

  transformationStars.forEach((star, index) => {
    transformations[star] = transformationTypes[index]
  })

  return transformations
}

/**
 * Create star object with transformation if applicable
 */
export function createStar(
  name: string,
  type: 'main' | 'auxiliary' | 'harmful' | 'misc',
  transformation?: TransformationType
): Star {
  return {
    name,
    type,
    transformation,
  }
}

/**
 * Normalize position to 1-12 range
 */
function normalizePosition(position: number): number {
  let normalized = position % 12
  if (normalized <= 0) normalized += 12
  return normalized
}

/**
 * Get misc stars positions (雜曜)
 * Simplified version with commonly used misc stars
 */
export function getMiscStarPositions(
  lunarMonth: number,
  lunarDay: number,
  hourIndex: number,
  yearBranch: string
): Record<string, number> {
  const positions: Record<string, number> = {}
  const branchIndex = EARTHLY_BRANCHES.indexOf(yearBranch)

  // 天馬 - based on year branch
  const tianmaTable = [2, 11, 8, 5, 2, 11, 8, 5, 2, 11, 8, 5]
  positions['天馬'] = tianmaTable[branchIndex]

  // 紅鸞 - based on year branch (from 卯 going backward)
  positions['紅鸞'] = normalizePosition(3 - branchIndex)

  // 天喜 - opposite of 紅鸞
  positions['天喜'] = normalizePosition(positions['紅鸞'] + 6)

  // 天刑 - based on lunar month (from 酉 position)
  positions['天刑'] = normalizePosition(9 + lunarMonth - 1)

  // 天姚 - based on lunar month (from 丑 position)
  positions['天姚'] = normalizePosition(1 + lunarMonth - 1)

  // 祿存 - based on year stem
  const lucunTable: Record<string, number> = {
    '甲': 2, '乙': 3, '丙': 5, '丁': 6,
    '戊': 5, '己': 6, '庚': 8, '辛': 9,
    '壬': 11, '癸': 12,
  }
  // Note: We need year stem here, using a workaround
  // In practice, this should be passed as parameter

  return positions
}
