import { useAppStore } from '../../store'
import type { ChartComparison } from '../../types'

interface ComparisonListProps {
  comparisons: ChartComparison[]
  onSelect: (comparison: ChartComparison) => void
}

export function ComparisonList({ comparisons, onSelect }: ComparisonListProps) {
  const { deleteComparison, charts } = useAppStore()

  const getMemberName = (chartId: string) => {
    const chart = charts.find((c) => c.id === chartId)
    return chart?.birthData.name || '未命名'
  }

  const getMemberCount = (comparison: ChartComparison) => {
    return comparison.members.length
  }

  const handleDelete = (e: React.MouseEvent, comparisonId: string) => {
    e.stopPropagation()
    if (confirm('確定要刪除這個合盤組合嗎？')) {
      deleteComparison(comparisonId)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-primary/20 divide-y divide-primary/10 shadow-classical">
      {comparisons.map((comparison) => (
        <div
          key={comparison.id}
          onClick={() => onSelect(comparison)}
          className="p-6 flex items-center justify-between hover:bg-cream/50
                     transition-colors cursor-pointer"
        >
          <div className="flex-1">
            <div className="inline-block mb-2">
              {comparison.members.length === 2 && <span className="text-2xl">👥</span>}
              {comparison.members.length === 3 && <span className="text-2xl">👨‍👩‍👧</span>}
              {comparison.members.length === 4 && <span className="text-2xl">👨‍👩‍👧‍👦</span>}
              {comparison.members.length > 4 && <span className="text-2xl">👨‍👩‍👧‍👦</span>}
            </div>
            <h3 className="font-medium text-ink text-lg">
              {comparison.name}
            </h3>
            <div className="text-sm text-ink/60 mt-2 space-y-1">
              <div>
                成員數：{getMemberCount(comparison)} 人 —{' '}
                {comparison.members
                  .slice(0, 2)
                  .map((m) => {
                    const chart = charts.find((c) => c.id === m.chartId)
                    return m.label || chart?.birthData.name || '未命名'
                  })
                  .join('、')}
                {comparison.members.length > 2 && '...'}
              </div>
              <div>
                建立於：{new Date(comparison.createdAt).toLocaleDateString('zh-TW')}
              </div>
            </div>
          </div>
          <button
            onClick={(e) => handleDelete(e, comparison.id)}
            className="ml-4 p-2 text-ink/40 hover:text-red-500 transition-colors"
            title="刪除"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      ))}
    </div>
  )
}
