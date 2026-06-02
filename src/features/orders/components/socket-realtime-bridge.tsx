"use client";

import { useEffect, useRef } from "react";
import { useSocket } from "@/shared/hooks/use-socket";
import { useChatStore } from "@/features/messages/store/use-chat-store";
import { useOrderNotificationStore } from "@/features/orders/store/use-order-notification-store";
import { useMessageNotificationStore } from "@/features/messages/store/use-message-notification-store";
import { toNullableNumber } from "@/features/messages/hooks/chat-identity";
import { SOCKET_EVENTS } from "@/shared/sockets/socket-events";
import { Role } from "@/shared/constants/type";
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
  const { incrementUnread } = useMessageNotificationStore();
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize Web Audio API context
  useEffect(() => {
    if (typeof window !== "undefined") {
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }, []);

  // Play a simple notification beep using Web Audio API
  const playNotificationSound = () => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    try {
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      // Set frequency for a pleasant notification sound (E6 note)
      oscillator.frequency.value = 1318.51;
      oscillator.type = "sine";

      // Set volume (0.0 to 1.0)
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);

      // Play the sound for 0.3 seconds
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    } catch (err) {
      console.warn("Failed to play notification sound:", err);
    }
  };

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

      // If message is from a guest (customer), increment unread count and play sound
      if (payload.sender_role === Role.Guest) {
        incrementUnread(payload.table_number);
        playNotificationSound();
      }
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
