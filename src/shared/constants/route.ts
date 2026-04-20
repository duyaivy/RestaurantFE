export const ROUTE = {
  HOME: "/",
  AUTH: {
    LOGIN: "/login",
    REGISTER: "/register",
    REFRESH_TOKEN: "/refresh-token",
    LOGOUT: "/logout",
  },
  PUBLIC: {
    TABLES: "/tables",
    TABLE_BY_NUMBER: (tableNumber: string | number) => `/tables/${tableNumber}`,
  },
  GUEST: {
    ROOT: "/guest",
    MENU: "/guest/menu",
    CART: "/guest/cart",
    CHECKOUT: "/guest/checkout",
    ORDER_CONFIRMATION: "/guest/order-confirmation",
    ORDERS: "/guest/orders",
  },
  MANAGE: {
    ROOT: "/manage",
    DASHBOARD: "/manage/dashboard",
    ORDERS: "/manage/orders",
    TABLES: "/manage/tables",
    DISHES: "/manage/dishes",
    ANALYTICS: "/manage/analytics",
    ACCOUNTS: "/manage/accounts",
    MESSAGES: "/manage/messages",
    SETTING: "/manage/setting",
  },
};
