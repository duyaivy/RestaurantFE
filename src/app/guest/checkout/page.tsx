"use client";

import { useState } from "react";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Check, Banknote, QrCode } from "lucide-react";
import { useOrder } from "@/context/OrderContext";
import { Button } from "@/components/ui/button";
import { usePaymentGuestMutation } from "@/hooks/queries/useOrder";
import { PAYMENT_METHOD, PaymentMethod } from "@/constants/type";

export default function CheckoutPage() {
  const { total, itemCount, clearOrder } = useOrder();
  const router = useRouter();

  const { mutateAsync: paymentOrderMutate, isPending: isOrderPaying } =
    usePaymentGuestMutation();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPaymentInfo, setShowPaymentInfo] = useState(false);

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8" style={{ backgroundColor: '#0f0e0c' }}>
        <div className="text-center">
          <h2 className="text-xl font-semibold text-[#f2ece0] mb-6 tracking-wide">
            Không có đơn hàng
          </h2>
          <Link href="/guest/menu">
            <button className="bg-amber-500 hover:bg-amber-400 text-[#0a0800] font-bold text-sm px-8 py-3.5 rounded-2xl tracking-wide">
              Quay lại thực đơn
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const handlePayment = async () => {
    // payment
    try {
      const { payload } = await paymentOrderMutate({
        orderId: Number(localStorage.getItem("order_id")),
        body: {
          payment_method: paymentMethod || PAYMENT_METHOD.CASH,
        },
      });
      const paymentUrl = payload.data.url;
      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
      }

      setIsProcessing(true);
      setShowPaymentInfo(true);

      setTimeout(() => {
        clearOrder();
        setPaymentMethod(null);
        setIsProcessing(false);
        setShowPaymentInfo(false);
        router.push("/guest/menu");
      }, 1000);
    } catch {
      setIsProcessing(false);
      setShowPaymentInfo(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0e0c] pb-10">
      {/* HEADER */}
      <div className="top-16 z-20 border-b border-[#1e1c18] px-5 py-4" style={{ backgroundColor: '#0f0e0c' }}>
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <h1 className="text-[17px] font-semibold text-[#f2ece0] tracking-wide">
            Thanh toán
          </h1>
          <span className="text-[10px] text-amber-500 tracking-[0.3em] uppercase">
            {itemCount} món
          </span>
        </div>
      </div>

      <div className="px-4 pt-5 pb-14 max-w-sm mx-auto flex flex-col gap-4">
        {/* TOTAL */}
        <div className="rounded-4xl border border-[#252118] p-5 text-center" style={{ backgroundColor: '#171512' }}>
          <p className="text-[10px] text-white/70 tracking-[0.3em] uppercase mb-2">
            Tổng tiền
          </p>
          <p className="text-[36px] font-bold text-amber-400 leading-none">
            {total.toLocaleString("vi-VN")}
            <span className="text-[16px] font-normal text-white/70 ml-2">
              ₫
            </span>
          </p>
          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-8 bg-[#252118]" />
            <span className="text-[10px] text-white/50 tracking-widest">{itemCount} MÓN</span>
            <div className="h-px w-8 bg-[#252118]" />
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="rounded-4xl border border-[#252118] overflow-hidden" style={{ backgroundColor: '#171512' }}>
          <div className="px-4 py-3 border-b border-[#1e1c16]">
            <p className="text-[10px] text-white/70 tracking-[0.25em] uppercase">
              Phương thức thanh toán
            </p>
          </div>

          {/* VNPay */}
          <button
            onClick={() => setPaymentMethod(PAYMENT_METHOD.QR_CODE)}
            className={`w-full flex items-center gap-4 px-4 py-4 border-b border-[#1a1816] transition-all ${
              paymentMethod === PAYMENT_METHOD.QR_CODE
                ? "bg-amber-"
                : "hover:bg-[#1e1c18]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === PAYMENT_METHOD.QR_CODE
                  ? "bg-blue-500"
                  : "bg-[#1e1c18] border border-[#2e2820]"
              }`}
            >
              <QrCode className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-[#f2ece0]">Thanh toán VNPay</p>
              <p className="text-[11px] text-white/60">Ví điện tử, QR, thẻ ngân hàng</p>
            </div>

            {paymentMethod === PAYMENT_METHOD.QR_CODE && (
              <Check className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* CASH */}
          <button
            onClick={() => setPaymentMethod(PAYMENT_METHOD.CASH)}
            className={`w-full flex items-center gap-4 px-4 py-4 transition-all ${
              paymentMethod === PAYMENT_METHOD.CASH
                ? "bg-amber-"
                : "hover:bg-[#1e1c18]"
            }`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                paymentMethod === PAYMENT_METHOD.CASH
                  ? "bg-green-600"
                  : "bg-[#1e1c18] border border-[#2e2820]"
              }`}
            >
              <Banknote className="w-5 h-5 text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-[#f2ece0]">Tiền mặt</p>
              <p className="text-[11px] text-white/60">
                Trả trực tiếp cho nhân viên
              </p>
            </div>

            {paymentMethod === PAYMENT_METHOD.CASH && (
              <Check className="w-5 h-5 text-amber-400" />
            )}
          </button>
        </div>

        {/* PAYMENT DETAIL */}

        {paymentMethod === PAYMENT_METHOD.QR_CODE && (
          <div className="bg-[#171512] rounded-4xl border border-[#252118] p-5">
            <p className="text-[10px] text-white/70 tracking-[0.25em] uppercase mb-4">
              Cổng thanh toán VNPay
            </p>
            <div className="rounded-2xl border border-[#252118] p-4 text-center" style={{ backgroundColor: '#0f0e0c' }}>
              <QrCode className="w-10 h-10 text-blue-400 mx-auto mb-3" />
              <p className="text-[13px] font-medium text-[#f2ece0] mb-1">Thanh toán qua VNPay</p>
              <p className="text-[11px] text-white/60">Bạn sẽ được chuyển tới cổng thanh toán VNPay</p>
            </div>
          </div>
        )}

        {paymentMethod === PAYMENT_METHOD.CASH && (
          <div className="bg-[#171512] rounded-4xl border border-[#252118] p-5">
            <p className="text-[10px] text-white/70 tracking-[0.25em] uppercase mb-4">
              Hướng dẫn thanh toán
            </p>
            <div className="rounded-2xl border border-[#252118] p-4 text-center" style={{ backgroundColor: '#0f0e0c' }}>
              <Banknote className="w-10 h-10 text-green-400 mx-auto mb-3" />
              <p className="text-[13px] font-medium text-[#f2ece0] mb-1">Chuẩn bị đúng số tiền</p>
              <p className="text-[11px] text-white/60">Nhân viên sẽ đến thu tiền</p>
            </div>
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex gap-3">
          <Link href="/guest/order-confirmation" className="flex-1">
            <button className="w-full h-12 rounded-2xl border border-[#2a2418] text-white/80 text-[13px] flex items-center justify-center gap-2" style={{ backgroundColor: '#171512' }}>
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          </Link>

          <Button
            onClick={handlePayment}
            disabled={!paymentMethod}
            isLoading={isOrderPaying || isProcessing}
            className="flex-1 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-[#0a0800] font-bold flex items-center justify-center gap-2"
          >
            {isProcessing ? "Đang xử lý" : "Hoàn tất"}
          </Button>
        </div>
      </div>
    </div>
  );
}
