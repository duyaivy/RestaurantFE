import Link from "next/link";
import Image from "next/image";
import DarkModeToggle from "@/shared/ui/dark-mode-toggle";
import NavItems from "@/features/auth/components/NavItems";
import PublicMobileNav from "@/features/auth/components/PublicMobileNav";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";
import { LanguageSwitcher } from "@/shared/ui/LanguageSwitcher";
import { SpeakerToggle } from "@/shared/ui/SpeakerToggle";

export default async function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="relative flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-50 flex h-16 items-center gap-3 border-b border-white/10 bg-[#0f0e0c]/92 px-3 text-white shadow-sm backdrop-blur-xl md:gap-4 md:bg-background md:px-6 md:text-foreground">
          <PublicMobileNav />

          <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <Image
                src="/favicon.ico"
                alt=""
                width={28}
                height={28}
                unoptimized
                className="size-7 rounded-sm object-contain"
              />
              <span className="sr-only">VietFood</span>
            </Link>
            <NavItems className="shrink-0 text-muted-foreground transition-colors hover:text-foreground" />
          </nav>

          <Link
            href="/"
            className="flex min-w-0 flex-1 items-center gap-2 md:hidden"
          >
            <Image
              src="/favicon.ico"
              alt=""
              width={28}
              height={28}
              unoptimized
              className="size-7 shrink-0 rounded-sm object-contain"
            />
            <span className="truncate text-base font-semibold">VietFood</span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2">
            <SpeakerToggle />
            <LanguageSwitcher />
            <DarkModeToggle />
          </div>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          {children}
        </main>
      </div>
    </NextIntlClientProvider>
  );
}
