"use client";

import { useMutation } from "@tanstack/react-query";
import { useCallback, useMemo, useState } from "react";
import chatbotApiRequest from "@/features/messages/api/chatbot.api";
import { useThinkingTimer } from "@/features/messages/hooks/use-thinking-timer";
import {
  AiChatMessage,
  ChatbotResponse,
  SendChatbotMessagePayload,
} from "@/features/messages/types/chatbot.types";
import { useLocale, useTranslations } from "next-intl";

interface UseMikiChatOptions {
  userName?: string;
}

interface UseMikiChatReturn {
  messages: AiChatMessage[];
  isSending: boolean;
  errorMessage: string | null;
  conversationId: number | null;
  pendingMessageId: string | null;
  thinkingSeconds: number;
  sendMessage: (message: string) => Promise<void>;
}

function createMessageId(prefix: "user" | "assistant") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

export function useMikiChat({
  userName,
}: UseMikiChatOptions): UseMikiChatReturn {
  const locale = useLocale() as "vi" | "en";
  const t = useTranslations("chatbot");

  const welcomeMessage = useMemo<AiChatMessage>(
    () => ({
      id: createMessageId("assistant"),
      sender: "assistant",
      message: userName
        ? t("welcomeWithName", { name: userName })
        : t("welcome"),
      timestamp: new Date().toISOString(),
    }),
    [t, userName],
  );

  const [messages, setMessages] = useState<AiChatMessage[]>([welcomeMessage]);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [pendingMessageId, setPendingMessageId] = useState<string | null>(null);
  const { elapsedSeconds, startTimer, stopTimer } = useThinkingTimer();

  const sendMutation = useMutation({
    mutationFn: (payload: SendChatbotMessagePayload) =>
      chatbotApiRequest.sendChatbotMessage(payload),
  });

  const sendMessage = useCallback(
    async (message: string) => {
      const content = message.trim();
      if (!content) {
        return;
      }

      setErrorMessage(null);

      const userMessage: AiChatMessage = {
        id: createMessageId("user"),
        sender: "user",
        message: content,
        timestamp: new Date().toISOString(),
      };

      const placeholderId = createMessageId("assistant");
      const pendingAssistantMessage: AiChatMessage = {
        id: placeholderId,
        sender: "assistant",
        message: t("messages.thinking", { seconds: 0 }),
        timestamp: new Date().toISOString(),
        status: "pending",
      };

      setMessages((prev) => [...prev, userMessage, pendingAssistantMessage]);
      setPendingMessageId(placeholderId);
      startTimer();

      try {
        const response = await sendMutation.mutateAsync({
          message: content,
          ...(conversationId ? { conversation_id: conversationId } : {}),
          locale,
        });

        const payload = response.payload as ChatbotResponse;

        setConversationId(payload.conversation_id);
        setMessages((prev) =>
          prev.map((item) => {
            if (item.id !== placeholderId) {
              return item;
            }

            return {
              ...item,
              message: payload.answer,
              status: undefined,
              citations: payload.citations,
              items: payload.items,
            };
          }),
        );
        stopTimer();
        setPendingMessageId(null);
      } catch {
        const failedMessage = t("errors.connection");

        setErrorMessage(failedMessage);
        setMessages((prev) =>
          prev.map((item) => {
            if (item.id !== placeholderId) {
              return item;
            }

            return {
              ...item,
              message: failedMessage,
              status: "error",
            };
          }),
        );
        stopTimer();
        setPendingMessageId(null);
      }
    },
    [conversationId, locale, sendMutation, startTimer, stopTimer, t],
  );

  return {
    messages,
    isSending: sendMutation.isPending,
    errorMessage,
    conversationId,
    pendingMessageId,
    thinkingSeconds: pendingMessageId ? elapsedSeconds : 0,
    sendMessage,
  };
}
