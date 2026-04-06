"use client";
import { ROUTE } from "@/constants/route";
import { getAccessTokenFromLocalStorage } from "@/lib/utils";
import Link from "next/link";
import { useState } from "react";
const menuItems = [
  {
    title: "Menu",
    href: ROUTE.GUEST.MENU, // dang nhap hay chua deu cho hien thi
  },
  {
    title: "Đơn hàng",
    href: ROUTE.GUEST.ORDERS,
    authRequired: true,
  },
  {
    title: "Đăng nhập",
    href: ROUTE.AUTH.LOGIN,
    authRequired: false, // khi false nghia la chua dang nhap la se hien thi
  },
  {
    title: "Quản lý",
    href: ROUTE.MANAGE.DASHBOARD,
    authRequired: true, // tru nghia la dang nhap roi moi hien thi
  },
];

export default function NavItems({ className }: { className?: string }) {
  const [isAuth] = useState<boolean>(Boolean(getAccessTokenFromLocalStorage()));

  return menuItems.map((item) => {
    if (
      (item.authRequired === false && isAuth) ||
      (item.authRequired === true && !isAuth)
    )
      return null;
    return (
      <Link href={item.href} key={item.href} className={className}>
        {item.title}
      </Link>
    );
  });
}
