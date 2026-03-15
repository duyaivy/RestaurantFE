import http from "@/lib/http";
import { SuccessResponse } from "@/constants/type";
import {
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
import {
  GuestLoginBodyType,
  GuestLoginResType,
} from "@/schemaValidations/guest.schema";
const guestApiRequest = {
  requestTokenRequest: null as Promise<{
    status: number;
    payload: SuccessResponse<RefreshTokenResType>;
  }> | null,

  sLogin: (body: GuestLoginBodyType) =>
    http.post<SuccessResponse<GuestLoginResType>>("guests/login/", body),

  login: (body: GuestLoginBodyType) =>
    http.post<SuccessResponse<GuestLoginResType>>("/api/guest/auth/login", body, {
      baseUrl: "",
    }),

  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    },
  ) =>
    http.post(
      "guests/logout/",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),
  logout: () => http.post("/api/guest/logout", null, { baseUrl: "" }),

  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<SuccessResponse<RefreshTokenResType>>(
      "guests/refresh-token/",
      body,
    ),
  async refreshToken() {
    if (this.requestTokenRequest) {
      return this.requestTokenRequest;
    }
    this.requestTokenRequest = http.post<SuccessResponse<RefreshTokenResType>>(
      "/api/guest/refresh-token",
      null,
      { baseUrl: "" },
    );
    const result = await this.requestTokenRequest;
    this.requestTokenRequest = null;
    return result;
  },
};

export default guestApiRequest;
