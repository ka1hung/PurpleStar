// Birth data types
export interface BirthData {
  name?: string
  gender: 'male' | 'female'
  birthDate: Date
  birthTime: string // HH:mm format
  birthPlace?: string
}

// Lunar date type
export interface LunarDate {
  year: number
  month: number
  day: number
  isLeapMonth: boolean
  yearGanZhi: string  // 天干地支年
  monthGanZhi: string
  dayGanZhi: string
  hourGanZhi: string
}

// Star types
export type StarType = 'main' | 'auxiliary' | 'harmful' | 'misc'
export type TransformationType = '化祿' | '化權' | '化科' | '化忌'

export interface Star {
  name: string
  type: StarType
  brightness?: '廟' | '旺' | '得' | '利' | '平' | '不' | '陷'
  transformation?: TransformationType
}

// Palace type
export interface Palace {
  name: string
  position: number // 0-11 (地支index)
  branch: string  // 地支
  stem?: string   // 宮干
  mainStars: Star[]
  auxiliaryStars: Star[]
  harmfulStars: Star[]
  miscStars: Star[]
  // iztro additional fields
  decadal?: {
    range: [number, number]
    heavenlyStem: string
    earthlyBranch: string
  }
  ages?: number[]
  isBodyPalace?: boolean
}

// Chart type
export interface Chart {
  id: string
  birthData: BirthData
  lunarDate: LunarDate
  fiveElement: '水二局' | '木三局' | '金四局' | '土五局' | '火六局'
  lifePalacePosition: number
  bodyPalacePosition: number
  palaces: Palace[]
  mingZhu?: string  // 命主
  shenZhu?: string  // 身主
  createdAt: Date
  // iztro additional fields
  zodiac?: string      // 生肖
  sign?: string        // 星座
  chineseDate?: string // 干支紀年日期
  time?: string        // 時辰
  timeRange?: string   // 時辰對應的時間段
  _astrolabe?: unknown // iztro astrolabe reference for advanced features
}

// Master types
export type MasterType =
  | 'xuanzhen'
  | 'lin'
  | 'sister'
  | 'tiekou'
  | 'science'
  | 'humor'
  | 'liao'
  | 'child'

export interface Master {
  id: MasterType
  name: string
  desc: string
  avatar: string
  prompt: string
}

// Chat types
export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface ChatSession {
  id: string
  chartId: string
  masterId: MasterType
  messages: ChatMessage[]
  createdAt: Date
}

// Settings
export interface Settings {
  theme: 'light' | 'dark'
  // AI Settings
  apiEndpoint?: string
  apiKey?: string
  apiModel?: string
}
