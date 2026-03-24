// Birth data types
export interface BirthData {
  name?: string
  gender: 'male' | 'female'
  birthDate: Date
  birthTime: string // HH:mm format
  birthPlace: string
  longitude: number
  timezone: number
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
  position: number // 1-12
  branch: string  // 地支
  mainStars: Star[]
  auxiliaryStars: Star[]
  harmfulStars: Star[]
  miscStars: Star[]
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
  trueSolarTime: {
    original: string
    corrected: string
    difference: number // minutes
  }
  createdAt: Date
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
  nameKey: string
  descKey: string
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
  language: 'zh-TW' | 'zh-CN' | 'en'
  theme: 'light' | 'dark'
  trueSolarTimeEnabled: boolean
  apiKey?: string
}

// City data for true solar time
export interface City {
  name: string
  nameEn: string
  nameCN: string
  longitude: number
  timezone: number
  country: string
}
