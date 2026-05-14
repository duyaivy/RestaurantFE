"use client";

import { checkAndRefreshToken, getRefreshTokenFromLocalStorage } from "@/shared/lib/utils";
import { usePathname, redirect } from "next/navigation";
import { useEffect } from "react";
import { ROUTE } from "@/shared/constants/route";
import { Router } from "lucide-react";
import { useRouter } from "next/navigation";
const UNAUTHENTICATED_PATH = [
  ROUTE.AUTH.LOGIN,
  ROUTE.AUTH.REGISTER,
  ROUTE.AUTH.REFRESH_TOKEN,
];
export default function RefreshToken() {
  const pathname = usePathname();
  const router = useRouter(); 

  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;

    let interval: any = null;
    checkAndRefreshToken({
      onError: () => {
        clearInterval(interval);
      },
    });
    // timeout interval phải bé hơn thời gian hết hạn của accesstoken
    // ví dụn thời gian hết hạn access là 10s thì 1s mình sẽ cho check 1 lần
    const TIMEOUT = 1000;
    interval = setInterval(checkAndRefreshToken, TIMEOUT);
    return () => {
      clearInterval(interval);
     
    };
  }, [pathname, router]);
  return null;
}
