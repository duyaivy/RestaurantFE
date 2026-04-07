"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

interface MessageComposerProps {
  draft: string;
  selectedTableNumber: number | null;
  isConnected: boolean;
  canSend: boolean;
  onDraftChange: (value: string) => void;
  onSend: () => void;
}

export default function MessageComposer({
  draft,
  selectedTableNumber,
  isConnected,
  canSend,
  onDraftChange,
  onSend,
}: MessageComposerProps) {
  return (
    <div className="border-t p-3">
      <div className="flex items-center gap-2">
        <Input
          value={draft}
          onChange={(event) => onDraftChange(event.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              onSend();
            }
          }}
          placeholder={
            selectedTableNumber
              ? "Nhập tin nhắn chăm sóc khách hàng..."
              : "Chọn bàn để nhắn tin"
          }
          disabled={!selectedTableNumber || !isConnected}
        />
        <Button onClick={onSend} disabled={!canSend} size="icon">
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
