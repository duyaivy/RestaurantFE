import z from "zod";

export const TokenType = {
  ForgotPasswordToken: "ForgotPasswordToken",
  AccessToken: "AccessToken",
  RefreshToken: "RefreshToken",
  TableToken: "TableToken",
} as const;

export const Role = {
  Admin: "ADMIN",
  Employee: "EMPLOYEE",
  Guest: "GUEST",
} as const;

export const RoleValues = [Role.Admin, Role.Employee, Role.Guest] as const;

export const DishStatus = {
  Available: "AVAILABLE",
  Unavailable: "UNAVAILABLE",
  Hidden: "HIDDEN",
} as const;

export const DishStatusValues = [
  DishStatus.Available,
  DishStatus.Unavailable,
  DishStatus.Hidden,
] as const;

export const TableStatus = {
  Available: "AVAILABLE",
  Hidden: "HIDDEN",
  Reserved: "RESERVED",
} as const;

export const TableStatusValues = [
  TableStatus.Available,
  TableStatus.Hidden,
  TableStatus.Reserved,
] as const;

export const OrderStatus = {
  Pending: "PENDING",
  Preparing: "PREPARING",
  Served: "SERVED",
  Cancelled: "CANCELLED",
  Completed: "COMPLETED",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Preparing,
  OrderStatus.Served,
  OrderStatus.Cancelled,
  OrderStatus.Completed,
] as const;

export const OrderItemStatus = {
  Ordered: "ORDERED",
  Cooking: "COOKING",
  Served: "SERVED",
  Cancelled: "CANCELLED",
} as const;

export const OrderItemStatusValues = [
  OrderItemStatus.Ordered,
  OrderItemStatus.Cooking,
  OrderItemStatus.Served,
  OrderItemStatus.Cancelled,
] as const;

export const ManagerRoom = "manager" as const;

export type SuccessResponse<T> = {
  success: true;
  message: string;
  data: T;
};

export type FailureResponse = {
  success: false;
  message: string;
  data?: unknown;
};

export type PaginationResponse<T> = {
  count: number;
  current: number;
  results: T[];
}


export const LanguageSchema = z.object({
  en: z.string(),
  vi: z.string()
})
export type Language = z.infer<typeof LanguageSchema>