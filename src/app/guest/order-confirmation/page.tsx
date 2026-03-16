"use client";

import { useOrder } from "@/context/OrderContext";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  MessageSquare,
  ChevronRight,
  ClipboardList,
  Check,
} from "lucide-react";
import NextImage from "next/image";

export default function OrderConfirmationPage() {
  const router = useRouter();
  const { items, total, orderId, status, itemCount, updateNote } = useOrder();

  const [showStaffCall, setShowStaffCall] = useState(false);
  const [staffRequest, setStaffRequest] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState("");

  if (itemCount === 0) {
    return (
      <div className="h-full pt-14  bg-[#0f0e0c] flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#171512] border border-[#252118] flex items-center justify-center mx-auto mb-6">
            <ClipboardList
              className="w-8 h-8 text-white/60"
              strokeWidth={1.5}
            />
          </div>

          <h2 className="text-xl font-semibold text-white mb-2 tracking-wide">
            Chưa có đơn hàng
          </h2>

          <p className="text-white/70 text-sm mb-8">Hãy chọn món để đặt hàng</p>

          <Link href="/guest/menu">
            <button className="bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-black font-bold text-sm px-8 py-3.5 rounded-2xl tracking-wide shadow-[0_4px_16px_rgba(201,160,48,0.3)]">
              Xem thực đơn
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStaffSubmit = () => {
    setIsSubmitted(true);
    setTimeout(() => {
      setShowStaffCall(false);
      setStaffRequest("");
      setIsSubmitted(false);
    }, 1500);
  };

  return (
    <div className="h-full pt-14 bg-[#0f0e0c] pb-36">
      {/* HEADER */}
      <div className=" top-16 z-20 bg-[#0f0e0c]/95 backdrop-blur-md border-b border-[#1e1c18] px-5 py-4">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <h1 className="text-[18px] font-semibold text-white tracking-wide">
            Đơn #{orderId?.slice(-5)}
          </h1>

          <div
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold ${
              status === "confirmed"
                ? "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                : "bg-green-500/15 text-green-400 border border-green-500/20"
            }`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                status === "confirmed" ? "bg-amber-400" : "bg-green-400"
              }`}
            />
            {status === "confirmed" ? "Đang chuẩn bị" : "Sẵn sàng"}
          </div>
        </div>
      </div>

      <div className="px-4 pt-4 pb-20 max-w-sm mx-auto flex flex-col gap-3">
        {/* ORDER ITEMS */}
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-[#171512] rounded-[20px] border border-[#252118] overflow-hidden"
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
                {/* TÊN MÓN */}
                <p className="text-[15px] font-semibold text-white leading-snug truncate">
                  {item.name}
                </p>

                <p className="text-[12px] text-white/80 mt-0.5">
                  {item.price.toLocaleString("vi-VN")} ₫ × {item.quantity}
                </p>

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

            {/* NOTE ROW */}
            <div className="border-t border-[#1e1c16] px-3 py-2.5 flex justify-end">
              <button
                onClick={() => {
                  setEditingNoteId(editingNoteId === item.id ? null : item.id);
                  setEditingNoteValue(item.note || "");
                }}
                className="flex items-center gap-1.5 text-[11px] text-white/70 hover:text-white transition-colors"
              >
                <MessageSquare className="w-3 h-3" strokeWidth={1.5} />
                {item.note ? "Sửa ghi chú" : "Thêm ghi chú"}
              </button>
            </div>

            {/* NOTE EDITOR */}
            {editingNoteId === item.id && (
              <div className="border-t border-[#1e1c16] p-3 flex gap-2">
                <textarea
                  value={editingNoteValue}
                  onChange={(e) => setEditingNoteValue(e.target.value)}
                  placeholder="Ghi chú cho món này..."
                  rows={1}
                  className="flex-1 bg-[#0f0e0c] border border-[#2e2820] rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/40 outline-none focus:border-amber-500/40 resize-none"
                />

                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => {
                      updateNote(item.id, editingNoteValue);
                      setEditingNoteId(null);
                    }}
                    className="w-8 h-8 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center"
                  >
                    <Check className="w-4 h-4 text-black" />
                  </button>

                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="w-8 h-8 rounded-xl border border-[#2e2820] flex items-center justify-center"
                  >
                    <span className="text-white/60 text-xs">✕</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* SUMMARY */}
        <div className="bg-[#171512] rounded-[20px] border border-[#252118] p-4">
          <div className="flex items-center justify-between mb-4">
            <span className="text-[13px] text-white/80 tracking-wide">
              Tổng cộng ({itemCount} món)
            </span>

            <span className="text-[22px] font-bold text-amber-400">
              {total.toLocaleString("vi-VN")}
              <span className="text-[11px] font-normal text-white/60 ml-1">
                ₫
              </span>
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => setShowStaffCall(true)}
              className="flex-1 h-12 rounded-2xl border border-[#2a2418] bg-[#1a1814] hover:border-amber-500/20 text-white/80 text-[12px] font-medium flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
              Gọi nhân viên
            </button>

            <Link href="/guest/checkout" className="flex-1">
              <button className="w-full h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 active:scale-[0.98] text-black text-[14px] font-bold flex items-center justify-center gap-1.5">
                Thanh toán
                <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
