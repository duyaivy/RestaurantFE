import {
  DishStatusValues,
  OrderStatusValues,
  PAYMENT_METHOD_VALUES,
} from "@/constants/type";
import { AccountSchema } from "@/schemaValidations/account.schema";
import { TableSchema } from "@/schemaValidations/table.schema";
import z from "zod";

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

export type GetOrdersResType = z.TypeOf<typeof GetOrdersRes>;

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

export const CreateOrdersRes = z.array(OrderSchema);

export type CreateOrdersResType = z.TypeOf<typeof CreateOrdersRes>;
