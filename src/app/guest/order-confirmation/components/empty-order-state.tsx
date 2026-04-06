import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { CARD_STYLE } from "./constants";
import { ROUTE } from "@/constants/route";

type EmptyOrderStateProps = {
  title: string;
  description: string;
};

export function EmptyOrderState({ title, description }: EmptyOrderStateProps) {
  return (
    <div className="h-full pt-14 bg-[#0f0e0c] flex flex-col items-center justify-center p-8">
      <div className="text-center">
        <div
          className="order-card w-20 h-20 rounded-3xl border border-[#252118] flex items-center justify-center mx-auto mb-6"
          style={CARD_STYLE}
        >
          <ClipboardList className="w-8 h-8 text-white/60" strokeWidth={1.5} />
        </div>
        <h2 className="text-xl font-semibold text-white mb-2 tracking-wide">
          {title}
        </h2>
        <p className="text-white/70 text-sm mb-8">{description}</p>
        <Link href={ROUTE.GUEST.MENU}>
          <button className="bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-black font-bold text-sm px-8 py-3.5 rounded-2xl tracking-wide shadow-[0_4px_16px_rgba(201,160,48,0.3)]">
            Xem thực đơn
          </button>
        </Link>
      </div>
    </div>
  );
}
