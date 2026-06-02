import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "@/shared/api/http";
import { toast } from "@/shared/ui/use-toast";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/shared/constants/type";
import { ROUTE } from "@/shared/constants/route";
import envConfig from "@/shared/config/env";

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

// Re-export token helpers for backward compatibility
export {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
  setAccessTokenToLoacalStorage,
  setRefreshTokenToLoacalStorage,
  setTokensToLocalStorage,
  removeTokensFromLocalStorage,
  checkAndRefreshToken,
  decodeToken,
} from "@/shared/auth/token";
