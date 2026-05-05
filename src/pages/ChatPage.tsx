import { useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAppStore } from '../store'
import { ChatWindow } from '../components/chat'

export function ChatPage() {
  const { chartId } = useParams<{ chartId: string }>()
  const navigate = useNavigate()
  const charts = useAppStore((s) => s.charts)
  const chart = charts.find((c) => c.id === chartId)

  useEffect(() => {
    if (!chart) {
      navigate('/calculator', { replace: true })
    }
  }, [chart, navigate])

  if (!chart) return null

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1)
    else navigate('/calculator')
  }

  const birthDate = new Date(chart.birthData.birthDate)

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
            {chart.birthData.name || '未命名'}
            <span className="ml-2 text-xs text-ink/50 font-normal">
              ({chart.birthData.gender === 'male' ? '男' : '女'})
            </span>
          </p>
          <p className="text-xs text-ink/50 truncate">
            {birthDate.getFullYear()}年{birthDate.getMonth() + 1}月{birthDate.getDate()}日 {chart.birthData.birthTime} · AI 命理諮詢
          </p>
        </div>
      </div>

      {/* Chat fills the remaining viewport */}
      <div className="flex-1 min-h-0">
        <ChatWindow chart={chart} />
      </div>
    </div>
  )
}
