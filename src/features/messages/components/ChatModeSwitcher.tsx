"use client";

import { ChatMode } from "@/features/messages/types/chatbot.types";
import { useTranslations } from "next-intl";

interface ChatModeSwitcherProps {
  mode: ChatMode;
  onModeChange: (mode: ChatMode) => void;
  canUseStaffMode: boolean;
  staffModeError?: string | null;
}

export function ChatModeSwitcher({
  mode,
  onModeChange,
  canUseStaffMode,
  staffModeError,
}: ChatModeSwitcherProps) {
  const t = useTranslations("chatbot");

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-2 gap-1.5 rounded-xl bg-white/5 p-1 border border-white/8">
        <button
          type="button"
          onClick={() => onModeChange("ai")}
          className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
            mode === "ai"
              ? "bg-amber-500 text-black"
              : "bg-transparent text-white/70 hover:text-white"
          }`}
        >
          {t("mode.ai")}
        </button>
        <button
          type="button"
          onClick={() => onModeChange("staff")}
          className={`rounded-lg px-2 py-1.5 text-xs font-medium transition-colors ${
            mode === "staff"
              ? "bg-amber-500 text-black"
              : "bg-transparent text-white/70 hover:text-white"
          }`}
        >
          {t("mode.staff")}
          {canUseStaffMode ? null : (
            <span className="ml-1 text-[10px] text-red-300/90">
              {t("mode.offline")}
            </span>
          )}
        </button>
      </div>

      {staffModeError ? (
        <p className="rounded-lg border border-red-500/20 bg-red-500/10 px-2 py-1 text-[11px] text-red-300">
          {staffModeError}
        </p>
      ) : null}
    </div>
  );
}
