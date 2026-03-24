import { useTranslation } from 'react-i18next'

export function Disclaimer() {
  const { t } = useTranslation()

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-primary text-center mb-8">
        {t('nav.disclaimer')}
      </h1>

      <div className="bg-white rounded-lg shadow-classical p-8 prose prose-lg max-w-none">
        <h2 className="font-serif text-2xl text-primary">服務性質</h2>
        <p>
          本網站提供的紫微斗數命盤計算與 AI 諮詢服務，僅供娛樂與自我探索參考之用。
        </p>

        <h2 className="font-serif text-2xl text-primary mt-8">重要聲明</h2>

        <h3 className="font-serif text-xl text-primary/80">1. 非專業建議</h3>
        <p>
          本服務不構成任何醫療、法律、財務或其他專業建議。如有相關需求，請諮詢合格的專業人士。
        </p>

        <h3 className="font-serif text-xl text-primary/80">2. AI 回覆聲明</h3>
        <p>
          AI 命理師的回覆由人工智慧生成，不代表真實命理師的意見，也不保證準確性。
        </p>

        <h3 className="font-serif text-xl text-primary/80">3. 命理參考性質</h3>
        <p>
          命理學屬於傳統文化範疇，其準確性與科學性尚未得到現代科學完全驗證。命盤分析結果僅供參考，不應作為重大人生決策的唯一依據。
        </p>

        <h3 className="font-serif text-xl text-primary/80">4. 個人責任</h3>
        <p>
          用戶基於本服務內容所做的任何決定，應自行承擔相關責任。
        </p>

        <h2 className="font-serif text-2xl text-primary mt-8">未成年人使用</h2>
        <p>
          建議未滿 18 歲的用戶在家長或監護人陪同下使用本服務。
        </p>

        <h2 className="font-serif text-2xl text-primary mt-8">心理健康資源</h2>
        <p>如果您正在經歷情緒困擾，請尋求專業協助：</p>
        <ul>
          <li>台灣自殺防治專線：1925（24小時）</li>
          <li>生命線：1995</li>
          <li>張老師專線：1980</li>
        </ul>
      </div>
    </div>
  )
}
