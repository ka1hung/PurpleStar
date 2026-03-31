import { useState, useEffect } from 'react'
import {
  getStorageStats,
  formatBytes,
  exportChatSessions,
  exportChatSessionsAsCSV,
  downloadFile,
  cleanupOldChats,
} from '../../lib/storage-utils'

export function StorageWarning() {
  const [stats, setStats] = useState(getStorageStats())
  const [showModal, setShowModal] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    // 每 10 秒檢查一次存儲空間
    const interval = setInterval(() => {
      setStats(getStorageStats())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  // 首次加載時檢查
  useEffect(() => {
    const newStats = getStorageStats()
    if (newStats.isNearLimit) {
      setShowModal(true)
    }
    setStats(newStats)
  }, [])

  const handleExportJSON = () => {
    setExporting(true)
    try {
      const content = exportChatSessions()
      if (content) {
        downloadFile(
          content,
          `purple-star-backup-${new Date().toISOString().split('T')[0]}.json`,
          'application/json'
        )
      }
    } finally {
      setExporting(false)
    }
  }

  const handleExportCSV = () => {
    setExporting(true)
    try {
      const content = exportChatSessionsAsCSV()
      if (content) {
        downloadFile(
          content,
          `purple-star-backup-${new Date().toISOString().split('T')[0]}.csv`,
          'text/csv'
        )
      }
    } finally {
      setExporting(false)
    }
  }

  const handleCleanup = () => {
    if (confirm('確定要刪除所有舊對話紀錄嗎？（保留最新 5 個對話）')) {
      cleanupOldChats(5)
      setStats(getStorageStats())
      setShowModal(false)
    }
  }

  if (!stats.isNearLimit) {
    return null
  }

  return (
    <>
      {/* Floating warning badge */}
      <button
        onClick={() => setShowModal(true)}
        className="fixed bottom-6 right-6 z-40 p-3 bg-red-500 text-white rounded-full shadow-lg hover:bg-red-600 transition-all"
        title="儲存空間警告"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4v2m0 6v-1m0-1v-6m0-4V6m0-1v1m8.657-9.657a8 8 0 11-11.314 0m11.314 0L12 3.172M12 3.172L3.172 12m16.656 0L12 20.828m0 0L3.172 12"
          />
        </svg>
      </button>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-ink/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-md w-full p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div>
                <h2 className="font-serif text-xl text-primary flex items-center gap-2">
                  <span>⚠️</span> 儲存空間即將滿載
                </h2>
                <p className="text-sm text-ink/60 mt-1">
                  建議備份對話紀錄後清除舊資料
                </p>
              </div>
              <button
                onClick={() => setShowModal(false)}
                className="text-ink/40 hover:text-ink"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Storage stats */}
            <div className="mb-6 p-4 bg-cream rounded-lg">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm text-ink/70">使用空間</span>
                <span className="font-medium text-ink">
                  {formatBytes(stats.usedBytes)} / {formatBytes(stats.limitBytes)}
                </span>
              </div>
              <div className="w-full bg-ink/10 rounded-full h-2">
                <div
                  className="bg-red-500 h-2 rounded-full transition-all"
                  style={{ width: `${stats.usagePercent}%` }}
                />
              </div>
              <p className="text-xs text-ink/60 mt-2">已使用 {stats.usagePercent}%</p>
            </div>

            {/* Actions */}
            <div className="space-y-3 mb-4">
              <p className="text-sm font-medium text-ink">備份對話紀錄：</p>

              <button
                onClick={handleExportJSON}
                disabled={exporting}
                className="w-full px-4 py-2 bg-primary text-cream rounded-classical hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                  />
                </svg>
                {exporting ? '處理中...' : '下載 JSON 備份'}
              </button>

              <button
                onClick={handleExportCSV}
                disabled={exporting}
                className="w-full px-4 py-2 bg-gold text-ink rounded-classical hover:bg-gold-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                {exporting ? '處理中...' : '下載 CSV 列表'}
              </button>
            </div>

            {/* Cleanup */}
            <div className="pt-4 border-t border-primary/10">
              <button
                onClick={handleCleanup}
                className="w-full px-4 py-2 border-2 border-red-500 text-red-500 rounded-classical hover:bg-red-500 hover:text-white transition-all"
              >
                清除舊對話（保留最新 5 個）
              </button>
              <p className="text-xs text-ink/60 mt-2 text-center">
                這將釋放約 {formatBytes(Math.max(0, stats.usedBytes - stats.limitBytes * 0.5))} 空間
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
