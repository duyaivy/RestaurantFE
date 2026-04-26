"use client";

import { usePathname } from "next/navigation";
import { useUser } from "@/features/auth/context/user-context";
import { MikiAssistant } from "@/features/messages/components/MikiAssistant";
import { useOrder } from "@/features/orders/context/order-context";
import { useCart } from "@/features/cart/context/cart-context";
import Link from "next/link";
import { UtensilsCrossed, ShoppingCart, ClipboardList } from "lucide-react";
import { UserProvider } from "@/features/auth/context/user-context";
import { CartProvider } from "@/features/cart/context/cart-context";
import { OrderProvider } from "@/features/orders/context/order-context";
import { ROUTE } from "@/shared/constants/route";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { GuestBackButton } from "@/features/guest/components/GuestBackButton";
import { useTranslations } from "next-intl";

function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const t = useTranslations("orders");
  const landingT = useTranslations("landing");
  const commonT = useTranslations("common");
  const menuT = useTranslations("menu");
  const { guestName, isGuest } = useUser();
  const { itemCount: orderItemCount, status, orderId } = useOrder();
  const { itemCount: cartItemCount } = useCart();

  const navItems = [
    {
      href: ROUTE.GUEST.CART,
      icon: ShoppingCart,
      label: commonT("cart"),
      isActive:
        pathname === ROUTE.GUEST.CART || pathname === ROUTE.GUEST.CHECKOUT,
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      href: ROUTE.GUEST.MENU,
      icon: UtensilsCrossed,
      label: menuT("title"),
      isActive: pathname === ROUTE.GUEST.MENU,
    },
    {
      href: ROUTE.GUEST.ORDER_CONFIRMATION,
      icon: ClipboardList,
      label: t("title"),
      isActive: pathname === ROUTE.GUEST.ORDER_CONFIRMATION,
      badge: orderId && status === "confirmed" ? orderItemCount : undefined,
    },
  ];

  return (
    <div className="h-screen bg-[#0a0908] pb-20">
      <header className="fixed min-w-full top-0 z-30 bg-[#0a0908]/95 backdrop-blur-md border-b border-white/6">
        <div className="grid grid-cols-[auto_1fr_auto] items-center max-w-screen-sm mx-auto h-14 px-4 gap-3">
          <GuestBackButton />
          <Link
            href={ROUTE.HOME}
            className="flex items-center justify-center w-full gap-2"
          >
            <h1 className="text-center font-semibold text-white tracking-wide truncate">
              {landingT("appTitle")}
            </h1>
          </Link>
          <LanguageSwitcher />
        </div>
      </header>
      <main className="h-full mx-auto ">{children}</main>
      {isGuest && (
        <>
          <div className="fixed bottom-20 right-4 z-40">
            <MikiAssistant userName={guestName} />
          </div>
          <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0e0c]/95 backdrop-blur-md border-t border-white/6">
            <div className="max-w-screen-sm mx-auto flex items-center justify-around h-16 px-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = item.isActive;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative"
                  >
                    {isActive && (
                      <div className="absolute inset-x-3 top-2 bottom-2 rounded-2xl bg-amber-500/10" />
                    )}

                    <div className="relative z-10">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          isActive ? "text-amber-400" : "text-white/30"
                        }`}
                        strokeWidth={isActive ? 2 : 1.5}
                      />
                      {item.badge !== undefined && item.badge > 0 && (
                        <span className="absolute -top-2 -right-2.5 bg-amber-500 text-black text-[10px] rounded-full min-w-4.5 h-4.5 flex items-center justify-center font-bold px-1 leading-none">
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <span
                      className={`text-[10px] font-medium z-10 transition-colors ${
                        isActive ? "text-amber-400" : "text-white/30"
                      }`}
                    >
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

export default function GuestClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          <StoreLayout>{children}</StoreLayout>
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  );
}
