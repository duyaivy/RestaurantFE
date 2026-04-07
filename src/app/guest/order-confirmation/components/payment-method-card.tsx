import { Banknote, Check, QrCode } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PAYMENT_METHOD, PaymentMethod } from "@/constants/type";
import { CARD_STYLE } from "./constants";

type PaymentMethodCardProps = {
  paymentMethod: PaymentMethod | null;
  isSubmitting: boolean;
  onChooseMethod: (method: PaymentMethod) => void;
  onCancel: () => void;
  onSubmit: () => void;
};

export function PaymentMethodCard({
  paymentMethod,
  isSubmitting,
  onChooseMethod,
  onCancel,
  onSubmit,
}: PaymentMethodCardProps) {
  return (
    <div
      className="order-card rounded-4xl border border-[#252118] overflow-hidden"
      style={CARD_STYLE}
    >
      <div className="px-4 py-3 border-b border-[#1e1c16]">
        <p className="text-[10px] text-white/70 tracking-[0.25em] uppercase">
          Chọn phương thức thanh toán
        </p>
      </div>

      <button
        onClick={() => onChooseMethod(PAYMENT_METHOD.QR_CODE)}
        className={`w-full flex items-center gap-4 px-4 py-4 border-b border-[#1a1816] transition-all ${
          paymentMethod === PAYMENT_METHOD.QR_CODE
            ? "bg-[#1e1c18]"
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
          <p className="text-[14px] font-medium text-[#f2ece0]">VNPay</p>
          <p className="text-[11px] text-white/60">Ví điện tử, QR, thẻ</p>
        </div>
        {paymentMethod === PAYMENT_METHOD.QR_CODE && (
          <Check className="w-5 h-5 text-amber-400" />
        )}
      </button>

      <button
        onClick={() => onChooseMethod(PAYMENT_METHOD.CASH)}
        className={`w-full flex items-center gap-4 px-4 py-4 transition-all ${
          paymentMethod === PAYMENT_METHOD.CASH
            ? "bg-[#1e1c18]"
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
          <p className="text-[11px] text-white/60">Nhân viên đến thu tiền</p>
        </div>
        {paymentMethod === PAYMENT_METHOD.CASH && (
          <Check className="w-5 h-5 text-amber-400" />
        )}
      </button>

      <div className="px-4 py-3 border-t border-[#1e1c16] flex justify-end gap-2">
        <button
          onClick={onCancel}
          className="h-9 px-4 rounded-xl border border-[#2e2820] text-xs text-white/70"
        >
          Huỷ
        </button>
        <Button
          onClick={onSubmit}
          disabled={!paymentMethod || isSubmitting}
          isLoading={isSubmitting}
          className="h-9 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-xs font-semibold"
        >
          Xác nhận thanh toán
        </Button>
      </div>
    </div>
  );
}
