export function Privacy() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="font-serif text-4xl text-primary text-center mb-8">
        隱私政策
      </h1>

      <div className="bg-white rounded-lg shadow-classical p-8 prose prose-lg max-w-none">
        <h2 className="font-serif text-2xl text-primary">資料收集</h2>
        <p>
          本網站<strong>不收集</strong>任何個人資料。所有資料均儲存於您的瀏覽器本地（localStorage）。
        </p>

        <h2 className="font-serif text-2xl text-primary mt-8">本地儲存內容</h2>
        <ul>
          <li>您輸入的出生資料</li>
          <li>計算後的命盤資料</li>
          <li>AI 對話記錄</li>
          <li>您的 OpenAI API Key</li>
          <li>介面偏好設定（主題）</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary mt-8">API Key 安全提醒</h2>
        <ul>
          <li>您的 API Key 僅儲存於本地瀏覽器</li>
          <li>我們不會傳送您的 API Key 至任何第三方伺服器</li>
          <li>API 請求直接從您的瀏覽器發送至 OpenAI</li>
          <li>建議定期更換 API Key 以確保安全</li>
        </ul>

        <h2 className="font-serif text-2xl text-primary mt-8">第三方服務</h2>
        <p>
          本服務使用 OpenAI API 提供 AI 對話功能。當您使用 AI 諮詢時，對話內容會傳送至 OpenAI 處理。請參閱 OpenAI 的隱私政策了解詳情。
        </p>

        <h2 className="font-serif text-2xl text-primary mt-8">資料刪除</h2>
        <p>
          您可以隨時在瀏覽器中清除本地儲存資料，或使用本網站提供的「清除所有資料」功能。
        </p>
      </div>
    </div>
  )
}
