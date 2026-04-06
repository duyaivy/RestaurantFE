"use client";

import { checkAndRefreshToken } from "@/lib/utils";
import { usePathname, redirect } from "next/navigation";
import { useEffect } from "react";
import { ROUTE } from "@/constants/route";

const UNAUTHENTICATED_PATH = [
  ROUTE.AUTH.LOGIN,
  ROUTE.AUTH.REGISTER,
  ROUTE.AUTH.REFRESH_TOKEN,
];
export default function RefreshToken() {
  const pathname = usePathname();
  useEffect(() => {
    if (UNAUTHENTICATED_PATH.includes(pathname)) return;

    let interval: any = null;

    // const checkAndRefreshToken = async () => {
    //   const refreshToken = getRefreshTokenFromLocalStorage();
    //   const accessToken = getAccessTokenFromLocalStorage();

    //   if (!refreshToken || !accessToken) return;
    //   const decodeAccessToken = jwt.decode(accessToken) as {
    //     exp: number;
    //     iat: number;
    //   };
    //   const decodeRefreshToken = jwt.decode(refreshToken) as {
    //     exp: number;
    //     iat: number;
    //   };
    //   // thời điểm hiện tại
    //   const now = Math.round(new Date().getTime() / 1000); // doi ra giay la lam tron
    //   // th refresh hết hạn thì không xử lý nữa
    //   if (decodeRefreshToken.exp <= now) return;

    //   // ví dự access của chúng ta còn lại là 10s
    //   // thì mình sẽ kiểm tra cón 1/3 thời gian (3s) thì mình sẽ cho refresh

    //   if (
    //     decodeAccessToken.exp - now <
    //     (decodeAccessToken.exp - decodeAccessToken.iat) / 3
    //   ) {
    //     try {
    //       const res = await authApiRequest.refreshToken();
    //       setAccessTokenToLoacalStorage(res.payload.data.accessToken);
    //       setRefreshTokenToLoacalStorage(res.payload.data.refreshToken);
    //     } catch (error) {
    //       clearInterval(interval);
    //     }
    //   }
    // };
    // phải gọi lần đầu tiên vì interval sẽ chạy sau thời gian TimOut
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
  }, [pathname]);
  return null;
}
