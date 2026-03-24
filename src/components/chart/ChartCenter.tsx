import { useTranslation } from 'react-i18next'
import type { Chart } from '../../types'
import { formatTimeDifference } from '../../lib/ziwei/trueSolarTime'

interface ChartCenterProps {
  chart: Chart
}

export function ChartCenter({ chart }: ChartCenterProps) {
  const { t } = useTranslation()

  const { birthData, lunarDate, fiveElement, trueSolarTime } = chart

  // Format lunar date
  const lunarDateStr = `${lunarDate.yearGanZhi}年 ${lunarDate.isLeapMonth ? '閏' : ''}${getLunarMonthName(lunarDate.month)} ${getLunarDayName(lunarDate.day)}`

  return (
    <div className="h-full flex flex-col items-center justify-center p-4 text-center">
      {/* Name (if provided) */}
      {birthData.name && (
        <h2 className="font-serif text-2xl text-primary mb-2">
          {birthData.name}
        </h2>
      )}

      {/* Birth info */}
      <div className="space-y-1 text-sm">
        {/* Solar date */}
        <p className="text-ink/70">
          {birthData.birthDate.toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Lunar date */}
        <p className="text-ink font-medium">
          {lunarDateStr}
        </p>

        {/* Time */}
        <p className="text-ink/70">
          {lunarDate.hourGanZhi}
        </p>

        {/* Gender */}
        <p className="text-ink/70">
          {birthData.gender === 'male' ? '男' : '女'}
        </p>
      </div>

      {/* Divider */}
      <div className="w-16 h-px bg-primary/20 my-3" />

      {/* Five Element */}
      <div className="mb-2">
        <span className="inline-block bg-gold/20 text-gold-dark px-3 py-1 rounded-full text-sm font-medium">
          {fiveElement}
        </span>
      </div>

      {/* True Solar Time Info */}
      {trueSolarTime.difference !== 0 && (
        <div className="text-xs text-ink/50 mt-2">
          <p>真太陽時校正</p>
          <p className="text-primary">
            {trueSolarTime.original} → {trueSolarTime.corrected}
          </p>
          <p>({formatTimeDifference(trueSolarTime.difference)})</p>
        </div>
      )}

      {/* Birth place */}
      <p className="text-xs text-ink/50 mt-2">
        {birthData.birthPlace}
      </p>
    </div>
  )
}

// Helper functions for lunar date formatting
function getLunarMonthName(month: number): string {
  const monthNames = [
    '正月', '二月', '三月', '四月', '五月', '六月',
    '七月', '八月', '九月', '十月', '冬月', '臘月'
  ]
  return monthNames[month - 1] || `${month}月`
}

function getLunarDayName(day: number): string {
  const tens = ['初', '十', '廿', '三十']
  const ones = ['', '一', '二', '三', '四', '五', '六', '七', '八', '九', '十']

  if (day === 10) return '初十'
  if (day === 20) return '二十'
  if (day === 30) return '三十'

  const tenIndex = Math.floor(day / 10)
  const oneIndex = day % 10

  if (tenIndex === 0) {
    return `初${ones[oneIndex]}`
  } else if (tenIndex === 1) {
    return `十${ones[oneIndex]}`
  } else if (tenIndex === 2) {
    return `廿${ones[oneIndex]}`
  }

  return `${day}`
}
