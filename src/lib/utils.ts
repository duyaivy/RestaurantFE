import { clsx, type ClassValue } from "clsx";
import { UseFormSetError } from "react-hook-form";
import { twMerge } from "tailwind-merge";
import { EntityError } from "./http";
import { toast } from "@/components/ui/use-toast";
import authApiRequest from "@/apiRequests/auth";
import jwt from "jsonwebtoken";
import { DishStatus, OrderStatus, Role, TableStatus } from "@/constants/type";
import envConfig from "@/config";
import { TokenPayload } from "@/types/jwt.types";
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

const isBrowser = typeof window !== "undefined";
export const getAccessTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("accessToken") : null;
};

export const getRefreshTokenFromLocalStorage = () => {
  return isBrowser ? localStorage.getItem("refreshToken") : null;
};

export const setAccessTokenToLoacalStorage = (value: string) => {
  if (isBrowser) {
    localStorage.setItem("accessToken", value);
  }
};
export const removeTokensFromLocalStorage = () => {
  if (isBrowser) {
    localStorage.removeItem("accessToken");
  }
  if (isBrowser) {
    localStorage.removeItem("refreshToken");
  }
};

export const setRefreshTokenToLoacalStorage = (value: string) => {
  if (isBrowser) {
    localStorage.setItem("refreshToken", value);
  }
};
export const checkAndRefreshToken = async (param?: {
  onError?: () => void;
  onSuccess?: () => void;
}) => {
  const refreshToken = getRefreshTokenFromLocalStorage();
  const accessToken = getAccessTokenFromLocalStorage();

  if (!refreshToken || !accessToken) return;
  const decodeAccessToken = decodeToken(accessToken);
  const decodeRefreshToken = decodeToken(refreshToken);
  // thời điểm hiện tại
  const now = Math.round(new Date().getTime() / 1000); // doi ra giay la lam tron
  // th refresh hết hạn thì không xử lý nữa
  if (decodeRefreshToken.exp <= now) return;

  // ví dự access của chúng ta còn lại là 10s
  // thì mình sẽ kiểm tra cón 1/3 thời gian (3s) thì mình sẽ cho refresh

  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLoacalStorage(res.payload.data.accessToken);
      setRefreshTokenToLoacalStorage(res.payload.data.refreshToken);
      if (param?.onSuccess) {
        param.onSuccess();
      }
    } catch (_) {
      if (param?.onError) {
        param.onError();
      }
    }
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
  return (
    envConfig.NEXT_PUBLIC_URL + "/tables/" + tableNumber + "?token=" + token
  );
};
export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
