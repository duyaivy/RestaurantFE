import authApiRequest from "@/apiRequests/auth";
import { LoginBodyType } from "@/schemaValidations/auth.schema";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { HttpError } from "@/lib/http";

export async function POST(request: Request) {
  const body = (await request.json()) as LoginBodyType;
  const cookieStore = await cookies();
  try {
    const { payload } = await authApiRequest.sLogin(body);
    const { accessToken, refreshToken } = payload.data;
    if (!accessToken || !refreshToken) {
      return Response.json(
        {
          message: "Login response thiếu token",
        },
        { status: 500 },
      );
    }
    const decodeAccessToken = jwt.decode(accessToken) as {
      exp?: number;
    } | null;
    const decodeRefreshToken = jwt.decode(refreshToken) as {
      exp?: number;
    } | null;
    if (!decodeAccessToken?.exp || !decodeRefreshToken?.exp) {
      return Response.json(
        {
          message: "Token không hợp lệ hoặc thiếu exp",
        },
        { status: 500 },
      );
    }
    cookieStore.set("accessToken", accessToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      expires: new Date(decodeAccessToken.exp * 1000),
      sameSite: "lax",
    });
    cookieStore.set("refreshToken", refreshToken, {
      path: "/",
      httpOnly: true,
      secure: true,
      expires: new Date(decodeRefreshToken.exp * 1000),
      sameSite: "lax",
    });
    return Response.json(payload);
  } catch (error) {
    if (error instanceof HttpError) {
      console.error("[api/auth/login] Upstream HttpError", {
        status: error.status,
        payload: error.payload,
      });
      return Response.json(error.payload, { status: error.status });
    } else {
      console.error("[api/auth/login] Unknown error", error);
      const message =
        error instanceof Error ? error.message : "Lỗi không xác định";
      return Response.json(
        {
          message,
        },
        { status: 500 },
      );
    }
  }
}
