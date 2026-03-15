"use client";
import {
  checkAndRefreshToken,
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/lib/utils";
import { useLogoutMutation } from "@/hooks/queries/useAuth";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";

export default function RefreshTokenPage() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get('refreshToken');
  const redirectPathname = searchParams.get('redirect');
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          route.push(redirectPathname || '/');
        },
      });
    }
  }, [route, refreshTokenFromUrl, redirectPathname]);
  return <div>Refresh token</div>;
}
