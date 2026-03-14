'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/CartContext'
import { useState } from 'react'
import { useCreateOrderMutation } from '@/queries/useOrder'
import Link from 'next/link'


export default function CartPage() {
  const { items, total, removeItem, updateQuantity, updateNote, itemCount } = useCart()
  const [showStaffCall, setShowStaffCall] = useState(false)
  const [staffRequest, setStaffRequest] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null)
  const [editingNoteValue, setEditingNoteValue] = useState('')
  const createOrderMutation = useCreateOrderMutation()

  if (itemCount === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-center">
          <p className="text-5xl mb-4">🛒</p>
          <h2 className="text-2xl font-bold text-foreground mb-2">Giỏ hàng trống</h2>
          <p className="text-muted-foreground mb-6 text-sm">
            Bạn chưa thêm sản phẩm nào
          </p>
          <Link href="/guest/menu">
            <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
              Quay lại mua hàng
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  const handleStaffSubmit = () => {
    setIsSubmitted(true)
    setTimeout(() => {
      setShowStaffCall(false)
      setStaffRequest('')
      setIsSubmitted(false)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="sticky top-16 z-20 bg-background border-b border-border p-4">
        <h1 className="text-xl font-bold text-foreground">Giỏ hàng ({itemCount})</h1>
      </div>

      {/* Cart Items List */}
      <div className="p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            {/* Item Card */}
            <div className="bg-card rounded-lg border border-border p-3 flex gap-3">
              {/* Image */}
              <div className="w-20 h-20 rounded-lg bg-secondary flex-shrink-0 overflow-hidden">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Details */}
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-sm">{item.name}</h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {item.price.toLocaleString()} VND × {item.quantity}
                </p>
                {item.note && (
                  <p className="text-xs text-foreground/70 mt-1 italic">
                    Ghi chú: {item.note}
                  </p>
                )}
                <p className="text-sm font-bold text-primary mt-1">
                  {(item.price * item.quantity).toLocaleString()} VND
                </p>
              </div>

              {/* Quantity & Remove */}
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(item.id)}
                  className="text-destructive hover:bg-destructive/10 rounded p-1 text-sm"
                >
                  ✕
                </button>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="px-2 py-0.5 rounded bg-secondary hover:bg-secondary/80 text-foreground text-xs"
                  >
                    −
                  </button>
                  <span className="px-2 text-foreground font-bold text-xs">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="px-2 py-0.5 rounded bg-primary hover:bg-primary/90 text-primary-foreground text-xs"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Edit Note Row */}
            {editingNoteId === item.id ? (
              <div className="bg-card rounded-lg border border-border p-3 flex gap-2">
                <textarea
                  value={editingNoteValue}
                  onChange={(e) => setEditingNoteValue(e.target.value)}
                  placeholder="Ghi chú cho sản phẩm này..."
                  className="flex-1 px-2 py-1 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-xs resize-none"
                  rows={2}
                />
                <div className="flex flex-col gap-1 flex-shrink-0">
                  <button
                    onClick={() => {
                      updateNote(item.id, editingNoteValue)
                      setEditingNoteId(null)
                    }}
                    className="px-2 py-1 rounded bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => setEditingNoteId(null)}
                    className="px-2 py-1 rounded bg-secondary hover:bg-secondary/80 text-foreground text-xs"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex justify-end px-3">
                <button
                  onClick={() => {
                    setEditingNoteId(item.id)
                    setEditingNoteValue(item.note || '')
                  }}
                  className="text-xs text-primary hover:text-primary/80 font-medium"
                >
                  {item.note ? 'Sửa ghi chú' : '+ Thêm ghi chú'}
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Summary & Checkout - Fixed Bottom */}
      <div className="fixed bottom-16 left-0 right-0 bg-card border-t border-border p-4">
        <div className="max-w-screen-sm mx-auto space-y-3">
          {/* Total */}
          <div className="flex justify-between items-center px-1">
            <span className="text-foreground/80 font-medium">Tong cong ({itemCount} mon)</span>
            <span className="text-xl font-bold text-primary">
              {total.toLocaleString()} VND
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            {/* Call Staff Button */}
            <button
              onClick={() => setShowStaffCall(true)}
              className="flex-1 px-4 py-3 rounded-lg bg-secondary hover:bg-secondary/80 text-foreground font-semibold transition-colors flex items-center justify-center gap-2 border border-border"
            >
              Goi nhan vien
            </button>

            {/* Checkout Button */}
            <Link href="/guest/checkout" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-12">
                Dat hang
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Staff Call Dialog */}
      <Dialog open={showStaffCall} onOpenChange={setShowStaffCall}>
        <DialogContent className="w-full rounded-2xl bg-card border border-border p-6 max-w-sm">
          {!isSubmitted ? (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-5xl mb-3">📞</p>
                <h3 className="text-lg font-bold text-foreground">Gọi nhân viên</h3>
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  Yêu cầu của bạn
                </label>
                <textarea
                  value={staffRequest}
                  onChange={(e) => setStaffRequest(e.target.value)}
                  placeholder="Ví dụ: Cần thêm nước lạnh, muốn gặp nhân viên..."
                  className="w-full px-3 py-2 rounded-lg bg-secondary border border-border text-foreground placeholder:text-muted-foreground text-sm resize-none"
                  rows={4}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={() => setShowStaffCall(false)}
                  className="flex-1 bg-secondary hover:bg-secondary/80 text-foreground"
                >
                  Hủy
                </Button>
                <Button
                  onClick={handleStaffSubmit}
                  disabled={!staffRequest.trim()}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Gửi
                </Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-3 py-6">
              <p className="text-4xl">✓</p>
              <h3 className="text-lg font-bold text-foreground">Yêu cầu đã gửi!</h3>
              <p className="text-sm text-foreground/80">
                Nhân viên sẽ sớm đến với bạn
              </p>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
