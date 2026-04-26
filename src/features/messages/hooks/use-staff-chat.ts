"use client";

import { useCallback } from "react";
import { useTableChat } from "@/features/messages/hooks/use-table-chat";
import { useSocket } from "@/shared/hooks/use-socket";

export function useStaffChat() {
  const { sendMessage } = useTableChat();
  const { isConnected, isConnecting, lastError } = useSocket();

  const canUseStaffMode = isConnected;

  const sendStaffMessage = useCallback(
    (message: string) => {
      const content = message.trim();
      if (!content || !canUseStaffMode) {
        return false;
      }

      sendMessage(content);
      return true;
    },
    [canUseStaffMode, sendMessage],
  );

  return {
    sendStaffMessage,
    canUseStaffMode,
    isConnected,
    isConnecting,
    lastError,
  };
}
