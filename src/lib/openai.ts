import type { Chart, MasterType, ChartComparison, ComparisonMember } from '../types'
import { getMasterById } from '../data/prompts'
import { getHoroscope } from './ziwei'
import { TRANSFORMATION_TABLE } from './ziwei/constants'

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

  // Get all decadal periods (大限總覽)
  const allDecadalsInfo = formatAllDecadals(chart)

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

${allDecadalsInfo}
`.trim()
}

/**
 * Format all decadal periods (大限總覽) for AI
 */
function formatAllDecadals(chart: Chart): string {
  const { palaces } = chart

  // Collect all decadals and sort by start age
  const decadals = palaces
    .filter(p => p.decadal)
    .map(p => ({
      name: p.name,
      stem: p.decadal!.heavenlyStem,
      branch: p.decadal!.earthlyBranch,
      range: p.decadal!.range,
    }))
    .sort((a, b) => a.range[0] - b.range[0])

  if (decadals.length === 0) return ''

  const decadalLines = decadals.map(d => {
    const stars = TRANSFORMATION_TABLE[d.stem]
    const sihua = stars
      ? `${stars[0]}化祿、${stars[1]}化權、${stars[2]}化科、${stars[3]}化忌`
      : '未知'
    return `${d.range[0]}-${d.range[1]}歲（${d.name}·${d.stem}${d.branch}）：${sihua}`
  })

  return `【大限總覽】
${decadalLines.join('\n')}`
}

/**
 * Format horoscope (運限) data for AI
 */
function formatHoroscope(chart: Chart): string {
  try {
    const horoscope = getHoroscope(chart)
    if (!horoscope) return '【流年運勢】\n無法取得流年資料'

    const { decadal, age, yearly, monthly } = horoscope
    const currentYear = new Date().getFullYear()

    // Format decadal (大限) with emphasis
    const decadalInfo = decadal ? `
【★★★ 當前大限 ★★★】
⚡ 此人目前正在走「${decadal.name}」大限（${decadal.heavenlyStem}${decadal.earthlyBranch}）
大限四化：${decadal.mutagen?.join('、') || '無'}
大限十二宮重疊：${decadal.palaceNames?.join('→') || ''}
💡 大限影響這10年的整體運勢基調` : ''

    // Format yearly (流年) with emphasis
    const yearlyInfo = yearly ? `
【★★★ ${currentYear}年流年（今年）★★★】
⚡ 今年流年落在「${yearly.name}」（${yearly.heavenlyStem}${yearly.earthlyBranch}）
流年四化：${yearly.mutagen?.join('、') || '無'}
流年十二宮重疊：${yearly.palaceNames?.join('→') || ''}
💡 流年四化是今年吉凶的關鍵指標` : ''

    // Format all years in current decadal
    const decadalYearsInfo = formatDecadalYears(chart, decadal, currentYear)

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
${decadalYearsInfo}
${ageInfo}
${monthlyInfo}`.trim()
  } catch (error) {
    console.error('Error formatting horoscope:', error)
    return '【流年運勢】\n流年計算發生錯誤'
  }
}

/**
 * Format all years within the current decadal period
 */
function formatDecadalYears(chart: Chart, decadal: any, currentYear: number): string {
  if (!decadal) return ''

  const { birthData } = chart
  const birthYear = new Date(birthData.birthDate).getFullYear()
  const [startAge, endAge] = decadal.range || [0, 0]

  // Calculate year range for this decadal
  const startYear = birthYear + startAge
  const endYear = birthYear + endAge

  const yearLines: string[] = []

  for (let year = startYear; year <= endYear; year++) {
    // Get yearly stem from the year
    const yearStem = getYearStem(year)
    const stars = TRANSFORMATION_TABLE[yearStem]
    const sihua = stars
      ? `${stars[0]}化祿、${stars[1]}化權、${stars[2]}化科、${stars[3]}化忌`
      : '未知'

    const marker = year === currentYear ? ' ← 【今年】' : ''
    const age = year - birthYear
    yearLines.push(`${year}年（${age}歲）${yearStem}年：${sihua}${marker}`)
  }

  return `
【當前大限內的流年四化】
${yearLines.join('\n')}`
}

