/**
 * Star placement calculations for Zi Wei Dou Shu
 * Based on ziwei_tool_spec.md
 */

import {
  EARTHLY_BRANCHES,
  TRANSFORMATION_TABLE,
  LUCUN_TABLE,
  TIANKUI_TABLE,
  TIANYUE_TABLE,
  HUOXING_BASE,
  LINGXING_BASE,
  TIANMA_TABLE,
} from './constants'
import type { Star, TransformationType } from '../../types'

/**
 * Calculate Zi Wei (紫微) star position
 * 紫微定盤法：
 * 1. 日/局 = 商...餘
 * 2. 從寅宮(2)順數商步
 * 3. 若餘數=0，紫微在此
 * 4. 若餘數≠0：餘數≤局/2則逆數餘數步；餘數>局/2則順數(局-餘)步
 *
 * @param wuXingJu - Five element number (2, 3, 4, 5, 6)
 * @param lunarDay - Lunar day (1-30)
 * @returns Position as earthly branch index (0-11)
 */
export function calcZiWeiPosition(wuXingJu: number, lunarDay: number): number {
  const n = wuXingJu
  const d = Math.min(Math.max(lunarDay, 1), 30)
  const q = Math.floor(d / n)
  const r = d % n

  // 從寅宮(2)順數商步
  let pos = (2 + q) % 12

  if (r === 0) {
    // 整除，紫微就在這
    return pos
  } else if (r <= n / 2) {
    // 逆數餘數步
    return (pos - r + 12) % 12
  } else {
    // 順數(局-餘)步
    return (pos + (n - r)) % 12
  }
}

/**
 * Calculate Tian Fu (天府) position
 * 紫微與天府以子午線為軸對稱
 * Formula: (12 - ziWei) % 12
 */
export function calcTianFuPosition(ziWeiPosition: number): number {
  let pos = (12 - ziWeiPosition) % 12
  if (pos < 0) pos += 12
  return pos
}

/**
 * Get positions of all 14 main stars based on Zi Wei and Tian Fu positions
 */
export function getMainStarPositions(ziWeiPosition: number): Record<string, number> {
  const tianFuPosition = calcTianFuPosition(ziWeiPosition)

  // 紫微系列：紫微 → 天機(-1) → 空(-1) → 太陽(-1) → 武曲(-1) → 天同(-1) → 空(-1) → 空(-1) → 廉貞(-1)
  // Offsets from spec: 紫微(0), 天機(-1), 太陽(-3), 武曲(-4), 天同(-5), 廉貞(-8)
  const ziWeiGroup: Record<string, number> = {
    '紫微': 0,
    '天機': -1,
    '太陽': -3,
    '武曲': -4,
    '天同': -5,
    '廉貞': -8,
  }

  // 天府系列：天府 → 太陰(-1) → 貪狼(-2) → 巨門(-3) → 天相(-4) → 天梁(-5) → 七殺(-6) → 破軍(-10)
  // 天府系列逆行
  const tianFuGroup: Record<string, number> = {
    '天府': 0,
    '太陰': -1,
    '貪狼': -2,
    '巨門': -3,
    '天相': -4,
    '天梁': -5,
    '七殺': -6,
    '破軍': -10,
  }

  const positions: Record<string, number> = {}

  // Calculate Zi Wei group positions (going backward/counterclockwise)
  for (const [star, offset] of Object.entries(ziWeiGroup)) {
    positions[star] = normalizePosition(ziWeiPosition + offset)
  }

  // Calculate Tian Fu group positions (going forward/clockwise)
  for (const [star, offset] of Object.entries(tianFuGroup)) {
    positions[star] = normalizePosition(tianFuPosition + offset)
  }

  return positions
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

  // 文昌：從戌宮(10)起子時，逆數生時
  // 戌=10, 逆數: 10 -> 9 -> 8 -> ...
  positions['文昌'] = normalizePosition(10 - hourIndex)

  // 文曲：從辰宮(4)起子時，順數生時
  positions['文曲'] = normalizePosition(4 + hourIndex)

  // 左輔：從辰宮(4)起正月，順數生月
  positions['左輔'] = normalizePosition(4 + lunarMonth - 1)

  // 右弼：從戌宮(10)起正月，逆數生月
  positions['右弼'] = normalizePosition(10 - (lunarMonth - 1))

  // 天魁：依生年天干查表
  positions['天魁'] = TIANKUI_TABLE[yearStem] ?? 0

  // 天鉞：依生年天干查表
  positions['天鉞'] = TIANYUE_TABLE[yearStem] ?? 0

  // 祿存：依生年天干查表
  positions['祿存'] = LUCUN_TABLE[yearStem] ?? 0

  return positions
}

