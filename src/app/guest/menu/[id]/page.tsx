"use client";

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

import { ShoppingCart, Check, ChevronLeft, Minus, Plus } from 'lucide-react'
import Image from 'next/image'
import { useGetDishQuery } from '@/hooks/queries/useDish';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { addItem } = useCart();

  const dishId = Number(params.id);

  const { data, isLoading } = useGetDishQuery({
    id: dishId,
    enabled: !!dishId,
  });

  const product = data?.payload.data;

  const [quantity, setQuantity] = useState(1);
  const [note, setNote] = useState("");
  const [isAdded, setIsAdded] = useState(false);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0908]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-8 h-8 rounded-full border-2 border-amber-400 border-t-transparent animate-spin" />
          <p className="text-amber-400/60 text-[10px] tracking-widest uppercase">Đang tải...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0908]">
        <p className="text-white/30 text-sm tracking-widest uppercase">Không tìm thấy sản phẩm</p>
      </div>
    );
  }

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product.id,
        name: product.name.vi,
        price: product.price,
        image: product.image,
        note: note || undefined,
      });
    }
    setIsAdded(true)
    setTimeout(() => setIsAdded(false), 2000)
  }

  return (
    <div className="min-h-screen bg-[#0a0908] pb-[160px]">

      {/* ── HERO ── */}
      <div className="relative px-4 pt-12">

        {/* Back button — ngoài card */}
        <button
          onClick={() => router.back()}
          className="absolute top-4 left-4 z-20 w-9 h-9 rounded-full bg-white/[0.08] border border-white/10 flex items-center justify-center text-white active:scale-90 transition-all"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Hero card */}
        <div
          className="relative h-[220px] rounded-[24px] overflow-hidden"
          style={{ boxShadow: '0 8px 40px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.06)' }}
        >
          {/* Blur background — nhẹ, vẫn thấy màu sắc */}
          <Image
            src={product.image}
            alt=""
            fill
            className="object-cover scale-105 blur-[2px] brightness-[0.75]"
            priority
          />

          {/* Vignette viền trong */}
          <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.4)]" />

          {/* Circle image nổi chính giữa */}
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Glow */}
            <div className="absolute w-[200px] h-[200px] rounded-full"
              style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.15) 0%, transparent 70%)' }}
            />
            {/* Ảnh tròn */}
            <div
              className="relative w-[155px] h-[155px] rounded-full overflow-hidden"
              style={{
                boxShadow: '0 0 0 3px rgba(255,255,255,0.12), 0 0 0 6px rgba(255,255,255,0.04), 0 16px 40px rgba(0,0,0,0.6)',
              }}
            >
              <Image
                src={product.image}
                alt={product.name.vi}
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-sm mx-auto px-5 mt-6 space-y-4">

        {/* Name & Price */}
        <div className="text-center">
          <h1 className="text-[24px] font-bold text-white leading-snug tracking-[-0.02em]">
            {product.name.vi}
          </h1>
          <p className="text-[22px] font-extrabold text-amber-400 mt-1 tabular-nums">
            {product.price.toLocaleString('vi-VN')}
            <span className="text-sm font-normal text-white/30 ml-1">₫</span>
          </p>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-amber-500/30" />
            <div className="w-1 h-1 rounded-full bg-amber-500/60" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-amber-500/30" />
          </div>
        </div>

        {/* Description */}
        <div className="bg-[#161412] rounded-2xl p-4 border border-white/[0.06]">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-2">Mô tả</p>
          <p className="text-white/65 text-[13px] leading-relaxed">
            {product.description.vi}
          </p>
        </div>

        {/* Note */}
        <div className="bg-[#161412] rounded-2xl p-4 border border-white/[0.06]">
          <label className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-2 block">
            Ghi chú
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ví dụ: không cay, ít muối..."
            rows={3}
            className="w-full bg-black/30 text-white/80 text-[13px] placeholder:text-white/20 rounded-xl px-3 py-2.5 resize-none border border-white/[0.08] focus:outline-none focus:border-amber-500/30 transition-colors"
          />
        </div>

        {/* Quantity + Subtotal */}
        <div className="bg-[#161412] rounded-2xl p-4 border border-white/[0.06]">
          <p className="text-[10px] tracking-[0.25em] uppercase text-white/25 mb-3">Số lượng</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-10 h-10 rounded-xl border border-white/[0.08] bg-white/[0.04] flex items-center justify-center text-white/50 hover:border-amber-500/30 hover:text-amber-400 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-xl font-bold text-white w-6 text-center tabular-nums">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="w-10 h-10 rounded-xl bg-amber-500 hover:bg-amber-400 flex items-center justify-center text-black transition-colors"
                style={{ boxShadow: '0 4px 16px rgba(245,158,11,0.35)' }}
              >
                <Plus className="w-4 h-4" strokeWidth={2.5} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-[10px] text-white/25 uppercase tracking-wider mb-0.5">Tạm tính</p>
              <p className="text-[18px] font-bold text-amber-400 tabular-nums">
                {(product.price * quantity).toLocaleString('vi-VN')}
                <span className="text-[11px] font-normal text-white/25 ml-1">₫</span>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-16 left-0 right-0 z-30 bg-[#0a0908]/95 backdrop-blur-md border-t border-white/[0.06] px-5 py-4">
        <div className="max-w-sm mx-auto">
          <button
            onClick={handleAddToCart}
            className={`w-full py-4 rounded-2xl flex items-center justify-center gap-2.5 text-[15px] font-bold transition-all duration-300 active:scale-[0.98] ${isAdded
              ? 'bg-green-500/15 border border-green-500/30 text-green-400'
              : 'bg-amber-500 hover:bg-amber-400 text-black'
              }`}
            style={!isAdded ? { boxShadow: '0 4px_20px rgba(245,158,11,0.35)' } : {}}
          >
            {isAdded ? (
              <>
                <Check className="w-5 h-5" strokeWidth={2.5} />
                Đã thêm vào giỏ
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" strokeWidth={2} />
                Thêm vào giỏ hàng
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}