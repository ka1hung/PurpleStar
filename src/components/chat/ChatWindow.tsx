import { useState, useRef, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAppStore } from '../../store'
import { MasterSelector } from './MasterSelector'
import { getMasterById } from '../../data/prompts'
import {
  sendChatMessage,
  formatChartForAI,
  buildSystemPrompt,
  suggestedQuestions,
} from '../../lib/openai'
import type { Chart, ChatMessage, MasterType } from '../../types'

interface ChatWindowProps {
  chart: Chart
}

export function ChatWindow({ chart }: ChatWindowProps) {
  const { t } = useTranslation()
  const { settings, selectedMaster, setSelectedMaster } = useAppStore()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [showApiKeyInput, setShowApiKeyInput] = useState(!settings.apiKey)
  const [apiKeyInput, setApiKeyInput] = useState('')

  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, streamingText])

  const master = getMasterById(selectedMaster)

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      useAppStore.getState().updateSettings({ apiKey: apiKeyInput.trim() })
      setShowApiKeyInput(false)
    }
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput('')
    setIsLoading(true)
    setStreamingText('')

    try {
      const chartContext = formatChartForAI(chart)
      const systemPrompt = buildSystemPrompt(selectedMaster, chartContext)

      const apiMessages = [
        { role: 'system' as const, content: systemPrompt },
        ...messages.map((m) => ({
          role: m.role as 'user' | 'assistant',
          content: m.content,
        })),
        { role: 'user' as const, content: userMessage.content },
      ]

      const response = await sendChatMessage(
        apiMessages,
        settings.apiKey!,
        (text) => setStreamingText(text)
      )

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
      setStreamingText('')
    } catch (error) {
      console.error('Chat error:', error)
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `抱歉，發生錯誤：${error instanceof Error ? error.message : '未知錯誤'}`,
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setInput(question)
  }

  if (showApiKeyInput) {
    return (
      <div className="bg-white rounded-lg shadow-classical p-6">
        <h3 className="font-serif text-xl text-primary mb-4">設定 OpenAI API Key</h3>
        <p className="text-ink/60 text-sm mb-4">
          請輸入您的 OpenAI API Key 以使用 AI 諮詢功能。
          您的 Key 只會儲存在本地瀏覽器中。
        </p>
        <div className="flex gap-2">
          <input
            type="password"
            value={apiKeyInput}
            onChange={(e) => setApiKeyInput(e.target.value)}
            placeholder="sk-..."
            className="flex-1 px-4 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
          <button
            onClick={handleSaveApiKey}
            className="px-6 py-2 bg-primary text-cream rounded-classical
                       hover:bg-primary-dark transition-all"
          >
            儲存
          </button>
        </div>
        <p className="text-xs text-ink/40 mt-2">
          <a
            href="https://platform.openai.com/api-keys"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-primary"
          >
            取得 API Key
          </a>
        </p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-classical overflow-hidden">
      {/* Master selector */}
      <div className="p-4 border-b border-primary/10">
        <h3 className="font-serif text-lg text-primary mb-3">
          {t('chat.selectMaster')}
        </h3>
        <MasterSelector
          selectedMaster={selectedMaster}
          onSelect={setSelectedMaster}
        />
      </div>

      {/* Chat messages */}
      <div className="h-96 overflow-y-auto p-4 space-y-4 bg-cream/30">
        {messages.length === 0 && !streamingText && (
          <div className="text-center py-8">
            <div className="text-5xl mb-4">{master.avatar}</div>
            <p className="text-ink/60">
              {t(master.nameKey)} 準備為您解讀命盤
            </p>
            {/* Suggested questions */}
            <div className="mt-6">
              <p className="text-sm text-ink/40 mb-2">{t('chat.suggestedQuestions')}</p>
              <div className="flex flex-wrap justify-center gap-2">
                {suggestedQuestions.slice(0, 4).map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSuggestedQuestion(q)}
                    className="px-3 py-1.5 text-sm bg-white border border-primary/20
                               rounded-full hover:border-primary/40 transition-all"
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`
                max-w-[80%] rounded-lg px-4 py-3
                ${
                  message.role === 'user'
                    ? 'bg-primary text-cream'
                    : 'bg-white border border-primary/10'
                }
              `}
            >
              {message.role === 'assistant' && (
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{master.avatar}</span>
                  <span className="text-sm font-medium text-primary">
                    {t(master.nameKey)}
                  </span>
                </div>
              )}
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}

        {/* Streaming message */}
        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white border border-primary/10">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg">{master.avatar}</span>
                <span className="text-sm font-medium text-primary">
                  {t(master.nameKey)}
                </span>
              </div>
              <p className="whitespace-pre-wrap">{streamingText}</p>
            </div>
          </div>
        )}

        {/* Loading indicator */}
        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="bg-white border border-primary/10 rounded-lg px-4 py-3">
              <div className="flex items-center gap-2">
                <span className="text-lg">{master.avatar}</span>
                <span className="text-sm text-ink/60">{t('chat.thinking')}</span>
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce" />
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-100" />
                  <span className="w-2 h-2 bg-primary/40 rounded-full animate-bounce delay-200" />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-primary/10">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={t('chat.inputPlaceholder')}
            disabled={isLoading}
            className="flex-1 px-4 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-6 py-2 bg-primary text-cream rounded-classical
                       hover:bg-primary-dark transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('chat.send')}
          </button>
        </div>
      </div>
    </div>
  )
}
