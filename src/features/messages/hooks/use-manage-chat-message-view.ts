"use client";

import { useCallback } from "react";
import { Role } from "@/shared/constants/type";
import { ChatMessagePayload } from "@/shared/types/socket";
import {
  getCurrentChatIdentity,
  toNullableNumber,
} from "@/features/messages/hooks/chat-identity";

export function useManageChatMessageView() {
  const viewer = getCurrentChatIdentity();

  const isOwnMessage = useCallback(
    (message: ChatMessagePayload) => {
      // In manage view, all messages from Admin/Employee should appear on the right
      // Messages from Guest should appear on the left
      const isStaffMessage =
        message.role === Role.Admin || message.role === Role.Employee;
      
      // Staff members viewing manage chat see all staff messages on the right
      return isStaffMessage;
    },
    [],
  );

  const getSenderLabel = useCallback(
    (message: ChatMessagePayload) => {
      const senderId = toNullableNumber(message.sender_id);
      const isCurrentUser = viewer.userId !== null && senderId !== null && viewer.userId === senderId;
      
      // Show "You" only for the current logged-in user
      if (isCurrentUser) return "Bạn";

      const sender = message.sender?.trim();
      if (sender && sender !== "You" && sender !== "Bạn") return sender;

      return senderId !== null ? `${message.role} #${senderId}` : message.role;
    },
    [viewer.userId],
  );

  return {
    isOwnMessage,
    getSenderLabel,
  };
}
