"use client";

import { useCallback, useState } from "react";
import { ChatMode } from "@/features/messages/types/chatbot.types";

interface UseChatModeOptions {
  defaultMode?: ChatMode;
  canUseStaffMode: boolean;
}

export function useChatMode({
  defaultMode = "ai",
  canUseStaffMode,
}: UseChatModeOptions) {
  const [mode, setModeState] = useState<ChatMode>(defaultMode);

  const setMode = useCallback(
    (nextMode: ChatMode) => {
      if (nextMode === "staff" && !canUseStaffMode) {
        return false;
      }

      setModeState(nextMode);
      return true;
    },
    [canUseStaffMode],
  );

  return {
    mode,
    setMode,
    canUseStaffMode,
  };
}
