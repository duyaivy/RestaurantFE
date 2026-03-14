import http from "@/lib/http";
import {
  
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import { GuestLoginBodyType, GuestLoginResType } from "@/schemaValidations/guest.schema";
const guestApiRequest = {
  requestTokenRequest: null as Promise<{
    status: number;
    payload: RefreshTokenResType;
  }> | null,

  sLogin: (body: GuestLoginBodyType) => http.post<GuestLoginResType>("guest/auth/login", body),

  login: (body: GuestLoginBodyType) =>
    http.post<GuestLoginResType>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),

  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    },
  ) =>
    http.post(
      "guest/auth/logout",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),
  logout: () => http.post("/api/guest/auth/logout", null, { baseUrl: "" }),

  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<RefreshTokenResType>("guest/auth/refresh-token", body),
  async refreshToken() {
    if (this.requestTokenRequest) {
      return this.requestTokenRequest;
    }
    this.requestTokenRequest = http.post<RefreshTokenResType>(
      "/api/guest/auth/refresh-token",
      null,
      { baseUrl: "" },
    );
    const result = await this.requestTokenRequest;
    this.requestTokenRequest = null;
    return result;
  },
};

export default guestApiRequest;
