import { create } from "zustand";
import { ChatbotQuestionKey } from "@/features/messages/constants/chatbot";

interface ChatbotState {
  selectedChatbot: ChatbotQuestionKey | null;
  setSelectedChatbot: (selectedChatbot: ChatbotQuestionKey | null) => void;
}

const useChatbotStore = create<ChatbotState>((set) => ({
  selectedChatbot: null,
  setSelectedChatbot: (selectedChatbot: ChatbotQuestionKey | null) =>
    set({ selectedChatbot }),
}));

export default useChatbotStore;
