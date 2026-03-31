/**
 * 儲存空間管理工具
 */

export interface StorageStats {
  usedBytes: number
  limitBytes: number
  usagePercent: number
  isNearLimit: boolean
}

/**
 * 計算 localStorage 使用量
 */
export function getStorageStats(): StorageStats {
  const limitBytes = 5 * 1024 * 1024 // 5MB
  let usedBytes = 0

  // 計算所有存儲的數據大小
  for (const key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      usedBytes += localStorage.getItem(key)?.length || 0
    }
  }

  const usagePercent = (usedBytes / limitBytes) * 100
  const isNearLimit = usagePercent > 80 // 超過 80% 視為接近上限

  return {
    usedBytes,
    limitBytes,
    usagePercent: Math.round(usagePercent),
    isNearLimit,
  }
}

/**
 * 格式化文件大小
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

/**
 * 導出所有對話紀錄為 JSON
 */
export function exportChatSessions(): string {
  const storageData = localStorage.getItem('purple-star-storage')
  if (!storageData) {
    return ''
  }

  try {
    const parsed = JSON.parse(storageData)
    const { chatSessions = [] } = parsed

    const exportData = {
      exportDate: new Date().toISOString(),
      totalSessions: chatSessions.length,
      sessions: chatSessions,
    }

    return JSON.stringify(exportData, null, 2)
  } catch (error) {
    console.error('Export error:', error)
    return ''
  }
}

/**
 * 導出為 CSV 格式（簡化版）
 */
export function exportChatSessionsAsCSV(): string {
  const storageData = localStorage.getItem('purple-star-storage')
  if (!storageData) {
    return ''
  }

  try {
    const parsed = JSON.parse(storageData)
    const { chatSessions = [] } = parsed

    let csv = '對話ID,命盤ID,合盤ID,命理師,訊息數,建立時間\n'

    chatSessions.forEach((session: any) => {
      const row = [
        `"${session.id}"`,
        `"${session.chartId || '-'}"`,
        `"${session.comparisonId || '-'}"`,
        `"${session.masterId}"`,
        session.messages?.length || 0,
        `"${new Date(session.createdAt).toLocaleString('zh-TW')}"`,
      ].join(',')
      csv += row + '\n'
    })

    return csv
  } catch (error) {
    console.error('CSV export error:', error)
    return ''
  }
}

/**
 * 下載檔案
 */
export function downloadFile(
  content: string,
  filename: string,
  mimeType: string = 'application/json'
): void {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * 刪除所有舊對話（保留最新N個）
 */
export function cleanupOldChats(keepCount: number = 5): void {
  const storageData = localStorage.getItem('purple-star-storage')
  if (!storageData) return

  try {
    const parsed = JSON.parse(storageData)
    const { chatSessions = [] } = parsed

    // 按建立時間排序，保留最新的 keepCount 個
    const sorted = [...chatSessions].sort(
      (a: any, b: any) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )

    const keptSessions = sorted.slice(0, keepCount)
    parsed.chatSessions = keptSessions

    localStorage.setItem('purple-star-storage', JSON.stringify(parsed))
  } catch (error) {
    console.error('Cleanup error:', error)
  }
}
