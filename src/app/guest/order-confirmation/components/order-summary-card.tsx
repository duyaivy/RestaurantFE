import { ChevronRight, MessageSquare } from "lucide-react";
import { CARD_STYLE } from "./constants";

type OrderSummaryCardProps = {
  itemCount: number;
  total: number;
  onOpenStaffRequest: () => void;
  onOpenPayment: () => void;
};

export function OrderSummaryCard({
  itemCount,
  total,
  onOpenStaffRequest,
  onOpenPayment,
}: OrderSummaryCardProps) {
  return (
    <div
      className="order-card rounded-4xl border border-[#252118] p-4"
      style={CARD_STYLE}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-[13px] text-white/80 tracking-wide">
          Tổng cộng ({itemCount} món)
        </span>
        <span className="text-[22px] font-bold text-amber-400">
          {total.toLocaleString("vi-VN")}
          <span className="text-[11px] font-normal text-white/60 ml-1">₫</span>
        </span>
      </div>

      <div className="flex gap-2.5">
        <button
          onClick={onOpenStaffRequest}
          className="order-card-alt flex-1 h-12 rounded-2xl border border-[#2a2418] text-white/80 text-[12px] font-medium flex items-center justify-center gap-1.5 hover:border-amber-500/20 transition-colors"
          style={{ backgroundColor: "#1a1814" }}
        >
          <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
          Gọi nhân viên
        </button>

        <button
          onClick={onOpenPayment}
          className="flex-1 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all"
          style={{ boxShadow: "0 4px 16px rgba(201,160,48,0.3)" }}
        >
          Thanh toán
          <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  );
}
