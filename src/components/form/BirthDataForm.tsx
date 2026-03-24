import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '../common/Button'
import { cities } from '../../lib/cities'
import type { BirthData, City } from '../../types'

interface BirthDataFormProps {
  onSubmit: (data: BirthData) => void
  isLoading?: boolean
}

export function BirthDataForm({ onSubmit, isLoading = false }: BirthDataFormProps) {
  const { t } = useTranslation()

  const currentYear = new Date().getFullYear()

  const [name, setName] = useState('')
  const [gender, setGender] = useState<'male' | 'female'>('male')
  const [birthYear, setBirthYear] = useState(String(currentYear - 30))
  const [birthMonth, setBirthMonth] = useState('1')
  const [birthDay, setBirthDay] = useState('1')
  const [birthHour, setBirthHour] = useState('11')
  const [selectedCity, setSelectedCity] = useState<City | null>(null)
  const [useTrueSolarTime, setUseTrueSolarTime] = useState(true)
  const [errors, setErrors] = useState<string[]>([])

  // Generate year options (1900 to current year)
  const yearOptions = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i)

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => i + 1)

  // Generate day options based on selected year and month
  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month, 0).getDate()
  }
  const dayOptions = Array.from(
    { length: getDaysInMonth(Number(birthYear), Number(birthMonth)) },
    (_, i) => i + 1
  )

  // Generate hour options with Chinese time periods (時辰)
  const hourOptions = [
    { value: '0', label: '子時早 (00:00-00:59)' },
    { value: '1', label: '丑時早 (01:00-02:59)' },
    { value: '3', label: '寅時 (03:00-04:59)' },
    { value: '5', label: '卯時 (05:00-06:59)' },
    { value: '7', label: '辰時 (07:00-08:59)' },
    { value: '9', label: '巳時 (09:00-10:59)' },
    { value: '11', label: '午時 (11:00-12:59)' },
    { value: '13', label: '未時 (13:00-14:59)' },
    { value: '15', label: '申時 (15:00-16:59)' },
    { value: '17', label: '酉時 (17:00-18:59)' },
    { value: '19', label: '戌時 (19:00-20:59)' },
    { value: '21', label: '亥時 (21:00-22:59)' },
    { value: '23', label: '子時晚 (23:00-23:59)' },
  ]

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cityName = e.target.value
    const city = cities.find(c => c.name === cityName) || null
    setSelectedCity(city)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors: string[] = []
    if (!selectedCity) newErrors.push('請選擇出生地點')

    if (newErrors.length > 0) {
      setErrors(newErrors)
      return
    }

    setErrors([])
    const year = Number(birthYear)
    const month = Number(birthMonth)
    const day = Number(birthDay)

    const data: BirthData = {
      name: name || undefined,
      gender,
      birthDate: new Date(year, month - 1, day),
      birthTime: `${birthHour}:00`,
      birthPlace: selectedCity!.name,
      longitude: selectedCity!.longitude,
      timezone: selectedCity!.timezone,
    }

    onSubmit(data)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Name (optional) */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('calculator.form.name')}
        </label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t('calculator.form.namePlaceholder')}
          className="w-full px-4 py-2 border border-primary/20 rounded-classical
                     focus:outline-none focus:ring-2 focus:ring-primary/30
                     bg-white"
        />
      </div>

      {/* Gender */}
      <div>
        <label className="block text-sm font-medium text-ink mb-2">
          {t('calculator.form.gender')}
        </label>
        <div className="flex gap-4">
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="male"
              checked={gender === 'male'}
              onChange={() => setGender('male')}
              className="sr-only"
            />
            <span
              className={`
                px-6 py-2 rounded-classical border-2 transition-all
                ${gender === 'male'
                  ? 'bg-primary text-cream border-primary'
                  : 'bg-white text-ink border-primary/20 hover:border-primary/40'
                }
              `}
            >
              {t('calculator.form.male')}
            </span>
          </label>
          <label className="flex items-center cursor-pointer">
            <input
              type="radio"
              name="gender"
              value="female"
              checked={gender === 'female'}
              onChange={() => setGender('female')}
              className="sr-only"
            />
            <span
              className={`
                px-6 py-2 rounded-classical border-2 transition-all
                ${gender === 'female'
                  ? 'bg-primary text-cream border-primary'
                  : 'bg-white text-ink border-primary/20 hover:border-primary/40'
                }
              `}
            >
              {t('calculator.form.female')}
            </span>
          </label>
        </div>
      </div>

      {/* Birth Date */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('calculator.form.birthDate')}
        </label>
        <div className="grid grid-cols-3 gap-2">
          <select
            value={birthYear}
            onChange={(e) => setBirthYear(e.target.value)}
            className="px-3 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       bg-white text-center"
          >
            {yearOptions.map((year) => (
              <option key={year} value={year}>{year} 年</option>
            ))}
          </select>
          <select
            value={birthMonth}
            onChange={(e) => setBirthMonth(e.target.value)}
            className="px-3 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       bg-white text-center"
          >
            {monthOptions.map((month) => (
              <option key={month} value={month}>{month} 月</option>
            ))}
          </select>
          <select
            value={birthDay}
            onChange={(e) => setBirthDay(e.target.value)}
            className="px-3 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       bg-white text-center"
          >
            {dayOptions.map((day) => (
              <option key={day} value={day}>{day} 日</option>
            ))}
          </select>
        </div>
      </div>

      {/* Birth Time */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('calculator.form.birthTime')}
        </label>
        <select
          value={birthHour}
          onChange={(e) => setBirthHour(e.target.value)}
          className="w-full px-4 py-2 border border-primary/20 rounded-classical
                     focus:outline-none focus:ring-2 focus:ring-primary/30
                     bg-white"
        >
          {hourOptions.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Birth Place */}
      <div>
        <label className="block text-sm font-medium text-ink mb-1">
          {t('calculator.form.birthPlace')}
        </label>
        <select
          value={selectedCity?.name || ''}
          onChange={handleCityChange}
          className="w-full px-4 py-2 border border-primary/20 rounded-classical
                     focus:outline-none focus:ring-2 focus:ring-primary/30
                     bg-white"
        >
          <option value="">-- 請選擇出生地 --</option>
          <optgroup label="台灣">
            {cities.filter(c => c.country === 'Taiwan').map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({city.nameEn})
              </option>
            ))}
          </optgroup>
          <optgroup label="中國大陸">
            {cities.filter(c => c.country === 'China').map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({city.nameEn})
              </option>
            ))}
          </optgroup>
          <optgroup label="港澳">
            {cities.filter(c => c.country === 'Hong Kong' || c.country === 'Macau').map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({city.nameEn})
              </option>
            ))}
          </optgroup>
          <optgroup label="東南亞">
            {cities.filter(c => ['Singapore', 'Malaysia', 'Thailand', 'Indonesia', 'Vietnam', 'Philippines'].includes(c.country)).map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({city.nameEn})
              </option>
            ))}
          </optgroup>
          <optgroup label="其他地區">
            {cities.filter(c => ['Japan', 'South Korea', 'USA', 'Canada', 'UK', 'France', 'Australia'].includes(c.country)).map(city => (
              <option key={city.name} value={city.name}>
                {city.name} ({city.nameEn})
              </option>
            ))}
          </optgroup>
        </select>

        {/* Selected city info */}
        {selectedCity && (
          <p className="text-xs text-ink/50 mt-1">
            經度: {selectedCity.longitude.toFixed(4)}° · 時區: UTC{selectedCity.timezone >= 0 ? '+' : ''}{selectedCity.timezone}
          </p>
        )}
      </div>

      {/* True Solar Time Toggle */}
      <div className="flex items-center justify-between p-4 bg-gold/10 rounded-classical">
        <div>
          <p className="font-medium text-ink">{t('calculator.solarTime.title')}</p>
          <p className="text-sm text-ink/60">
            依出生地經度校正真太陽時
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={useTrueSolarTime}
            onChange={(e) => setUseTrueSolarTime(e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-11 h-6 bg-ink/20 peer-focus:outline-none peer-focus:ring-2
                          peer-focus:ring-primary/30 rounded-full peer
                          peer-checked:after:translate-x-full peer-checked:after:border-white
                          after:content-[''] after:absolute after:top-[2px] after:left-[2px]
                          after:bg-white after:rounded-full after:h-5 after:w-5
                          after:transition-all peer-checked:bg-primary" />
        </label>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-classical">
          <ul className="text-red-700 text-sm space-y-1">
            {errors.map((error, i) => (
              <li key={i}>{error}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={isLoading}
      >
        {isLoading ? t('calculator.form.calculating') : t('calculator.form.calculate')}
      </Button>
    </form>
  )
}
