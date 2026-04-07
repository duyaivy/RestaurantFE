"use client";

import { useCallback } from "react";
import { Role } from "@/constants/type";
import { useSocket } from "@/hooks/common/useSocket";
import { getCurrentChatIdentity } from "@/hooks/common/chat-identity";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { ChatSendPayload } from "@/types/socket";

export interface UseTableChatReturn {
  sendMessage: (message: string, tableNumber?: number) => void;
}

export function useTableChat(): UseTableChatReturn {
  const { socket, isConnected } = useSocket();

  const sendMessage = useCallback(
    (message: string, tableNumber?: number) => {
      if (!socket || !isConnected) return;

      const content = message.trim();
      if (!content) return;

      const { role: userRole } = getCurrentChatIdentity();

      const payload: ChatSendPayload = { message: content };

      if (userRole === Role.Admin || userRole === Role.Employee) {
        if (typeof tableNumber !== "number") return;
        payload.table_number = tableNumber;
      }

      socket.emit(SOCKET_EVENTS.CHAT_SEND, payload);
    },
    [socket, isConnected],
  );

  return { sendMessage };
}
