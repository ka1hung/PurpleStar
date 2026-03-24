import { useState } from 'react'
import type { Chart } from '../../types'
import {
  MAIN_STAR_INTERPRETATIONS,
  PALACE_INTERPRETATIONS,
  TRANSFORMATION_INTERPRETATIONS,
  AUXILIARY_STAR_INTERPRETATIONS,
  HARMFUL_STAR_INTERPRETATIONS,
  MINGZHU_INTERPRETATIONS,
  SHENZHU_INTERPRETATIONS,
  generateBasicInterpretation,
} from '../../data/interpretations'

interface ChartInterpretationProps {
  chart: Chart
}

type TabType = 'overview' | 'palaces' | 'stars'

export function ChartInterpretation({ chart }: ChartInterpretationProps) {
  const [activeTab, setActiveTab] = useState<TabType>('overview')
  const [expandedPalace, setExpandedPalace] = useState<string | null>(null)

  // Find life palace
  const lifePalace = chart.palaces.find(p => p.name === '命宮')
  const lifePalaceMainStars = lifePalace?.mainStars.map(s => s.name) || []

  // Generate basic interpretation
  const basicInterpretation = generateBasicInterpretation(
    lifePalaceMainStars,
    chart.mingZhu,
    chart.shenZhu,
    chart.fiveElement
  )

  const tabs: { id: TabType; label: string }[] = [
    { id: 'overview', label: '命盤總覽' },
    { id: 'palaces', label: '十二宮解說' },
    { id: 'stars', label: '星曜解說' },
  ]

  return (
    <div className="bg-white rounded-lg shadow-classical overflow-hidden">
      {/* Tabs */}
      <div className="flex border-b border-primary/20">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 py-3 px-4 text-sm font-medium transition-colors
              ${activeTab === tab.id
                ? 'bg-primary text-cream border-b-2 border-gold'
                : 'text-ink/70 hover:bg-cream/50'
              }
            `}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === 'overview' && (
          <OverviewTab
            chart={chart}
            basicInterpretation={basicInterpretation}
            lifePalaceMainStars={lifePalaceMainStars}
          />
        )}
        {activeTab === 'palaces' && (
          <PalacesTab
            chart={chart}
            expandedPalace={expandedPalace}
            setExpandedPalace={setExpandedPalace}
          />
        )}
        {activeTab === 'stars' && <StarsTab chart={chart} />}
      </div>
    </div>
  )
}

function OverviewTab({
  chart,
  basicInterpretation,
  lifePalaceMainStars,
}: {
  chart: Chart
  basicInterpretation: string[]
  lifePalaceMainStars: string[]
}) {
  return (
    <div className="space-y-6">
      {/* Basic Info */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <InfoCard label="五行局" value={chart.fiveElement} />
        <InfoCard
          label="命宮"
          value={chart.palaces[chart.lifePalacePosition]?.branch || ''}
          subValue={lifePalaceMainStars.join('、') || '空宮'}
        />
        <InfoCard
          label="命主"
          value={chart.mingZhu || '-'}
        />
        <InfoCard
          label="身主"
          value={chart.shenZhu || '-'}
        />
      </div>

      {/* Main Interpretation */}
      <div className="bg-cream/50 rounded-lg p-5 space-y-3">
        <h3 className="font-serif text-lg text-primary font-medium">命盤基本解說</h3>
        <div className="text-ink/80 leading-relaxed space-y-2">
          {basicInterpretation.map((line, index) => (
            <p
              key={index}
              className={line.startsWith('【') ? 'font-medium text-primary mt-4 first:mt-0' : ''}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Transformations Summary */}
      <div>
        <h3 className="font-serif text-lg text-primary font-medium mb-3">本命四化</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {chart.palaces.flatMap(p => [
            ...p.mainStars.filter(s => s.transformation),
            ...p.auxiliaryStars.filter(s => s.transformation),
          ]).map((star, index) => (
            <div
              key={index}
              className={`
                p-3 rounded-lg text-center
                ${star.transformation === '化祿' ? 'bg-green-50 border border-green-200' : ''}
                ${star.transformation === '化權' ? 'bg-blue-50 border border-blue-200' : ''}
                ${star.transformation === '化科' ? 'bg-purple-50 border border-purple-200' : ''}
                ${star.transformation === '化忌' ? 'bg-red-50 border border-red-200' : ''}
              `}
            >
              <div className="font-medium">{star.name}</div>
              <div className={`text-sm ${
                star.transformation === '化祿' ? 'text-green-600' :
                star.transformation === '化權' ? 'text-blue-600' :
                star.transformation === '化科' ? 'text-purple-600' :
                'text-red-600'
              }`}>
                {star.transformation}
              </div>
              <div className="text-xs text-ink/60 mt-1">
                {TRANSFORMATION_INTERPRETATIONS[star.transformation!]?.meaning}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function PalacesTab({
  chart,
  expandedPalace,
  setExpandedPalace,
}: {
  chart: Chart
  expandedPalace: string | null
  setExpandedPalace: (palace: string | null) => void
}) {
  // Sort palaces in traditional order starting from 命宮
  const palaceOrder = ['命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄', '遷移', '交友', '官祿', '田宅', '福德', '父母']
  const sortedPalaces = [...chart.palaces].sort(
    (a, b) => palaceOrder.indexOf(a.name) - palaceOrder.indexOf(b.name)
  )

  return (
    <div className="space-y-3">
      {sortedPalaces.map(palace => {
        const isExpanded = expandedPalace === palace.name
        const palaceInfo = PALACE_INTERPRETATIONS[palace.name]
        const mainStarNames = palace.mainStars.map(s => s.name)

        return (
          <div
            key={palace.name}
            className="border border-primary/20 rounded-lg overflow-hidden"
          >
            <button
              onClick={() => setExpandedPalace(isExpanded ? null : palace.name)}
              className="w-full p-4 flex items-center justify-between hover:bg-cream/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="font-serif text-lg text-primary font-medium">
                  {palace.name}
                </span>
                <span className="text-sm text-ink/50">({palace.branch})</span>
                <span className="text-sm text-ink/70">
                  {mainStarNames.length > 0 ? mainStarNames.join('、') : '空宮'}
                </span>
              </div>
              <svg
                className={`w-5 h-5 text-ink/50 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isExpanded && (
              <div className="px-4 pb-4 space-y-3">
                <div className="text-sm text-ink/60 border-t border-primary/10 pt-3">
                  <strong>宮位意義：</strong>{palaceInfo?.meaning}
                </div>

                {/* Main Stars in this palace */}
                {palace.mainStars.length > 0 && (
                  <div className="space-y-2">
                    {palace.mainStars.map(star => {
                      const starInfo = MAIN_STAR_INTERPRETATIONS[star.name]
                      return (
                        <div key={star.name} className="bg-cream/50 rounded p-3">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-primary">{star.name}</span>
                            {star.transformation && (
                              <span className={`text-xs px-2 py-0.5 rounded ${
                                star.transformation === '化祿' ? 'bg-green-100 text-green-700' :
                                star.transformation === '化權' ? 'bg-blue-100 text-blue-700' :
                                star.transformation === '化科' ? 'bg-purple-100 text-purple-700' :
                                'bg-red-100 text-red-700'
                              }`}>
                                {star.transformation}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-ink/70">{starInfo?.description}</p>
                        </div>
                      )
                    })}
                  </div>
                )}

                {/* Auxiliary Stars */}
                {palace.auxiliaryStars.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-ink/70 mb-1">輔星：</div>
                    <div className="flex flex-wrap gap-2">
                      {palace.auxiliaryStars.map(star => (
                        <span
                          key={star.name}
                          className="text-sm bg-blue-50 text-blue-700 px-2 py-1 rounded"
                          title={AUXILIARY_STAR_INTERPRETATIONS[star.name]}
                        >
                          {star.name}
                          {star.transformation && ` (${star.transformation})`}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Harmful Stars */}
                {palace.harmfulStars.length > 0 && (
                  <div>
                    <div className="text-sm font-medium text-ink/70 mb-1">煞星：</div>
                    <div className="flex flex-wrap gap-2">
                      {palace.harmfulStars.map(star => (
                        <span
                          key={star.name}
                          className="text-sm bg-red-50 text-red-700 px-2 py-1 rounded"
                          title={HARMFUL_STAR_INTERPRETATIONS[star.name]}
                        >
                          {star.name}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Palace specific interpretation */}
                <div className="text-sm text-ink/60 pt-2 border-t border-primary/10">
                  <strong>此宮主看：</strong>
                  {palaceInfo?.aspects.join('、')}
                </div>
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

function StarsTab({ chart }: { chart: Chart }) {
  // Collect all unique main stars
  const allMainStars = new Set<string>()
  chart.palaces.forEach(p => {
    p.mainStars.forEach(s => allMainStars.add(s.name))
  })

  return (
    <div className="space-y-4">
      <p className="text-sm text-ink/60 mb-4">
        點擊星曜查看詳細解說。您的命盤中出現的主星以較亮的方式顯示。
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {Object.entries(MAIN_STAR_INTERPRETATIONS).map(([starName, info]) => {
          const isInChart = allMainStars.has(starName)
          const starInPalace = chart.palaces.find(p =>
            p.mainStars.some(s => s.name === starName)
          )
          const starData = starInPalace?.mainStars.find(s => s.name === starName)

          return (
            <details
              key={starName}
              className={`
                border rounded-lg overflow-hidden
                ${isInChart ? 'border-primary/30 bg-cream/30' : 'border-ink/10 opacity-60'}
              `}
            >
              <summary className="p-3 cursor-pointer hover:bg-cream/50 transition-colors">
                <span className="font-medium text-primary">{starName}</span>
                <span className="text-sm text-ink/50 ml-2">({info.nature} · {info.element})</span>
                {starData?.transformation && (
                  <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
                    starData.transformation === '化祿' ? 'bg-green-100 text-green-700' :
                    starData.transformation === '化權' ? 'bg-blue-100 text-blue-700' :
                    starData.transformation === '化科' ? 'bg-purple-100 text-purple-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {starData.transformation}
                  </span>
                )}
                {isInChart && starInPalace && (
                  <span className="text-xs text-ink/50 ml-2">
                    在 {starInPalace.name}
                  </span>
                )}
              </summary>
              <div className="px-3 pb-3 text-sm space-y-2">
                <p className="text-ink/80">{info.description}</p>
                <div>
                  <span className="text-green-600">優點：</span>
                  <span className="text-ink/70">{info.strengths.join('、')}</span>
                </div>
                <div>
                  <span className="text-orange-600">注意：</span>
                  <span className="text-ink/70">{info.weaknesses.join('、')}</span>
                </div>
                <div>
                  <span className="text-blue-600">事業：</span>
                  <span className="text-ink/70">{info.career}</span>
                </div>
                <div>
                  <span className="text-pink-600">感情：</span>
                  <span className="text-ink/70">{info.relationship}</span>
                </div>
              </div>
            </details>
          )
        })}
      </div>
    </div>
  )
}

function InfoCard({
  label,
  value,
  subValue,
}: {
  label: string
  value: string
  subValue?: string
}) {
  return (
    <div className="bg-cream/50 rounded-lg p-3 text-center">
      <div className="text-xs text-ink/50 mb-1">{label}</div>
      <div className="font-serif text-lg text-primary font-medium">{value}</div>
      {subValue && <div className="text-xs text-ink/60 mt-1">{subValue}</div>}
    </div>
  )
}
