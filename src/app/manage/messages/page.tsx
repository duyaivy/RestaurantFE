"use client";

import { useEffect, useMemo, useState } from "react";
import { useTableListQuery } from "@/hooks/queries/useTable";
import { useTableChat } from "@/hooks/common/useTableChat";
import { useChatStore } from "@/hooks/stores/useChatStore";
import { useOrderNotificationStore } from "@/hooks/stores/useOrderNotificationStore";
import { useManageChatMessageView } from "@/hooks/common/useManageChatMessageView";
import { useSocket } from "@/hooks/common/useSocket";
import { useAppContext } from "@/context/app-provider";
import { Role } from "@/constants/type";
import MessagesSidebar from "./components/messages-sidebar";
import ConversationHeader from "./components/conversation-header";
import MessageThread from "./components/message-thread";
import MessageComposer from "./components/message-composer";
import { MessageRoomItem } from "./components/types";

export default function ManageMessagesPage() {
  const { role } = useAppContext();
  const { data: tableRes, isLoading: isTableLoading } = useTableListQuery();
  const { sendMessage } = useTableChat();
  const { messages, errors } = useChatStore();
  const { createdOrders } = useOrderNotificationStore();
  const { isOwnMessage, getSenderLabel } = useManageChatMessageView();
  const { isConnected, isConnecting, lastError } = useSocket();

  const [selectedTableNumber, setSelectedTableNumber] = useState<number | null>(
    null,
  );
  const [draft, setDraft] = useState("");

  const tables = tableRes?.payload.data ?? [];

  useEffect(() => {
    if (!tables.length) return;
    if (selectedTableNumber !== null) return;
    setSelectedTableNumber(tables[0].number);
  }, [tables, selectedTableNumber]);

  const isStaff = role === Role.Admin || role === Role.Employee;

  const guestNameByTable = useMemo(() => {
    const nameMap = new Map<number, string>();

    for (let i = messages.length - 1; i >= 0; i--) {
      const msg = messages[i];
      const isGuestMsg = msg.role === Role.Guest;
      const hasValidTable = Number.isFinite(msg.table_number);
      if (!isGuestMsg || !hasValidTable) continue;

      if (!nameMap.has(msg.table_number)) {
        nameMap.set(msg.table_number, msg.sender);
      }
    }

    return nameMap;
  }, [messages]);

  const roomList = useMemo<MessageRoomItem[]>(() => {
    return tables.map((table) => {
      const roomMessages = messages.filter(
        (msg) => msg.table_number === table.number,
      );
      const lastMessage = roomMessages[roomMessages.length - 1];
      const activeGuestName =
        guestNameByTable.get(table.number) ?? "Chưa có khách";

      return {
        tableNumber: table.number,
        tableStatus: table.status,
        activeGuestName,
        lastMessage,
      };
    });
  }, [tables, messages, guestNameByTable]);

  const currentRoomMessages = useMemo(() => {
    if (!selectedTableNumber) return [];

    return messages.filter((msg) => msg.table_number === selectedTableNumber);
  }, [messages, selectedTableNumber]);

  const canSend =
    Boolean(draft.trim()) && Boolean(selectedTableNumber) && isConnected;

  const handleSendMessage = () => {
    if (!selectedTableNumber) return;
    const content = draft.trim();
    if (!content) return;

    sendMessage(content, selectedTableNumber);
    setDraft("");
  };

  if (!isStaff) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-card p-6 text-sm text-muted-foreground">
          Chỉ tài khoản quản trị hoặc nhân viên mới truy cập được khu vực chăm
          sóc khách hàng.
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-4.5rem)] overflow-hidden p-4 md:p-6">
      <div className="flex h-full overflow-hidden rounded-2xl border bg-card">
        <MessagesSidebar
          isConnected={isConnected}
          isConnecting={isConnecting}
          isTableLoading={isTableLoading}
          createdOrdersCount={createdOrders.length}
          selectedTableNumber={selectedTableNumber}
          roomList={roomList}
          onSelectTable={setSelectedTableNumber}
        />

        <section className="flex h-full min-w-0 flex-1 flex-col overflow-hidden bg-card">
          <ConversationHeader
            selectedTableNumber={selectedTableNumber}
            currentGuestName={
              selectedTableNumber
                ? (guestNameByTable.get(selectedTableNumber) ?? "Chưa có khách")
                : "Chưa có khách"
            }
            isConnected={isConnected}
            lastError={lastError}
          />

          <MessageThread
            currentRoomMessages={currentRoomMessages}
            isOwnMessage={isOwnMessage}
            getSenderLabel={getSenderLabel}
          />

          {errors.length > 0 && (
            <div className="border-t px-4 py-2">
              <p className="text-xs text-red-600">
                {errors[errors.length - 1]}
              </p>
            </div>
          )}

          <MessageComposer
            draft={draft}
            selectedTableNumber={selectedTableNumber}
            isConnected={isConnected}
            canSend={canSend}
            onDraftChange={setDraft}
            onSend={handleSendMessage}
          />
        </section>
      </div>
    </div>
  );
}
