import type { Chart, ChartComparison } from '../../types'

interface TransformationTabProps {
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

export function TransformationTab({
  comparison,
  charts,
}: TransformationTabProps) {
  const getMemberName = (chartId: string) => {
    const member = comparison.members.find((m) => m.chartId === chartId)
    if (!member) return '未命名'
    const chart = charts.find((c) => c.id === chartId)
    return member.label || chart?.birthData.name || '未命名'
  }

  const getTransformations = (chart: Chart) => {
    const transformationMap: Record<string, string[]> = {
      化祿: [],
      化權: [],
      化科: [],
      化忌: [],
    }

    chart.palaces.forEach((palace, index) => {
      palace.mainStars.forEach((star) => {
        if (star.transformation) {
          const palace名 = palaceNames[index]
          transformationMap[star.transformation].push(
            `${star.name}(${palace名})`
          )
        }
      })
    })

    return transformationMap
  }

  const getDecadalTransformations = (chart: Chart) => {
    // 簡化版：顯示當前大限的四化
    // 實際應用中可能需要根據使用者年齡計算
    const transformations: Record<string, string> = {
      化祿: '—',
      化權: '—',
      化科: '—',
      化忌: '—',
    }
    return transformations
  }

  return (
    <div className="space-y-8">
      <div className="text-sm text-ink/60">
        💡 四化星代表命盤中的能量轉化方向 · 交叉分析時看一人的四化落在另一人的哪個宮位
      </div>

      {/* Section 1: 生年四化 */}
      <div>
        <h3 className="font-serif text-lg text-primary mb-4">生年四化</h3>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-primary/5 border-b border-primary/20">
                <th className="px-4 py-3 text-left font-medium text-ink border-r border-primary/10 min-w-24">
                  四化類型
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
              {['化祿', '化權', '化科', '化忌'].map((transformationType) => (
                <tr key={transformationType} className="border-b border-primary/10 hover:bg-cream/30">
                  <td
                    className={`px-4 py-3 font-medium border-r border-primary/10 bg-cream/50 ${
                      transformationType === '化祿'
                        ? 'text-green-700'
                        : transformationType === '化權'
                          ? 'text-amber-700'
                          : transformationType === '化科'
                            ? 'text-blue-700'
                            : 'text-red-700'
                    }`}
                  >
                    {transformationType}
                  </td>
                  {comparison.members.map((member) => {
                    const chart = charts.find((c) => c.id === member.chartId)
                    if (!chart) {
                      return (
                        <td
                          key={member.chartId}
                          className="px-4 py-3 text-sm border-r border-primary/10 text-ink/40"
                        >
                          —
                        </td>
                      )
                    }

                    const transformations = getTransformations(chart)
                    const stars = transformations[transformationType] || []

                    return (
                      <td
                        key={member.chartId}
                        className="px-4 py-3 text-sm border-r border-primary/10"
                      >
                        {stars.length === 0 ? (
                          <span className="text-ink/40">—</span>
                        ) : (
                          <div className="space-y-1">
                            {stars.map((star, idx) => (
                              <div key={idx} className="text-ink">
                                {star}
                              </div>
                            ))}
                          </div>
                        )}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Section 2: 交叉分析提示 */}
      <div className="bg-cream rounded-lg p-6 border border-primary/10">
        <h3 className="font-serif text-lg text-primary mb-4">交叉分析：四化飛星</h3>
        <div className="space-y-4">
          {comparison.members.length === 2 && (
            <>
              <div>
                <p className="text-sm font-medium text-ink mb-2">
                  {getMemberName(comparison.members[0].chartId)} 的四化對 {getMemberName(comparison.members[1].chartId)} 的影響：
                </p>
                <div className="bg-white border border-primary/10 rounded p-4 text-sm space-y-2 text-ink/70">
                  <p>
                    • <span className="font-medium">化祿</span> → 帶來好運、機會、滿足感
                  </p>
                  <p>
                    • <span className="font-medium">化權</span> → 帶來主導權、競爭、掌控力
                  </p>
                  <p>
                    • <span className="font-medium">化科</span> → 帶來名聲、表現、才華展露
                  </p>
                  <p>
                    • <span className="font-medium">化忌</span> → 帶來挑戰、阻礙、需要面對課題
                  </p>
                </div>
              </div>
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded text-sm text-yellow-900">
                <p className="font-medium mb-2">關鍵：</p>
                <p>
                  若對方的夫妻宮、官祿宮、財帛宮有您的化忌星，需要特別注意溝通與相處方式。相反，化祿落在對方重點宮位，則能帶來加分。
                </p>
              </div>
            </>
          )}
          {comparison.members.length > 2 && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded text-sm text-blue-900">
              <p className="font-medium mb-2">多人合盤提示：</p>
              <p>
                建議您在 AI 對話中詢問「XXX 和 YYY 之間的四化互動如何？」，AI 會為您進行深入的交叉分析。
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Section 3: 詳細解析說明 */}
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg text-sm text-ink/70">
        <p className="font-medium text-ink mb-2">細節解析：</p>
        <ul className="space-y-1 ml-4 list-disc text-xs">
          <li>
            <span className="font-medium">化祿在夫妻宮</span> → 感情甜蜜、物質豐裕
          </li>
          <li>
            <span className="font-medium">化忌在官祿宮</span> → 工作阻力、競爭激烈
          </li>
          <li>
            <span className="font-medium">化權在財帛宮</span> → 財務掌控力強、易於積累
          </li>
          <li>
            <span className="font-medium">化科在命宮</span> → 才華表現、名聲好
          </li>
        </ul>
      </div>
    </div>
  )
}
