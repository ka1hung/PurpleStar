import type { Chart, MasterType } from '../types'
import { getMasterById } from '../data/prompts'
import { getHoroscope } from './ziwei'

/**
 * Format chart data for AI context
 */
export function formatChartForAI(chart: Chart): string {
  const { birthData, lunarDate, fiveElement, palaces, mingZhu, shenZhu, zodiac } = chart

  // Find life palace
  const lifePalace = palaces.find(p => p.name === '命宮')
  const lifePalaceStars = lifePalace
    ? [
        ...lifePalace.mainStars.map(s => s.name + (s.brightness ? `(${s.brightness})` : '') + (s.transformation ? `[${s.transformation}]` : '')),
        ...lifePalace.auxiliaryStars.map(s => s.name + (s.transformation ? `[${s.transformation}]` : '')),
      ].join('、')
    : '無'

  // Build palace summary with brightness
  const palaceSummary = palaces
    .map(p => {
      const mainStars = p.mainStars.map(s =>
        s.name + (s.brightness ? `(${s.brightness})` : '') + (s.transformation ? `[${s.transformation}]` : '')
      )
      const auxStars = p.auxiliaryStars.map(s => s.name + (s.transformation ? `[${s.transformation}]` : ''))
      const harmStars = p.harmfulStars.map(s => s.name)
      const stars = [...mainStars, ...auxStars, ...harmStars].join('、')

      // Add decadal info
      const decadalInfo = p.decadal ? ` [大限${p.decadal.range[0]}-${p.decadal.range[1]}歲]` : ''
      return `${p.name}(${p.stem}${p.branch})${decadalInfo}: ${stars || '空宮'}`
    })
    .join('\n')

  // Get current horoscope (流年)
  const horoscopeInfo = formatHoroscope(chart)

  return `
【命盤資料】
姓名：${birthData.name || '未提供'}
性別：${birthData.gender === 'male' ? '男' : '女'}
生肖：${zodiac || '未知'}
出生時間：${new Date(birthData.birthDate).toLocaleDateString('zh-TW')} ${chart.time || ''}時
農曆：${lunarDate.yearGanZhi}年 ${lunarDate.month}月 ${lunarDate.day}日 ${lunarDate.hourGanZhi}時
五行局：${fiveElement}
命主：${mingZhu || '未知'}
身主：${shenZhu || '未知'}

【命宮主星】
${lifePalaceStars}

【十二宮概覽】
${palaceSummary}

${horoscopeInfo}
`.trim()
}

/**
 * Format horoscope (運限) data for AI
 */
function formatHoroscope(chart: Chart): string {
  try {
    const horoscope = getHoroscope(chart)
    if (!horoscope) return '【流年運勢】\n無法取得流年資料'

    const { decadal, age, yearly, monthly } = horoscope

    // Format decadal (大限)
    const decadalInfo = decadal ? `
【當前大限】
大限宮位：${decadal.name}（${decadal.heavenlyStem}${decadal.earthlyBranch}）
大限四化：${decadal.mutagen?.join('、') || '無'}
大限十二宮：${decadal.palaceNames?.join('→') || ''}` : ''

    // Format yearly (流年)
    const yearlyInfo = yearly ? `
【${new Date().getFullYear()}年流年】
流年宮位：${yearly.name}（${yearly.heavenlyStem}${yearly.earthlyBranch}）
流年四化：${yearly.mutagen?.join('、') || '無'}
流年十二宮：${yearly.palaceNames?.join('→') || ''}` : ''

    // Format age (小限)
    const ageInfo = age ? `
【小限】
虛歲：${age.nominalAge}歲
小限宮位：${age.name}（${age.heavenlyStem}${age.earthlyBranch}）` : ''

    // Format monthly (流月) - current month
    const monthlyInfo = monthly ? `
【本月流月】
流月宮位：${monthly.name}（${monthly.heavenlyStem}${monthly.earthlyBranch}）
流月四化：${monthly.mutagen?.join('、') || '無'}` : ''

    return `${decadalInfo}
${yearlyInfo}
${ageInfo}
${monthlyInfo}`.trim()
  } catch (error) {
    console.error('Error formatting horoscope:', error)
    return '【流年運勢】\n流年計算發生錯誤'
  }
}

/**
 * Build system prompt for AI chat
 */
export function buildSystemPrompt(masterId: MasterType, chartContext: string): string {
  const master = getMasterById(masterId)

  // Get current date info
  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return `${master.prompt}

【今天日期】${dateStr}

你現在正在為一位問命者解讀紫微斗數命盤。以下是他/她的命盤資料及當前運勢：

${chartContext}

請根據以上命盤資料與流年運勢，以你的風格為問命者解答問題。

【解盤要點】
1. 始終保持你的角色風格
2. 結合「本命盤」與「流年運勢」來分析，讓解讀更精準
3. 回答時說明是「本命特質」還是「流年影響」
4. 注意大限、流年、小限的疊加效應
5. 主星亮度(廟/旺/得/利/平/陷)會影響星曜發揮
6. 四化(祿權科忌)是重要的吉凶指標
7. 適時提醒命理僅供參考，人生掌握在自己手中
8. 對於健康、法律、投資等敏感問題，要提醒諮詢專業人士
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
    const isOpenAI = apiEndpoint.includes('openai')
    // OpenAI newer models (o1, o3) use max_completion_tokens
    const maxTokensParam = isOpenAI ? { max_completion_tokens: 2000 } : { max_tokens: 2000 }
    body = JSON.stringify({
      model: apiModel,
      messages,
      stream: !!onStream,
      temperature: 0.8,
      ...maxTokensParam,
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
  '分析我今年的整體運勢',
  '今年事業有什麼機會或挑戰？',
  '今年感情運勢如何？',
  '今年財運什麼時候最好？',
  '我目前走的大限好不好？',
  '幫我分析命盤格局特色',
  '我的個性優缺點是什麼？',
  '適合我的職業方向？',
]
