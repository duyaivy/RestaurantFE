"use client";

import { ChevronLeft } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { ROUTE } from "@/shared/constants/route";

export function GuestBackButton() {
  const router = useRouter();
  const pathname = usePathname();

  if (pathname === ROUTE.GUEST.MENU) {
    return <div className="w-8 h-8" aria-hidden="true" />;
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      router.back();
      return;
    }

    router.push(ROUTE.GUEST.MENU);
  };

  return (
    <button
      type="button"
      onClick={handleBack}
      className="w-8 h-8 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white/80 hover:text-white hover:bg-white/10 transition-colors"
      aria-label="Go back"
    >
      <ChevronLeft className="w-4 h-4" />
    </button>
  );
}
