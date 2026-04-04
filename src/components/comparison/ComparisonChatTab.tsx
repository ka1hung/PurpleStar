import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAppStore } from '../../store'
import { MasterSelector } from '../chat/MasterSelector'
import { MarkdownContent } from '../chat/MarkdownContent'
import { getMasterById } from '../../data/prompts'
import {
  sendChatMessage,
  formatComparisonForAI,
  buildComparisonSystemPrompt,
  getComparisonSuggestedQuestions,
} from '../../lib/openai'
import type { Chart, ChartComparison, ChatMessage, ChatSession } from '../../types'

interface ComparisonChatTabProps {
  comparison: ChartComparison
  charts: Chart[]
}

export function ComparisonChatTab({
  comparison,
  charts,
}: ComparisonChatTabProps) {
  const { settings, selectedMaster, setSelectedMaster, addChatSession, getLatestComparisonSession, deleteComparisonSessions, chatSessions } = useAppStore()

  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [currentSessionId, setCurrentSessionId] = useState<string>('')
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [showMasterSelector, setShowMasterSelector] = useState(false)

  const isApiConfigured = settings.apiEndpoint && settings.apiKey && settings.apiModel

  // 進入時自動加載該比較的最新對話
  useEffect(() => {
    const latestSession = getLatestComparisonSession(comparison.id)
    if (latestSession) {
      setMessages(latestSession.messages)
      setCurrentSessionId(latestSession.id)
    } else {
      setMessages([])
      setCurrentSessionId(`session-${Date.now()}`)
    }
  }, [comparison.id, chatSessions])

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)
  const [showScrollButton, setShowScrollButton] = useState(false)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = messagesContainerRef.current
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100
      setShowScrollButton(!isNearBottom)
    }
  }

  const handleClearOldSessions = () => {
    if (confirm('確定要刪除所有舊對話紀錄嗎？目前對話將被保存。')) {
      // 先保存当前对话
      if (messages.length > 0) {
        const currentSession: ChatSession = {
          id: currentSessionId,
          comparisonId: comparison.id,
          masterId: selectedMaster,
          messages: messages,
          createdAt: new Date(),
        }
        addChatSession(currentSession)
      }
      // 再删除所有旧对话
      deleteComparisonSessions(comparison.id)
      setMessages([])
      setCurrentSessionId(`session-${Date.now()}`)
    }
  }

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
      const comparisonMembers = comparison.members.map((member) => ({
        chart: charts.find((c) => c.id === member.chartId)!,
        role: member.role,
        label: member.label,
      }))

      const comparisonContext = formatComparisonForAI(comparisonMembers)
      const systemPrompt = buildComparisonSystemPrompt(selectedMaster, comparisonContext)

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

      const updatedMessages = [...messages, userMessage, assistantMessage]
      setMessages(updatedMessages)
      setStreamingText('')

      // 只在取得回應後保存對話
      const session: ChatSession = {
        id: currentSessionId,
        comparisonId: comparison.id,
        masterId: selectedMaster,
        messages: updatedMessages,
        createdAt: new Date(),
      }
      addChatSession(session)
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
          使用 AI 合盤諮詢功能前，請先設定 API 路徑、Token 和模型。
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

  const suggestedQuestions = getComparisonSuggestedQuestions(comparison.members)
  const master = getMasterById(selectedMaster)

  return (
    <div className="bg-white rounded-lg shadow-classical overflow-hidden flex flex-col h-[80vh]">
      {/* Master selector header */}
      <div className="border-b border-primary/10">
        <div className="flex items-center gap-2 p-4">
          <button
            onClick={() => setShowMasterSelector(!showMasterSelector)}
            className="flex-1 flex items-center justify-between gap-3 hover:bg-cream/50 transition-colors rounded-classical px-2 py-1"
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">{master.avatar}</span>
              <div className="text-left">
                <p className="font-medium text-ink">{master.name}</p>
                <p className="text-xs text-ink/50">{master.desc}</p>
              </div>
            </div>
            <svg
              className={`w-5 h-5 text-ink/40 transition-transform ${
                showMasterSelector ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          <button
            onClick={handleClearOldSessions}
            className="p-2 rounded-classical transition-all text-ink/40 hover:text-red-500 hover:bg-red-500/10"
            title="清除舊對話"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>

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
      <div className="flex-1 relative min-h-0">
        <div
          ref={messagesContainerRef}
          onScroll={handleScroll}
          className="h-full overflow-y-auto p-4 space-y-4 bg-cream/30"
        >
          {messages.length === 0 && !streamingText && (
            <div className="text-center py-8">
              <div className="text-5xl mb-4">{master.avatar}</div>
              <p className="text-ink/60 mb-2">
                {master.name} 準備為您分析 {comparison.name} 的合盤
              </p>
              <p className="text-sm text-ink/50 mb-6">
                {comparison.members.length} 人 · 您可以詢問他們之間的關係、相容度或相處建議
              </p>

              <div className="mt-6">
                <p className="text-sm text-ink/40 mb-3">推薦提問：</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {suggestedQuestions.slice(0, 3).map((q, i) => (
                    <button
                      key={i}
                      onClick={() => handleSuggestedQuestion(q)}
                      className="px-3 py-1.5 text-sm bg-white border border-primary/20
                                 rounded-full hover:border-primary/40 transition-all text-left"
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
                      {master.name}
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

          {streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg px-4 py-3 bg-white border border-primary/10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{master.avatar}</span>
                  <span className="text-sm font-medium text-primary">
                    {master.name}
                  </span>
                </div>
                <MarkdownContent content={streamingText} />
              </div>
            </div>
          )}

          {isLoading && !streamingText && (
            <div className="flex justify-start">
              <div className="bg-white border border-primary/10 rounded-lg px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{master.avatar}</span>
                  <span className="text-sm text-ink/60">分析中...</span>
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

      {/* Input */}
      <div className="sticky bottom-0 border-t border-primary/10 bg-white chat-input-container">
        <div className="flex gap-2 items-center p-4 pb-0">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            placeholder="詢問他們之間的關係..."
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
            發送
          </button>
        </div>
      </div>
    </div>
  )
}
