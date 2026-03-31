import { useState } from 'react'
import { useAppStore } from '../../store'
import type { ChartComparison, ComparisonMember, FamilyRole } from '../../types'

const familyRoles: { value: FamilyRole; label: string }[] = [
  { value: 'self', label: '本人' },
  { value: 'spouse', label: '配偶' },
  { value: 'father', label: '父親' },
  { value: 'mother', label: '母親' },
  { value: 'son', label: '兒子' },
  { value: 'daughter', label: '女兒' },
  { value: 'sibling', label: '兄弟姐妹' },
  { value: 'partner', label: '合作夥伴' },
  { value: 'friend', label: '朋友' },
  { value: 'other', label: '其他' },
]

interface ComparisonFormProps {
  onClose: () => void
}

export function ComparisonForm({ onClose }: ComparisonFormProps) {
  const { charts, addComparison } = useAppStore()
  const [name, setName] = useState('')
  const [selectedCharts, setSelectedCharts] = useState<Map<string, FamilyRole>>(
    new Map()
  )
  const [labels, setLabels] = useState<Map<string, string>>(new Map())
  const [error, setError] = useState('')

  const handleChartSelect = (chartId: string, checked: boolean) => {
    const newSelected = new Map(selectedCharts)
    if (checked) {
      newSelected.set(chartId, 'other')
    } else {
      newSelected.delete(chartId)
    }
    setSelectedCharts(newSelected)
    setError('')
  }

  const handleRoleChange = (chartId: string, role: FamilyRole) => {
    const newSelected = new Map(selectedCharts)
    newSelected.set(chartId, role)
    setSelectedCharts(newSelected)
  }

  const handleLabelChange = (chartId: string, label: string) => {
    const newLabels = new Map(labels)
    if (label) {
      newLabels.set(chartId, label)
    } else {
      newLabels.delete(chartId)
    }
    setLabels(newLabels)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      setError('請輸入合盤名稱')
      return
    }

    if (selectedCharts.size < 2) {
      setError('至少需要選擇 2 人進行合盤')
      return
    }

    const members: ComparisonMember[] = Array.from(selectedCharts.entries()).map(
      ([chartId, role]) => ({
        chartId,
        role,
        label: labels.get(chartId),
      })
    )

    const comparison: ChartComparison = {
      id: `comp-${Date.now()}`,
      name: name.trim(),
      members,
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    addComparison(comparison)
    onClose()
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-lg shadow-classical p-8">
        <div className="mb-8">
          <button
            onClick={onClose}
            className="text-primary hover:text-primary-dark mb-4 flex items-center gap-2"
          >
            ← 返回
          </button>
          <h1 className="font-serif text-3xl text-primary">
            建立新合盤
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name input */}
          <div>
            <label className="block text-sm font-medium text-ink mb-2">
              合盤名稱
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="例如：我和老婆、我們一家四口"
              className="w-full px-4 py-2 border border-primary/20 rounded-classical
                         focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>

          {/* Error message */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-classical text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Chart selection */}
          <div>
            <label className="block text-sm font-medium text-ink mb-3">
              選擇成員（至少 2 人）
            </label>
            {charts.length === 0 ? (
              <div className="p-4 bg-cream rounded-classical text-center text-ink/60">
                還沒有任何命盤。請先去
                <a href="#/calculator" className="text-primary hover:underline mx-1">
                  排盤計算
                </a>
                建立命盤。
              </div>
            ) : (
              <div className="space-y-4 max-h-96 overflow-y-auto">
                {charts.map((chart) => (
                  <div
                    key={chart.id}
                    className="p-4 border border-primary/10 rounded-classical"
                  >
                    <div className="flex items-start gap-4">
                      <input
                        type="checkbox"
                        checked={selectedCharts.has(chart.id)}
                        onChange={(e) =>
                          handleChartSelect(chart.id, e.target.checked)
                        }
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium text-ink">
                          {chart.birthData.name || '未命名'}
                          <span className="ml-2 text-sm text-ink/50">
                            ({chart.birthData.gender === 'male' ? '男' : '女'})
                          </span>
                        </h3>
                        <p className="text-sm text-ink/60">
                          {new Date(chart.birthData.birthDate).toLocaleDateString('zh-TW')}
                          {' '}
                          {chart.birthData.birthTime}
                        </p>
                      </div>

                      {selectedCharts.has(chart.id) && (
                        <div className="space-y-2 w-64">
                          <div>
                            <label className="text-xs text-ink/60">角色</label>
                            <select
                              value={selectedCharts.get(chart.id) || 'other'}
                              onChange={(e) =>
                                handleRoleChange(chart.id, e.target.value as FamilyRole)
                              }
                              className="w-full px-3 py-1 text-sm border border-primary/20
                                         rounded-classical focus:outline-none focus:ring-1
                                         focus:ring-primary/30"
                            >
                              {familyRoles.map((role) => (
                                <option key={role.value} value={role.value}>
                                  {role.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-ink/60">
                              標籤（選填，用以區分同角色）
                            </label>
                            <input
                              type="text"
                              value={labels.get(chart.id) || ''}
                              onChange={(e) =>
                                handleLabelChange(chart.id, e.target.value)
                              }
                              placeholder="例如：大女兒、小女兒"
                              className="w-full px-3 py-1 text-sm border border-primary/20
                                         rounded-classical focus:outline-none focus:ring-1
                                         focus:ring-primary/30"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Summary */}
          <div className="p-4 bg-cream rounded-classical">
            <div className="text-sm text-ink/70">
              已選擇：<span className="font-medium">{selectedCharts.size}</span> 人
            </div>
          </div>

          {/* Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-2 border-2 border-primary text-primary rounded-classical
                         hover:bg-primary hover:text-cream transition-all"
            >
              取消
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-2 bg-primary text-cream rounded-classical
                         hover:bg-primary-dark transition-all font-medium"
            >
              確認建立
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
