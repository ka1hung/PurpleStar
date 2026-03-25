import { useState, useEffect } from 'react'
import { useAppStore } from '../store'
import { Button } from '../components/common/Button'

interface ModelInfo {
  id: string
  name: string
}

// API Provider presets
const API_PRESETS = [
  {
    name: 'OpenAI',
    endpoint: 'https://api.openai.com/v1',
    placeholder: 'sk-...',
    defaultModel: 'gpt-4o-mini',
  },
  {
    name: 'Anthropic',
    endpoint: 'https://api.anthropic.com',
    placeholder: 'sk-ant-...',
    defaultModel: 'claude-3-5-sonnet-20241022',
  },
  {
    name: 'Ollama (本地)',
    endpoint: 'http://localhost:11434/v1',
    placeholder: '(不需要)',
    defaultModel: 'llama3',
  },
  {
    name: 'Groq',
    endpoint: 'https://api.groq.com/openai/v1',
    placeholder: 'gsk_...',
    defaultModel: 'llama-3.1-70b-versatile',
  },
]

export function Settings() {
  const { settings, updateSettings } = useAppStore()

  const [apiEndpoint, setApiEndpoint] = useState(settings.apiEndpoint || '')
  const [apiKey, setApiKey] = useState(settings.apiKey || '')
  const [apiModel, setApiModel] = useState(settings.apiModel || '')
  const [saved, setSaved] = useState(false)
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null)

  // Model fetching state
  const [models, setModels] = useState<ModelInfo[]>([])
  const [loadingModels, setLoadingModels] = useState(false)
  const [modelError, setModelError] = useState('')

  // Connection test state
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null)

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

  const handlePresetSelect = (preset: typeof API_PRESETS[0]) => {
    setApiEndpoint(preset.endpoint)
    setApiModel(preset.defaultModel)
    setSelectedPreset(preset.name)
    setModels([])
    setTestResult(null)
  }

  const testConnection = async () => {
    const isOllama = apiEndpoint.includes('localhost:11434') || apiEndpoint.includes('127.0.0.1:11434')
    const isGroq = apiEndpoint.includes('groq')

    if (!apiEndpoint || (!apiKey && !isOllama)) {
      setTestResult({ success: false, message: '請先填寫 API 路徑和 Token' })
      return
    }

    setTesting(true)
    setTestResult(null)

    try {
      const isAnthropic = apiEndpoint.includes('anthropic')

      if (isAnthropic) {
        // Anthropic API test - use messages endpoint with minimal request
        const response = await fetch(`${apiEndpoint}/v1/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': apiKey,
            'anthropic-version': '2023-06-01',
          },
          body: JSON.stringify({
            model: apiModel || 'claude-3-5-haiku-20241022',
            max_tokens: 1,
            messages: [{ role: 'user', content: 'Hi' }],
          }),
        })

        if (response.ok || response.status === 400) {
          setTestResult({ success: true, message: '連線成功！API 金鑰有效' })
        } else if (response.status === 401) {
          setTestResult({ success: false, message: 'API 金鑰無效' })
        } else {
          setTestResult({ success: false, message: `連線失敗: ${response.status}` })
        }
      } else if (isOllama) {
        // Ollama - test with models endpoint (no auth needed)
        const response = await fetch(`${apiEndpoint}/models`, {
          method: 'GET',
        })

        if (response.ok) {
          setTestResult({ success: true, message: '連線成功！Ollama 服務正常運行' })
        } else {
          setTestResult({ success: false, message: `連線失敗: ${response.status}` })
        }
      } else if (isGroq) {
        // Groq - test with chat completion
        const testModel = apiModel || 'llama-3.1-8b-instant'
        const response = await fetch(`${apiEndpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify({
            model: testModel,
            max_tokens: 5,
            messages: [{ role: 'user', content: 'Hi' }],
          }),
        })

        if (response.ok) {
          setTestResult({ success: true, message: '連線成功！Groq API 正常' })
        } else if (response.status === 401 || response.status === 403) {
          setTestResult({ success: false, message: 'API 金鑰無效或無權限' })
        } else {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData.error?.message || response.statusText
          setTestResult({ success: false, message: `連線失敗: ${errorMsg}` })
        }
      } else {
        // OpenAI compatible API - test with chat completion
        const testModel = apiModel || 'gpt-4o-mini'

        // No token limits - let API use defaults
        const requestBody: Record<string, unknown> = {
          model: testModel,
          messages: [{ role: 'user', content: 'Hi' }],
        }

        const response = await fetch(`${apiEndpoint}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
          },
          body: JSON.stringify(requestBody),
        })

        if (response.ok) {
          setTestResult({ success: true, message: `連線成功！模型 ${testModel} 可用` })
        } else if (response.status === 401) {
          setTestResult({ success: false, message: 'API 金鑰無效' })
        } else if (response.status === 404) {
          setTestResult({ success: false, message: `模型 ${testModel} 不存在，請確認模型名稱` })
        } else {
          const errorData = await response.json().catch(() => ({}))
          const errorMsg = errorData.error?.message || response.statusText
          setTestResult({ success: false, message: `連線失敗: ${errorMsg}` })
        }
      }
    } catch (error) {
      console.error('Connection test failed:', error)
      setTestResult({
        success: false,
        message: error instanceof Error ? `錯誤: ${error.message}` : '連線測試失敗'
      })
    } finally {
      setTesting(false)
    }
  }

  const fetchModels = async () => {
    const isOllama = apiEndpoint.includes('localhost:11434') || apiEndpoint.includes('127.0.0.1:11434')

    if (!apiEndpoint || (!apiKey && !isOllama)) {
      setModelError('請先填寫 API 路徑和 Token')
      return
    }

    setLoadingModels(true)
    setModelError('')
    setModels([])

    try {
      // Determine API type based on endpoint
      const isOpenAI = apiEndpoint.includes('openai')
      const isAnthropic = apiEndpoint.includes('anthropic')
      const isGroq = apiEndpoint.includes('groq')

      let fetchedModels: ModelInfo[] = []

      if (isOllama) {
        // Ollama - use /api/tags endpoint
        const response = await fetch(apiEndpoint.replace('/v1', '') + '/api/tags')

        if (!response.ok) {
          throw new Error(`Ollama 錯誤: ${response.status}`)
        }

        const data = await response.json()
        fetchedModels = (data.models || []).map((m: any) => ({
          id: m.name,
          name: m.name,
        }))
      } else if (isAnthropic) {
        // Anthropic doesn't have a public models endpoint
        fetchedModels = [
          { id: 'claude-sonnet-4-20250514', name: 'Claude Sonnet 4' },
          { id: 'claude-opus-4-20250514', name: 'Claude Opus 4' },
          { id: 'claude-3-5-sonnet-20241022', name: 'Claude 3.5 Sonnet' },
          { id: 'claude-3-5-haiku-20241022', name: 'Claude 3.5 Haiku' },
          { id: 'claude-3-opus-20240229', name: 'Claude 3 Opus' },
        ]
      } else if (isGroq) {
        // Groq - provide known models
        fetchedModels = [
          { id: 'llama-3.3-70b-versatile', name: 'Llama 3.3 70B' },
          { id: 'llama-3.1-70b-versatile', name: 'Llama 3.1 70B' },
          { id: 'llama-3.1-8b-instant', name: 'Llama 3.1 8B' },
          { id: 'mixtral-8x7b-32768', name: 'Mixtral 8x7B' },
          { id: 'gemma2-9b-it', name: 'Gemma 2 9B' },
        ]
      } else if (isOpenAI || apiEndpoint.includes('/v1')) {
        // OpenAI compatible API
        const response = await fetch(`${apiEndpoint}/models`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()

        // Filter and sort models (prioritize chat models)
        fetchedModels = (data.data || [])
          .map((m: any) => ({ id: m.id, name: m.id }))
          .filter((m: ModelInfo) =>
            m.id.includes('gpt') ||
            m.id.includes('claude') ||
            m.id.includes('chat') ||
            m.id.includes('turbo') ||
            m.id.includes('o1') ||
            m.id.includes('o3')
          )
          .sort((a: ModelInfo, b: ModelInfo) => {
            const priority = ['gpt-4o', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5', 'o1', 'o3']
            const aIdx = priority.findIndex(p => a.id.includes(p))
            const bIdx = priority.findIndex(p => b.id.includes(p))
            if (aIdx !== -1 && bIdx !== -1) return aIdx - bIdx
            if (aIdx !== -1) return -1
            if (bIdx !== -1) return 1
            return a.id.localeCompare(b.id)
          })
      } else {
        // Try generic OpenAI-compatible endpoint
        const response = await fetch(`${apiEndpoint}/models`, {
          headers: {
            'Authorization': `Bearer ${apiKey}`,
          },
        })

        if (!response.ok) {
          throw new Error(`API 錯誤: ${response.status} ${response.statusText}`)
        }

        const data = await response.json()
        fetchedModels = (data.data || data.models || [])
          .map((m: any) => ({ id: m.id || m.name, name: m.id || m.name }))
      }

      setModels(fetchedModels)

      if (fetchedModels.length === 0) {
        setModelError('未找到可用模型')
      }
    } catch (error) {
      console.error('Failed to fetch models:', error)
      setModelError(error instanceof Error ? error.message : '取得模型列表失敗')
    } finally {
      setLoadingModels(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-serif text-primary mb-8">AI 設定</h1>

      <div className="bg-white rounded-lg border border-primary/20 p-6 space-y-6">
        {/* Preset Selector */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            快速選擇 API 服務
          </label>
          <div className="flex flex-wrap gap-2">
            {API_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => handlePresetSelect(preset)}
                className={`px-3 py-1.5 text-sm rounded-full border transition-all
                  ${selectedPreset === preset.name
                    ? 'bg-primary text-cream border-primary'
                    : 'bg-white text-ink border-primary/30 hover:border-primary/60'
                  }`}
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>

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
            {selectedPreset === 'Ollama (本地)' && (
              <span className="ml-2 text-xs text-ink/50">(本地服務不需要)</span>
            )}
          </label>
          <input
            type="password"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder={API_PRESETS.find(p => p.name === selectedPreset)?.placeholder || 'sk-...'}
            disabled={selectedPreset === 'Ollama (本地)'}
            className="w-full px-4 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       bg-white font-mono disabled:bg-gray-100 disabled:text-ink/50"
          />
          <p className="text-xs text-ink/50 mt-1">
            您的 API 金鑰將安全地儲存在瀏覽器本地
          </p>
        </div>

        {/* Test Connection */}
        <div>
          <Button
            variant="outline"
            onClick={testConnection}
            loading={testing}
          >
            {testing ? '測試中...' : '測試連線'}
          </Button>

          {testResult && (
            <div className={`mt-2 p-3 rounded-classical text-sm ${
              testResult.success
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-red-50 border border-red-200 text-red-700'
            }`}>
              {testResult.success ? '✓ ' : '✗ '}{testResult.message}
            </div>
          )}
        </div>

        {/* Model */}
        <div>
          <label className="block text-sm font-medium text-ink mb-2">
            模型 (Model)
          </label>

          {/* Fetch Models Button */}
          <Button
            variant="secondary"
            onClick={fetchModels}
            loading={loadingModels}
            className="mb-3"
          >
            {loadingModels ? '取得中...' : '取得模型列表'}
          </Button>

          {/* Error Message */}
          {modelError && (
            <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-classical text-red-600 text-sm">
              {modelError}
            </div>
          )}

          {/* Models List */}
          {models.length > 0 && (
            <div className="mb-3 max-h-60 overflow-y-auto border border-primary/20 rounded-classical">
              {models.map((model) => (
                <button
                  key={model.id}
                  type="button"
                  onClick={() => setApiModel(model.id)}
                  className={`w-full text-left px-4 py-2 text-sm transition-colors
                    ${apiModel === model.id
                      ? 'bg-primary text-cream'
                      : 'hover:bg-cream'
                    }`}
                >
                  <span className="font-mono">{model.id}</span>
                  {model.name !== model.id && (
                    <span className="ml-2 text-xs opacity-70">({model.name})</span>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* Manual Input */}
          <div>
            <label className="block text-xs text-ink/60 mb-1">
              或直接輸入模型名稱：
            </label>
            <input
              type="text"
              value={apiModel}
              onChange={(e) => setApiModel(e.target.value)}
              placeholder="gpt-4o-mini"
              className="w-full px-4 py-2 border border-primary/20 rounded-classical
                         focus:outline-none focus:ring-2 focus:ring-primary/30
                         bg-white font-mono text-sm"
            />
          </div>

          {/* Selected Model Display */}
          {apiModel && (
            <p className="mt-2 text-sm text-primary">
              已選擇: <span className="font-mono font-medium">{apiModel}</span>
            </p>
          )}
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
          <li>• 點擊上方按鈕快速選擇 API 服務，或手動填寫路徑</li>
          <li>• API 金鑰僅儲存在您的瀏覽器本地，不會上傳到任何伺服器</li>
          <li>• <strong>OpenAI</strong>: 推薦使用 gpt-4o-mini 性價比最高</li>
          <li>• <strong>Anthropic</strong>: Claude 系列模型，智能程度高</li>
          <li>• <strong>Ollama</strong>: 本地運行，完全免費，需先安裝 Ollama</li>
          <li>• <strong>Groq</strong>: 超快速推理，免費額度充足</li>
        </ul>
      </div>
    </div>
  )
}
