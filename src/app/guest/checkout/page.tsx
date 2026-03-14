'use client'

import { useState } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useOrder } from '@/context/OrderContext'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

type PaymentMethod = 'card' | 'qr' | null

export default function CheckoutPage() {
  const { items, total, itemCount, clearCart } = useCart()
  const { addItem, placeOrder } = useOrder()
  const router = useRouter()
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [showPaymentInfo, setShowPaymentInfo] = useState(false)

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Không có đơn hàng
          </h2>
          <Link href="/guest/menu">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground mt-4">
              Quay lại mua hàng
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handlePayment = async () => {
    if (!paymentMethod) return

    setIsProcessing(true)
    setShowPaymentInfo(true)

    // Chuyen du lieu tu Cart sang Order
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({
          id: item.id,
          name: item.name,
          price: item.price,
          image: item.image,
          note: item.note,
        })
      }
    })
    placeOrder()
    clearCart()

    setTimeout(() => {
      setPaymentMethod(null)
      setIsProcessing(false)
      setShowPaymentInfo(false)
      router.push('/guest/order-confirmation')
    }, 2000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Checkout Card */}
      <div className="w-full max-w-sm bg-card rounded-2xl border border-border p-6 shadow-lg">
        {/* Header */}
        <h2 className="text-2xl font-bold text-foreground text-center mb-6">
          Thanh toán
        </h2>

        {/* Total Amount */}
        <div className="bg-secondary rounded-lg p-4 mb-6 text-center">
          <p className="text-sm text-muted-foreground mb-1">Tổng tiền</p>
          <p className="text-3xl font-bold text-primary">
            {total.toLocaleString()} VND
          </p>
        </div>

        {/* Payment Methods */}
        <div className="space-y-3 mb-6">
          {/* Card Payment Option */}
          <button
            onClick={() => setPaymentMethod('card')}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
              paymentMethod === 'card'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-secondary/50 hover:bg-secondary/70'
            }`}
          >
            <div className="text-3xl">💳</div>
            <div className="text-left flex-1">
              <p className="font-semibold text-foreground">Thanh toán qua thẻ</p>
              <p className="text-xs text-muted-foreground">Thẻ tín dụng hoặc ghi nợ</p>
            </div>
            {paymentMethod === 'card' && (
              <div className="text-primary font-bold">✓</div>
            )}
          </button>

          {/* QR Code Payment Option */}
          <button
            onClick={() => setPaymentMethod('qr')}
            className={`w-full p-4 rounded-xl border-2 transition-all flex items-center gap-3 ${
              paymentMethod === 'qr'
                ? 'border-primary bg-primary/5'
                : 'border-border bg-secondary/50 hover:bg-secondary/70'
            }`}
          >
            <div className="text-3xl">📱</div>
            <div className="text-left flex-1">
              <p className="font-semibold text-foreground">Quét mã QR</p>
              <p className="text-xs text-muted-foreground">Ví điện tử, chuyển khoản</p>
            </div>
            {paymentMethod === 'qr' && (
              <div className="text-primary font-bold">✓</div>
            )}
          </button>
        </div>

        {/* Payment Details Preview */}
        {paymentMethod && (
          <div className="bg-secondary rounded-lg p-4 mb-6 text-sm">
            {paymentMethod === 'card' ? (
              <div className="space-y-2">
                <p className="text-foreground/80">Thông tin thanh toán:</p>
                <p className="text-foreground font-medium">Thẻ tín dụng/ghi nợ</p>
                <p className="text-xs text-muted-foreground">
                  Nhấn Hoàn tất để tiếp tục với cổng thanh toán
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-foreground/80">Mã QR Code:</p>
                <div className="bg-input rounded-lg p-4 flex items-center justify-center h-40">
                  <div className="text-center">
                    <p className="text-muted-foreground text-sm mb-2">📱</p>
                    <p className="text-xs text-muted-foreground">QR Code sẽ hiển thị ở đây</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">
                  Quét bằng ứng dụng thanh toán của bạn
                </p>
              </div>
            )}
          </div>
        )}

        {/* Terms */}
        <p className="text-xs text-muted-foreground text-center mb-4">
          Dữ liệu của bạn sẽ được bảo vệ theo chính sách bảo mật của chúng tôi.
        </p>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Link href="/guest/cart" className="flex-1">
            <Button className="w-full bg-secondary hover:bg-secondary/80 text-foreground">
              Quay lại
            </Button>
          </Link>
          <Button
            onClick={handlePayment}
            disabled={!paymentMethod || isProcessing}
            className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2"
          >
            {isProcessing ? 'Đang xử lý...' : 'Hoàn tất'}
          </Button>
        </div>
      </div>

      {/* Success Dialog */}
      <Dialog open={showPaymentInfo}>
        <DialogContent className="w-full max-w-sm bg-card border border-border rounded-2xl p-6">
          <div className="text-center space-y-4">
            <div className="text-6xl">✓</div>
            <div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                Đơn hàng đã tạo!
              </h3>
              <p className="text-sm text-foreground/80">
                {paymentMethod === 'card'
                  ? 'Thanh toán bằng thẻ đã được xác nhận'
                  : 'Thanh toán bằng QR Code đã được xác nhận'}
              </p>
            </div>
            <div className="bg-secondary rounded-lg p-3 text-sm">
              <p className="text-muted-foreground mb-1">Tổng tiền</p>
              <p className="text-primary font-bold text-lg">
                {total.toLocaleString()} VND
              </p>
            </div>
            <p className="text-xs text-muted-foreground">
              Đơn hàng sẽ được giao sớm...
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
