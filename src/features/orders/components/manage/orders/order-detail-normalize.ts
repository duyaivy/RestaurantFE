import { GetOrderDetailResType } from "@/features/orders/schemas/order.schema";

type RawOrderDetail = Partial<GetOrderDetailResType> & Record<string, unknown>;
type RawDishSnapshot = Record<string, unknown>;

export const getDishSnapshotFromOrderDetail = (
  orderDetail: unknown,
): RawDishSnapshot | null => {
  if (!orderDetail || typeof orderDetail !== "object") return null;

  const record = orderDetail as RawOrderDetail;
  const snapshot = record.dishSnapshot ?? record.dish_snapshot;

  return snapshot && typeof snapshot === "object"
    ? (snapshot as RawDishSnapshot)
    : null;
};

export const getDishIdFromOrderDetail = (orderDetail: unknown) => {
  if (!orderDetail || typeof orderDetail !== "object") return 0;

  const record = orderDetail as RawOrderDetail;
  const snapshot = getDishSnapshotFromOrderDetail(record);
  const snapshotDishId = snapshot?.dishId ?? snapshot?.dish_id;
  const snapshotId = snapshot?.id;
  const orderDishSnapshotId = record.dishSnapshotId ?? record.dish_snapshot_id;

  return Number(snapshotDishId ?? snapshotId ?? orderDishSnapshotId ?? 0) || 0;
};

export const getQuantityFromOrderDetail = (orderDetail: unknown) => {
  if (!orderDetail || typeof orderDetail !== "object") return 1;

  const quantity = (orderDetail as RawOrderDetail).quantity;
  return Number(quantity) || 1;
};

export const getDisplayDishFromOrderDetail = (orderDetail: unknown) => {
  const snapshot = getDishSnapshotFromOrderDetail(orderDetail);
  if (!snapshot) return null;

  const name = typeof snapshot.name === "string" ? snapshot.name : "Món ăn";
  const image = typeof snapshot.image === "string" ? snapshot.image : undefined;

  return {
    name,
    image,
  };
};
