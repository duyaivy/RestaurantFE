"use client";
import {
  checkAndRefreshToken,
  getRefreshTokenFromLocalStorage,
} from "@/shared/lib/utils";

import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { ROUTE } from "@/shared/constants/route";

function RefreshTokenComponent() {
  const route = useRouter();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const redirectPathname = searchParams.get("redirect");
  useEffect(() => {
    if (
      refreshTokenFromUrl &&
      refreshTokenFromUrl === getRefreshTokenFromLocalStorage()
    ) {
      checkAndRefreshToken({
        onSuccess: () => {
          route.push(redirectPathname || ROUTE.HOME);
        },
      });
    }
  }, [route, refreshTokenFromUrl, redirectPathname]);
  return (
    <div className="flex gap-2 items-center justify-center">
      <Loader2Icon className="animate-spin size-5" />
      Refresh token
    </div>
  );
}

export default function RefreshTokenPage() {
  return (
    <Suspense
      fallback={
        <div className="flex gap-2 items-center justify-center">
          <Loader2Icon className="animate-spin size-5" />
          Refresh token
        </div>
      }
    >
      <RefreshTokenComponent />
    </Suspense>
  );
}
