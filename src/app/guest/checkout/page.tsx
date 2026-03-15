'use client'

import { useState } from 'react'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft,  Check, Banknote, QrCode } from 'lucide-react'
import { useOrder } from '@/context/OrderContext'

type PaymentMethod = 'vnpay' | 'cash' | null

export default function CheckoutPage() {
  const { total, itemCount, clearOrder } = useOrder()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#0f0e0c] flex flex-col items-center justify-center p-8">
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
    )
  }

  const handlePayment = async () => {
    if (!paymentMethod) return

    setIsProcessing(true)
    setShowPaymentInfo(true)

    setTimeout(() => {
      clearOrder()
      setPaymentMethod(null)
      setIsProcessing(false)
      setShowPaymentInfo(false)
      router.push('/guest/menu')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-[#0f0e0c] pb-10">

      {/* HEADER */}
      <div className=" top-16 z-20 bg-[#0f0e0c]/95 backdrop-blur-md border-b border-[#1e1c18] px-5 py-4">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <h1 className="text-[17px] font-semibold text-[#f2ece0] tracking-wide">
            Thanh toán
          </h1>
          <span className="text-[10px] text-amber-500 tracking-[0.3em] uppercase">
            {itemCount} món
          </span>
        </div>
      </div>

      <div className="px-4 pt-5 max-w-sm mx-auto flex flex-col gap-4">

        {/* TOTAL */}
        <div className="bg-[#171512] rounded-[20px] border border-[#252118] p-5 text-center">
          <p className="text-[10px] text-white/70 tracking-[0.3em] uppercase mb-2">
            Tổng tiền
          </p>

          <p className="text-[36px] font-bold text-amber-400 leading-none">
            {total.toLocaleString('vi-VN')}
            <span className="text-[16px] font-normal text-white/70 ml-2">₫</span>
          </p>

          <div className="flex items-center justify-center gap-2 mt-3">
            <div className="h-px w-8 bg-[#252118]" />
            <span className="text-[10px] text-white/50 tracking-widest">
              {itemCount} MÓN
            </span>
            <div className="h-px w-8 bg-[#252118]" />
          </div>
        </div>

        {/* PAYMENT METHODS */}
        <div className="bg-[#171512] rounded-[20px] border border-[#252118] overflow-hidden">
          <div className="px-4 py-3 border-b border-[#1e1c16]">
            <p className="text-[10px] text-white/70 tracking-[0.25em] uppercase">
              Phương thức thanh toán
            </p>
          </div>

          {/* VNPay */}
          <button
            onClick={() => setPaymentMethod('vnpay')}
            className={`w-full flex items-center gap-4 px-4 py-4 border-b border-[#1a1816] transition-all ${
              paymentMethod === 'vnpay'
                ? 'bg-amber-'
                : 'hover:bg-[#1e1c18]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              paymentMethod === 'vnpay'
                ? 'bg-blue-500'
                : 'bg-[#1e1c18] border border-[#2e2820]'
            }`}>
              <QrCode className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-[#f2ece0]">
                Thanh toán VNPay
              </p>
              <p className="text-[11px] text-white/60">
                Ví điện tử, QR, thẻ ngân hàng
              </p>
            </div>

            {paymentMethod === 'vnpay' && (
              <Check className="w-5 h-5 text-amber-400" />
            )}
          </button>

          {/* CASH */}
          <button
            onClick={() => setPaymentMethod('cash')}
            className={`w-full flex items-center gap-4 px-4 py-4 transition-all ${
              paymentMethod === 'cash'
                ? 'bg-amber-'
                : 'hover:bg-[#1e1c18]'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              paymentMethod === 'cash'
                ? 'bg-green-600'
                : 'bg-[#1e1c18] border border-[#2e2820]'
            }`}>
              <Banknote className="w-5 h-5 text-white" />
            </div>

            <div className="flex-1 text-left">
              <p className="text-[14px] font-medium text-[#f2ece0]">
                Tiền mặt
              </p>
              <p className="text-[11px] text-white/60">
                Trả trực tiếp cho nhân viên
              </p>
            </div>

            {paymentMethod === 'cash' && (
              <Check className="w-5 h-5 text-amber-400" />
            )}
          </button>
        </div>

        {/* PAYMENT DETAIL */}

        {paymentMethod === 'vnpay' && (
          <div className="bg-[#171512] rounded-[20px] border border-[#252118] p-5">
            <p className="text-[10px] text-white/70 tracking-[0.25em] uppercase mb-4">
              Cổng thanh toán VNPay
            </p>

            <div className="bg-[#0f0e0c] rounded-2xl border border-[#252118] p-4 text-center">
              <QrCode className="w-10 h-10 text-blue-400 mx-auto mb-3" />

              <p className="text-[13px] font-medium text-[#f2ece0] mb-1">
                Thanh toán qua VNPay
              </p>

              <p className="text-[11px] text-white/60">
                Bạn sẽ được chuyển tới cổng thanh toán VNPay
              </p>
            </div>
          </div>
        )}

        {paymentMethod === 'cash' && (
          <div className="bg-[#171512] rounded-[20px] border border-[#252118] p-5">
            <p className="text-[10px] text-white/70 tracking-[0.25em] uppercase mb-4">
              Hướng dẫn thanh toán
            </p>

            <div className="bg-[#0f0e0c] rounded-2xl border border-[#252118] p-4 text-center">
              <Banknote className="w-10 h-10 text-green-400 mx-auto mb-3" />

              <p className="text-[13px] font-medium text-[#f2ece0] mb-1">
                Chuẩn bị đúng số tiền
              </p>

              <p className="text-[11px] text-white/60">
                Nhân viên sẽ đến thu tiền
              </p>
            </div>
          </div>
        )}

        {/* BUTTONS */}

        <div className="flex gap-3 pb-4">
          <Link href="/guest/order-confirmation" className="flex-1">
            <button className="w-full h-12 rounded-2xl border border-[#2a2418] bg-[#171512] text-white/80 text-[13px] flex items-center justify-center gap-2">
              <ArrowLeft className="w-4 h-4" />
              Quay lại
            </button>
          </Link>

          <button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="flex-1 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-30 text-[#0a0800] font-bold flex items-center justify-center gap-2"
          >
            {isProcessing ? 'Đang xử lý' : 'Hoàn tất'}
          </button>
        </div>

      </div>
    </div>
  )
}