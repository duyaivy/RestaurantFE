"use client";

import { Badge } from "@/components/ui/badge";
import { MessageRoomItem } from "./types";
import { formatTime } from "./format-time";

interface MessagesSidebarProps {
  isConnected: boolean;
  isConnecting: boolean;
  isTableLoading: boolean;
  createdOrdersCount: number;
  selectedTableNumber: number | null;
  roomList: MessageRoomItem[];
  onSelectTable: (tableNumber: number) => void;
}

export default function MessagesSidebar({
  isConnected,
  isConnecting,
  isTableLoading,
  createdOrdersCount,
  selectedTableNumber,
  roomList,
  onSelectTable,
}: MessagesSidebarProps) {
  return (
    <aside className="flex h-full w-80 shrink-0 flex-col overflow-hidden border-r bg-card">
      <div className="border-b px-4 py-3">
        <div className="flex items-center justify-between">
          <h1 className="text-sm font-semibold tracking-wide">
            Tin nhắn theo bàn
          </h1>
          <Badge variant={isConnected ? "default" : "secondary"}>
            {isConnected ? "Online" : isConnecting ? "Đang kết nối" : "Offline"}
          </Badge>
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {isTableLoading
            ? "Đang tải danh sách bàn..."
            : `${roomList.length} phòng chat`}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Đơn mới realtime: {createdOrdersCount}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {roomList.map((room) => {
          const isActive = room.tableNumber === selectedTableNumber;

          return (
            <button
              key={room.tableNumber}
              type="button"
              onClick={() => onSelectTable(room.tableNumber)}
              className={`mb-2 w-full rounded-xl border px-3 py-3 text-left transition-colors ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-transparent hover:border-border hover:bg-muted/60"
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold">Bàn {room.tableNumber}</p>
                <span className="text-xs text-muted-foreground">
                  {room.lastMessage
                    ? formatTime(room.lastMessage.timestamp)
                    : "--:--"}
                </span>
              </div>

              <p className="mt-1 text-xs text-muted-foreground">
                Khách hiện tại: {room.activeGuestName}
              </p>

              <p className="mt-1 text-xs text-muted-foreground/80">
                Trạng thái bàn: {room.tableStatus}
              </p>

              <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
                {room.lastMessage?.message ?? ""}
              </p>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
