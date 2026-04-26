import http from "@/shared/api/http";
import {
  ChatbotResponse,
  SendChatbotMessagePayload,
} from "@/features/messages/types/chatbot.types";

const CHATBOT_URL = "";

const chatbotApiRequest = {
  sendChatbotMessage: (payload: SendChatbotMessagePayload) =>
    http.post<ChatbotResponse>(`${CHATBOT_URL}/chat/`, payload),
  getConversations: () => http.get<unknown>(`${CHATBOT_URL}/conversations/`),
  getConversationMessages: (conversationId: number) =>
    http.get<unknown>(
      `${CHATBOT_URL}/conversations/${conversationId}/messages/`,
    ),
};

export default chatbotApiRequest;
