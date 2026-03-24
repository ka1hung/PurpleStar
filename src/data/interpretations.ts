/**
 * 紫微斗數基本解說資料
 * Basic interpretations for Zi Wei Dou Shu
 */

// 十四主星基本解說
export const MAIN_STAR_INTERPRETATIONS: Record<string, {
  nature: string      // 星性
  element: string     // 五行
  description: string // 基本描述
  strengths: string[] // 優點
  weaknesses: string[] // 缺點
  career: string      // 事業傾向
  relationship: string // 感情特質
}> = {
  '紫微': {
    nature: '帝王星',
    element: '土',
    description: '紫微為帝座之星，具有領袖氣質與貴人運。個性尊貴、有主見、講求面子，適合擔任管理職位。',
    strengths: ['領導能力強', '氣質高貴', '貴人運佳', '有主見'],
    weaknesses: ['愛面子', '較固執', '不易親近', '有時過於自負'],
    career: '適合管理階層、政治、高階主管等需要領導統御的工作',
    relationship: '感情上較為被動，需要對方主動追求，重視對象的社會地位'
  },
  '天機': {
    nature: '智慧星',
    element: '木',
    description: '天機為智慧之星，聰明機智、反應快、善於思考分析。心思細膩但容易想太多。',
    strengths: ['聰明伶俐', '反應敏捷', '善於分析', '學習力強'],
    weaknesses: ['想太多', '較神經質', '猶豫不決', '容易焦慮'],
    career: '適合策劃、分析師、顧問、研究員等需要動腦的工作',
    relationship: '感情細膩敏感，需要心靈上的契合，容易因小事想太多'
  },
  '太陽': {
    nature: '光明星',
    element: '火',
    description: '太陽為光明之星，熱情積極、樂於助人、有博愛精神。男命較佳，女命則辛勞。',
    strengths: ['熱情開朗', '樂於助人', '有正義感', '積極進取'],
    weaknesses: ['過度付出', '不懂拒絕', '有時過於直接', '容易操勞'],
    career: '適合服務業、公關、政治、教育等需要與人接觸的工作',
    relationship: '感情上較為主動熱情，但容易付出太多而忽略自己'
  },
  '武曲': {
    nature: '財星',
    element: '金',
    description: '武曲為財星，剛毅果斷、重視實際、有財運但需努力。性格較為剛硬，不善言詞。',
    strengths: ['剛毅果斷', '財運佳', '做事實際', '執行力強'],
    weaknesses: ['較為固執', '不善表達', '過於嚴肅', '較少變通'],
    career: '適合金融、財務、軍警、工程等需要專業技術的工作',
    relationship: '感情表達較為含蓄，重視實際行動勝於甜言蜜語'
  },
  '天同': {
    nature: '福星',
    element: '水',
    description: '天同為福星，性情溫和、知足常樂、有享福之命。但較缺乏進取心，容易安於現狀。',
    strengths: ['性情溫和', '知足常樂', '人緣好', '心態樂觀'],
    weaknesses: ['缺乏進取', '較為懶散', '容易滿足', '不夠積極'],
    career: '適合服務業、社福、休閒產業等較為輕鬆的工作環境',
    relationship: '感情上溫和體貼，是很好的伴侶，但可能過於被動'
  },
  '廉貞': {
    nature: '囚星',
    element: '火',
    description: '廉貞為囚星，聰明能幹但內心複雜。具有雙面性格，既有才華也有是非。',
    strengths: ['聰明能幹', '才華洋溢', '適應力強', '交際能力佳'],
    weaknesses: ['內心複雜', '容易糾結', '有時任性', '情緒起伏'],
    career: '適合法律、公關、演藝、設計等需要創意與口才的工作',
    relationship: '感情豐富但複雜，容易有感情上的波折'
  },
  '天府': {
    nature: '祿庫星',
    element: '土',
    description: '天府為祿庫之星，穩重大方、有包容心、財庫豐盈。是穩定可靠的吉星。',
    strengths: ['穩重大方', '包容心強', '財運穩定', '有貴人運'],
    weaknesses: ['較為保守', '不愛冒險', '有時過於謹慎', '缺乏衝勁'],
    career: '適合財務、行政、管理等需要穩定性的工作',
    relationship: '感情穩定可靠，是很好的結婚對象，重視家庭'
  },
  '太陰': {
    nature: '富星',
    element: '水',
    description: '太陰為富星，溫柔細膩、有藝術天分、重視精神生活。女命較佳，男命則較為陰柔。',
    strengths: ['溫柔細膩', '藝術天分', '直覺敏銳', '善解人意'],
    weaknesses: ['較為敏感', '情緒化', '容易受傷', '有時優柔'],
    career: '適合藝術、設計、服務業等需要細膩感受的工作',
    relationship: '感情細膩浪漫，重視心靈交流，需要被呵護'
  },
  '貪狼': {
    nature: '桃花星',
    element: '木',
    description: '貪狼為桃花之星，多才多藝、慾望強烈、交際能力佳。有魅力但也容易沉迷。',
    strengths: ['多才多藝', '魅力十足', '適應力強', '交際廣闘'],
    weaknesses: ['慾望較強', '容易沉迷', '較不專一', '有時貪心'],
    career: '適合娛樂、銷售、公關等需要交際魅力的工作',
    relationship: '感情豐富有魅力，但需注意專一，容易有桃花困擾'
  },
  '巨門': {
    nature: '暗星',
    element: '水',
    description: '巨門為暗星，口才好但容易招是非。善於分析研究，但也容易多疑猜忌。',
    strengths: ['口才便給', '分析力強', '善於研究', '邏輯清晰'],
    weaknesses: ['容易招非', '較多疑慮', '有時尖銳', '不易信任'],
    career: '適合律師、教師、研究員等需要口才與分析的工作',
    relationship: '感情上較多疑慮，需要對方的耐心與真誠'
  },
  '天相': {
    nature: '印星',
    element: '水',
    description: '天相為印星，善於協調、有貴人緣、適合輔佐工作。為人正直但較缺乏主見。',
    strengths: ['協調能力強', '貴人運佳', '為人正直', '善於輔佐'],
    weaknesses: ['較缺主見', '容易依賴', '有時過於順從', '優柔寡斷'],
    career: '適合秘書、助理、公務員等輔助性質的工作',
    relationship: '感情上溫順體貼，是很好的伴侶，但需要對方引導'
  },
  '天梁': {
    nature: '蔭星',
    element: '土',
    description: '天梁為蔭星，有長輩緣、適合助人、有化解災厄的能力。性格較為老成穩重。',
    strengths: ['長輩緣佳', '有正義感', '化解能力', '穩重可靠'],
    weaknesses: ['較為老成', '有時嘮叨', '過於操心', '不夠靈活'],
    career: '適合醫療、社工、教育等助人性質的工作',
    relationship: '感情上較為成熟穩重，適合年紀有差距的對象'
  },
  '七殺': {
    nature: '將星',
    element: '金',
    description: '七殺為將星，勇敢果決、有開創力、適合獨當一面。但性格剛烈，容易與人衝突。',
    strengths: ['勇敢果決', '開創力強', '獨立自主', '行動力佳'],
    weaknesses: ['性格剛烈', '容易衝動', '不善妥協', '有時霸道'],
    career: '適合創業、軍警、業務等需要開拓的工作',
    relationship: '感情上較為強勢，需要學習柔軟與包容'
  },
  '破軍': {
    nature: '耗星',
    element: '水',
    description: '破軍為耗星，有破壞力也有開創力，一生變動較大。適合開創新局，但守成較難。',
    strengths: ['開創力強', '不畏變動', '勇於突破', '適應力佳'],
    weaknesses: ['變動較大', '較難守成', '有時衝動', '不夠穩定'],
    career: '適合創業、改革、開發等需要突破的工作',
    relationship: '感情波折較多，需要能接受變動的伴侶'
  }
}

