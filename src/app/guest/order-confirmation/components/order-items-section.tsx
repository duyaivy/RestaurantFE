import NextImage from "next/image";
import { ORDER_ITEM_STATUS_LABEL } from "./constants";
import { NormalizedOrderItem } from "./types";

type OrderItemsSectionProps = {
  items: NormalizedOrderItem[];
};

export function OrderItemsSection({ items }: OrderItemsSectionProps) {
  return (
    <>
      {items.map((item) => (
        <div
          key={item.id}
          className="bg-[#171512] rounded-4xl border border-[#252118] overflow-hidden"
        >
          <div className="flex gap-3 p-3">
            <div className="relative w-20 h-20 rounded-[14px] overflow-hidden shrink-0">
              <NextImage
                src={item.image}
                alt={item.name}
                sizes="80px"
                fill
                className="object-cover"
              />
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
              <p className="text-[15px] font-semibold text-white leading-snug truncate">
                {item.name}
              </p>
              <p className="text-[12px] text-white/80 mt-0.5">
                {item.price.toLocaleString("vi-VN")} ₫ × {item.quantity}
              </p>
              {item.status && (
                <p className="text-[11px] text-amber-300 mt-0.5">
                  Trạng thái món:{" "}
                  {ORDER_ITEM_STATUS_LABEL[item.status] ?? item.status}
                </p>
              )}
              {item.note && (
                <p className="text-[11px] text-white/70 italic truncate mt-0.5">
                  {item.note}
                </p>
              )}
              <p className="text-[16px] font-bold text-amber-400 mt-1">
                {(item.price * item.quantity).toLocaleString("vi-VN")}
                <span className="text-[11px] font-normal text-white/60 ml-1">
                  ₫
                </span>
              </p>
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