/**
 * Get the heavenly stem for a given year
 */
function getYearStem(year: number): string {
  const stems = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']
  // 甲子年 = 1984, 1924, 1864...
  // year % 10: 4=甲, 5=乙, 6=丙, 7=丁, 8=戊, 9=己, 0=庚, 1=辛, 2=壬, 3=癸
  const index = (year - 4) % 10
  return stems[index >= 0 ? index : index + 10]
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

【⚠️ 重要：流年運勢資訊】
上方資料中已包含完整的流年運勢資訊，請務必使用：
- 「★★★ 當前大限 ★★★」：此人目前正在走的10年大運
- 「★★★ 今年流年 ★★★」：今年的運勢重點
- 「當前大限內的流年四化」：這個大限內每一年的四化
- 大限四化 + 流年四化的疊加，是判斷該年吉凶的關鍵

【解盤要點】
1. 始終保持你的角色風格
2. 回答時必須結合「大限」與「流年」來分析！不要說沒有流年資料
3. 明確告訴問命者：「你目前正在走 XX 大限，今年流年落在 XX 宮」
4. 說明是「本命特質」、「大限影響」還是「流年影響」
5. 重視大限四化與流年四化的疊加效應（雙祿、雙忌等）
6. 主星亮度(廟/旺/得/利/平/陷)會影響星曜發揮
7. 四化(祿權科忌)是重要的吉凶指標
8. 適時提醒命理僅供參考，人生掌握在自己手中
9. 對於健康、法律、投資等敏感問題，要提醒諮詢專業人士
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
    // OpenAI newer models (o1/o3/gpt-4.1/gpt-4.5) don't support temperature/stream
    const isNewerModel =
      apiModel.startsWith('o1') ||
      apiModel.startsWith('o3') ||
      apiModel.startsWith('gpt-4.1') ||
      apiModel.startsWith('gpt-4.5')

    if (isNewerModel) {
      // Newer models: no temperature, no stream
      body = JSON.stringify({
        model: apiModel,
        messages,
      })
    } else {
      body = JSON.stringify({
        model: apiModel,
        messages,
        stream: !!onStream,
        temperature: 0.8,
      })
    }
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

  // Check if it's a model that doesn't support streaming
  const isNewerModel =
    apiModel.startsWith('o1') ||
    apiModel.startsWith('o3') ||
    apiModel.startsWith('gpt-4.1') ||
    apiModel.startsWith('gpt-4.5')

  if (isAnthropic || isNewerModel) {
    // Anthropic and newer OpenAI models don't support streaming
    const data = await response.json()
    if (isAnthropic) {
      return data.content?.[0]?.text || ''
    }
    return data.choices?.[0]?.message?.content || ''
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

/**
 * Infer relationship type from roles
 */
function inferRelationshipTypes(
  members: Array<{ role: string; label?: string }>
): string {
  const roles = members.map(m => m.role)

  if (
    (roles.includes('self') && roles.includes('spouse')) ||
    (roles.includes('spouse') && roles.includes('self'))
  ) {
    return 'romance'
  }

  if (roles.includes('father') || roles.includes('mother')) {
    if (roles.includes('son') || roles.includes('daughter')) {
      return 'family'
    }
  }

  if (
    roles.filter(r => r === 'daughter' || r === 'son').length >= 2 ||
    roles.includes('sibling')
  ) {
    return 'family'
  }

  if (roles.includes('partner')) {
    return 'business'
  }

  if (roles.includes('friend')) {
    return 'friendship'
  }

  return 'custom'
}

/**
 * Format multiple charts for comparison AI context
 */
export function formatComparisonForAI(
  charts: Array<{ chart: Chart; role: string; label?: string }>
): string {
  const relationshipType = inferRelationshipTypes(
    charts.map(c => ({ role: c.role, label: c.label }))
  )

  const memberSummaries = charts
    .map((m, idx) => {
      const chart = m.chart
      const label = m.label || chart.birthData.name || `成員${idx + 1}`
      const roleEmoji = {
        self: '👤',
        spouse: '💑',
        father: '👨‍🦳',
        mother: '👩‍🦳',
        son: '👦',
        daughter: '👧',
        sibling: '👥',
        partner: '🤝',
        friend: '🤝',
        other: '🔮',
      }[m.role] || '👤'

      // Find key palaces for relationship analysis
      const lifePalace = chart.palaces.find(p => p.name === '命宮')
      const spousePalace = chart.palaces.find(p => p.name === '夫妻宮')
      const childrenPalace = chart.palaces.find(p => p.name === '子女宮')
      const parentPalace = chart.palaces.find(p => p.name === '父母宮')
      const careerPalace = chart.palaces.find(p => p.name === '官祿宮')
      const siblingPalace = chart.palaces.find(p => p.name === '兄弟宮')

      const formatPalace = (palace: any) =>
        palace
          ? palace.mainStars.map((s: any) => `${s.name}(${s.brightness || '平'})`).join('、')
          : '無'

      return `【${roleEmoji} ${label}（${m.role}）】
性別：${chart.birthData.gender === 'male' ? '男' : '女'}
出生日期：${new Date(chart.birthData.birthDate).toLocaleDateString('zh-TW')}
五行局：${chart.fiveElement}
命主：${chart.mingZhu || '未知'}
命宮主星：${formatPalace(lifePalace)}
夫妻宮：${formatPalace(spousePalace)}
子女宮：${formatPalace(childrenPalace)}
父母宮：${formatPalace(parentPalace)}
官祿宮：${formatPalace(careerPalace)}
兄弟宮：${formatPalace(siblingPalace)}`
    })
    .join('\n\n')

  const relationshipGuide = {
    romance: `
【分析重點（感情配對）】
- 命宮主星的性格互補或衝突
- 夫妻宮的星曜配置與四化
- 化忌在對方夫妻宮或感情相關宮位的影響
- 大限流年的吉凶時機`,
    family: `
【分析重點（親子/家庭）】
- 父親的子女宮 vs 子女的父母宮
- 母親的子女宮 vs 子女的父母宮
- 兄弟姐妹的兄弟宮互動
- 教養方式與性格互補
- 大限時期的親子關係變化`,
    business: `
【分析重點（事業合作）】
- 各人的官祿宮與財帛宮
- 命宮主星的個性與領導風格
- 在合作中的角色分工建議
- 四化的機會與挑戰`,
    friendship: `
【分析重點（朋友關係）】
- 交友宮的互動
- 性格相容度
- 共同發展方向`,
    custom: `
【分析重點】
- 綜合各人的命宮特質
- 重點宮位間的互動',`,
  }

  return `
【多人合盤資料】
${memberSummaries}

${relationshipGuide[relationshipType as keyof typeof relationshipGuide] || relationshipGuide.custom}

【關係分析框架】
- 關係類型：${
    {
      romance: '感情配對',
      family: '親子/家庭',
      business: '事業合作',
      friendship: '朋友',
      custom: '自訂',
    }[relationshipType] || '自訂'
  }
- 總人數：${charts.length} 人
- 請根據以上資訊進行深入的交叉分析
`.trim()
}

/**
 * Build system prompt for comparison (multi-chart) AI chat
 */
export function buildComparisonSystemPrompt(
  masterId: MasterType,
  comparisonContext: string
): string {
  const master = getMasterById(masterId)

  const now = new Date()
  const dateStr = now.toLocaleDateString('zh-TW', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  })

  return `${master.prompt}

【今天日期】${dateStr}

你正在進行一場「多人合盤對比分析」。這不是單人排盤，而是分析多個人的命盤之間的互動、相容度與關係動態。以下是合盤資訊：

${comparisonContext}

【重要：合盤分析要點】
1. 始終保持你的角色風格
2. 分析時聚焦於人與人之間的互動，而非單人特質
3. 清楚區分：
   - 各人的「本命特質」（命宮、五行局等）
   - 關係中的「互補或衝突」（星曜配置）
   - 「四化飛星」對對方的影響
4. 對夫妻/親子/合作關係，要分別看對應的宮位：
   - 夫妻關係 → 看雙方「夫妻宮」
   - 親子關係 → 看父母的「子女宮」對應子女的「父母宮」
   - 手足關係 → 看雙方「兄弟宮」
   - 事業合作 → 看雙方「官祿宮」與「財帛宮」
5. 一人的化忌落在另一人的重點宮位，需特別注意
6. 提醒對方適合的相處模式、溝通方式
7. 若涉及多人（3人以上），要分析整個「關係網絡」
8. 適時提醒命理僅供參考，關係經營最重要的還是雙方努力

【用戶可能的提問方式】
- 「我和 XXX 的感情配對度如何？」
- 「我們適合合作嗎？」
- 「我跟大女兒的親子關係怎麼經營？」
- 「兩個女兒之間會不會吵架？」
- 「我們家今年的整體運勢如何？」
請根據提問識別涉及的人物，並專注於他們之間的互動分析。
`
}

/**
 * Get suggested questions based on relationship type and member count
 */
export function getComparisonSuggestedQuestions(
  members: Array<{ role: string; label?: string }>,
  relationshipType?: string
): string[] {
  const inferredType =
    relationshipType || inferRelationshipTypes(members)

  const baseQuestions: Record<string, string[]> = {
    romance: [
      // 感情配對只適用於 2 人
      members.length === 2
        ? `我和${members[1]?.label || '對方'}的感情配對度如何？`
        : `我們的感情動力如何？`,
      `相處上會有哪些摩擦？`,
      `最適合我們的相處模式是什麼？`,
      `今年感情運勢怎麼走？`,
      members.length === 2 ? `我們適合結婚嗎？` : `如何增進感情？`,
    ],
    family: [
      `我們一家人的性格互動如何？`,
      members.length === 2
        ? `我和${members[1]?.label || '對方'}的親子關係怎麼經營？`
        : `家族中各成員的角色和互動模式是什麼？`,
      `${
        members.filter(m => m.role === 'daughter' || m.role === 'son').length >= 2
          ? '孩子們之間會怎樣相處？'
          : '教養上需要注意什麼？'
      }`,
      `我們家今年的整體運勢如何？`,
      `家庭成員之間如何更好地溝通和協調？`,
    ],
    business: [
      members.length === 2
        ? `我和${members[1]?.label || '對方'}適合一起合作嗎？`
        : `這個團隊適合一起合作嗎？`,
      `各自適合擔任什麼角色？`,
      `合作的最佳時機是什麼時候？`,
      `如何避免合作中的衝突？`,
      `我們的優勢和弱點各是什麼？`,
    ],
    friendship: [
      members.length === 2
        ? `我和${members[1]?.label || '對方'}的友誼相容度如何？`
        : `這個朋友圈的和諧度怎麼樣？`,
      `我們會有什麼共同話題？`,
      `相處中要注意什麼？`,
      `友誼能長久嗎？`,
      `如何維持這段友誼？`,
    ],
    other: [
      members.length === 2
        ? `我和${members[1]?.label || '對方'}的互動動力如何？`
        : `多人間會怎樣相處？`,
      `各有什麼特質？`,
      `整體氛圍如何？`,
      `有什麼需要注意的地方？`,
      `未來如何發展？`,
    ],
  }

  return baseQuestions[inferredType] || baseQuestions.other
}
