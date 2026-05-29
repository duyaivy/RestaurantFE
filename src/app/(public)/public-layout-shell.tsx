"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Package2 } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import NavItems from "@/features/auth/components/NavItems";
import DarkModeToggle from "@/shared/ui/dark-mode-toggle";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { Button } from "@/shared/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/shared/ui/sheet";

export default function PublicLayoutShell({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isGuestLoginPage = /^\/tables\/[^/]+/.test(pathname);

  if (isGuestLoginPage) {
    return <div className="min-h-screen w-full">{children}</div>;
  }

  return (
    <div className="relative flex min-h-screen w-full flex-col">
      <header className="bg-background sticky top-0 z-50 flex h-16 items-center gap-4 border-b px-4 md:px-6">
        <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
          <Link
            href="#"
            className="flex items-center gap-2 text-lg font-semibold md:text-base"
          >
            <Package2 className="h-6 w-6" />
            <span className="sr-only">Big boy</span>
          </Link>
          <NavItems className="text-muted-foreground hover:text-foreground shrink-0 transition-colors" />
        </nav>
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="shrink-0 md:hidden"
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <VisuallyHidden>
              <SheetTitle>Menu</SheetTitle>
            </VisuallyHidden>
            <nav className="grid gap-6 text-lg font-medium">
              <Link href="#" className="flex items-center gap-2 text-lg font-semibold">
                <Package2 className="h-6 w-6" />
                <span className="sr-only">Big boy</span>
              </Link>

              <NavItems className="text-muted-foreground hover:text-foreground transition-colors" />
            </nav>
          </SheetContent>
        </Sheet>
        <div className="ml-auto flex items-center gap-2">
          <LanguageSwitcher />
          <DarkModeToggle />
        </div>
      </header>
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        {children}
      </main>
    </div>
  );
}
