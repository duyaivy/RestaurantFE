import {
  LayoutDashboard,
  LineChart,
  MessageCircleMore,
  Salad,
  ShoppingCart,
  Table,
  Users2,
  type LucideIcon,
} from "lucide-react";
import { ROUTE } from "@/constants/route";
import { Role } from "@/constants/type";
import { RoleType } from "@/types/jwt.types";

export type ManageMenuItem = {
  title: string;
  Icon: LucideIcon;
  href: string;
};

const adminMenuItems: ManageMenuItem[] = [
  {
    title: "Dashboard",
    Icon: LayoutDashboard,
    href: ROUTE.MANAGE.DASHBOARD,
  },
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: ROUTE.MANAGE.ORDERS,
  },
  {
    title: "Bàn ăn",
    Icon: Table,
    href: ROUTE.MANAGE.TABLES,
  },
  {
    title: "Món ăn",
    Icon: Salad,
    href: ROUTE.MANAGE.DISHES,
  },
  {
    title: "Phân tích",
    Icon: LineChart,
    href: ROUTE.MANAGE.ANALYTICS,
  },
  {
    title: "Nhân viên",
    Icon: Users2,
    href: ROUTE.MANAGE.ACCOUNTS,
  },
  {
    title: "Chăm sóc khách hàng",
    Icon: MessageCircleMore,
    href: ROUTE.MANAGE.MESSAGES,
  },
];

const employeeMenuItems: ManageMenuItem[] = [
  {
    title: "Đơn hàng",
    Icon: ShoppingCart,
    href: ROUTE.MANAGE.ORDERS,
  },
  {
    title: "Chăm sóc khách hàng",
    Icon: MessageCircleMore,
    href: ROUTE.MANAGE.MESSAGES,
  },
];

export const getMenuItemsByRole = (
  role: RoleType | null | undefined,
): ManageMenuItem[] => {
  if (role === Role.Admin) {
    return adminMenuItems;
  }

  if (role === Role.Employee) {
    return employeeMenuItems;
  }

  return [];
};
