import { useState } from 'react'
import { ChartGrid } from '../chart/ChartGrid'
import type { Chart, ChartComparison } from '../../types'

interface OverviewTabProps {
  comparison: ChartComparison
  charts: Chart[]
}

export function OverviewTab({ comparison, charts }: OverviewTabProps) {
  const [expandedChart, setExpandedChart] = useState<string | null>(
    charts.length > 0 ? charts[0].id : null
  )

  // Generate relationships based on roles
  const generateRelationships = () => {
    const relationships: {
      label: string
      emoji: string
      member1: { id: string; name: string }
      member2: { id: string; name: string }
    }[] = []

    const members = comparison.members

    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const role1 = members[i].role
        const role2 = members[j].role
        const chart1 = charts.find((c) => c.id === members[i].chartId)
        const chart2 = charts.find((c) => c.id === members[j].chartId)

        if (!chart1 || !chart2) continue

        const name1 = members[i].label || chart1.birthData.name || '未命名'
        const name2 = members[j].label || chart2.birthData.name || '未命名'

        let label = ''
        let emoji = '🤝'

        // Determine relationship type
        if (
          (role1 === 'self' && role2 === 'spouse') ||
          (role1 === 'spouse' && role2 === 'self')
        ) {
          label = '夫妻'
          emoji = '💕'
        } else if (
          (role1 === 'self' && role2 === 'daughter') ||
          (role1 === 'daughter' && role2 === 'self') ||
          (role1 === 'mother' && role2 === 'son') ||
          (role1 === 'son' && role2 === 'mother') ||
          (role1 === 'father' && role2 === 'daughter') ||
          (role1 === 'daughter' && role2 === 'father')
        ) {
          label = '親子'
          emoji = '👨‍👧'
        } else if (
          (role1 === 'self' && role2 === 'son') ||
          (role1 === 'son' && role2 === 'self') ||
          (role1 === 'mother' && role2 === 'daughter') ||
          (role1 === 'daughter' && role2 === 'mother') ||
          (role1 === 'father' && role2 === 'son') ||
          (role1 === 'son' && role2 === 'father')
        ) {
          label = '親子'
          emoji = '👨‍👦'
        } else if (
          (role1 === 'daughter' && role2 === 'daughter') ||
          (role1 === 'son' && role2 === 'son') ||
          (role1 === 'sibling' && role2 === 'sibling')
        ) {
          label = '手足'
          emoji = '👧‍🤝‍👧'
        } else if (role1 === 'partner' || role2 === 'partner') {
          label = '合作'
          emoji = '💼'
        } else if (role1 === 'friend' || role2 === 'friend') {
          label = '朋友'
          emoji = '🤝'
        }

        relationships.push({
          label,
          emoji,
          member1: { id: members[i].chartId, name: name1 },
          member2: { id: members[j].chartId, name: name2 },
        })
      }
    }

    return relationships
  }

  const relationships = generateRelationships()

  return (
    <div className="space-y-8">
      {/* Member cards grid */}
      <div>
        <h2 className="font-serif text-xl text-primary mb-4">成員概況</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {comparison.members.map((member) => {
            const chart = charts.find((c) => c.id === member.chartId)
            if (!chart) return null

            const birthDate = new Date(chart.birthData.birthDate)

            return (
              <div
                key={member.chartId}
                className="bg-cream rounded-lg p-4 border border-primary/10
                           hover:border-primary/30 transition-all cursor-pointer
                           hover:shadow-classical"
                onClick={() => setExpandedChart(chart.id)}
              >
                <div className="text-2xl mb-2">
                  {member.role === 'self' && '👨'}
                  {member.role === 'spouse' && '👩'}
                  {member.role === 'father' && '👨‍🦳'}
                  {member.role === 'mother' && '👩‍🦳'}
                  {member.role === 'son' && '👦'}
                  {member.role === 'daughter' && '👧'}
                  {(member.role === 'sibling' || member.role === 'friend' || member.role === 'partner') &&
                    '👤'}
                  {member.role === 'other' && '🔮'}
                </div>
                <h3 className="font-medium text-ink">
                  {member.label ||
                    chart.birthData.name ||
                    '未命名'}
                </h3>
                <p className="text-xs text-ink/60">
                  {chart.birthData.gender === 'male' ? '男' : '女'} · {birthDate.getFullYear()}
                  年
                </p>
                <div className="mt-3 pt-3 border-t border-primary/10 space-y-1">
                  <p className="text-xs text-primary font-medium">
                    {chart.fiveElement}
                  </p>
                  <p className="text-xs text-ink/70">
                    命宮主星：{chart.mingZhu}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setExpandedChart(chart.id)
                  }}
                  className="w-full mt-3 px-3 py-1.5 text-xs bg-primary text-cream
                             rounded-classical hover:bg-primary-dark transition-all"
                >
                  檢視命盤
                </button>
              </div>
            )
          })}
        </div>
      </div>

      {/* Expanded chart view */}
      {expandedChart && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-serif text-xl text-primary">完整命盤</h2>
            <button
              onClick={() => setExpandedChart(null)}
              className="text-primary hover:text-primary-dark"
            >
              ✕
            </button>
          </div>
          {charts
            .filter((c) => c.id === expandedChart)
            .map((chart) => (
              <div key={chart.id} className="overflow-x-auto">
                <ChartGrid chart={chart} />
              </div>
            ))}
        </div>
      )}

      {/* Relationships network */}
      <div>
        <h2 className="font-serif text-xl text-primary mb-4">關係網絡</h2>
        <div className="flex flex-wrap gap-3">
          {relationships.map((rel, idx) => (
            <button
              key={idx}
              className="px-4 py-2 bg-cream border border-primary/20 rounded-full
                         text-sm font-medium text-ink hover:border-primary/40
                         hover:bg-primary/5 transition-all"
            >
              <span>{rel.emoji}</span>
              <span className="ml-2">{rel.label}</span>
            </button>
          ))}
        </div>
        {relationships.length === 0 && (
          <p className="text-ink/60">無法推導出明確的關係類型</p>
        )}
      </div>
    </div>
  )
}
