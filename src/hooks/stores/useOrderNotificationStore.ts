import { create } from "zustand";
import { OrderNotificationPayload } from "@/types/socket";

interface OrderNotificationStore {
  createdOrders: OrderNotificationPayload[];
  updatedOrders: OrderNotificationPayload[];
  addCreatedOrder: (order: OrderNotificationPayload) => void;
  addUpdatedOrder: (order: OrderNotificationPayload) => void;
  clearCreatedOrders: () => void;
  clearUpdatedOrders: () => void;
  reset: () => void;
}

export const useOrderNotificationStore = create<OrderNotificationStore>(
  (set) => ({
    createdOrders: [],
    updatedOrders: [],

    addCreatedOrder: (order) =>
      set((state) => ({ createdOrders: [order, ...state.createdOrders] })),

    addUpdatedOrder: (order) =>
      set((state) => ({ updatedOrders: [order, ...state.updatedOrders] })),

    clearCreatedOrders: () => set({ createdOrders: [] }),

    clearUpdatedOrders: () => set({ updatedOrders: [] }),

    reset: () => set({ createdOrders: [], updatedOrders: [] }),
  }),
);
