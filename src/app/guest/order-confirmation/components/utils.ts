import { toNullableNumber } from "@/hooks/common/chat-identity";
import { NormalizedOrder, NormalizedOrderItem } from "./types";

export const parsePrice = (value: unknown) => {
  if (typeof value === "number") return value;
  const normalized = Number(
    String(value ?? "0")
      .replace(/,/g, "")
      .trim(),
  );
  return Number.isFinite(normalized) ? normalized : 0;
};

export const parseDishName = (value: unknown): string | null => {
  if (typeof value === "string" && value.trim()) return value.trim();
  if (!value || typeof value !== "object") return null;

  const record = value as Record<string, unknown>;
  const vi = record.vi;
  if (typeof vi === "string" && vi.trim()) return vi.trim();

  const en = record.en;
  if (typeof en === "string" && en.trim()) return en.trim();

  for (const candidate of Object.values(record)) {
    if (typeof candidate === "string" && candidate.trim()) {
      return candidate.trim();
    }
  }

  return null;
};

export const getOrderItemsFromRaw = (rawOrder: Record<string, unknown>) => {
  const rawItems =
    rawOrder.order_items ?? rawOrder.items ?? rawOrder.orderItems ?? [];

  if (!Array.isArray(rawItems)) return [];

  return rawItems.map((rawItem, index) => {
    const item = rawItem as Record<string, unknown>;
    const dishSnapshot =
      (item.dish_snapshot as Record<string, unknown> | undefined) ??
      (item.dishSnapshot as Record<string, unknown> | undefined);

    const name =
      parseDishName(item.name) ?? parseDishName(dishSnapshot?.name) ?? "Món ăn";

    const image =
      (typeof item.image === "string" && item.image) ||
      (typeof dishSnapshot?.image === "string"
        ? dishSnapshot.image
        : "/placeholder.svg");

    const itemId = item.id ?? item.order_item_id ?? index;

    return {
      id: String(itemId),
      name,
      price: parsePrice(item.price ?? dishSnapshot?.price),
      quantity: parsePrice(item.quantity),
      image,
      note:
        typeof item.note === "string" && item.note.trim()
          ? item.note.trim()
          : undefined,
      status:
        (typeof item.item_status === "string" && item.item_status) ||
        (typeof item.status === "string" && item.status)
          ? String(item.item_status ?? item.status)
          : undefined,
    } satisfies NormalizedOrderItem;
  });
};

export const normalizeOrder = (
  rawOrder: Record<string, unknown>,
): NormalizedOrder | null => {
  const id = toNullableNumber(rawOrder.id);
  if (id === null) return null;

  const items = getOrderItemsFromRaw(rawOrder);
  const totalFromItems = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  return {
    id,
    status: typeof rawOrder.status === "string" ? rawOrder.status : "PENDING",
    totalAmount:
      parsePrice(rawOrder.total_amount ?? rawOrder.totalAmount) ||
      totalFromItems,
    createdAtTs: Number.isFinite(
      Date.parse(String(rawOrder.created_at ?? rawOrder.createdAt ?? "")),
    )
      ? Date.parse(String(rawOrder.created_at ?? rawOrder.createdAt ?? ""))
      : 0,
    items,
  };
};

export const pickLatestOrder = (rawOrders: Record<string, unknown>[]) => {
  const normalizedOrders = rawOrders
    .map(normalizeOrder)
    .filter((order): order is NormalizedOrder => order !== null);

  if (!normalizedOrders.length) return null;

  return [...normalizedOrders].sort((a, b) => b.createdAtTs - a.createdAtTs)[0];
};