// 宮位基本解說
export const PALACE_INTERPRETATIONS: Record<string, {
  meaning: string     // 宮位意義
  aspects: string[]   // 主要看的面向
}> = {
  '命宮': {
    meaning: '代表個人的本質、性格、才能、人生觀',
    aspects: ['性格特質', '才能傾向', '人生態度', '外在形象']
  },
  '兄弟': {
    meaning: '代表兄弟姊妹、朋友關係、合作對象',
    aspects: ['手足關係', '朋友緣分', '合作運勢', '同儕互動']
  },
  '夫妻': {
    meaning: '代表婚姻感情、配偶特質、戀愛對象',
    aspects: ['婚姻狀況', '配偶特質', '感情模式', '戀愛運勢']
  },
  '子女': {
    meaning: '代表子女緣分、後代發展、性生活',
    aspects: ['子女緣分', '親子關係', '後代發展', '桃花運勢']
  },
  '財帛': {
    meaning: '代表財運、理財能力、收入來源',
    aspects: ['財運好壞', '理財能力', '收入狀況', '花錢習慣']
  },
  '疾厄': {
    meaning: '代表健康狀況、身體弱點、災厄',
    aspects: ['健康狀態', '身體弱點', '災厄運勢', '意外風險']
  },
  '遷移': {
    meaning: '代表外出運、旅行、在外發展',
    aspects: ['外出運勢', '旅行機會', '異地發展', '貴人運勢']
  },
  '交友': {
    meaning: '代表朋友部屬、社交關係、人際往來',
    aspects: ['社交能力', '朋友關係', '部屬運勢', '人脈發展']
  },
  '官祿': {
    meaning: '代表事業、工作、學業、社會地位',
    aspects: ['事業發展', '工作運勢', '學業表現', '社會地位']
  },
  '田宅': {
    meaning: '代表不動產、家庭環境、居住狀況',
    aspects: ['置產運勢', '家庭環境', '居住狀況', '祖業繼承']
  },
  '福德': {
    meaning: '代表精神生活、興趣嗜好、晚年運勢',
    aspects: ['精神狀態', '興趣嗜好', '晚年運勢', '福氣享受']
  },
  '父母': {
    meaning: '代表父母關係、長輩緣、庇蔭運',
    aspects: ['父母關係', '長輩緣分', '庇蔭運勢', '文書運勢']
  }
}

