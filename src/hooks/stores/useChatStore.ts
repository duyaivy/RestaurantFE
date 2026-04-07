import { create } from 'zustand'
import { ChatMessagePayload } from '@/types/socket'

export type ChatStatus = 'idle' | 'joining' | 'joined' | 'error'

interface ChatStore {
  messages: ChatMessagePayload[]
  errors: string[]
  status: ChatStatus
  
  // Actions
  addMessage: (msg: ChatMessagePayload) => void
  removeLastMessage: () => void // For rollback on errors
  addError: (err: string) => void
  setStatus: (status: ChatStatus) => void
  reset: () => void
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  errors: [],
  status: 'idle',

  addMessage: (msg) => set((state) => ({ messages: [...state.messages, msg] })),
  
  removeLastMessage: () => set((state) => ({ 
    messages: state.messages.slice(0, -1) 
  })),

  addError: (err) => set((state) => ({ errors: [...state.errors, err] })),
  
  setStatus: (status) => set({ status }),
  
  reset: () => set({ messages: [], errors: [], status: 'idle' }),
}))
