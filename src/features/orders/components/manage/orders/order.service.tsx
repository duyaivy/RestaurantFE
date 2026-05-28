import { OrderMiniResType } from "@/features/orders/schemas/order.schema";
import { OrderStatus, OrderStatusValues } from "@/shared/constants/type";
import { useMemo } from "react";
import {
  OrderObjectByGuestID,
  ServingGuestByTableNumber,
  Statics,
  StatusCountObject,
} from "./order-table";

const servingStatuses: ReadonlySet<(typeof OrderStatusValues)[number]> = new Set([
  OrderStatus.Pending,
  OrderStatus.Preparing,
  OrderStatus.Served,
]);

export const createStatusCountObject = (): StatusCountObject =>
  OrderStatusValues.reduce((acc, status) => {
    acc[status] = 0;
    return acc;
  }, {} as StatusCountObject);

export const useOrderService = (orderList: OrderMiniResType[]) => {
  return useMemo(() => {
    const statics: Statics = {
      status: createStatusCountObject(),
      table: {},
    };
    const orderObjectByGuestId: OrderObjectByGuestID = {};
    const guestByTableNumber: ServingGuestByTableNumber = {};

    orderList.forEach((order) => {
      statics.status[order.status] += 1;

      if (order.table_number !== null && order.guest_id !== null) {
        if (!statics.table[order.table_number]) {
          statics.table[order.table_number] = {};
        }

        const currentGuestStatics =
          statics.table[order.table_number][order.guest_id] ??
          createStatusCountObject();

        statics.table[order.table_number][order.guest_id] = {
          ...currentGuestStatics,
          [order.status]: currentGuestStatics[order.status] + 1,
        };
      }

      if (order.guest_id !== null) {
        if (!orderObjectByGuestId[order.guest_id]) {
          orderObjectByGuestId[order.guest_id] = [];
        }
        orderObjectByGuestId[order.guest_id].push(order);
      }

      if (order.table_number !== null && order.guest_id !== null) {
        if (!guestByTableNumber[order.table_number]) {
          guestByTableNumber[order.table_number] = {};
        }
        guestByTableNumber[order.table_number][order.guest_id] =
          orderObjectByGuestId[order.guest_id];
      }
    });

    const servingGuestByTableNumber: ServingGuestByTableNumber = {};
    for (const tableNumber in guestByTableNumber) {
      const guestObject = guestByTableNumber[tableNumber];
      const servingGuestObject: OrderObjectByGuestID = {};

      for (const guestId in guestObject) {
        const guestOrders = guestObject[guestId];
        const isServingGuest = guestOrders.some((order) =>
          servingStatuses.has(order.status),
        );

        if (isServingGuest) {
          servingGuestObject[Number(guestId)] = guestOrders;
        }
      }

      if (Object.keys(servingGuestObject).length) {
        servingGuestByTableNumber[Number(tableNumber)] = servingGuestObject;
      }
    }

    return {
      statics,
      orderObjectByGuestId,
      servingGuestByTableNumber,
    };
  }, [orderList]);
};
