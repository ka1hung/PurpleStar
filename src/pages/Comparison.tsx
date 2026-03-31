import { useState, useEffect } from 'react'
import { useAppStore } from '../store'
import { ComparisonList } from '../components/comparison/ComparisonList'
import { ComparisonForm } from '../components/comparison/ComparisonForm'
import { ComparisonView } from '../components/comparison/ComparisonView'

export function Comparison() {
  const { comparisons, currentComparison, setCurrentComparison } = useAppStore()
  const [showForm, setShowForm] = useState(false)

  // If a comparison is selected, show the view
  if (currentComparison) {
    return (
      <ComparisonView
        comparison={currentComparison}
        onBack={() => setCurrentComparison(null)}
      />
    )
  }

  // If form is open, show form
  if (showForm) {
    return (
      <ComparisonForm
        onClose={() => setShowForm(false)}
      />
    )
  }

  // Otherwise show list
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-primary text-center mb-12">
        合盤比較
      </h1>

      {comparisons.length === 0 ? (
        <div className="max-w-md mx-auto text-center bg-white rounded-lg shadow-classical p-12">
          <div className="text-5xl mb-4">✨</div>
          <h2 className="font-serif text-2xl text-primary mb-4">
            還沒有合盤組合
          </h2>
          <p className="text-ink/60 mb-8">
            為多個人的命盤進行比較，深入了解彼此的關係互動
          </p>
          <button
            onClick={() => setShowForm(true)}
            className="px-6 py-3 bg-primary text-cream rounded-classical
                       hover:bg-primary-dark transition-all font-medium"
          >
            ＋ 建立第一組合盤
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="font-serif text-2xl text-primary">
              合盤列表
            </h2>
            <button
              onClick={() => setShowForm(true)}
              className="px-4 py-2 bg-primary text-cream rounded-classical
                         hover:bg-primary-dark transition-all text-sm"
            >
              ＋ 新增合盤
            </button>
          </div>
          <ComparisonList
            comparisons={comparisons}
            onSelect={(comparison) => setCurrentComparison(comparison)}
          />
        </div>
      )}
    </div>
  )
}
