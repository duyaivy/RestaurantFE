import { create } from "zustand";
import { ChatbotQuestionKey } from "@/features/messages/constants/chatbot";

interface ChatbotState {
  selectedChatbot: ChatbotQuestionKey | null;
  pendingQuestion: string | null;
  setSelectedChatbot: (selectedChatbot: ChatbotQuestionKey | null) => void;
  setPendingQuestion: (question: string | null) => void;
}

const useChatbotStore = create<ChatbotState>((set) => ({
  selectedChatbot: null,
  pendingQuestion: null,
  setSelectedChatbot: (selectedChatbot: ChatbotQuestionKey | null) =>
    set({ selectedChatbot }),
  setPendingQuestion: (question: string | null) => set({ pendingQuestion: question }),
}));

export default useChatbotStore;
