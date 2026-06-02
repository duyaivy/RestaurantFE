import authApiRequest from "@/features/auth/api/auth.api";
import { dispatchAuthTokenChanged } from "@/shared/auth/token-events";
import jwt from "jsonwebtoken";
import { TokenPayload } from "@/shared/types/jwt.types";

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
    dispatchAuthTokenChanged();
  }
};

export const setRefreshTokenToLoacalStorage = (value: string) => {
  if (isBrowser) {
    localStorage.setItem("refreshToken", value);
    dispatchAuthTokenChanged();
  }
};

export const setTokensToLocalStorage = ({
  accessToken,
  refreshToken,
}: {
  accessToken: string;
  refreshToken?: string | null;
}) => {
  if (!isBrowser) return;

  localStorage.setItem("accessToken", accessToken);
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken);
  }
  dispatchAuthTokenChanged();
};

export const removeTokensFromLocalStorage = () => {
  if (!isBrowser) return;

  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  dispatchAuthTokenChanged();
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
  const now = Math.round(new Date().getTime() / 1000);
  if (decodeRefreshToken.exp <= now) return;

  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    try {
      const res = await authApiRequest.refreshToken();
      setTokensToLocalStorage(res.payload.data);
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

export const decodeToken = (token: string) => {
  return jwt.decode(token) as TokenPayload;
};
