import { useTranslation } from 'react-i18next'

export function About() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-primary text-center mb-8">
        {t('nav.about')}
      </h1>

      <div className="bg-white rounded-lg shadow-classical p-8 prose prose-lg max-w-none">
        <h2 className="font-serif text-2xl text-primary">專案介紹</h2>
        <p>
          紫微星盤是一個免費、開源的紫微斗數命盤計算工具，致力於提供最準確的命盤計算與最友善的使用體驗。
        </p>

        <h2 className="font-serif text-2xl text-primary mt-8">核心特色</h2>
        <ul>
          <li><strong>真太陽時校正</strong> - 還原古法精準時辰計算</li>
          <li><strong>AI 命理諮詢</strong> - 8 種風格命理師任選</li>
          <li><strong>完整科普教學</strong> - 新手也能看懂</li>
          <li><strong>三語系支援</strong> - 繁中、簡中、英文</li>
          <li><strong>隱私保護</strong> - 資料不上傳，完全本地運算</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary mt-8">開源資訊</h2>
        <p>
          本專案採用 MIT 授權，歡迎貢獻與使用。
        </p>

        <h2 className="font-serif text-2xl text-primary mt-8">技術棧</h2>
        <ul>
          <li>React + TypeScript</li>
          <li>Tailwind CSS</li>
          <li>Vite</li>
          <li>i18next</li>
          <li>Zustand</li>
        </ul>
      </div>
    </div>
  )
}
