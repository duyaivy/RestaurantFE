'use client'

import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCart } from '@/context/CartContext'
import { useOrder } from '@/context/OrderContext'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Trash2, Minus, Plus, MessageSquare, ShoppingBag, ChevronRight, Check, X } from 'lucide-react'
import NextImage from 'next/image'

export default function CartPage() {
  const { items, total, removeItem, updateQuantity, updateNote, itemCount, clearCart } = useCart()
  const { addItem, placeOrder } = useOrder()
  const router = useRouter()

  const [showStaffCall, setShowStaffCall] = useState(false)
  const [staffRequest, setStaffRequest] = useState('')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editingNoteValue, setEditingNoteValue] = useState('')
  const [isOrdering, setIsOrdering] = useState(false)

  if (itemCount === 0) {
    return (
      <div className="min-h-screen bg-[#0a0908] flex flex-col items-center justify-center p-8">
        <div className="text-center">
          <div className="w-20 h-20 rounded-3xl bg-[#161412] border border-white/5 flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-8 h-8 text-white/30" strokeWidth={1.5} />
          </div>
          <h2 className="text-lg font-semibold text-white mb-2 tracking-wide">Giỏ hàng trống</h2>
          <p className="text-white/40 text-sm mb-8">Bạn chưa thêm sản phẩm nào</p>
          <Link href="/guest/menu">
            <button className="bg-amber-500 hover:bg-amber-400 active:scale-95 transition-all text-black font-bold text-sm px-8 py-3.5 rounded-2xl tracking-wide shadow-[0_4px_20px_rgba(245,158,11,0.35)]">
              Quay lại mua hàng
            </button>
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

  const handlePlaceOrder = () => {
    setIsOrdering(true)
    items.forEach((item) => {
      for (let i = 0; i < item.quantity; i++) {
        addItem({ id: item.id, name: item.name, price: item.price, image: item.image, note: item.note })
      }
    })
    placeOrder()
    clearCart()
    setTimeout(() => router.push('/guest/order-confirmation'), 500)
  }

  return (
    <div className="min-h-screen bg-[#0a0908] pb-40">

      {/* HEADER */}
      <div className="sticky top-16 z-20 bg-[#0a0908]/95 backdrop-blur-md border-b border-white/5 px-5 py-4">
        <div className="max-w-sm mx-auto flex items-center justify-between">
          <h1 className="text-[17px] font-semibold text-white tracking-wide">Giỏ hàng</h1>
          <span className="text-[10px] text-amber-500/70 tracking-[0.35em] uppercase font-medium">
            {itemCount} món
          </span>
        </div>
      </div>

      {/* CART ITEMS */}
      <div className="px-4 pt-5 max-w-sm mx-auto flex flex-col gap-2">

        {items.map((item) => (
          <div key={item.id} className="bg-[#161412] rounded-[20px] border border-white/[0.07] overflow-hidden">

            {/* TOP: image + info + delete + qty */}
            <div className="flex gap-3 p-3.5 items-start">
              <div className="relative w-[68px] h-[68px] rounded-[14px] overflow-hidden shrink-0">
                <NextImage src={item.image} alt={item.name} fill sizes="68px" className="object-cover" />
              </div>

              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-[14px] font-semibold text-white leading-snug truncate">{item.name}</p>
                <p className="text-[11px] text-white/35 mt-1">{item.price.toLocaleString('vi-VN')}₫ / món</p>
                <p className="text-[17px] font-bold text-amber-400 mt-1.5 tabular-nums">
                  {(item.price * item.quantity).toLocaleString('vi-VN')}
                  <span className="text-[10px] font-normal text-white/30 ml-0.5">₫</span>
                </p>
              </div>

              <div className="flex flex-col items-end gap-2.5 shrink-0">
                <button
                  onClick={() => removeItem(item.id)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-red-500/10 transition-colors group"
                >
                  <Trash2 className="w-5 h-5 text-white/30 group-hover:text-red-400 transition-colors" strokeWidth={1.5} />
                </button>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                    className="w-[30px] h-[30px] rounded-[10px] bg-white/[0.06] border border-white/[0.08] flex items-center justify-center hover:bg-white/10 transition-colors"
                  >
                    <Minus className="w-3 h-3 text-white/60" strokeWidth={2} />
                  </button>
                  <span className="text-[15px] font-bold text-white tabular-nums w-5 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="w-[30px] h-[30px] rounded-[10px] bg-amber-500 hover:bg-amber-400 flex items-center justify-center transition-colors"
                  >
                    <Plus className="w-3 h-3 text-black" strokeWidth={2.5} />
                  </button>
                </div>
              </div>
            </div>

            {/* DIVIDER */}
            <div className="h-px bg-white/[0.05]" />

            {/* BOTTOM ROW: note trigger (right) */}
            {editingNoteId !== item.id && (
              <div className="flex items-center justify-between px-3.5 py-1.5">
                {item.note ? (
                  <p className="text-[10px] text-amber-400/60 italic truncate flex-1 mr-3">"{item.note}"</p>
                ) : (
                  <span />
                )}
                <button
                  onClick={() => { setEditingNoteId(item.id); setEditingNoteValue(item.note || '') }}
                  className="flex items-center gap-1.5 text-[11px] text-white/25 hover:text-amber-400 transition-colors shrink-0"
                >
                  <MessageSquare className="w-3 h-3" strokeWidth={1.5} />
                  {item.note ? 'Sửa ghi chú' : '+ Thêm ghi chú'}
                </button>
              </div>
            )}

            {/* NOTE EDITOR — inside card */}
            {editingNoteId === item.id && (
              <div className="px-3.5 pt-2.5 pb-3 border-t border-amber-500/[0.15] bg-amber-500/[0.03]">
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
                    onClick={() => { setEditingNoteId(null); setEditingNoteValue('') }}
                    className="flex items-center gap-1 h-8 px-3 rounded-xl bg-white/[0.07] hover:bg-white/10 text-white/45 text-[12px] transition-colors"
                  >
                    <X className="w-3 h-3" strokeWidth={2} /> Huỷ
                  </button>
                  <button
                    onClick={() => { updateNote(item.id, editingNoteValue); setEditingNoteId(null) }}
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
        <div className="mt-1 bg-[#161412] rounded-[20px] border border-white/[0.07] p-4">
          <div className="flex justify-between items-center text-[12px] text-white/35 mb-1.5">
            <span>Tạm tính ({itemCount} món)</span>
            <span className="tabular-nums">{total.toLocaleString('vi-VN')}₫</span>
          </div>
          <div className="flex justify-between items-center text-[12px] mb-4">
            <span className="text-white/35">Phí dịch vụ</span>
            <span className="text-green-400/70">Miễn phí</span>
          </div>

          <div className="h-px bg-white/[0.06] mb-4" />

          <div className="flex justify-between items-center mb-4">
            <span className="text-[13px] text-white font-medium">Tổng cộng</span>
            <span className="text-[22px] font-bold text-amber-400 tabular-nums leading-none">
              {total.toLocaleString('vi-VN')}
              <span className="text-[11px] font-normal text-white/30 ml-1">₫</span>
            </span>
          </div>

          <div className="flex gap-2.5">
            <button
              onClick={() => setShowStaffCall(true)}
              className="flex-1 h-12 rounded-2xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-white/50 text-[12px] font-medium flex items-center justify-center gap-2 transition-all"
            >
              <MessageSquare className="w-3.5 h-3.5" strokeWidth={1.5} />
              Gọi nhân viên
            </button>
            <button
              onClick={handlePlaceOrder}
              disabled={isOrdering}
              className="flex-1 h-12 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 active:scale-[0.98] text-black text-[14px] font-bold flex items-center justify-center gap-1.5 transition-all shadow-[0_4px_20px_rgba(245,158,11,0.35)]"
            >
              {isOrdering ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/40 border-t-black rounded-full animate-spin" />
                  Đang xử lý
                </>
              ) : (
                <>Đặt món <ChevronRight className="w-4 h-4" strokeWidth={2.5} /></>
              )}
            </button>
          </div>
        </div>

      </div>

      {/* STAFF CALL DIALOG */}
      <Dialog open={showStaffCall} onOpenChange={setShowStaffCall}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-sm rounded-[24px] bg-[#161412] border border-white/[0.08] p-6">
          {!isSubmitted ? (
            <div className="space-y-5">
              <div className="text-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-3">
                  <MessageSquare className="w-5 h-5 text-amber-400" strokeWidth={1.5} />
                </div>
                <h3 className="text-[16px] font-semibold text-white">Gọi nhân viên</h3>
                <p className="text-[11px] text-white/40 mt-1">Nhân viên sẽ sớm đến hỗ trợ bạn</p>
              </div>
              <textarea
                value={staffRequest}
                onChange={(e) => setStaffRequest(e.target.value)}
                placeholder="Ví dụ: Cần thêm nước lạnh, muốn gặp nhân viên..."
                className="w-full px-3.5 py-3 rounded-2xl bg-black/30 border border-white/[0.08] text-white placeholder:text-white/25 text-[13px] resize-none outline-none focus:border-amber-500/30 transition-colors"
                rows={3}
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setShowStaffCall(false)}
                  className="flex-1 h-11 rounded-2xl border border-white/[0.08] bg-white/[0.04] text-white/50 text-[13px] font-medium flex items-center justify-center gap-1.5 hover:bg-white/[0.07] transition-all"
                >
                  <X className="w-3.5 h-3.5" strokeWidth={2} /> Huỷ
                </button>
                <button
                  onClick={handleStaffSubmit}
                  disabled={!staffRequest.trim()}
                  className="flex-1 h-11 rounded-2xl bg-amber-500 hover:bg-amber-400 disabled:opacity-40 text-black text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <Check className="w-3.5 h-3.5" strokeWidth={2.5} /> Gửi
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-6 space-y-3">
              <div className="w-12 h-12 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto">
                <Check className="w-5 h-5 text-amber-400" strokeWidth={2} />
              </div>
              <h3 className="text-[16px] font-semibold text-white">Yêu cầu đã gửi!</h3>
              <p className="text-[11px] text-white/40">Nhân viên sẽ sớm đến với bạn</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

    </div>
  )
}