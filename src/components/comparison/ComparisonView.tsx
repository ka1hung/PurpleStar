import { useState } from 'react'
import { useAppStore } from '../../store'
import { OverviewTab } from './OverviewTab'
import { PalaceComparisonTab } from './PalaceComparisonTab'
import { StarComparisonTab } from './StarComparisonTab'
import { TransformationTab } from './TransformationTab'
import { ComparisonChatTab } from './ComparisonChatTab'
import type { ChartComparison } from '../../types'

type TabType = 'overview' | 'palace' | 'stars' | 'transformation' | 'ai'

interface ComparisonViewProps {
  comparison: ChartComparison
  onBack: () => void
}

export function ComparisonView({ comparison, onBack }: ComparisonViewProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const { charts } = useAppStore()

  // Verify all charts still exist
  const comparisonCharts = comparison.members
    .map((member) => charts.find((c) => c.id === member.chartId))
    .filter((c): c is typeof charts[0] => c !== undefined)

  if (comparisonCharts.length < comparison.members.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary-dark mb-4 flex items-center gap-2"
        >
          ← 返回
        </button>
        <div className="bg-red-50 border border-red-200 rounded-lg p-8 text-center">
          <p className="text-red-700">
            此合盤中的某些命盤已被刪除，無法顯示。
          </p>
          <button
            onClick={onBack}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-classical
                       hover:bg-red-700 transition-all"
          >
            返回列表
          </button>
        </div>
      </div>
    )
  }

  const tabs: {
    id: TabType
    label: string
    icon: string
  }[] = [
    { id: 'overview', label: '總覽', icon: '👥' },
    { id: 'palace', label: '宮位對照', icon: '📊' },
    { id: 'stars', label: '星曜對照', icon: '⭐' },
    { id: 'transformation', label: '四化對照', icon: '🔄' },
    { id: 'ai', label: 'AI 合盤', icon: '🤖' },
  ]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header with back button and title */}
      <div className="mb-8">
        <button
          onClick={onBack}
          className="text-primary hover:text-primary-dark mb-4 flex items-center gap-2"
        >
          ← 返回列表
        </button>
        <h1 className="font-serif text-4xl text-primary">{comparison.name}</h1>
        <p className="text-ink/60 mt-2">
          {comparison.members.length} 人合盤
        </p>
      </div>

      {/* Tab navigation */}
      <div className="bg-white rounded-t-lg border-b border-primary/10 mb-0">
        <div className="flex overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`
                flex-1 sm:flex-none px-6 sm:px-8 py-4 font-medium transition-all
                border-b-2 whitespace-nowrap
                ${
                  activeTab === tab.id
                    ? 'border-primary text-primary'
                    : 'border-transparent text-ink/60 hover:text-ink'
                }
              `}
            >
              <span className="mr-2">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab content */}
      <div className="bg-white rounded-b-lg shadow-classical p-8">
        {activeTab === 'overview' && (
          <OverviewTab comparison={comparison} charts={comparisonCharts} />
        )}
        {activeTab === 'palace' && (
          <PalaceComparisonTab comparison={comparison} charts={comparisonCharts} />
        )}
        {activeTab === 'stars' && (
          <StarComparisonTab comparison={comparison} charts={comparisonCharts} />
        )}
        {activeTab === 'transformation' && (
          <TransformationTab comparison={comparison} charts={comparisonCharts} />
        )}
        {activeTab === 'ai' && (
          <ComparisonChatTab comparison={comparison} charts={comparisonCharts} />
        )}
      </div>
    </div>
  )
}
