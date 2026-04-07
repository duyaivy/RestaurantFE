"use client";
import React, { useEffect, useRef } from "react";
import { Role } from "@/constants/type";
import { useChatMessageView } from "@/hooks/common/useChatMessageView";
import { ChatMessagePayload } from "@/types/socket";
const ROLE_LABEL: Record<string, string> = {
  [Role.Admin]: "Admin",
  [Role.Employee]: "Staff",
  [Role.Guest]: "Guest",
};
const ROLE_COLOR: Record<string, string> = {
  [Role.Admin]: "#7c3aed",
  [Role.Employee]: "#2563eb",
  [Role.Guest]: "#059669",
};
function formatTime(iso: string): string {
  try {
    return new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}
export interface MessageListProps {
  messages: ChatMessagePayload[];
}
export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const { isOwnMessage, getSenderLabel } = useChatMessageView();

  // Auto-scroll to the latest message whenever the list grows
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);
  if (messages.length === 0) {
    return (
      <div style={styles.empty}>
        Không có tin nhắn nào. Hãy bắt đầu cuộc trò chuyện!
      </div>
    );
  }
  return (
    <div style={styles.list}>
      {messages.map((msg, idx) => {
        const isMine = isOwnMessage(msg);
        const senderLabel = getSenderLabel(msg);
        const roleLabel = ROLE_LABEL[msg.role] ?? msg.role;
        const roleColor = ROLE_COLOR[msg.role] ?? "#6b7280";
        return (
          <div
            key={`${msg.timestamp}-${idx}`}
            style={{
              ...styles.row,
              flexDirection: isMine ? "row-reverse" : "row",
            }}
          >
            {/* Avatar */}
            <div
              style={{
                ...styles.avatar,
                backgroundColor: roleColor + "22",
                color: roleColor,
              }}
            >
              {msg.sender.charAt(0).toUpperCase()}
            </div>
            {/* Bubble */}
            <div style={{ maxWidth: "70%" }}>
              {/* Sender meta */}
              <div
                style={{
                  ...styles.meta,
                  justifyContent: isMine ? "flex-end" : "flex-start",
                }}
              >
                <span style={{ fontWeight: 600, fontSize: "13px" }}>
                  {isMine ? "You" : senderLabel}
                </span>
                <span
                  style={{
                    fontSize: "11px",
                    padding: "1px 6px",
                    borderRadius: "6px",
                    backgroundColor: roleColor + "20",
                    color: roleColor,
                    fontWeight: 500,
                  }}
                >
                  {roleLabel}
                </span>
                <span style={{ fontSize: "11px", color: "#9ca3af" }}>
                  {formatTime(msg.timestamp)}
                </span>
              </div>
              {/* Message bubble */}
              <div
                style={{
                  ...styles.bubble,
                  backgroundColor: isMine ? "#6366f1" : "#f3f4f6",
                  color: isMine ? "#ffffff" : "#111827",
                  borderRadius: isMine
                    ? "18px 18px 4px 18px"
                    : "18px 18px 18px 4px",
                  alignSelf: isMine ? "flex-end" : "flex-start",
                }}
              >
                {msg.message}
              </div>
            </div>
          </div>
        );
      })}
      {/* Invisible anchor for auto-scroll */}
      <div ref={bottomRef} />
    </div>
  );
}
const styles: Record<string, React.CSSProperties> = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
    overflowY: "auto",
    flex: 1,
    padding: "16px",
  },
  empty: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#9ca3af",
    fontSize: "14px",
    fontStyle: "italic",
  },
  row: {
    display: "flex",
    alignItems: "flex-end",
    gap: "8px",
  },
  avatar: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "13px",
    fontWeight: 700,
    flexShrink: 0,
  },
  meta: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    marginBottom: "4px",
  },
  bubble: {
    padding: "10px 14px",
    fontSize: "14px",
    lineHeight: 1.5,
    wordBreak: "break-word",
  },
};
