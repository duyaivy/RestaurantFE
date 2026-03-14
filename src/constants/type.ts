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
  Processing: "PROCESSING",
  Rejected: "REJECTED",
  Delivered: "DELIVERED",
  Paid: "PAID",
} as const;

export const OrderStatusValues = [
  OrderStatus.Pending,
  OrderStatus.Processing,
  OrderStatus.Rejected,
  OrderStatus.Delivered,
  OrderStatus.Paid,
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
