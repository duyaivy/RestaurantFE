import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ROUTE } from "@/constants/route";
// route bắt buoc phải đăng nhập mới vào được
const privatePaths = [ROUTE.MANAGE.ROOT];
// route dành cho người chưa đăng nhập
const unAuthPaths = [ROUTE.AUTH.LOGIN];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get("accessToken")?.value;
  const refreshToken = request.cookies.get("refreshToken")?.value;

  // chưa đăng nhâpk thì không vào privatePaths
  if (privatePaths.some((path) => pathname.startsWith(path)) && !refreshToken) {
    return NextResponse.redirect(new URL(ROUTE.AUTH.LOGIN, request.url));
  }

  // đã đăng nhập thì không vào LOGIN nữa
  if (unAuthPaths.some((path) => pathname.startsWith(path)) && refreshToken) {
    return NextResponse.redirect(new URL(ROUTE.HOME, request.url));
  }
  // TH dang nhap roi nhung accessToken het han
  if (
    privatePaths.some((path) => pathname.startsWith(path)) &&
    !accessToken &&
    refreshToken
  ) {
    const url = new URL(ROUTE.AUTH.REFRESH_TOKEN, request.url);
    url.searchParams.set("refreshToken", refreshToken);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/manage/:path*", "/login"],
};
