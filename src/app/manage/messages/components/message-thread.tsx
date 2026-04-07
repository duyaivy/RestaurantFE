"use client";

import { MessageCircle } from "lucide-react";
import { ChatMessagePayload } from "@/types/socket";
import { formatTime } from "./format-time";

interface MessageThreadProps {
  currentRoomMessages: ChatMessagePayload[];
  isOwnMessage: (message: ChatMessagePayload) => boolean;
  getSenderLabel: (message: ChatMessagePayload) => string;
}

export default function MessageThread({
  currentRoomMessages,
  isOwnMessage,
  getSenderLabel,
}: MessageThreadProps) {
  return (
    <div className="flex-1 overflow-y-auto px-4 py-3">
      {currentRoomMessages.length === 0 ? (
        <div className="flex h-full items-center justify-center">
          <div className="text-center text-sm text-muted-foreground">
            <MessageCircle className="mx-auto mb-2 h-8 w-8 opacity-40" />
            Chưa có tin nhắn cho bàn này
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {currentRoomMessages.map((msg: ChatMessagePayload, idx) => {
            const isMine = isOwnMessage(msg);
            const senderLabel = getSenderLabel(msg);

            return (
              <div
                key={`${msg.timestamp}-${idx}`}
                className={`flex ${isMine ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`max-w-3/4 rounded-2xl px-3 py-2 text-sm ${
                    isMine
                      ? "rounded-tr-md bg-primary text-primary-foreground"
                      : "rounded-tl-md bg-muted"
                  }`}
                >
                  {!isMine && (
                    <p className="mb-1 text-xs font-semibold text-muted-foreground">
                      {senderLabel} · {msg.role}
                    </p>
                  )}
                  <p className="whitespace-pre-wrap wrap-break-word">
                    {msg.message}
                  </p>
                  <p className="mt-1 text-right text-sm opacity-70">
                    {formatTime(msg.timestamp)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
