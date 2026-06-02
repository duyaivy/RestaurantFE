"use client";

import { useEffect, useMemo, useState } from "react";
import { X, MessageCircle, ChevronDown } from "lucide-react";
import { useChatStore } from "@/features/messages/store/use-chat-store";
import { useGuestChatMessageView } from "@/features/messages/hooks/use-guest-chat-message-view";
import { useMikiChat } from "@/features/messages/hooks/use-miki-chat";
import { useStaffChat } from "@/features/messages/hooks/use-staff-chat";
import { useChatMode } from "@/features/messages/hooks/use-chat-mode";
import { ChatModeSwitcher } from "@/features/messages/components/ChatModeSwitcher";
import {
  AssistantRenderMessage,
  ChatMessagesList,
} from "@/features/messages/components/ChatMessagesList";
import { ChatInputBar } from "@/features/messages/components/ChatInputBar";
import { ChatSuggestions } from "@/features/messages/components/ChatSuggestions";
import { ChatMode } from "@/features/messages/types/chatbot.types";
import { useTranslations } from "next-intl";
import {
  CHATBOT_QUESTION_KEYS,
  getChatbotQuestionTranslationKey,
} from "@/features/messages/constants/chatbot";
import useChatbotStore from "@/features/messages/store/use-chatbot-store";

interface MikiAssistantProps {
  userName?: string;
}

