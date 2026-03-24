import type { City } from '../types'

/**
 * Cities database for True Solar Time calculation
 * Includes major cities in Chinese-speaking regions
 */
export const cities: City[] = [
  // Taiwan
  { name: '台北', nameEn: 'Taipei', nameCN: '台北', longitude: 121.5654, timezone: 8, country: 'Taiwan' },
  { name: '新北', nameEn: 'New Taipei', nameCN: '新北', longitude: 121.4628, timezone: 8, country: 'Taiwan' },
  { name: '桃園', nameEn: 'Taoyuan', nameCN: '桃园', longitude: 121.3010, timezone: 8, country: 'Taiwan' },
  { name: '台中', nameEn: 'Taichung', nameCN: '台中', longitude: 120.6736, timezone: 8, country: 'Taiwan' },
  { name: '台南', nameEn: 'Tainan', nameCN: '台南', longitude: 120.2270, timezone: 8, country: 'Taiwan' },
  { name: '高雄', nameEn: 'Kaohsiung', nameCN: '高雄', longitude: 120.3014, timezone: 8, country: 'Taiwan' },
  { name: '新竹', nameEn: 'Hsinchu', nameCN: '新竹', longitude: 120.9647, timezone: 8, country: 'Taiwan' },
  { name: '基隆', nameEn: 'Keelung', nameCN: '基隆', longitude: 121.7419, timezone: 8, country: 'Taiwan' },
  { name: '嘉義', nameEn: 'Chiayi', nameCN: '嘉义', longitude: 120.4473, timezone: 8, country: 'Taiwan' },
  { name: '花蓮', nameEn: 'Hualien', nameCN: '花莲', longitude: 121.6014, timezone: 8, country: 'Taiwan' },
  { name: '宜蘭', nameEn: 'Yilan', nameCN: '宜兰', longitude: 121.7530, timezone: 8, country: 'Taiwan' },

  // China - Major cities
  { name: '北京', nameEn: 'Beijing', nameCN: '北京', longitude: 116.4074, timezone: 8, country: 'China' },
  { name: '上海', nameEn: 'Shanghai', nameCN: '上海', longitude: 121.4737, timezone: 8, country: 'China' },
  { name: '廣州', nameEn: 'Guangzhou', nameCN: '广州', longitude: 113.2644, timezone: 8, country: 'China' },
  { name: '深圳', nameEn: 'Shenzhen', nameCN: '深圳', longitude: 114.0579, timezone: 8, country: 'China' },
  { name: '杭州', nameEn: 'Hangzhou', nameCN: '杭州', longitude: 120.1551, timezone: 8, country: 'China' },
  { name: '南京', nameEn: 'Nanjing', nameCN: '南京', longitude: 118.7969, timezone: 8, country: 'China' },
  { name: '武漢', nameEn: 'Wuhan', nameCN: '武汉', longitude: 114.3055, timezone: 8, country: 'China' },
  { name: '成都', nameEn: 'Chengdu', nameCN: '成都', longitude: 104.0665, timezone: 8, country: 'China' },
  { name: '重慶', nameEn: 'Chongqing', nameCN: '重庆', longitude: 106.5516, timezone: 8, country: 'China' },
  { name: '西安', nameEn: "Xi'an", nameCN: '西安', longitude: 108.9402, timezone: 8, country: 'China' },
  { name: '蘇州', nameEn: 'Suzhou', nameCN: '苏州', longitude: 120.6199, timezone: 8, country: 'China' },
  { name: '天津', nameEn: 'Tianjin', nameCN: '天津', longitude: 117.1909, timezone: 8, country: 'China' },
  { name: '長沙', nameEn: 'Changsha', nameCN: '长沙', longitude: 112.9388, timezone: 8, country: 'China' },
  { name: '鄭州', nameEn: 'Zhengzhou', nameCN: '郑州', longitude: 113.6254, timezone: 8, country: 'China' },
  { name: '青島', nameEn: 'Qingdao', nameCN: '青岛', longitude: 120.3826, timezone: 8, country: 'China' },
  { name: '大連', nameEn: 'Dalian', nameCN: '大连', longitude: 121.6147, timezone: 8, country: 'China' },
  { name: '廈門', nameEn: 'Xiamen', nameCN: '厦门', longitude: 118.0894, timezone: 8, country: 'China' },
  { name: '福州', nameEn: 'Fuzhou', nameCN: '福州', longitude: 119.2965, timezone: 8, country: 'China' },
  { name: '昆明', nameEn: 'Kunming', nameCN: '昆明', longitude: 102.8329, timezone: 8, country: 'China' },
  { name: '哈爾濱', nameEn: 'Harbin', nameCN: '哈尔滨', longitude: 126.5350, timezone: 8, country: 'China' },
  { name: '瀋陽', nameEn: 'Shenyang', nameCN: '沈阳', longitude: 123.4315, timezone: 8, country: 'China' },
  { name: '長春', nameEn: 'Changchun', nameCN: '长春', longitude: 125.3235, timezone: 8, country: 'China' },
  { name: '濟南', nameEn: 'Jinan', nameCN: '济南', longitude: 117.0009, timezone: 8, country: 'China' },
  { name: '南昌', nameEn: 'Nanchang', nameCN: '南昌', longitude: 115.8921, timezone: 8, country: 'China' },
  { name: '合肥', nameEn: 'Hefei', nameCN: '合肥', longitude: 117.2272, timezone: 8, country: 'China' },
  { name: '石家莊', nameEn: 'Shijiazhuang', nameCN: '石家庄', longitude: 114.4896, timezone: 8, country: 'China' },
  { name: '太原', nameEn: 'Taiyuan', nameCN: '太原', longitude: 112.5489, timezone: 8, country: 'China' },
  { name: '蘭州', nameEn: 'Lanzhou', nameCN: '兰州', longitude: 103.8343, timezone: 8, country: 'China' },
  { name: '貴陽', nameEn: 'Guiyang', nameCN: '贵阳', longitude: 106.6302, timezone: 8, country: 'China' },
  { name: '南寧', nameEn: 'Nanning', nameCN: '南宁', longitude: 108.3200, timezone: 8, country: 'China' },
  { name: '海口', nameEn: 'Haikou', nameCN: '海口', longitude: 110.1999, timezone: 8, country: 'China' },

  // China - Western regions (significant time difference!)
  { name: '烏魯木齊', nameEn: 'Urumqi', nameCN: '乌鲁木齐', longitude: 87.6177, timezone: 8, country: 'China' },
  { name: '拉薩', nameEn: 'Lhasa', nameCN: '拉萨', longitude: 91.1409, timezone: 8, country: 'China' },
  { name: '西寧', nameEn: 'Xining', nameCN: '西宁', longitude: 101.7782, timezone: 8, country: 'China' },
  { name: '銀川', nameEn: 'Yinchuan', nameCN: '银川', longitude: 106.2309, timezone: 8, country: 'China' },
  { name: '呼和浩特', nameEn: 'Hohhot', nameCN: '呼和浩特', longitude: 111.7490, timezone: 8, country: 'China' },

  // Hong Kong & Macau
  { name: '香港', nameEn: 'Hong Kong', nameCN: '香港', longitude: 114.1694, timezone: 8, country: 'Hong Kong' },
  { name: '澳門', nameEn: 'Macau', nameCN: '澳门', longitude: 113.5439, timezone: 8, country: 'Macau' },

  // Singapore
  { name: '新加坡', nameEn: 'Singapore', nameCN: '新加坡', longitude: 103.8198, timezone: 8, country: 'Singapore' },

  // Malaysia
  { name: '吉隆坡', nameEn: 'Kuala Lumpur', nameCN: '吉隆坡', longitude: 101.6869, timezone: 8, country: 'Malaysia' },
  { name: '檳城', nameEn: 'Penang', nameCN: '槟城', longitude: 100.3287, timezone: 8, country: 'Malaysia' },
  { name: '怡保', nameEn: 'Ipoh', nameCN: '怡保', longitude: 101.0829, timezone: 8, country: 'Malaysia' },
  { name: '新山', nameEn: 'Johor Bahru', nameCN: '新山', longitude: 103.7414, timezone: 8, country: 'Malaysia' },

  // Other overseas Chinese communities
  { name: '東京', nameEn: 'Tokyo', nameCN: '东京', longitude: 139.6917, timezone: 9, country: 'Japan' },
  { name: '首爾', nameEn: 'Seoul', nameCN: '首尔', longitude: 126.9780, timezone: 9, country: 'South Korea' },
  { name: '曼谷', nameEn: 'Bangkok', nameCN: '曼谷', longitude: 100.5018, timezone: 7, country: 'Thailand' },
  { name: '雅加達', nameEn: 'Jakarta', nameCN: '雅加达', longitude: 106.8456, timezone: 7, country: 'Indonesia' },
  { name: '胡志明市', nameEn: 'Ho Chi Minh City', nameCN: '胡志明市', longitude: 106.6297, timezone: 7, country: 'Vietnam' },
  { name: '馬尼拉', nameEn: 'Manila', nameCN: '马尼拉', longitude: 120.9842, timezone: 8, country: 'Philippines' },

  // Western countries
  { name: '洛杉磯', nameEn: 'Los Angeles', nameCN: '洛杉矶', longitude: -118.2437, timezone: -8, country: 'USA' },
  { name: '紐約', nameEn: 'New York', nameCN: '纽约', longitude: -74.0060, timezone: -5, country: 'USA' },
  { name: '舊金山', nameEn: 'San Francisco', nameCN: '旧金山', longitude: -122.4194, timezone: -8, country: 'USA' },
  { name: '溫哥華', nameEn: 'Vancouver', nameCN: '温哥华', longitude: -123.1216, timezone: -8, country: 'Canada' },
  { name: '多倫多', nameEn: 'Toronto', nameCN: '多伦多', longitude: -79.3832, timezone: -5, country: 'Canada' },
  { name: '倫敦', nameEn: 'London', nameCN: '伦敦', longitude: -0.1276, timezone: 0, country: 'UK' },
  { name: '巴黎', nameEn: 'Paris', nameCN: '巴黎', longitude: 2.3522, timezone: 1, country: 'France' },
  { name: '雪梨', nameEn: 'Sydney', nameCN: '悉尼', longitude: 151.2093, timezone: 10, country: 'Australia' },
  { name: '墨爾本', nameEn: 'Melbourne', nameCN: '墨尔本', longitude: 144.9631, timezone: 10, country: 'Australia' },
]

/**
 * Search cities by name (supports all three languages)
 */
export function searchCities(query: string): City[] {
  const lowerQuery = query.toLowerCase()
  return cities.filter(
    (city) =>
      city.name.includes(query) ||
      city.nameEn.toLowerCase().includes(lowerQuery) ||
      city.nameCN.includes(query)
  )
}

/**
 * Get city by name
 */
export function getCityByName(name: string): City | undefined {
  return cities.find(
    (city) =>
      city.name === name ||
      city.nameEn.toLowerCase() === name.toLowerCase() ||
      city.nameCN === name
  )
}

/**
 * Get cities grouped by country
 */
export function getCitiesByCountry(): Record<string, City[]> {
  return cities.reduce((acc, city) => {
    if (!acc[city.country]) {
      acc[city.country] = []
    }
    acc[city.country].push(city)
    return acc
  }, {} as Record<string, City[]>)
}
