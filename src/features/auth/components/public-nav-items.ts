import {
  ClipboardList,
  LayoutDashboard,
  LogIn,
  ShoppingCart,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { ROUTE } from "@/shared/constants/route";
import { Role } from "@/shared/constants/type";
import { RoleType } from "@/shared/types/jwt.types";

export type PublicNavItem = {
  title: string;
  href: string;
  Icon: LucideIcon;
};

export function getPublicNavItems(
  role: RoleType | null | undefined,
): PublicNavItem[] {
  const baseItems: PublicNavItem[] = [
    {
      title: "Menu",
      href: ROUTE.GUEST.MENU,
      Icon: UtensilsCrossed,
    },
  ];

  if (role === Role.Guest) {
    return [
      ...baseItems,
      {
        title: "Giỏ hàng",
        href: ROUTE.GUEST.CART,
        Icon: ShoppingCart,
      },
      {
        title: "Đơn hàng",
        href: ROUTE.GUEST.ORDER_CONFIRMATION,
        Icon: ClipboardList,
      },
    ];
  }

  if (role === Role.Admin || role === Role.Employee) {
    return [
      ...baseItems,
      {
        title: "Quản lý",
        href:
          role === Role.Admin ? ROUTE.MANAGE.DASHBOARD : ROUTE.MANAGE.ORDERS,
        Icon: LayoutDashboard,
      },
    ];
  }

  return [
    ...baseItems,
    {
      title: "Đăng nhập",
      href: ROUTE.AUTH.LOGIN,
      Icon: LogIn,
    },
  ];
}

export function getPublicRoleLabel(role: RoleType | null | undefined) {
  if (role === Role.Admin) return "Quản trị viên";
  if (role === Role.Employee) return "Nhân viên";
  if (role === Role.Guest) return "Khách tại bàn";

  return "Chưa đăng nhập";
}