export function MikiAssistant({ userName }: MikiAssistantProps) {
  const t = useTranslations("chatbot");
  const [isOpen, setIsOpen] = useState(false);
  const [staffModeError, setStaffModeError] = useState<string | null>(null);
  const { pendingQuestion, setPendingQuestion } = useChatbotStore();

  const chatSuggestions = useMemo(
    () =>
      CHATBOT_QUESTION_KEYS.map((questionKey) =>
        t(getChatbotQuestionTranslationKey(questionKey)),
      ),
    [t],
  );

  const mikiChat = useMikiChat({ userName });
  const staffChat = useStaffChat();
  const { mode, setMode, canUseStaffMode } = useChatMode({
    defaultMode: "ai",
    canUseStaffMode: staffChat.canUseStaffMode,
  });

  const { messages: staffSocketMessages } = useChatStore();
  const { isOwnMessage, getSenderLabel } = useGuestChatMessageView();

  // Handle pending question from quick reply clicks
  useEffect(() => {
    if (pendingQuestion) {
      setIsOpen(true);
      // Small delay to ensure chat is open before sending
      setTimeout(() => {
        void mikiChat.sendMessage(pendingQuestion);
        setPendingQuestion(null);
      }, 100);
    }
  }, [pendingQuestion, mikiChat, setPendingQuestion]);

  const aiRenderMessages = useMemo<AssistantRenderMessage[]>(
    () =>
      mikiChat.messages.map((message) => ({
        id: message.id,
        text: message.message,
        timestamp: message.timestamp,
        isOwn: message.sender === "user",
        senderLabel: message.sender === "user" ? t("you") : t("assistantName"),
        roleLabel: message.sender === "user" ? t("guestRole") : t("aiRole"),
        status: message.status,
        isMarkdown:
          message.sender === "assistant" && message.status !== "pending",
        thinkingSeconds:
          message.id === mikiChat.pendingMessageId
            ? mikiChat.thinkingSeconds
            : undefined,
        citations: message.citations,
        items: message.items,
      })),
    [mikiChat.messages, mikiChat.pendingMessageId, mikiChat.thinkingSeconds, t],
  );

  const staffRenderMessages = useMemo<AssistantRenderMessage[]>(
    () =>
      staffSocketMessages.map((message, index) => {
        const isOwn = isOwnMessage(message);

        return {
          id: `${message.timestamp}-${index}`,
          text: message.message,
          timestamp: message.timestamp,
          isOwn,
          senderLabel: isOwn ? "You" : getSenderLabel(message),
          roleLabel: message.role,
        };
      }),
    [staffSocketMessages, isOwnMessage, getSenderLabel],
  );

  const activeMessages = mode === "ai" ? aiRenderMessages : staffRenderMessages;
  const showSuggestions = mode === "ai" && aiRenderMessages.length <= 1;

  const isInputDisabled = mode === "staff" && !staffChat.canUseStaffMode;
  const inputPlaceholder =
    mode === "ai"
      ? t("input.aiPlaceholder")
      : isInputDisabled
        ? t("input.staffDisconnected")
        : t("input.staffPlaceholder");

  const handleSendMessage = async (message: string) => {
    setStaffModeError(null);

    if (mode === "ai") {
      await mikiChat.sendMessage(message);
      return;
    }

    staffChat.sendStaffMessage(message);
  };

  const handleSuggestionClick = async (suggestion: string) => {
    setStaffModeError(null);
    await mikiChat.sendMessage(suggestion);
  };

  const handleModeChange = (nextMode: ChatMode) => {
    const didChange = setMode(nextMode);

    if (!didChange && nextMode === "staff") {
      setStaffModeError(
        staffChat.lastError ||
          (staffChat.isConnecting
            ? t("errors.staffConnecting")
            : t("errors.staffOffline")),
      );
      return;
    }

    setStaffModeError(null);
  };

  useEffect(() => {
    if (staffChat.canUseStaffMode) {
      setStaffModeError(null);
    }
  }, [staffChat.canUseStaffMode]);

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(245,158,11,0.4)]"
        title={t("fabTitle")}
      >
        {isOpen ? (
          <ChevronDown className="w-5 h-5 text-black" strokeWidth={2.5} />
        ) : (
          <MessageCircle className="w-5 h-5 text-black" strokeWidth={2} />
        )}
      </button>

      {/* Chat Panel */}
      {isOpen && (
        <div
          className="fixed bottom-34 right-4 z-40 w-[calc(100vw-2rem)] max-w-80 rounded-3xl bg-[#161412] border border-white/8 shadow-2xl flex flex-col overflow-hidden"
          style={{ height: "420px" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center">
                <MessageCircle
                  className="w-3.5 h-3.5 text-amber-400"
                  strokeWidth={1.5}
                />
              </div>
              <div>
                <p className="text-sm font-semibold text-white leading-none">
                  {t("title")}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {mode === "ai" ? (
                    <p className="text-sm text-green-400/80">
                      {t("headerStatus.ai")}
                    </p>
                  ) : !staffChat.isConnected ? (
                    <p className="text-sm text-red-400/80">
                      {t("headerStatus.staffOffline")}
                    </p>
                  ) : staffChat.isConnecting ? (
                    <p className="text-sm text-amber-400/80">
                      {t("headerStatus.staffConnecting")}
                    </p>
                  ) : (
                    <p className="text-sm text-green-400/80">
                      {t("headerStatus.staffOnline")}
                    </p>
                  )}
                </div>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-xl bg-white/6 flex items-center justify-center hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-white/50" strokeWidth={2} />
            </button>
          </div>

          <div className="px-3 pt-2 pb-2 border-b border-white/6">
            <ChatModeSwitcher
              mode={mode}
              onModeChange={handleModeChange}
              canUseStaffMode={canUseStaffMode}
              staffModeError={staffModeError}
            />
          </div>

          <ChatMessagesList
            messages={activeMessages}
            thinkingLabel={(seconds) => t("messages.thinking", { seconds })}
            recommendedItemsLabel={t("messages.recommendedItems")}
          />

          {/* Suggestions */}
          {showSuggestions ? (
            <ChatSuggestions
              suggestions={chatSuggestions}
              onSuggestionClick={(suggestion) =>
                void handleSuggestionClick(suggestion)
              }
              disabled={mikiChat.isSending}
            />
          ) : null}

          {mikiChat.errorMessage && mode === "ai" ? (
            <div className="px-3 pb-2">
              <p className="text-[11px] text-red-300/90">
                {mikiChat.errorMessage}
              </p>
            </div>
          ) : null}

          <ChatInputBar
            onSend={handleSendMessage}
            disabled={isInputDisabled}
            isSending={mode === "ai" ? mikiChat.isSending : false}
            placeholder={inputPlaceholder}
          />

          {mode === "staff" && isInputDisabled ? (
            <div className="px-3 pb-3">
              <button
                type="button"
                onClick={() => setMode("ai")}
                className="w-full rounded-xl border border-amber-500/40 text-amber-300 text-xs py-2 hover:bg-amber-500/10 transition-colors"
              >
                {t("mode.switchToAi")}
              </button>
            </div>
          ) : null}
        </div>
      )}
    </>
  );
}
