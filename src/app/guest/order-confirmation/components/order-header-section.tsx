import { PAGE_STYLE } from "./constants";

type OrderHeaderSectionProps = {
  orderId: number;
  statusClassName: string;
  statusDotClassName: string;
  statusLabel: string;
  isFetching: boolean;
};

export function OrderHeaderSection({
  orderId,
  statusClassName,
  statusDotClassName,
  statusLabel,
  isFetching,
}: OrderHeaderSectionProps) {
  return (
    <div
      className="order-page top-16 z-20 border-b border-[#1e1c18] px-5 py-4"
      style={PAGE_STYLE}
    >
      <div className="max-w-sm mx-auto flex items-center justify-between">
        <h1 className="text-[18px] font-semibold text-white tracking-wide">
          Đơn #{String(orderId).slice(-5)}
        </h1>
        <div
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${statusClassName}`}
        >
          <div className={`w-1.5 h-1.5 rounded-full ${statusDotClassName}`} />
          {statusLabel}
        </div>
      </div>
      {isFetching && (
        <p className="max-w-sm mx-auto mt-2 text-[11px] text-white/40">
          Đang đồng bộ đơn hàng...
        </p>
      )}
    </div>
  );
}
