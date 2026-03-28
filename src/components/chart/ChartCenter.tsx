import type { Chart } from '../../types'

interface ChartCenterProps {
  chart: Chart
}

export function ChartCenter({ chart }: ChartCenterProps) {
  const { birthData, lunarDate, fiveElement, zodiac, sign, mingZhu, shenZhu, time, timeRange } = chart

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
          {new Date(birthData.birthDate).toLocaleDateString('zh-TW', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>

        {/* Lunar date */}
        <p className="text-ink font-medium">
          {lunarDateStr}
        </p>

        {/* Time with range */}
        <p className="text-ink/70">
          {time || lunarDate.hourGanZhi}時
          {timeRange && <span className="text-xs ml-1">({timeRange})</span>}
        </p>

        {/* Gender & Zodiac & Sign */}
        <p className="text-ink/70">
          {birthData.gender === 'male' ? '男' : '女'}
          {zodiac && <span className="ml-2">屬{zodiac}</span>}
          {sign && <span className="ml-2">{sign}</span>}
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

      {/* Ming Zhu & Shen Zhu */}
      {(mingZhu || shenZhu) && (
        <div className="text-xs text-ink/70 space-x-3">
          {mingZhu && <span>命主: {mingZhu}</span>}
          {shenZhu && <span>身主: {shenZhu}</span>}
        </div>
      )}
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
