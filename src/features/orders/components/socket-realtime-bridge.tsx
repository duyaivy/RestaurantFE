"use client";

import { useEffect } from "react";
import { useSocket } from "@/shared/hooks/use-socket";
import { useChatStore } from "@/features/messages/store/use-chat-store";
import { useOrderNotificationStore } from "@/features/orders/store/use-order-notification-store";
import { toNullableNumber } from "@/features/messages/hooks/chat-identity";
import { SOCKET_EVENTS } from "@/shared/sockets/socket-events";
import {
  ChatErrorPayload,
  ChatMessageEventPayload,
  ChatMessagePayload,
  OrderNotificationPayload,
} from "@/shared/types/socket";

export default function SocketRealtimeBridge() {
  const { socket } = useSocket();
  const { addMessage, addError } = useChatStore();
  const { addCreatedOrder, addUpdatedOrder } = useOrderNotificationStore();

  useEffect(() => {
    if (!socket) return;

    const handleChatMessage = (payload: ChatMessageEventPayload) => {
      const senderId = toNullableNumber(payload.sender_id);
      const senderLabel =
        senderId !== null
          ? `${payload.sender_role} #${senderId}`
          : payload.sender_role;

      const normalizedMessage: ChatMessagePayload = {
        message: payload.message,
        sender: senderLabel,
        role: payload.sender_role,
        sender_id: senderId ?? undefined,
        table_number: payload.table_number,
        timestamp: new Date().toISOString(),
      };

      addMessage(normalizedMessage);
    };

    const handleChatError = (payload: ChatErrorPayload) => {
      addError(payload.message);
    };

    const handleOrderCreated = (payload: OrderNotificationPayload) => {
      addCreatedOrder(payload);
    };

    const handleOrderStatusUpdated = (payload: OrderNotificationPayload) => {
      addUpdatedOrder(payload);
    };

    socket.on(SOCKET_EVENTS.CHAT_MESSAGE, handleChatMessage);
    socket.on(SOCKET_EVENTS.CHAT_ERROR, handleChatError);
    socket.on(SOCKET_EVENTS.ORDER_CREATED, handleOrderCreated);
    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleOrderStatusUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.CHAT_MESSAGE, handleChatMessage);
      socket.off(SOCKET_EVENTS.CHAT_ERROR, handleChatError);
      socket.off(SOCKET_EVENTS.ORDER_CREATED, handleOrderCreated);
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleOrderStatusUpdated);
    };
  }, [socket, addMessage, addError, addCreatedOrder, addUpdatedOrder]);

  return null;
}
