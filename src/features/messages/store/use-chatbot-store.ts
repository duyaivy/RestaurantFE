import { create } from "zustand";

interface ChatbotState {
    selectedChatbot: string | null;
    setSelectedChatbot: (selectedChatbot: string | null) => void;
}

const useChatbotStore = create<ChatbotState>((set) => ({
    selectedChatbot: null,
    setSelectedChatbot: (selectedChatbot: string | null) => set({ selectedChatbot }),
}));

export default useChatbotStore;