// 四化解說
export const TRANSFORMATION_INTERPRETATIONS: Record<string, {
  meaning: string
  effect: string
}> = {
  '化祿': {
    meaning: '財祿、利益、順遂',
    effect: '增加該星的正面能量，帶來財運與順遂'
  },
  '化權': {
    meaning: '權力、掌控、積極',
    effect: '增加該星的主導性，帶來權力與影響力'
  },
  '化科': {
    meaning: '名聲、貴人、學業',
    effect: '增加該星的名望，帶來貴人與學習機會'
  },
  '化忌': {
    meaning: '阻礙、煩惱、執著',
    effect: '該星能量受阻，需要特別注意相關事項'
  }
}

// 輔星解說
export const AUXILIARY_STAR_INTERPRETATIONS: Record<string, string> = {
  '文昌': '主文書、學業、考試，有利於讀書與文職工作',
  '文曲': '主才藝、口才、藝術，有利於表演與創作',
  '左輔': '主貴人、助力、輔佐，人緣好有人幫助',
  '右弼': '主貴人、助力、輔佐，人緣好有人幫助',
  '天魁': '主日貴人、男性貴人、長輩提拔',
  '天鉞': '主夜貴人、女性貴人、異性緣分',
  '祿存': '主財祿、穩定收入、保守理財'
}

// 煞星解說
export const HARMFUL_STAR_INTERPRETATIONS: Record<string, string> = {
  '擎羊': '主是非、衝突、意外，做事容易有阻礙與波折',
  '陀羅': '主拖延、糾纏、暗傷，事情容易反覆不順',
  '火星': '主急躁、衝動、災厄，性格較為急躁易怒',
  '鈴星': '主孤獨、陰沉、暗災，內心較為壓抑',
  '地空': '主空虛、損失、突變，容易有意外損失',
  '地劫': '主劫難、破耗、波動，財運容易有破耗'
}

