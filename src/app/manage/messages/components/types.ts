import { ChatMessagePayload } from "@/types/socket";

export interface MessageRoomItem {
  tableNumber: number;
  tableStatus: string;
  activeGuestName: string;
  lastMessage?: ChatMessagePayload;
}
