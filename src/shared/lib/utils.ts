import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "@/shared/api/http";
import { toast } from "@/shared/ui/use-toast";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/shared/constants/type";
import { ROUTE } from "@/shared/constants/route";
import envConfig from "@/shared/config/env";
import { format } from 'date-fns'
import { BookX, CookingPot, HandCoins, Loader, Truck } from 'lucide-react'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const normalizePath = (path: string) => {
  return path.startsWith("/") ? path.slice(1) : path;
};

export const handleErrorApi = ({
  error,
  setError,
  duration,
}: {
  error: any;
  setError?: UseFormSetError<any>;
  duration?: number;
}) => {
  if (error instanceof EntityError && setError) {
    Object.keys(error.payload.errors).forEach((key: string) => {
      setError(key, {
        type: "server",
        message: error.payload.errors[key],
      });
    });
  } else {
    toast({
      title: "Lỗi",
      description: error?.payload?.message ?? "Lỗi không xác định",
      variant: "destructive",
      duration: duration ?? 5000,
    });
  }
};

export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(number);
};

export const getVietnameseTableStatus = (
  status: (typeof TableStatus)[keyof typeof TableStatus],
) => {
  switch (status) {
    case TableStatus.Available:
      return "Có sẵn";
    case TableStatus.Reserved:
      return "Đã đặt";
    default:
      return "Ẩn";
  }
};

export const getVietnameseDishStatus = (
  status: (typeof DishStatus)[keyof typeof DishStatus],
) => {
  switch (status) {
    case DishStatus.Available:
      return "Có sẵn";
    case DishStatus.Unavailable:
      return "Không có sẵn";
    default:
      return "Ẩn";
  }
};

export const getTableLink = ({
  token,
  tableNumber,
}: {
  token: string;
  tableNumber: number;
}) => {
  return `${envConfig.NEXT_PUBLIC_URL}${ROUTE.PUBLIC.TABLE_BY_NUMBER(tableNumber)}?token=${token}`;
};
export function removeAccents(str: string) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
}
export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Pending:
      return "Chờ xử lý";

    case OrderStatus.Preparing:
      return "Đang nấu";

    case OrderStatus.Served:
      return "Đã phục vụ";

    case OrderStatus.Completed:
      return "Hoàn thành";

    case OrderStatus.Cancelled:
      return "Đã hủy";
  }
}
export const formatDateTimeToLocaleString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss dd/MM/yyyy')
}

export const formatDateTimeToTimeString = (date: string | Date) => {
  return format(date instanceof Date ? date : new Date(date), 'HH:mm:ss')
}
export const OrderStatusIcon = {
  [OrderStatus.Pending]: Loader,
  [OrderStatus.Preparing]: CookingPot,
  [OrderStatus.Served]: BookX,
  [OrderStatus.Completed]: Truck,
  [OrderStatus.Cancelled]: HandCoins
}


export const simpleMatchText = (fullText: string, matchText: string) => {
  return removeAccents(fullText.toLowerCase()).includes(removeAccents(matchText.trim().toLowerCase()))
}
// Re-export token helpers for backward compatibility
export {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLoacalStorage,
  setRefreshTokenToLoacalStorage,
  removeTokensFromLocalStorage,
  checkAndRefreshToken,
  decodeToken,
} from "@/shared/auth/token";
