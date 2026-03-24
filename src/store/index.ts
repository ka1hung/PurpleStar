import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Chart, Settings, ChatSession, MasterType } from '../types'

interface AppState {
  // Charts
  charts: Chart[]
  currentChart: Chart | null
  addChart: (chart: Chart) => void
  setCurrentChart: (chart: Chart | null) => void
  deleteChart: (id: string) => void

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

  // UI State
  isCalculating: boolean
  setIsCalculating: (value: boolean) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
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

      // UI State
      isCalculating: false,
      setIsCalculating: (value) => set({ isCalculating: value }),
    }),
    {
      name: 'purple-star-storage',
      partialize: (state) => ({
        charts: state.charts,
        settings: state.settings,
        chatSessions: state.chatSessions,
        selectedMaster: state.selectedMaster,
      }),
    }
  )
)
