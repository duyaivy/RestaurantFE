"use client";

import { useState, useEffect, useRef } from "react";
import {
  X,
  Send,
  MessageCircle,
  ChevronDown,
  WifiOff,
  Loader2,
} from "lucide-react";
import { useChatStore } from "@/hooks/stores/useChatStore";
import { useTableChat } from "@/hooks/common/useTableChat";
import { useGuestChatMessageView } from "@/hooks/common/useGuestChatMessageView";
import { useSocket } from "@/hooks/common/useSocket";
import { Role } from "@/constants/type";

const chatSuggestions = [
  "Các hạng mục món ăn?",
  "Cách đặt hàng?",
  "Thời gian giao hàng?",
  "Có giao hàng không?",
];

interface MikiAssistantProps {
  userName?: string;
}

export function MikiAssistant({ userName }: MikiAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, addMessage } = useChatStore();
  const { sendMessage } = useTableChat();
  const { isOwnMessage, getSenderLabel } = useGuestChatMessageView();
  const { isConnected, isConnecting, lastError } = useSocket();

  // Initialize welcome message if store empty
  useEffect(() => {
    if (messages.length === 0) {
      addMessage({
        message: `Xin chào${userName ? " " + userName : ""}! Tôi là trợ lý cửa hàng. Bạn cần hỗ trợ gì?`,
        sender: "Trợ lý",
        role: Role.Admin,
        table_number: 0,
        timestamp: new Date().toISOString(),
      });
    }
  }, [messages.length, userName, addMessage]);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  const handleSuggestionClick = (suggestion: string) => {
    // Optimistic user message handled by sendMessage
    sendMessage(suggestion);

    const responses: Record<string, string> = {
      "Các hạng mục món ăn?":
        "Chúng tôi có các hạng mục: Cơm, Mì & Bún, Thịt, Hải sản, Chay, Đồ uống, Tráng miệng và Bánh. Bạn muốn xem hạng mục nào?",
      "Cách đặt hàng?":
        "Rất đơn giản! 1. Chọn món từ Menu → 2. Thêm vào giỏ hàng → 3. Vào Giỏ hàng kiểm tra → 4. Bấm Đặt món. Xong!",
      "Thời gian giao hàng?":
        "Đơn hàng sẽ được phục vụ trong vòng 15–30 phút. Bạn có thể gọi nhân viên nếu cần hỗ trợ thêm.",
      "Có giao hàng không?":
        "Hiện tại chúng tôi phục vụ tại bàn. Bạn có thể gọi nhân viên từ mục Giỏ hàng để được hỗ trợ.",
    };

    // Fake bot reply to store locally (so we don't hit the server for FAQs)
    setTimeout(() => {
      addMessage({
        message:
          responses[suggestion] || "Cảm ơn bạn đã hỏi! Hệ thống đã ghi nhận.",
        sender: "assistant",
        role: Role.Admin,
        table_number: 0,
        timestamp: new Date().toISOString(),
      });
    }, 300);
  };

  const handleSendMessage = () => {
    if (!input.trim() || !isConnected) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* FAB Button */}
      <button
        onClick={() => setIsOpen((v) => !v)}
        className="fixed bottom-20 right-4 z-40 w-12 h-12 rounded-full bg-amber-500 hover:bg-amber-400 active:scale-95 flex items-center justify-center transition-all shadow-[0_4px_16px_rgba(245,158,11,0.4)]"
        title="Trợ lý cửa hàng"
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
                  Trợ lý cửa hàng
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  {!isConnected ? (
                    <p className="text-sm text-red-400/80">● Mất kết nối</p>
                  ) : isConnecting ? (
                    <p className="text-sm text-amber-400/80">
                      ● Đang kết nối...
                    </p>
                  ) : (
                    <p className="text-sm text-green-400/80">
                      ● Đang hoạt động
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

          {/* Connection Error Banner */}
          {lastError && !isConnected && (
            <div className="bg-red-500/10 border-b border-red-500/20 px-3 py-2 flex items-center gap-2">
              <WifiOff className="w-3.5 h-3.5 text-red-400" />
              <p className="text-xs text-red-400 font-medium">
                Kết nối tới máy chủ bị lỗi. Đang thử lại...
              </p>
            </div>
          )}

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-2">
            {messages.map((msg, idx) => {
              const isMine = isOwnMessage(msg);
              const senderLabel = getSenderLabel(msg);

              return (
                <div
                  key={idx}
                  className={`flex ${isMine ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-4/5 px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                      isMine
                        ? "bg-amber-500 text-black font-medium rounded-tr-sm"
                        : "bg-white/10 text-white/80 rounded-tl-sm"
                    }`}
                  >
                    <p className="mb-1 text-xs leading-none opacity-70">
                      {isMine
                        ? `You · ${msg.role}`
                        : `${senderLabel} · ${msg.role}`}
                    </p>
                    {msg.message}
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 1 && (
            <div className="px-3 pb-2 flex flex-col gap-1.5">
              {chatSuggestions.map((suggestion) => (
                <button
                  key={suggestion}
                  onClick={() => handleSuggestionClick(suggestion)}
                  disabled={!isConnected}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/6 text-white/60 text-xs transition-colors disabled:opacity-50"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          {(messages.length > 1 || !isConnected) && (
            <div className="px-3 pb-3 pt-2 border-t border-white/6 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder={
                  isConnected ? "Nhập tin nhắn..." : "Đang kết nối..."
                }
                disabled={!isConnected}
                className="flex-1 bg-white/6 border border-white/8 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-amber-500/30 transition-colors disabled:opacity-50"
              />
              <button
                onClick={handleSendMessage}
                disabled={!input.trim() || !isConnected}
                className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0 self-end"
              >
                {isConnecting ? (
                  <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
                ) : (
                  <Send className="w-3.5 h-3.5 text-black" strokeWidth={2} />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
}
