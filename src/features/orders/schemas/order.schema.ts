import {
  DishStatusValues,
  OrderItemStatusValues,
  OrderStatusValues,
  PAYMENT_METHOD_VALUES,
} from "@/shared/constants/type";
import { AccountSchema } from "@/features/accounts/schemas/account.schema";
import { TableSchema } from "@/features/tables/schemas/table.schema";
import z from "zod";

const OrderMiniSchema = z.object({
  id: z.number(),
  guest_id: z.number().nullable(),
  table_number: z.number().nullable(),
  order_handler_id: z.number().nullable(),
  status: z.enum(OrderStatusValues),
  payment_method: z.enum(PAYMENT_METHOD_VALUES),
  total_amount: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});
const DishSnapshotSchema = z.object({
  id: z.number(),
  name: z.string(),
  price: z.number(),
  image: z.string(),
  description: z.string(),
  status: z.enum(DishStatusValues),
  dishId: z.number().nullable(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export const OrderSchema = z.object({
  id: z.number(),
  guestId: z.number().nullable(),
  guest: z
    .object({
      id: z.number(),
      name: z.string(),
      tableNumber: z.number().nullable(),
      createdAt: z.date(),
      updatedAt: z.date(),
    })
    .nullable(),
  tableNumber: z.number().nullable(),
  dishSnapshotId: z.number(),
  dishSnapshot: DishSnapshotSchema,
  quantity: z.number(),
  orderHandlerId: z.number().nullable(),
  orderHandler: AccountSchema.nullable(),
  status: z.enum(OrderStatusValues),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const UpdateOrderBody = z.object({
  status: z.enum(OrderStatusValues),
  dishId: z.number(),
  quantity: z.number(),
});

export type UpdateOrderBodyType = z.TypeOf<typeof UpdateOrderBody>;

export const OrderParam = z.object({
  orderId: z.coerce.number(),
});

export type OrderParamType = z.TypeOf<typeof OrderParam>;

export const UpdateOrderRes = OrderSchema;

export type UpdateOrderResType = z.TypeOf<typeof UpdateOrderRes>;

export const GetOrdersQueryParams = z.object({
  fromDate: z.coerce.date().optional(),
  toDate: z.coerce.date().optional(),
});

export type GetOrdersQueryParamsType = z.TypeOf<typeof GetOrdersQueryParams>;

export const GetOrdersRes = z.array(OrderSchema);

export const GetOrderDetailRes = OrderSchema.extend({
  table: TableSchema,
});

export type GetOrderDetailResType = z.TypeOf<typeof GetOrderDetailRes>;

export const PayGuestOrdersBody = z.object({
  payment_method: z.enum(PAYMENT_METHOD_VALUES),
});

export type PayGuestOrdersBodyType = z.TypeOf<typeof PayGuestOrdersBody>;

export const PayGuestOrdersRes = z.object({
  url: z.string().optional(),
});

export type PayGuestOrdersResType = z.TypeOf<typeof PayGuestOrdersRes>;
export const OrderItemSchema = z.object({
  dish_id: z.number(),
  quantity: z.number(),
  note: z.string().optional(),
});
export type OrderItemType = z.TypeOf<typeof OrderItemSchema>;
export const CreateOrdersBody = z
  .object({
    table_number_id: z.number(),
    items: z.array(OrderItemSchema),
  })
  .strict();

export type CreateOrdersBodyType = z.TypeOf<typeof CreateOrdersBody>;

export type CreateOrdersResType = z.TypeOf<typeof OrderSchema>;

export type OrderMiniResType = z.TypeOf<typeof OrderMiniSchema>;

// ── Staff-side manage schemas ─────────────────────────────────────────────────

/** POST /orders/staff-create/ */
export const StaffCreateOrderBody = z.object({
  table_number_id: z.number(),
  guest_id: z.number(),
  items: z.array(
    z.object({
      dish_id: z.number(),
      quantity: z.number().int().positive(),
      note: z.string().optional(),
    }),
  ),
});
export type StaffCreateOrderBodyType = z.TypeOf<typeof StaffCreateOrderBody>;

/** Response for staff-create: matches OrderMiniSchema shape from the API */
export const StaffCreateOrderRes = OrderMiniSchema;
export type StaffCreateOrderResType = z.TypeOf<typeof StaffCreateOrderRes>;

/** PATCH /orders/{id}/update/ */
export const UpdateOrderInfoBody = z.object({
  table_number: z.number().optional(),
  order_handler_id: z.number().nullable().optional(),
  status: z.enum(OrderStatusValues).optional(),
  payment_method: z.enum(PAYMENT_METHOD_VALUES).optional(),
});
export type UpdateOrderInfoBodyType = z.TypeOf<typeof UpdateOrderInfoBody>;

/** PATCH /orders/{id}/items/ */
const AddItemSchema = z.object({
  dish_id: z.number(),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
});
const UpdateItemSchema = z.object({
  order_item_id: z.number(),
  quantity: z.number().int().positive(),
  note: z.string().optional(),
  item_status: z.enum(OrderItemStatusValues).optional(),
});
export const UpdateOrderItemsBody = z.object({
  add_items: z.array(AddItemSchema).optional(),
  cancel_item_ids: z.array(z.number()).optional(),
  update_items: z.array(UpdateItemSchema).optional(),
});
export type UpdateOrderItemsBodyType = z.TypeOf<typeof UpdateOrderItemsBody>;
export type AddItemType = z.TypeOf<typeof AddItemSchema>;
export type UpdateItemType = z.TypeOf<typeof UpdateItemSchema>;

/** Paginated orders list query params */
export const ManageOrdersQueryParams = z.object({
  page: z.coerce.number().optional(),
  limit: z.coerce.number().optional(),
});
export type ManageOrdersQueryParamsType = z.TypeOf<typeof ManageOrdersQueryParams>;
