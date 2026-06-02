import { create } from "zustand";
import { persist } from "zustand/middleware";

interface MessageNotificationStore {
  // Map of table_number -> unread count
  unreadByTable: Map<number, number>;
  
  // Total unread messages across all tables
  totalUnread: number;
  
  // Actions
  incrementUnread: (tableNumber: number) => void;
  clearUnread: (tableNumber: number) => void;
  clearAllUnread: () => void;
  getTotalUnread: () => number;
  getUnreadForTable: (tableNumber: number) => number;
}

export const useMessageNotificationStore = create<MessageNotificationStore>(
  (set, get) => ({
    unreadByTable: new Map(),
    totalUnread: 0,

    incrementUnread: (tableNumber) =>
      set((state) => {
        const newMap = new Map(state.unreadByTable);
        const current = newMap.get(tableNumber) ?? 0;
        newMap.set(tableNumber, current + 1);
        
        const newTotal = Array.from(newMap.values()).reduce((sum, count) => sum + count, 0);
        
        return {
          unreadByTable: newMap,
          totalUnread: newTotal,
        };
      }),

    clearUnread: (tableNumber) =>
      set((state) => {
        const newMap = new Map(state.unreadByTable);
        newMap.delete(tableNumber);
        
        const newTotal = Array.from(newMap.values()).reduce((sum, count) => sum + count, 0);
        
        return {
          unreadByTable: newMap,
          totalUnread: newTotal,
        };
      }),

    clearAllUnread: () =>
      set({
        unreadByTable: new Map(),
        totalUnread: 0,
      }),

    getTotalUnread: () => get().totalUnread,

    getUnreadForTable: (tableNumber) => get().unreadByTable.get(tableNumber) ?? 0,
  }),
);
