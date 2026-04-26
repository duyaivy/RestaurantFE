export interface ChatbotCitation {
  source: string;
  title: string;
  distance: number;
}

export interface ChatbotRecommendedItem {
  name: string;
  id: string;
  image_url: string;
}

export interface ChatbotResponse {
  conversation_id: number;
  answer: string;
  citations: ChatbotCitation[];
  items: ChatbotRecommendedItem[];
}

export interface SendChatbotMessagePayload {
  message: string;
  conversation_id?: number;
}

export interface AiChatMessage {
  id: string;
  sender: "user" | "assistant";
  message: string;
  timestamp: string;
  status?: "pending" | "error";
  citations?: ChatbotCitation[];
  items?: ChatbotRecommendedItem[];
}

export type ChatMode = "ai" | "staff";
