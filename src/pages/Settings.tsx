import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../store'
import { Button } from '../components/common/Button'

export function Settings() {
  const { t } = useTranslation()
  const { settings, updateSettings } = useAppStore()

  const [apiEndpoint, setApiEndpoint] = useState(settings.apiEndpoint || '')
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [apiModel, setApiModel] = useState(settings.apiModel || '')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setApiEndpoint(settings.apiEndpoint || '')
    setApiKey(settings.apiKey || '')
    setApiModel(settings.apiModel || '')
  }, [settings])

  const handleSave = () => {
    updateSettings({
      apiEndpoint,
      apiKey,
      apiModel,
    })
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const commonModels = [
    { value: 'gpt-4o', label: 'GPT-4o' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
    { value: 'claude-sonnet-4-20250514', label: 'Claude Sonnet 4' },
    { value: 'claude-3-5-sonnet-20241022', label: 'Claude 3.5 Sonnet' },
  ]

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-primary mb-8">AI 設定</h1>

      <div className="bg-white rounded-lg border border-primary/20 p-6 space-y-6">
        {/* API Endpoint */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            API 路徑 (Endpoint)
          </label>
          <input
            type="text"
            value={apiEndpoint}
            onChange={(e) => setApiEndpoint(e.target.value)}
            placeholder="https://api.openai.com/v1"
            className="w-full px-4 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       bg-white"
          />
          <p className="text-xs text-ink/50 mt-1">
            OpenAI: https://api.openai.com/v1 | Anthropic: https://api.anthropic.com
          </p>
        </div>

        {/* API Key */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            API Token (Key)
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="sk-..."
            className="w-full px-4 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       bg-white font-mono"
          />
          <p className="text-xs text-ink/50 mt-1">
            您的 API 金鑰將安全地儲存在瀏覽器本地
          </p>
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            模型 (Model)
          </label>
          <div className="flex gap-2">
            <select
              value={commonModels.some(m => m.value === apiModel) ? apiModel : ''}
              onChange={(e) => setApiModel(e.target.value)}
              className="flex-1 px-4 py-2 border border-primary/20 rounded-classical
                         focus:outline-none focus:ring-2 focus:ring-primary/30
                         bg-white"
            >
              <option value="">-- 選擇常用模型 --</option>
              <optgroup label="OpenAI">
                {commonModels.filter(m => m.value.startsWith('gpt')).map(model => (
                  <option key={model.value} value={model.value}>{model.label}</option>
                ))}
              </optgroup>
              <optgroup label="Anthropic">
                {commonModels.filter(m => m.value.startsWith('claude')).map(model => (
                  <option key={model.value} value={model.value}>{model.label}</option>
                ))}
              </optgroup>
            </select>
          </div>
          <input
            type="text"
            value={apiModel}
            onChange={(e) => setApiModel(e.target.value)}
            placeholder="或直接輸入模型名稱"
            className="w-full mt-2 px-4 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       bg-white font-mono text-sm"
          />
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-primary/10">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={handleSave}
          >
            {saved ? '已儲存!' : '確定儲存'}
          </Button>
        </div>

        {/* Status */}
        {saved && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-classical text-green-700 text-center">
            設定已儲存成功
          </div>
        )}
      </div>

      {/* Info Section */}
      <div className="mt-8 p-4 bg-gold/10 rounded-lg">
        <h3 className="font-medium text-ink mb-2">使用說明</h3>
        <ul className="text-sm text-ink/70 space-y-1">
          <li>• API 金鑰僅儲存在您的瀏覽器本地，不會上傳到任何伺服器</li>
          <li>• 使用 OpenAI API 需要有效的 API Key</li>
          <li>• 建議使用 gpt-4o-mini 以獲得較好的性價比</li>
          <li>• 如使用其他相容 API，請修改 API 路徑</li>
        </ul>
      </div>
    </div>
  )
}
