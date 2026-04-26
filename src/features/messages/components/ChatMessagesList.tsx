"use client";

import { useEffect, useRef } from "react";
import {
  ChatbotCitation,
  ChatbotRecommendedItem,
} from "@/features/messages/types/chatbot.types";
import { ChatRecommendedItems } from "@/features/messages/components/ChatRecommendedItems";
import { ChatMarkdownContent } from "@/features/messages/components/ChatMarkdownContent";

export interface AssistantRenderMessage {
  id: string;
  text: string;
  timestamp: string;
  isOwn: boolean;
  senderLabel: string;
  roleLabel: string;
  status?: "pending" | "error";
  isMarkdown?: boolean;
  thinkingSeconds?: number;
  citations?: ChatbotCitation[];
  items?: ChatbotRecommendedItem[];
}

interface ChatMessagesListProps {
  messages: AssistantRenderMessage[];
}

export function ChatMessagesList({ messages }: ChatMessagesListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.isOwn ? "justify-end" : "justify-start"}`}
        >
          <div
            className={`max-w-4/5 px-3 py-2 rounded-2xl text-sm leading-relaxed ${
              message.isOwn
                ? "bg-amber-500 text-black font-medium rounded-tr-sm"
                : "bg-white/10 text-white/85 rounded-tl-sm"
            }`}
          >
            <p className="mb-1 text-xs leading-none opacity-70">
              {message.senderLabel} · {message.roleLabel}
            </p>
            {message.status === "pending" ? (
              <p>Miki đang suy nghĩ... {message.thinkingSeconds ?? 0}s</p>
            ) : message.isMarkdown ? (
              <ChatMarkdownContent content={message.text} />
            ) : (
              <p>{message.text}</p>
            )}

            {message.items && message.items.length > 0 ? (
              <>
                <p className="">Tham khảo một số món ăn</p>
                <ChatRecommendedItems items={message.items} />
              </>
            ) : null}
          </div>
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
