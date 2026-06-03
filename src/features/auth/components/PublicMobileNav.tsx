"use client";

import Link from "next/link";
import Image from "next/image";
import { useSyncExternalStore } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  BadgeCheck,
  ChevronRight,
  LogIn,
  LogOut,
  Menu,
  Sparkles,
} from "lucide-react";
import { Role } from "@/shared/constants/type";
import { ROUTE } from "@/shared/constants/route";
import { useAppContext } from "@/shared/providers/app-provider";
import { Button, buttonVariants } from "@/shared/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";
import { cn, handleErrorApi } from "@/shared/lib/utils";
import { useLogoutMutation as useStaffLogoutMutation } from "@/features/auth/hooks/use-auth";
import { useLogoutMutation as useGuestLogoutMutation } from "@/features/guest/hooks/use-guest";
import {
  getPublicNavItems,
  getPublicRoleLabel,
} from "./public-nav-items";

const subscribeHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function PublicMobileNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useAppContext();
  const staffLogoutMutation = useStaffLogoutMutation();
  const guestLogoutMutation = useGuestLogoutMutation();
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const navItems = getPublicNavItems(isHydrated ? role : null);
  const roleLabel = getPublicRoleLabel(isHydrated ? role : null);
  const isLoggedIn = isHydrated && role !== null;

  const logout = async () => {
    if (
      staffLogoutMutation.isPending ||
      guestLogoutMutation.isPending ||
      !role
    ) {
      return;
    }

    try {
      if (role === Role.Guest) {
        await guestLogoutMutation.mutateAsync();
      } else {
        await staffLogoutMutation.mutateAsync();
      }

      router.push(ROUTE.HOME);
      router.refresh();
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="size-10 shrink-0 rounded-full border-white/12 bg-black/20 text-white shadow-sm backdrop-blur-md hover:bg-white/10 md:hidden"
        >
          <Menu className="size-5" />
          <span className="sr-only">Mở menu</span>
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="w-[min(88vw,22rem)] gap-0 overflow-hidden border-r border-white/10 bg-[#0f0e0c] p-0 text-white sm:max-w-sm"
      >
        <div className="flex min-h-full flex-col">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(245,158,11,0.22),transparent_36%),#0f0e0c] px-5 pb-5 pt-6">
            <Link href={ROUTE.HOME} className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-xl bg-white shadow-[0_12px_30px_rgba(245,158,11,0.18)]">
                <Image
                  src="/favicon.ico"
                  alt=""
                  width={34}
                  height={34}
                  unoptimized
                  className="size-8.5 object-contain"
                />
              </span>
              <div className="min-w-0">
                <SheetTitle className="truncate text-lg font-semibold text-white">
                  VietFood
                </SheetTitle>
                <p className="mt-0.5 text-xs text-white/45">
                  Nhà hàng trực tuyến
                </p>
              </div>
            </Link>

            <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.04] px-3 py-3">
              <div
                className={cn(
                  "flex size-10 items-center justify-center rounded-full",
                  isLoggedIn
                    ? "bg-emerald-400/12 text-emerald-300"
                    : "bg-white/8 text-white/55",
                )}
              >
                {isLoggedIn ? (
                  <BadgeCheck className="size-5" />
                ) : (
                  <Sparkles className="size-5" />
                )}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-white">
                  {roleLabel}
                </p>
                <p className="mt-0.5 truncate text-xs text-white/45">
                  {isLoggedIn
                    ? "Phiên đăng nhập đang hoạt động"
                    : "Phiên khách vãng lai"}
                </p>
              </div>
            </div>
          </div>

          <nav className="flex-1 space-y-2 px-3 py-4">
            {navItems.map((item) => {
              const Icon = item.Icon;
              const isActive =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`);

              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex min-h-12 items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-amber-500 text-black shadow-[0_10px_24px_rgba(245,158,11,0.2)]"
                        : "text-white/70 hover:bg-white/8 hover:text-white",
                    )}
                  >
                    <Icon className="size-5 shrink-0" />
                    <span className="min-w-0 flex-1 truncate">
                      {item.title}
                    </span>
                    <ChevronRight
                      className={cn(
                        "size-4 shrink-0 transition-transform group-hover:translate-x-0.5",
                        isActive ? "text-black/70" : "text-white/30",
                      )}
                    />
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          <div className="border-t border-white/10 p-4">
            {isLoggedIn ? (
              <Button
                type="button"
                variant="outline"
                className="h-11 w-full border-white/12 bg-white/[0.04] text-white hover:bg-white/10 hover:text-white"
                onClick={logout}
                isLoading={
                  staffLogoutMutation.isPending ||
                  guestLogoutMutation.isPending
                }
              >
                <LogOut className="size-4" />
                Đăng xuất
              </Button>
            ) : (
              <SheetClose asChild>
                <Link
                  href={ROUTE.AUTH.LOGIN}
                  className={cn(buttonVariants(), "h-11 w-full")}
                >
                  <LogIn className="size-4" />
                  Đăng nhập
                </Link>
              </SheetClose>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
