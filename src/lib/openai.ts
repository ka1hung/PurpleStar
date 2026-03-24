import type { Chart, MasterType } from '../types'
import { getMasterById } from '../data/prompts'

/**
 * Format chart data for AI context
 */
export function formatChartForAI(chart: Chart): string {
  const { birthData, lunarDate, fiveElement, palaces, trueSolarTime } = chart

  // Find life palace
  const lifePalace = palaces.find(p => p.name === '命宮')
  const lifePalaceStars = lifePalace
    ? [
        ...lifePalace.mainStars.map(s => s.name + (s.transformation ? `(${s.transformation})` : '')),
        ...lifePalace.auxiliaryStars.map(s => s.name),
      ].join('、')
    : '無'

  // Build palace summary
  const palaceSummary = palaces
    .map(p => {
      const stars = [
        ...p.mainStars.map(s => s.name + (s.transformation ? `(${s.transformation})` : '')),
        ...p.auxiliaryStars.map(s => s.name),
        ...p.harmfulStars.map(s => s.name),
      ].join('、')
      return `${p.name}(${p.branch}): ${stars || '空宮'}`
    })
    .join('\n')

  return `
【命盤資料】
姓名：${birthData.name || '未提供'}
性別：${birthData.gender === 'male' ? '男' : '女'}
出生時間：${birthData.birthDate.toLocaleDateString('zh-TW')} ${trueSolarTime.corrected}（已真太陽時校正）
農曆：${lunarDate.yearGanZhi}年 ${lunarDate.month}月 ${lunarDate.day}日 ${lunarDate.hourGanZhi}
出生地：${birthData.birthPlace}
五行局：${fiveElement}

【命宮主星】
${lifePalaceStars}

【十二宮概覽】
${palaceSummary}
`.trim()
}

/**
 * Build system prompt for AI chat
 */
export function buildSystemPrompt(masterId: MasterType, chartContext: string): string {
  const master = getMasterById(masterId)

  return `${master.prompt}

你現在正在為一位問命者解讀紫微斗數命盤。以下是他/她的命盤資料：

${chartContext}

請根據以上命盤資料，以你的風格為問命者解答問題。
記住：
1. 始終保持你的角色風格
2. 基於命盤資料給出有依據的分析
3. 適時提醒命理僅供參考
4. 對於健康、法律、投資等敏感問題，要提醒諮詢專業人士
`
}

export interface ChatConfig {
  apiEndpoint: string
  apiKey: string
  apiModel: string
}

/**
 * Send message to OpenAI-compatible API
 */
export async function sendChatMessage(
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>,
  config: ChatConfig,
  onStream?: (text: string) => void
): Promise<string> {
  const { apiEndpoint, apiKey, apiModel } = config
  const isAnthropic = apiEndpoint.includes('anthropic')

  // Build request based on API type
  let url: string
  let headers: Record<string, string>
  let body: string

  if (isAnthropic) {
    // Anthropic API format
    url = `${apiEndpoint}/v1/messages`
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    }
    // Convert messages format for Anthropic
    const systemMsg = messages.find(m => m.role === 'system')
    const chatMsgs = messages.filter(m => m.role !== 'system')
    body = JSON.stringify({
      model: apiModel,
      max_tokens: 2000,
      system: systemMsg?.content || '',
      messages: chatMsgs.map(m => ({ role: m.role, content: m.content })),
    })
  } else {
    // OpenAI compatible API format
    url = `${apiEndpoint}/chat/completions`
    headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    }
    body = JSON.stringify({
      model: apiModel,
      messages,
      stream: !!onStream,
      temperature: 0.8,
      max_tokens: 2000,
    })
  }

  const response = await fetch(url, {
    method: 'POST',
    headers,
    body,
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: 'Unknown error' } }))
    throw new Error(error.error?.message || `API error: ${response.status}`)
  }

  if (isAnthropic) {
    // Anthropic doesn't support streaming in the same way, just return the response
    const data = await response.json()
    return data.content?.[0]?.text || ''
  }

  if (onStream && response.body) {
    // Handle streaming response (OpenAI compatible)
    const reader = response.body.getReader()
    const decoder = new TextDecoder()
    let fullText = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      const chunk = decoder.decode(value)
      const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

      for (const line of lines) {
        const data = line.replace('data: ', '')
        if (data === '[DONE]') continue

        try {
          const parsed = JSON.parse(data)
          const content = parsed.choices?.[0]?.delta?.content || ''
          fullText += content
          onStream(fullText)
        } catch {
          // Skip invalid JSON
        }
      }
    }

    return fullText
  } else {
    // Handle non-streaming response
    const data = await response.json()
    return data.choices?.[0]?.message?.content || ''
  }
}

/**
 * Suggested questions for users
 */
export const suggestedQuestions = [
  '我的事業運如何？',
  '今年感情有什麼要注意的？',
  '我適合什麼類型的工作？',
  '我的財運什麼時候會比較好？',
  '我的個性有什麼優缺點？',
  '幫我分析我的命盤格局',
  '我的大限走到哪了？',
  '我跟另一半合適嗎？',
]
