import { SuccessResponse } from "@/constants/type";
import http from "@/lib/http";
import {
  LoginBodyType,
  LoginResType,
  LogoutBodyType,
  RefreshTokenBodyType,
  RefreshTokenResType,
} from "@/schemaValidations/auth.schema";
const authApiRequest = {
  requestTokenRequest: null as Promise<{
    status: number;
    payload: SuccessResponse<RefreshTokenResType>;
  }> | null,

  sLogin: (body: LoginBodyType) =>
    http.post<SuccessResponse<LoginResType>>("/auth/login/", body),

  login: (body: LoginBodyType) =>
    http.post<SuccessResponse<LoginResType>>("/api/auth/login/", body, {
      baseUrl: "",
    }),

  sLogout: (
    body: LogoutBodyType & {
      accessToken: string;
    },
  ) =>
    http.post(
      "/auth/logout/",
      {
        refreshToken: body.refreshToken,
      },
      {
        headers: {
          Authorization: `Bearer ${body.accessToken}`,
        },
      },
    ),
  logout: () => http.post("/api/auth/logout/", null, { baseUrl: "" }),

  sRefreshToken: (body: RefreshTokenBodyType) =>
    http.post<SuccessResponse<RefreshTokenResType>>(
      "/auth/refresh-token/",
      body,
    ),
  async refreshToken() {
    if (this.requestTokenRequest) {
      return this.requestTokenRequest;
    }
    this.requestTokenRequest = http.post<SuccessResponse<RefreshTokenResType>>(
      "/api/auth/refresh-token/",
      null,
      { baseUrl: "" },
    );
    const result = await this.requestTokenRequest;
    this.requestTokenRequest = null;
    return result;
  },
};

export default authApiRequest;
