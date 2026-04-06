"use client";

import { useCallback } from "react";
import { Role } from "@/constants/type";
import { ChatMessagePayload } from "@/types/socket";
import { toNullableNumber } from "@/hooks/common/chat-identity";

export function useGuestChatMessageView() {
  const isOwnMessage = useCallback((message: ChatMessagePayload) => {
    // Guest screen must always treat guest messages as "You"
    return message.role === Role.Guest;
  }, []);

  const getSenderLabel = useCallback(
    (message: ChatMessagePayload) => {
      if (isOwnMessage(message)) return "You";

      const sender = message.sender?.trim();
      if (sender && sender !== "You") return sender;

      const senderId = toNullableNumber(message.sender_id);
      return senderId !== null ? `${message.role} #${senderId}` : message.role;
    },
    [isOwnMessage],
  );

  return {
    isOwnMessage,
    getSenderLabel,
  };
}
