import { useAppStore } from '../../store'
import type { Chart, ChartComparison } from '../../types'

interface PalaceComparisonTabProps {
  comparison: ChartComparison
  charts: Chart[]
}

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

export function PalaceComparisonTab({
  comparison,
  charts,
}: PalaceComparisonTabProps) {
  const getMemberName = (chartId: string) => {
    const member = comparison.members.find((m) => m.chartId === chartId)
    if (!member) return '未命名'
    const chart = charts.find((c) => c.id === chartId)
    return member.label || chart?.birthData.name || '未命名'
  }

  return (
    <div className="space-y-6">
      <div className="text-sm text-ink/60">
        💡 表格顯示各宮位的主星 · 相同主星用亮色高亮 · 手機版可左右滑動
      </div>

      {/* Desktop view - Table */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-primary/5 border-b border-primary/20">
              <th className="px-4 py-3 text-left font-medium text-ink border-r border-primary/10">
                宮位
              </th>
              {comparison.members.map((member) => (
                <th
                  key={member.chartId}
                  className="px-4 py-3 text-center font-medium text-ink border-r border-primary/10 min-w-48"
                >
                  {getMemberName(member.chartId)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {palaceNames.map((palaceName, palaceIndex) => (
              <tr key={palaceIndex} className="border-b border-primary/10 hover:bg-cream/30">
                <td className="px-4 py-3 font-medium text-ink border-r border-primary/10 bg-cream/50">
                  {palaceName}
                </td>
                {comparison.members.map((member) => {
                  const chart = charts.find((c) => c.id === member.chartId)
                  if (!chart || !chart.palaces[palaceIndex]) {
                    return (
                      <td
                        key={member.chartId}
                        className="px-4 py-3 text-sm text-ink/40 border-r border-primary/10"
                      >
                        —
                      </td>
                    )
                  }

                  const palace = chart.palaces[palaceIndex]
                  const starNames = [
                    ...palace.mainStars.map((s) => s.name),
                  ].join(' ')
                  const transformations = [
                    ...palace.mainStars
                      .filter((s) => s.transformation)
                      .map((s) => s.transformation),
                  ].join(' ')

                  return (
                    <td
                      key={member.chartId}
                      className="px-4 py-3 text-sm border-r border-primary/10"
                    >
                      <div className="space-y-1">
                        <div className="font-medium text-ink">{starNames}</div>
                        {transformations && (
                          <div className="text-xs text-gold">
                            {transformations}
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
        {palaceNames.map((palaceName, palaceIndex) => (
          <div
            key={palaceIndex}
            className="bg-cream rounded-lg border border-primary/10 p-4 overflow-x-auto"
          >
            <h3 className="font-medium text-ink mb-3">{palaceName}</h3>
            <div className="flex flex-wrap gap-4">
              {comparison.members.map((member) => {
                const chart = charts.find((c) => c.id === member.chartId)
                if (!chart || !chart.palaces[palaceIndex]) {
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

                const palace = chart.palaces[palaceIndex]
                const starNames = [
                  ...palace.mainStars.map((s) => s.name),
                ].join(' ')
                const transformations = [
                  ...palace.mainStars
                    .filter((s) => s.transformation)
                    .map((s) => s.transformation),
                ].join(' ')

                return (
                  <div
                    key={member.chartId}
                    className="flex-1 min-w-40"
                  >
                    <p className="text-xs font-medium text-ink/60 mb-1">
                      {getMemberName(member.chartId)}
                    </p>
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-ink">{starNames}</p>
                      {transformations && (
                        <p className="text-xs text-gold">{transformations}</p>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary note */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-ink/70">
        <p>
          本表顯示各成員的命盤宮位資訊。對於不同關係，重點關注的宮位不同：
        </p>
        <ul className="mt-2 space-y-1 ml-4 list-disc text-xs">
          <li>
            <span className="font-medium">夫妻關係</span> → 看雙方「夫妻宮」
          </li>
          <li>
            <span className="font-medium">親子關係</span> → 看父母的「子女宮」對應子女的「父母宮」
          </li>
          <li>
            <span className="font-medium">手足關係</span> → 看雙方「兄弟宮」
          </li>
        </ul>
      </div>
    </div>
  )
}
