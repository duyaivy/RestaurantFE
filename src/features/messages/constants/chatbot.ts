export const CHATBOT_QUESTION_KEYS = [
  "categories",
  "howToOrder",
  "deliveryTime",
  "deliveryAvailable",
] as const;

export type ChatbotQuestionKey = (typeof CHATBOT_QUESTION_KEYS)[number];

export function getChatbotQuestionTranslationKey(
  questionKey: ChatbotQuestionKey,
) {
  return `quickReplies.${questionKey}` as const;
}

export function getChatbotAnswerTranslationKey(
  questionKey: ChatbotQuestionKey,
) {
  return `answers.${questionKey}` as const;
}
