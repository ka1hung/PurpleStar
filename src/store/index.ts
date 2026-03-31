import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chart, Settings, ChatSession, MasterType, ChartComparison } from '../types'

interface AppState {
  // Charts
  charts: Chart[]
  currentChart: Chart | null
  addChart: (chart: Chart) => void
  setCurrentChart: (chart: Chart | null) => void
  deleteChart: (id: string) => void

  // Comparisons (multi-chart)
  comparisons: ChartComparison[]
  currentComparison: ChartComparison | null
  addComparison: (comparison: ChartComparison) => void
  updateComparison: (id: string, updates: Partial<ChartComparison>) => void
  deleteComparison: (id: string) => void
  setCurrentComparison: (comparison: ChartComparison | null) => void

  // Settings
  settings: Settings
  updateSettings: (settings: Partial<Settings>) => void

  // Chat
  chatSessions: ChatSession[]
  currentSession: ChatSession | null
  selectedMaster: MasterType
  setSelectedMaster: (master: MasterType) => void
  addChatSession: (session: ChatSession) => void
  setCurrentSession: (session: ChatSession | null) => void
  getLatestComparisonSession: (comparisonId: string) => ChatSession | null
  getLatestChartSession: (chartId: string) => ChatSession | null
  deleteComparisonSessions: (comparisonId: string) => void
  deleteChartSessions: (chartId: string) => void

  // UI State
  isCalculating: boolean
  setIsCalculating: (value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Charts
      charts: [],
      currentChart: null,
      addChart: (chart) =>
        set((state) => ({
          charts: [chart, ...state.charts],
          currentChart: chart,
        })),
      setCurrentChart: (chart) => set({ currentChart: chart }),
      deleteChart: (id) =>
        set((state) => ({
          charts: state.charts.filter((c) => c.id !== id),
          currentChart:
            state.currentChart?.id === id ? null : state.currentChart,
        })),

      // Comparisons
      comparisons: [],
      currentComparison: null,
      addComparison: (comparison) =>
        set((state) => ({
          comparisons: [comparison, ...state.comparisons],
          currentComparison: comparison,
        })),
      updateComparison: (id, updates) =>
        set((state) => ({
          comparisons: state.comparisons.map((c) =>
            c.id === id ? { ...c, ...updates } : c
          ),
          currentComparison:
            state.currentComparison?.id === id
              ? { ...state.currentComparison, ...updates }
              : state.currentComparison,
        })),
      deleteComparison: (id) =>
        set((state) => ({
          comparisons: state.comparisons.filter((c) => c.id !== id),
          currentComparison:
            state.currentComparison?.id === id ? null : state.currentComparison,
        })),
      setCurrentComparison: (comparison) =>
        set({ currentComparison: comparison }),

      // Settings
      settings: {
        theme: 'light',
        apiEndpoint: 'https://api.openai.com/v1',
        apiKey: '',
        apiModel: 'gpt-4o-mini',
      },
      updateSettings: (newSettings) =>
        set((state) => ({
          settings: { ...state.settings, ...newSettings },
        })),

      // Chat
      chatSessions: [],
      currentSession: null,
      selectedMaster: 'lin',
      setSelectedMaster: (master) => set({ selectedMaster: master }),
      addChatSession: (session) =>
        set((state) => ({
          chatSessions: [session, ...state.chatSessions],
          currentSession: session,
        })),
      setCurrentSession: (session) => set({ currentSession: session }),
      getLatestComparisonSession: (comparisonId) => {
        const state = get()
        return state.chatSessions.find((s) => s.comparisonId === comparisonId) || null
      },
      getLatestChartSession: (chartId) => {
        const state = get()
        return state.chatSessions.find((s) => s.chartId === chartId) || null
      },
      deleteComparisonSessions: (comparisonId) =>
        set((state) => ({
          chatSessions: state.chatSessions.filter((s) => s.comparisonId !== comparisonId),
        })),
      deleteChartSessions: (chartId) =>
        set((state) => ({
          chatSessions: state.chatSessions.filter((s) => s.chartId !== chartId),
        })),

      // UI State
      isCalculating: false,
      setIsCalculating: (value: boolean) => set({ isCalculating: value }),
    }),
    {
      name: 'purple-star-storage',
      partialize: (state) => ({
        charts: state.charts,
        comparisons: state.comparisons,
        settings: state.settings,
        chatSessions: state.chatSessions,
        selectedMaster: state.selectedMaster,
      }),
    }
  )
)
