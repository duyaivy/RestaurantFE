"use client";

import { KeyboardEvent, useState } from "react";
import { Loader2, Send } from "lucide-react";

interface ChatInputBarProps {
  onSend: (message: string) => Promise<void> | void;
  disabled?: boolean;
  isSending?: boolean;
  placeholder?: string;
}

export function ChatInputBar({
  onSend,
  disabled = false,
  isSending = false,
  placeholder = "Nhập tin nhắn...",
}: ChatInputBarProps) {
  const [input, setInput] = useState("");

  const canSend = input.trim().length > 0 && !disabled && !isSending;

  const handleSend = async () => {
    if (!canSend) {
      return;
    }

    await onSend(input);
    setInput("");
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      return;
    }

    event.preventDefault();
    void handleSend();
  };

  return (
    <div className="px-3 pb-3 pt-2 border-t border-white/6 flex gap-2">
      <input
        type="text"
        value={input}
        onChange={(event) => setInput(event.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-white/6 border border-white/8 rounded-xl px-3 py-2 text-xs text-white placeholder:text-white/25 outline-none focus:border-amber-500/30 transition-colors disabled:opacity-50"
      />
      <button
        type="button"
        onClick={() => void handleSend()}
        disabled={!canSend}
        className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 flex items-center justify-center transition-colors shrink-0 self-end"
      >
        {isSending ? (
          <Loader2 className="w-3.5 h-3.5 text-black animate-spin" />
        ) : (
          <Send className="w-3.5 h-3.5 text-black" strokeWidth={2} />
        )}
      </button>
    </div>
  );
}
