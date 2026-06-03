"use client";

import { useAppContext } from "@/shared/providers/app-provider";
import { cn } from "@/shared/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSyncExternalStore } from "react";
import { getPublicNavItems } from "./public-nav-items";

const subscribeHydration = () => () => {};
const getClientSnapshot = () => true;
const getServerSnapshot = () => false;

export default function NavItems({ className }: { className?: string }) {
  const pathname = usePathname();
  const { role } = useAppContext();
  const isHydrated = useSyncExternalStore(
    subscribeHydration,
    getClientSnapshot,
    getServerSnapshot,
  );
  const navItems = getPublicNavItems(isHydrated ? role : null);

  return navItems.map((item) => {
    const isActive =
      pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        href={item.href}
        key={item.href}
        className={cn(className, isActive && "text-foreground")}
      >
        {item.title}
      </Link>
    );
  });
}
