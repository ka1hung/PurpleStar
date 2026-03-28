import { useState } from 'react'
import { BirthDataForm } from '../components/form'
import { ChartGrid, ChartInterpretation } from '../components/chart'
import { ChatWindow } from '../components/chat'
import { calculateChart } from '../lib/ziwei'
import { useAppStore } from '../store'
import type { BirthData, Chart } from '../types'

export function Calculator() {
  const [chart, setChart] = useState<Chart | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const { charts, addChart, deleteChart } = useAppStore()

  const handleCalculate = async (birthData: BirthData) => {
    setIsCalculating(true)

    // Simulate loading for better UX
    await new Promise((resolve) => setTimeout(resolve, 800))

    try {
      const calculatedChart = calculateChart(birthData)
      setChart(calculatedChart)
      addChart(calculatedChart)
    } catch (error) {
      console.error('Chart calculation error:', error)
      alert('命盤計算發生錯誤，請檢查輸入資料')
    } finally {
      setIsCalculating(false)
    }
  }

  const handleReset = () => {
    setChart(null)
    setShowChat(false)
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-primary text-center mb-8">
        命盤計算
      </h1>

      {!chart ? (
        <div className="space-y-8">
          {/* Form */}
          <div className="bg-white rounded-lg shadow-classical p-8 max-w-xl mx-auto">
            <BirthDataForm onSubmit={handleCalculate} isLoading={isCalculating} />
          </div>

          {/* Saved Charts */}
          {charts.length > 0 && (
            <div className="max-w-xl mx-auto">
              <h2 className="font-serif text-xl text-primary mb-4">已儲存的命盤</h2>
              <div className="bg-white rounded-lg border border-primary/20 divide-y divide-primary/10">
                {charts.map((savedChart) => {
                  const birthDate = new Date(savedChart.birthData.birthDate) // Ensure it's a Date object
                  return (
                    <div
                      key={savedChart.id}
                      className="p-4 flex items-center justify-between hover:bg-cream/50 transition-colors"
                    >
                      <button
                        onClick={() => setChart(savedChart)}
                        className="flex-1 text-left"
                      >
                        <div className="font-medium text-ink">
                          {savedChart.birthData.name || '未命名'}
                          <span className="ml-2 text-sm text-ink/50">
                            ({savedChart.birthData.gender === 'male' ? '男' : '女'})
                          </span>
                        </div>
                        <div className="text-sm text-ink/60">
                          {birthDate.getFullYear()}年{birthDate.getMonth() + 1}月{birthDate.getDate()}日
                          {' '}{savedChart.birthData.birthTime}
                        </div>
                        <div className="text-xs text-primary/70 mt-1">
                          {savedChart.fiveElement} · 命宮{savedChart.palaces[savedChart.lifePalacePosition]?.branch}
                        </div>
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('確定要刪除這個命盤嗎？')) {
                            deleteChart(savedChart.id)
                          }
                        }}
                        className="ml-4 p-2 text-ink/40 hover:text-red-500 transition-colors"
                        title="刪除"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      ) : (
        // Show chart and chat
        <div className="space-y-8">
          {/* Action buttons */}
          <div className="flex justify-center gap-4">
            <button
              onClick={handleReset}
              className="px-6 py-2 border-2 border-primary text-primary rounded-classical
                         hover:bg-primary hover:text-cream transition-all"
            >
              重新排盤
            </button>
            <button
              onClick={() => setShowChat(!showChat)}
              className={`
                px-6 py-2 border-2 rounded-classical transition-all
                ${showChat
                  ? 'bg-gold border-gold text-ink'
                  : 'border-gold text-gold hover:bg-gold hover:text-ink'
                }
              `}
            >
              {showChat ? '隱藏 AI 諮詢' : 'AI 深度解盤'}
              <span className="ml-1 text-xs opacity-70">(進階)</span>
            </button>
          </div>


          {/* Chart */}
          <ChartGrid chart={chart} />

          {/* Basic Interpretation */}
          <div className="max-w-4xl mx-auto">
            <h2 className="font-serif text-2xl text-primary text-center mb-6">
              命盤解說
            </h2>
            <ChartInterpretation chart={chart} />
          </div>

        </div>
      )}

      {/* AI Chat Overlay */}
      {showChat && chart && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-primary/10">
              <h2 className="font-serif text-xl text-primary">
                AI 命理諮詢
                <span className="ml-2 text-sm bg-gold/20 text-gold-dark px-2 py-1 rounded">
                  進階功能
                </span>
              </h2>
              <button
                onClick={() => setShowChat(false)}
                className="p-2 text-ink/60 hover:text-ink hover:bg-ink/10 rounded-lg transition-all"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Chat content */}
            <div className="flex-1 overflow-hidden">
              <ChatWindow chart={chart} />
            </div>
          </div>
        </div>
      )}

      {/* Loading overlay */}
      {isCalculating && (
        <div className="fixed inset-0 bg-ink/50 flex items-center justify-center z-50">
          <div className="bg-cream rounded-lg p-8 text-center">
            <div className="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4" />
            <p className="font-serif text-xl text-primary">正在排列星曜...</p>
            <p className="text-ink/60 text-sm mt-2">天機即將揭曉</p>
          </div>
        </div>
      )}
    </div>
  )
}