// 命主解說
export const MINGZHU_INTERPRETATIONS: Record<string, string> = {
  '貪狼': '命主貪狼者，多才多藝、慾望強烈，一生追求新鮮刺激',
  '巨門': '命主巨門者，口才便給、善於分析，但容易招惹是非',
  '祿存': '命主祿存者，財運穩定、保守謹慎，適合穩紮穩打',
  '文曲': '命主文曲者，才藝出眾、感情豐富，適合藝術創作',
  '廉貞': '命主廉貞者，聰明能幹、適應力強，但內心較複雜',
  '武曲': '命主武曲者，剛毅果斷、重視財務，適合金融理財',
  '破軍': '命主破軍者，開創力強、不畏變動，但一生波折較多'
}

// 身主解說
export const SHENZHU_INTERPRETATIONS: Record<string, string> = {
  '火星': '身主火星者，行事積極、衝勁十足，但需注意脾氣',
  '天相': '身主天相者，善於協調、有貴人緣，適合輔助工作',
  '天梁': '身主天梁者，有長輩緣、適合助人，性格較為老成',
  '天同': '身主天同者，性情溫和、知足常樂，但進取心較弱',
  '文昌': '身主文昌者，文書出眾、學習力強，適合文職工作',
  '天機': '身主天機者，聰明機智、反應快速，但容易想太多'
}

/**
 * 根據命宮主星生成基本解說
 */
export function generateBasicInterpretation(
  lifePalaceStars: string[],
  mingZhu?: string,
  shenZhu?: string,
  fiveElement?: string
): string[] {
  const interpretations: string[] = []

  // 命宮主星解說
  if (lifePalaceStars.length > 0) {
    const mainStar = lifePalaceStars[0]
    const starInfo = MAIN_STAR_INTERPRETATIONS[mainStar]
    if (starInfo) {
      interpretations.push(`【命宮主星：${mainStar}】`)
      interpretations.push(starInfo.description)
      interpretations.push(`性格優點：${starInfo.strengths.join('、')}`)
      interpretations.push(`需要注意：${starInfo.weaknesses.join('、')}`)
      interpretations.push(`事業傾向：${starInfo.career}`)
      interpretations.push(`感情特質：${starInfo.relationship}`)
    }

    // 如果有第二顆主星
    if (lifePalaceStars.length > 1) {
      const secondStar = lifePalaceStars[1]
      const secondInfo = MAIN_STAR_INTERPRETATIONS[secondStar]
      if (secondInfo) {
        interpretations.push('')
        interpretations.push(`【命宮副星：${secondStar}】`)
        interpretations.push(secondInfo.description)
      }
    }
  } else {
    interpretations.push('【命宮空宮】')
    interpretations.push('命宮無主星，需借對宮（遷移宮）主星來論命。空宮之人較為多變，適應力強但較無主見。')
  }

  // 五行局解說
  if (fiveElement) {
    interpretations.push('')
    interpretations.push(`【${fiveElement}】`)
    const elementInterpretations: Record<string, string> = {
      '水二局': '水二局者，聰明靈活、善於變通，但需注意過於飄忽不定。大運起運較早（2歲起），人生較早開始歷練。',
      '木三局': '木三局者，仁慈正直、有成長力，但需注意過於固執。大運3歲起運，人生穩步發展。',
      '金四局': '金四局者，剛毅果決、有執行力，但需注意過於剛硬。大運4歲起運，適合腳踏實地。',
      '土五局': '土五局者，穩重踏實、有包容力，但需注意過於保守。大運5歲起運，厚積薄發。',
      '火六局': '火六局者，熱情積極、有衝勁，但需注意過於急躁。大運6歲起運，大器晚成。'
    }
    interpretations.push(elementInterpretations[fiveElement] || '')
  }

  // 命主身主解說
  if (mingZhu) {
    interpretations.push('')
    interpretations.push(`【命主：${mingZhu}】`)
    interpretations.push(MINGZHU_INTERPRETATIONS[mingZhu] || '')
  }

  if (shenZhu) {
    interpretations.push(`【身主：${shenZhu}】`)
    interpretations.push(SHENZHU_INTERPRETATIONS[shenZhu] || '')
  }

  return interpretations.filter(line => line !== '')
}
