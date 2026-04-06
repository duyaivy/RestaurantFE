"use client";

import { useCallback } from "react";
import { Role } from "@/constants/type";
import { ChatMessagePayload } from "@/types/socket";
import {
  getCurrentChatIdentity,
  toNullableNumber,
} from "@/hooks/common/chat-identity";

export function useManageChatMessageView() {
  const viewer = getCurrentChatIdentity();

  const isOwnMessage = useCallback(
    (message: ChatMessagePayload) => {
      const senderId = toNullableNumber(message.sender_id);

      if (viewer.userId !== null && senderId !== null) {
        return viewer.userId === senderId;
      }

      const isStaffRole =
        message.role === Role.Admin || message.role === Role.Employee;
      if (!isStaffRole || !viewer.role) return false;

      // Fallback for payloads without stable sender_id in staff dashboards.
      return message.role === viewer.role;
    },
    [viewer.role, viewer.userId],
  );

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
