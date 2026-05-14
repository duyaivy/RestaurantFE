"use client";
import {
  getAccessTokenFromLocalStorage,
  getRefreshTokenFromLocalStorage,
} from "@/shared/lib/utils";
import { useLogoutMutation } from "@/features/auth/hooks/use-auth";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef, Suspense } from "react";
import { Loader2Icon } from "lucide-react";
import { ROUTE } from "@/shared/constants/route";
import { useAppContext } from "@/shared/providers/app-provider";

function LogoutComponent() {
  const { mutateAsync } = useLogoutMutation();
  const route = useRouter();
  const { setRole } = useAppContext();
  const searchParams = useSearchParams();
  const refreshTokenFromUrl = searchParams.get("refreshToken");
  const accessTokenFromUrl = searchParams.get("accessToken");
  const ref = useRef<any>(null);
  useEffect(() => {
    if (
      ref.current ||
      (refreshTokenFromUrl &&
        refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      (accessTokenFromUrl &&
        accessTokenFromUrl !== getAccessTokenFromLocalStorage())
    ) {
      return;
    }
    ref.current = mutateAsync;
    mutateAsync().then((res) => {
      setTimeout(() => { }, 100);
      setRole();
      route.push(ROUTE.AUTH.LOGIN);
    });
  }, [mutateAsync, route, refreshTokenFromUrl, accessTokenFromUrl, setRole]);
  return <div>LogoutPage</div>;
}

export default function LogoutPage() {
  return (
    <Suspense
      fallback={
        <div>
          <Loader2Icon className="animate-spin size-5" />
          Đăng xuất
        </div>
      }
    >
      <LogoutComponent />
    </Suspense>
  );
}