/**
 * Get harmful star positions (煞星)
 */
export function getHarmfulStarPositions(
  yearBranch: string,
  yearStem: string,
  hourIndex: number
): Record<string, number> {
  const positions: Record<string, number> = {}

  // 祿存位置
  const lucunPos = LUCUN_TABLE[yearStem] ?? 0

  // 擎羊：祿存順數1宮
  positions['擎羊'] = normalizePosition(lucunPos + 1)

  // 陀羅：祿存逆數1宮
  positions['陀羅'] = normalizePosition(lucunPos - 1)

  // 火星：依生年地支組＋生時查表
  const huoxingBase = getHuoLingBase(yearBranch, 'huo')
  positions['火星'] = normalizePosition(huoxingBase + hourIndex)

  // 鈴星：依生年地支組＋生時查表
  const lingxingBase = getHuoLingBase(yearBranch, 'ling')
  positions['鈴星'] = normalizePosition(lingxingBase + hourIndex)

  // 地空：從亥宮(11)起子時，逆數生時
  positions['地空'] = normalizePosition(11 - hourIndex)

  // 地劫：從亥宮(11)起子時，順數生時
  positions['地劫'] = normalizePosition(11 + hourIndex)

  return positions
}

/**
 * Get base position for Huo Xing or Ling Xing
 */
function getHuoLingBase(yearBranch: string, type: 'huo' | 'ling'): number {
  const groups = ['寅午戌', '申子辰', '巳酉丑', '亥卯未']
  const table = type === 'huo' ? HUOXING_BASE : LINGXING_BASE

  for (const group of groups) {
    if (group.includes(yearBranch)) {
      return table[group] ?? 0
    }
  }
  return 0
}

/**
 * Get four transformations (四化)
 */
export function getTransformations(yearStem: string): Record<string, TransformationType> {
  const stars = TRANSFORMATION_TABLE[yearStem]
  if (!stars) return {}

  const transformations: Record<string, TransformationType> = {}
  const types: TransformationType[] = ['化祿', '化權', '化科', '化忌']

  stars.forEach((star, index) => {
    transformations[star] = types[index]
  })

  return transformations
}

/**
 * Get misc stars positions (雜曜)
 */
export function getMiscStarPositions(
  lunarMonth: number,
  lunarDay: number,
  hourIndex: number,
  yearBranch: string
): Record<string, number> {
  const positions: Record<string, number> = {}

  // 天馬：依生年地支查表
  positions['天馬'] = TIANMA_TABLE[yearBranch] ?? 0

  // 紅鸞：從卯宮(3)起子年，逆數年支
  const branchIndex = EARTHLY_BRANCHES.indexOf(yearBranch)
  positions['紅鸞'] = normalizePosition(3 - branchIndex)

  // 天喜：紅鸞對宮
  positions['天喜'] = normalizePosition(positions['紅鸞'] + 6)

  // 天刑：從酉宮(9)起正月，順數生月
  positions['天刑'] = normalizePosition(9 + lunarMonth - 1)

  // 天姚：從丑宮(1)起正月，順數生月
  positions['天姚'] = normalizePosition(1 + lunarMonth - 1)

  // 解神：從戌宮(10)起正月，順數生月
  positions['解神'] = normalizePosition(10 + lunarMonth - 1)

  // 天巫：從巳宮(5)起正月，順數生月
  positions['天巫'] = normalizePosition(5 + lunarMonth - 1)

  // 天月：從戌宮(10)起正月，順數生月（部分派別不同）
  positions['天月'] = normalizePosition(10 + lunarMonth - 1)

  // 陰煞：從寅宮(2)起正月，順數生月
  positions['陰煞'] = normalizePosition(2 + lunarMonth - 1)

  return positions
}

/**
 * Create star object
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
 * Normalize position to 0-11 range
 */
function normalizePosition(position: number): number {
  let normalized = position % 12
  if (normalized < 0) normalized += 12
  return normalized
}
