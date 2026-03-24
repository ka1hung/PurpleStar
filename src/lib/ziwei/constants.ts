/**
 * Constants for Zi Wei Dou Shu calculations
 */

// Heavenly Stems (天干)
export const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸']

// Earthly Branches (地支)
export const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥']

// Palace branches in order (starting from 寅)
export const PALACE_BRANCHES = ['寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥', '子', '丑']

// Palace names
export const PALACE_NAMES = [
  '命宮', '兄弟', '夫妻', '子女', '財帛', '疾厄',
  '遷移', '交友', '官祿', '田宅', '福德', '父母'
]

// Five Elements (五行局)
export const FIVE_ELEMENTS = {
  '水二局': 2,
  '木三局': 3,
  '金四局': 4,
  '土五局': 5,
  '火六局': 6,
} as const

// Main Stars (主星) - 14 main stars
export const MAIN_STARS = [
  '紫微', '天機', '太陽', '武曲', '天同', '廉貞', '天府',
  '太陰', '貪狼', '巨門', '天相', '天梁', '七殺', '破軍'
]

// Auxiliary Stars (輔星)
export const AUXILIARY_STARS = ['文昌', '文曲', '左輔', '右弼', '天魁', '天鉞']

// Harmful Stars (煞星)
export const HARMFUL_STARS = ['擎羊', '陀羅', '火星', '鈴星', '地空', '地劫']

// Four Transformations (四化)
export const TRANSFORMATIONS = ['化祿', '化權', '化科', '化忌']

// Transformation table by year stem
export const TRANSFORMATION_TABLE: Record<string, string[]> = {
  '甲': ['廉貞', '破軍', '武曲', '太陽'],
  '乙': ['天機', '天梁', '紫微', '太陰'],
  '丙': ['天同', '天機', '文昌', '廉貞'],
  '丁': ['太陰', '天同', '天機', '巨門'],
  '戊': ['貪狼', '太陰', '右弼', '天機'],
  '己': ['武曲', '貪狼', '天梁', '文曲'],
  '庚': ['太陽', '武曲', '太陰', '天同'],
  '辛': ['巨門', '太陽', '文曲', '文昌'],
  '壬': ['天梁', '紫微', '左輔', '武曲'],
  '癸': ['破軍', '巨門', '太陰', '貪狼'],
}

// Zi Wei star positions based on Five Element and lunar day
export const ZIWEI_POSITION_TABLE: Record<number, number[]> = {
  // Five Element局數 -> array of positions for days 1-30
  2: [2, 3, 1, 2, 3, 4, 2, 3, 4, 5, 3, 4, 5, 6, 4, 5, 6, 7, 5, 6, 7, 8, 6, 7, 8, 9, 7, 8, 9, 10],
  3: [3, 4, 4, 2, 3, 4, 5, 5, 3, 4, 5, 6, 6, 4, 5, 6, 7, 7, 5, 6, 7, 8, 8, 6, 7, 8, 9, 9, 7, 8],
  4: [4, 5, 5, 6, 3, 4, 5, 6, 6, 7, 4, 5, 6, 7, 7, 8, 5, 6, 7, 8, 8, 9, 6, 7, 8, 9, 9, 10, 7, 8],
  5: [5, 6, 6, 7, 7, 4, 5, 6, 7, 7, 8, 5, 6, 7, 8, 8, 9, 6, 7, 8, 9, 9, 10, 7, 8, 9, 10, 10, 11, 8],
  6: [6, 7, 7, 8, 8, 9, 5, 6, 7, 8, 8, 9, 9, 6, 7, 8, 9, 9, 10, 10, 7, 8, 9, 10, 10, 11, 11, 8, 9, 10],
}

// Star brightness levels
export const BRIGHTNESS_LEVELS = ['廟', '旺', '得', '利', '平', '不', '陷'] as const
