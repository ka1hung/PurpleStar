import { Solar, Lunar } from 'lunar-javascript'
import type { LunarDate } from '../../types'

/**
 * Convert solar date to lunar date
 */
export function solarToLunar(
  year: number,
  month: number,
  day: number,
  hour: number,
  minute: number
): LunarDate {
  // Handle zi hour (子時) crossing midnight - 23:00-00:59
  // In traditional Chinese astrology, zi hour belongs to the next day
  let adjustedYear = year
  let adjustedMonth = month
  let adjustedDay = day

  if (hour >= 23) {
    // Add one day for zi hour after 23:00
    const date = new Date(year, month - 1, day + 1)
    adjustedYear = date.getFullYear()
    adjustedMonth = date.getMonth() + 1
    adjustedDay = date.getDate()
  }

  const solar = Solar.fromYmdHms(adjustedYear, adjustedMonth, adjustedDay, hour, minute, 0)
  const lunar = solar.getLunar()

  // Get the hour branch (時辰地支)
  const hourBranch = getHourBranch(hour)

  return {
    year: lunar.getYear(),
    month: lunar.getMonth(),
    day: lunar.getDay(),
    isLeapMonth: lunar.isLeap(),
    yearGanZhi: lunar.getYearInGanZhi(),
    monthGanZhi: lunar.getMonthInGanZhi(),
    dayGanZhi: lunar.getDayInGanZhi(),
    hourGanZhi: getHourGanZhi(lunar.getDayGan(), hourBranch),
  }
}

/**
 * Get hour branch (時辰地支) from hour
 */
export function getHourBranch(hour: number): string {
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  // 23:00-00:59 = 子, 01:00-02:59 = 丑, etc.
  const index = Math.floor(((hour + 1) % 24) / 2)
  return branches[index]
}

/**
 * Get hour index (0-11) from hour
 */
export function getHourIndex(hour: number): number {
  return Math.floor(((hour + 1) % 24) / 2)
}

/**
 * Get hour Gan Zhi (時辰干支) from day Gan and hour branch
 */
export function getHourGanZhi(dayGan: string, hourBranch: string): string {
  const gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

  // 甲己日起甲子時，乙庚日起丙子時，丙辛日起戊子時，丁壬日起庚子時，戊癸日起壬子時
  const dayGanIndex = gans.indexOf(dayGan)
  const startGanIndex = (dayGanIndex % 5) * 2

  const hourBranchIndex = branches.indexOf(hourBranch)
  const hourGanIndex = (startGanIndex + hourBranchIndex) % 10

  return gans[hourGanIndex] + hourBranch
}

/**
 * Get year Gan (年干) from lunar year
 */
export function getYearGan(year: number): string {
  const gans = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  return gans[(year - 4) % 10]
}

/**
 * Get year branch (年支) from lunar year
 */
export function getYearBranch(year: number): string {
  const branches = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']
  return branches[(year - 4) % 12]
}

/**
 * Convert lunar month to index (1-12, handling leap months)
 */
export function getLunarMonthIndex(month: number, isLeapMonth: boolean): number {
  // For leap months, use the same index as the regular month
  return month
}

