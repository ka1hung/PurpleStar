import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../store'
import { MasterSelector } from './MasterSelector'
import { MarkdownContent } from './MarkdownContent'
import { getMasterById } from '../../data/prompts'
import {
  sendChatMessage,
  formatChartForAI,
  buildSystemPrompt,
  suggestedQuestions,
} from '../../lib/openai'
import type { Chart, ChatMessage } from '../../types'

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
  const [showMasterSelector, setShowMasterSelector] = useState(false)

  // Check if API is configured
  const isApiConfigured = settings.apiEndpoint && settings.apiKey && settings.apiModel

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  // Check if user has scrolled up
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  const master = getMasterById(selectedMaster)

  const handleSelectMaster = (masterId: typeof selectedMaster) => {
    setSelectedMaster(masterId)
    setShowMasterSelector(false)
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
        {
          apiEndpoint: settings.apiEndpoint!,
          apiKey: settings.apiKey!,
          apiModel: settings.apiModel!,
        },
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

  if (!isApiConfigured) {
    return (
      <div className="bg-white rounded-lg shadow-classical p-6 text-center">
        <div className="text-5xl mb-4">⚙️</div>
        <h3 className="font-serif text-xl text-primary mb-4">請先設定 AI</h3>
        <p className="text-ink/60 text-sm mb-6">
          使用 AI 命理諮詢功能前，請先設定 API 路徑、Token 和模型。
        </p>
        <Link
          to="/settings"
          className="inline-block px-6 py-2 bg-primary text-cream rounded-classical
                     hover:bg-primary-dark transition-all"
        >
          前往設定
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow-classical overflow-hidden">
      {/* Master selector - collapsible */}
      <div className="border-b border-primary/10">
        <button
          onClick={() => setShowMasterSelector(!showMasterSelector)}
          className="w-full p-4 flex items-center justify-between hover:bg-cream/50 transition-colors"
        >
          <div className="flex items-center gap-3">
            <span className="text-2xl">{master.avatar}</span>
            <div className="text-left">
              <p className="font-medium text-ink">{t(master.nameKey)}</p>
              <p className="text-xs text-ink/50">{t(master.descKey)}</p>
            </div>
          </div>
          <svg
            className={`w-5 h-5 text-ink/40 transition-transform ${showMasterSelector ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        {showMasterSelector && (
          <div className="px-4 pb-4">
            <MasterSelector
              selectedMaster={selectedMaster}
              onSelect={handleSelectMaster}
            />
          </div>
        )}
      </div>

      {/* Chat messages */}
      <div className="relative">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="h-96 overflow-y-auto p-4 space-y-4 bg-cream/30">
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
              {message.role === 'assistant' ? (
                <MarkdownContent content={message.content} />
              ) : (
                <p className="whitespace-pre-wrap">{message.content}</p>
              )}
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
              <MarkdownContent content={streamingText} />
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

        {/* Scroll to bottom button - sticky at bottom right of chat area */}
        {showScrollButton && (
          <button
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 p-3 bg-primary text-cream rounded-full shadow-lg
                       hover:bg-primary-dark transition-all z-10"
            title="滾動到最新訊息"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </button>
        )}
      </div>

      {/* Input - sticky at bottom for mobile */}
      <div className="sticky bottom-0 border-t border-primary/10 bg-white chat-input-container">
        <div className="flex gap-2 items-center p-4 pb-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder={t('chat.inputPlaceholder')}
            disabled={isLoading}
            className="flex-1 min-w-0 px-4 py-2 border border-primary/20 rounded-classical
                       focus:outline-none focus:ring-2 focus:ring-primary/30
                       disabled:opacity-50"
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="flex-shrink-0 px-4 py-2 bg-primary text-cream rounded-classical
                       hover:bg-primary-dark transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed
                       whitespace-nowrap"
          >
            {t('chat.send')}
          </button>
        </div>
      </div>
    </div>
  )
}
