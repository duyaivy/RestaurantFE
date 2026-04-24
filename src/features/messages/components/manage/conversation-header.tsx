"use client";

import { Wifi, WifiOff } from "lucide-react";

interface ConversationHeaderProps {
  selectedTableNumber: number | null;
  currentGuestName: string;
  isConnected: boolean;
  lastError: string | null;
}

export default function ConversationHeader({
  selectedTableNumber,
  currentGuestName,
  isConnected,
  lastError,
}: ConversationHeaderProps) {
  return (
    <header className="border-b px-4 py-3">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold">
            {selectedTableNumber
              ? `Bàn ${selectedTableNumber}`
              : "Chưa chọn bàn"}
          </p>
          <p className="text-xs text-muted-foreground">
            {selectedTableNumber
              ? `Khách hiện tại: ${currentGuestName}`
              : "Hãy chọn một bàn để bắt đầu chăm sóc"}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {isConnected ? (
            <Wifi className="h-4 w-4 text-emerald-500" />
          ) : (
            <WifiOff className="h-4 w-4 text-red-500" />
          )}
          {isConnected ? "Đã kết nối" : "Mất kết nối"}
        </div>
      </div>

      {lastError && (
        <p className="mt-2 rounded-md bg-red-500/10 px-2 py-1 text-xs text-red-600">
          {lastError}
        </p>
      )}
    </header>
  );
}
