import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { BirthDataForm } from '../components/form'
import { ChartGrid } from '../components/chart'
import { ChatWindow } from '../components/chat'
import { calculateChart } from '../lib/ziwei'
import { useAppStore } from '../store'
import type { BirthData, Chart } from '../types'

export function Calculator() {
  const { t } = useTranslation()
  const [chart, setChart] = useState<Chart | null>(null)
  const [isCalculating, setIsCalculating] = useState(false)
  const [showChat, setShowChat] = useState(false)
  const { addChart } = useAppStore()

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
        {t('calculator.title')}
      </h1>

      {!chart ? (
        // Show form
        <div className="bg-white rounded-lg shadow-classical p-8 max-w-xl mx-auto">
          <BirthDataForm onSubmit={handleCalculate} isLoading={isCalculating} />
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
              {showChat ? '隱藏諮詢' : 'AI 命理諮詢'}
            </button>
          </div>

          {/* True Solar Time Notice */}
          {chart.trueSolarTime.difference !== 0 && (
            <div className="max-w-2xl mx-auto bg-gold/10 border border-gold/30 rounded-lg p-4 text-center">
              <p className="text-sm text-ink/70">
                <span className="font-medium text-gold-dark">真太陽時校正已啟用</span>
                <br />
                標準時間 {chart.trueSolarTime.original} → 真太陽時 {chart.trueSolarTime.corrected}
                <br />
                <span className="text-xs text-ink/50">
                  (校正 {chart.trueSolarTime.difference > 0 ? '+' : ''}{chart.trueSolarTime.difference} 分鐘)
                </span>
              </p>
            </div>
          )}

          {/* Chart */}
          <ChartGrid chart={chart} />

          {/* AI Chat */}
          {showChat && (
            <div className="max-w-4xl mx-auto">
              <h2 className="font-serif text-2xl text-primary text-center mb-6">
                {t('chat.title')}
              </h2>
              <ChatWindow chart={chart} />
            </div>
          )}
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
