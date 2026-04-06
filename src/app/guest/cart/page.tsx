"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useCart } from "@/context/CartContext";
import { useOrder } from "@/context/OrderContext";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Trash2,
  Minus,
  Plus,
  MessageSquare,
  ShoppingBag,
  ChevronRight,
  Check,
  X,
} from "lucide-react";
import NextImage from "next/image";
import { Button } from "@/components/ui/button";
import { useCreateOrderMutation } from "@/hooks/queries/useOrder";
import { toast } from "@/components/ui/use-toast";
import { useTableChat } from "@/hooks/common/useTableChat";
import { useSocket } from "@/hooks/common/useSocket";
import { ROUTE } from "@/constants/route";

export default function CartPage() {
  const {
    items,
    total,
    removeItem,
    updateQuantity,
    updateNote,
    itemCount,
    clearCart,
  } = useCart();
  const { placeOrder, addItem } = useOrder();
  const router = useRouter();

  const { mutateAsync: createOrder, isPending: isCreatingOrder } =
    useCreateOrderMutation();
  const { sendMessage } = useTableChat();
  const { isConnected } = useSocket();
  const [showStaffCall, setShowStaffCall] = useState(false);
  const [staffRequest, setStaffRequest] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [editingNoteValue, setEditingNoteValue] = useState("");
  const [isOrdering, setIsOrdering] = useState(false);

  if (itemCount === 0) {
    return (
      <div className="h-full pt-14 bg-[#0a0908] flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="size-20 rounded-3xl bg-[#161412] border border-white/5 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="size-8 text-white/30" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2 tracking-wide">
            Giỏ hàng trống
          </h2>
          <p className="text-white/40 text-sm mb-8">
            Bạn chưa thêm sản phẩm nào
          </p>
          <Link href={ROUTE.GUEST.MENU}>
            <button className="bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-black font-bold text-sm px-8 py-3.5 rounded-2xl tracking-wide shadow-[0_4px_20px_rgba(245,158,11,0.35)]">
              Quay lại mua hàng
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handleStaffSubmit = () => {
    if (!isConnected) {
      toast({
        title: "Gọi nhân viên thất bại",
        description: "Mất kết nối realtime, vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    const tableNumber =
      typeof window !== "undefined"
        ? localStorage.getItem("table_number_id")
        : null;

    const fallbackMessage = `Khách ở bàn số ${tableNumber || "xxx"} yêu cầu gọi nhân viên.`;
    const message = staffRequest.trim() || fallbackMessage;

    sendMessage(message);

    setIsSubmitted(true);
    setTimeout(() => {
      setShowStaffCall(false);
      setStaffRequest("");
      setIsSubmitted(false);
    }, 1500);
  };

  const handlePlaceOrder = async () => {
    try {
      setIsOrdering(true);

      const dataApi = items.map((item) => ({
        dish_id: item.id,
        quantity: item.quantity,
        note: item.note || "",
      }));
      const { payload } = await createOrder({ items: dataApi });

      const orderId = payload.data?.id;
      localStorage.setItem("order_id", orderId.toString());
      items.forEach((item) => {
        for (let i = 0; i < item.quantity; i++) {
          addItem({
            id: item.id.toString(),
            name: item.name,
            price: item.price,
            image: item.image,
            note: item.note,
          });
        }
      });
      placeOrder();
      clearCart();
      router.push(ROUTE.GUEST.ORDER_CONFIRMATION);
    } catch (error) {
      console.error("Error placing order:", error);
      toast({
        title: "Đặt món thất bại",
        description: "Vui lòng thử lại sau.",
        variant: "destructive",
      });
    } finally {
      setIsOrdering(false);
    }
  };

  return (
    // pb-[200px] = nav bar (~64px) + summary card + breathing room
    <div className="min-h-full pt-14 bg-[#0a0908] pb-50">
      {/* HEADER */}
      <div className="z-20 bg-[#0a0908] border-b border-white/5 px-5 py-4">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <h1 className="text-[17px] font-semibold text-white tracking-wide">
            Giỏ hàng
          </h1>
          <span className="text-[10px] text-amber-500/70 tracking-[0.35em] uppercase font-medium">
            {itemCount} món
          </span>
        </div>
      </div>

      {/* CART ITEMS */}
      <div className="px-4 pt-5 pb-16 max-w-sm mx-auto flex flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="rounded-4xl border border-white/10 overflow-hidden"
            style={{ backgroundColor: "#161412" }}
          >
            {/* TOP: image + info + delete + qty */}
            <div className="flex gap-3 p-3.5 items-start">
              <div className="relative w-17 h-17 rounded-[14px] overflow-hidden shrink-0">
                <NextImage
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="68px"
                  className="object-cover"
                />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[14px] font-semibold text-white leading-snug truncate">
                  {item.name}
                </p>
                <p className="text-[11px] text-white/35 mt-1">
                  {item.price.toLocaleString("vi-VN")}₫ / món
                </p>
                <p className="text-[17px] font-bold text-amber-400 mt-1.5 tabular-nums">
                  {(item.price * item.quantity).toLocaleString("vi-VN")}
                  <span className="text-[10px] font-normal text-white/30 ml-0.5">
                    ₫
                  </span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2.5 shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="size-8 rounded-xl flex items-center justify-center hover:bg-red-500/10 transition-colors group"
                >
                  <Trash2
                    className="size-4 text-white/30 group-hover:text-red-400 transition-colors"
                    strokeWidth={1.5}
                  />
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() =>
                      updateQuantity(item.id, Math.max(1, item.quantity - 1))
                    }
                    className="flex items-center justify-center hover:opacity-60 transition-opacity"
                  >
                    <Minus className="size-4 text-white/50" strokeWidth={2} />
                  </button>
                  <span className="text-[14px] font-bold text-white tabular-nums w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="flex items-center justify-center hover:opacity-60 transition-opacity"
                  >
                    <Plus className="size-4 text-amber-400" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-white/5" />

            {/* BOTTOM ROW: note */}
            {editingNoteId !== item.id && (
              <div className="flex items-center justify-between px-3.5 py-1.5">
                {item.note ? (
                  <p className="text-[10px] text-amber-400/60 italic truncate flex-1 mr-3">
                    {item.note}
                  </p>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => {
                    setEditingNoteId(item.id);
                    setEditingNoteValue(item.note || "");
                  }}
                  className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-amber-400 transition-colors shrink-0"
                >
                  <MessageSquare className="size-3" strokeWidth={1.5} />
                  {item.note ? "Sửa ghi chú" : "+ Thêm ghi chú"}
                </button>
              </div>
            )}

            {/* NOTE EDITOR */}
            {editingNoteId === item.id && (
              <div
                className="px-3.5 pt-2.5 pb-3 border-t border-amber-500/15"
                style={{ backgroundColor: "rgba(245,158,11,0.03)" }}
              >
                <textarea
                  autoFocus
                  value={editingNoteValue}
                  onChange={(e) => setEditingNoteValue(e.target.value)}
                  placeholder="Ví dụ: ít cay, không hành..."
                  className="w-full bg-black/30 border border-amber-500/20 rounded-xl px-3 py-2 text-[12px] text-white placeholder:text-white/25 outline-none resize-none focus:border-amber-500/40 transition-colors mb-2"
                  rows={2}
                />
                <div className="flex justify-end gap-1.5">
                  <button
                    onClick={() => {
                      setEditingNoteId(null);
                      setEditingNoteValue("");
                    }}
                    className="flex items-center gap-1 h-8 px-3 rounded-xl text-white/45 text-[12px] transition-colors"
                    style={{ backgroundColor: "rgba(255,255,255,0.07)" }}
                  >
                    <X className="w-3 h-3" strokeWidth={2} /> Huỷ
                  </button>
                  <button
                    onClick={() => {
                      updateNote(item.id, editingNoteValue);
                      setEditingNoteId(null);
                    }}
                    className="flex items-center gap-1 h-8 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-[12px] font-bold transition-colors"
                  >
                    <Check className="w-3 h-3" strokeWidth={2.5} /> Lưu
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}

        {/* SUMMARY */}
        <div
          className="mt-1 rounded-4xl border border-white/[0.07] p-4"
          style={{ backgroundColor: "#161412" }}
        >
          <div className="flex justify-between items-center text-[12px] text-white/35 mb-1.5">
            <span>Tạm tính ({itemCount} món)</span>
            <span className="tabular-nums">
              {total.toLocaleString("vi-VN")}₫
            </span>
          </div>
          <div className="flex justify-between items-center text-[12px] mb-4">
            <span className="text-white/35">Phí dịch vụ</span>
            <span className="text-green-400/70">Miễn phí</span>
          </div>

          <div className="h-px bg-white/6 mb-4" />

          <div className="flex justify-between items-center mb-4">
            <span className="text-xs text-white font-medium">Tổng cộng</span>
            <span className="text-xl font-bold text-amber-400 tabular-nums leading-none">
              {total.toLocaleString("vi-VN")}
              <span className="text-[11px] font-normal text-white/30 ml-1">
                ₫
              </span>
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => setShowStaffCall(true)}
              className="flex-1 h-12 rounded-2xl border border-white/8 text-white/50 text-[12px] font-medium flex items-center justify-center gap-2 transition-all"
              style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
            >
              <MessageSquare className="size-3.5" strokeWidth={1.5} />
              Gọi nhân viên
            </button>
            <Button
              onClick={handlePlaceOrder}
              isLoading={isCreatingOrder || isOrdering}
              className="flex-1 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 active:scale-[0.98] text-black text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all"
              style={{ boxShadow: "0 4px 20px rgba(245,158,11,0.35)" }}
            >
              {isOrdering || isCreatingOrder ? (
                <p className="flex items-center gap-2 text-white">Đang xử lý</p>
              ) : (
                <span className="flex items-center gap-1 text-black">
                  Đặt món <ChevronRight className="w-4 h-4" strokeWidth={2.5} />
                </span>
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* STAFF CALL DIALOG */}
      <Dialog open={showStaffCall} onOpenChange={setShowStaffCall}>
        <DialogContent
          className="w-[calc(100%-2rem)] max-w-sm rounded-3xl border border-white/8 p-6"
          style={{ backgroundColor: "#161412" }}
        >
          {!isSubmitted ? (
            <div className="space-y-5">
              <div className="text-center">
                <div
                  className="w-12 h-12 rounded-2xl border border-amber-500/20 flex items-center justify-center mx-auto mb-3"
                  style={{ backgroundColor: "rgba(245,158,11,0.1)" }}
                >
                  <MessageSquare
                    className="size-5 text-amber-400"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="text-[16px] font-semibold text-white">
                  Gọi nhân viên
                </h3>
                <p className="text-[11px] text-white/40 mt-1">
                  Nhân viên sẽ sớm đến hỗ trợ bạn
                </p>
              </div>
              <textarea
                value={staffRequest}
                onChange={(e) => setStaffRequest(e.target.value)}
                placeholder="Ví dụ: Cần thêm nước lạnh, gọi thanh toán..."
                className="w-full px-3.5 py-3 rounded-2xl bg-black/30 border border-white/8 text-white placeholder:text-white/25 text-[13px] resize-none outline-none focus:border-amber-500/30 transition-colors"
                rows={3}
              />
              <div className="flex gap-2">
                <Button
                  onClick={() => setShowStaffCall(false)}
                  className="flex-1 h-11 rounded-2xl border border-white/8 text-white/50 text-[13px] font-medium flex items-center justify-center gap-1.5 transition-all"
                  style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                >
                  <X className="size-3.5" strokeWidth={2} /> Huỷ
                </Button>
                <Button
                  onClick={handleStaffSubmit}
                  className="flex-1 h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-white text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="size-3.5" strokeWidth={2.5} /> Gửi
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div
                className="size-12 rounded-full border border-amber-500/25 flex items-center justify-center mx-auto"
                style={{ backgroundColor: "rgba(245,158,11,0.15)" }}
              >
                <Check className="size-5 text-amber-400" strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-semibold text-white">
                Yêu cầu đã gửi!
              </h3>
              <p className="text-[11px] text-white/40">
                Nhân viên sẽ sớm đến với bạn
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
