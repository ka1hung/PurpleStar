import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { ComparisonChatTab } from '../components/comparison/ComparisonChatTab'

export function ComparisonChatPage() {
  const { comparisonId } = useParams<{ comparisonId: string }>()
  const navigate = useNavigate()
  const { comparisons, charts, setCurrentComparison } = useAppStore()
  const comparison = comparisons.find((c) => c.id === comparisonId)

  // Verify all charts still exist for this comparison
  const comparisonCharts = comparison
    ? comparison.members
        .map((m) => charts.find((c) => c.id === m.chartId))
        .filter((c): c is NonNullable<typeof c> => c !== undefined)
    : []

  const isValid =
    !!comparison && comparisonCharts.length === comparison.members.length

  useEffect(() => {
    if (!isValid) {
      navigate('/comparison', { replace: true })
    }
  }, [isValid, navigate])

  if (!comparison || !isValid) return null

  const handleBack = () => {
    // Restore the comparison view when returning to /comparison
    setCurrentComparison(comparison)
    if (window.history.length > 1) navigate(-1)
    else navigate('/comparison')
  }

  return (
    <div className="h-screen-safe flex flex-col bg-cream overflow-hidden">
      {/* Top bar */}
      <div className="flex items-center gap-2 px-3 py-2 bg-white border-b border-primary/10 pt-safe flex-shrink-0">
        <button
          onClick={handleBack}
          aria-label="返回"
          className="p-2 rounded-classical text-ink/60 hover:text-primary hover:bg-cream/50 transition-all"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="flex-1 min-w-0">
          <p className="font-medium text-ink truncate leading-tight">
            {comparison.name}
          </p>
          <p className="text-xs text-ink/50 truncate">
            {comparison.members.length} 人合盤 · AI 諮詢
          </p>
        </div>
      </div>

      {/* Chat fills the remaining viewport */}
      <div className="flex-1 min-h-0">
        <ComparisonChatTab comparison={comparison} charts={comparisonCharts} />
      </div>
    </div>
  )
}
