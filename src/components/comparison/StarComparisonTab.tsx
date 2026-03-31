import type { Chart, ChartComparison } from '../../types'

interface StarComparisonTabProps {
  comparison: ChartComparison
  charts: Chart[]
}

const mainStars = [
  '紫微',
  '天機',
  '太陽',
  '武曲',
  '天同',
  '廉貞',
  '天府',
  '太陰',
  '貪狼',
  '巨門',
  '天相',
  '天梁',
  '七殺',
  '破軍',
]

const palaceNames = [
  '命宮',
  '兄弟宮',
  '夫妻宮',
  '子女宮',
  '財帛宮',
  '疾厄宮',
  '遷移宮',
  '交友宮',
  '官祿宮',
  '田宅宮',
  '福德宮',
  '父母宮',
]

export function StarComparisonTab({
  comparison,
  charts,
}: StarComparisonTabProps) {
  const getMemberName = (chartId: string) => {
    const member = comparison.members.find((m) => m.chartId === chartId)
    if (!member) return '未命名'
    const chart = charts.find((c) => c.id === chartId)
    return member.label || chart?.birthData.name || '未命名'
  }

  const getStarPalace = (chart: Chart, starName: string) => {
    for (let i = 0; i < chart.palaces.length; i++) {
      const palace = chart.palaces[i]
      const star = palace.mainStars.find((s) => s.name === starName)
      if (star) {
        return {
          palace: palaceNames[i],
          brightness: star.brightness || '平',
          transformation: star.transformation,
        }
      }
    }
    return null
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-ink/60">
        💡 表格顯示 14 主星在各成員命盤中的落宮位置 · 便於比較同一星曜在不同人盤中的差異
      </div>

      {/* Desktop view - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/20">
              <th className="px-4 py-3 text-left font-medium text-ink border-r border-primary/10">
                星曜
              </th>
              {comparison.members.map((member) => (
                <th
                  key={member.chartId}
                  className="px-4 py-3 text-center font-medium text-ink border-r border-primary/10 min-w-56"
                >
                  {getMemberName(member.chartId)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mainStars.map((starName) => (
              <tr key={starName} className="border-b border-primary/10 hover:bg-cream/30">
                <td className="px-4 py-3 font-medium text-ink border-r border-primary/10 bg-cream/50 min-w-20">
                  {starName}
                </td>
                {comparison.members.map((member) => {
                  const chart = charts.find((c) => c.id === member.chartId)
                  if (!chart) {
                    return (
                      <td
                        key={member.chartId}
                        className="px-4 py-3 text-sm text-ink/40 border-r border-primary/10"
                      >
                        —
                      </td>
                    )
                  }

                  const result = getStarPalace(chart, starName)
                  if (!result) {
                    return (
                      <td
                        key={member.chartId}
                        className="px-4 py-3 text-sm text-ink/40 border-r border-primary/10"
                      >
                        —
                      </td>
                    )
                  }

                  return (
                    <td
                      key={member.chartId}
                      className="px-4 py-3 text-sm border-r border-primary/10"
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-ink">
                          {result.palace}
                        </div>
                        <div className="text-xs text-ink/60">
                          亮度：{result.brightness}
                        </div>
                        {result.transformation && (
                          <div className="text-xs text-gold font-medium">
                            {result.transformation}
                          </div>
                        )}
                      </div>
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile view - Cards */}
      <div className="lg:hidden space-y-4">
        {mainStars.map((starName) => (
          <div
            key={starName}
            className="bg-cream rounded-lg border border-primary/10 p-4"
          >
            <h3 className="font-medium text-ink mb-3">{starName}</h3>
            <div className="flex flex-wrap gap-4">
              {comparison.members.map((member) => {
                const chart = charts.find((c) => c.id === member.chartId)
                if (!chart) {
                  return (
                    <div
                      key={member.chartId}
                      className="flex-1 min-w-40"
                    >
                      <p className="text-xs font-medium text-ink/60 mb-1">
                        {getMemberName(member.chartId)}
                      </p>
                      <p className="text-sm text-ink/40">—</p>
                    </div>
                  )
                }

                const result = getStarPalace(chart, starName)
                if (!result) {
                  return (
                    <div
                      key={member.chartId}
                      className="flex-1 min-w-40"
                    >
                      <p className="text-xs font-medium text-ink/60 mb-1">
                        {getMemberName(member.chartId)}
                      </p>
                      <p className="text-sm text-ink/40">—</p>
                    </div>
                  )
                }

                return (
                  <div
                    key={member.chartId}
                    className="flex-1 min-w-40"
                  >
                    <p className="text-xs font-medium text-ink/60 mb-1">
                      {getMemberName(member.chartId)}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-ink">
                        {result.palace}
                      </p>
                      <p className="text-xs text-ink/60">
                        亮度：{result.brightness}
                      </p>
                      {result.transformation && (
                        <p className="text-xs text-gold font-medium">
                          {result.transformation}
                        </p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-ink/70">
        <p className="font-medium text-ink mb-2">快速對比技巧：</p>
        <ul className="space-y-1 ml-4 list-disc text-xs">
          <li>相同星曜在不同人盤中的落宮不同，代表該星在各人的影響面向不同</li>
          <li>同星同宮 → 性格或命運面向相似，容易共鳴或衝突</li>
          <li>四化星（化祿、化權、化科、化忌）最需要關注，代表能量轉化方向</li>
        </ul>
      </div>
    </div>
  )
}
