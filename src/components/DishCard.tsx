'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Plus, Minus } from 'lucide-react'

interface DishCardProps {
  id: number
  name: string
  price: number
  image: string
  description?: string
}

export function DishCard({ id, name, price, image, description }: DishCardProps) {
  const { items, addItem, updateQuantity } = useCart()

  const cartItem = items.find((item) => item.id === id)
  const quantity = cartItem?.quantity || 0

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id, name, price, image })
  }

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (quantity > 0) updateQuantity(id, quantity - 1)
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id, name, price, image })
  }

  return (
    <Link href={`/guest/menu/${id}`}>
      <div
        className={`group flex items-center gap-[14px] rounded-[20px] p-[10px] border cursor-pointer transition-all duration-200 shadow-[0_2px_16px_rgba(0,0,0,0.4)] ${
          quantity > 0
            ? 'bg-[#1e1b12] border-[#c9a03055]'
            : 'bg-[#1c1a16] border-[#343028] hover:bg-[#222018] hover:border-[#4a4030]'
        }`}
      >
        {/* Thumbnail */}
        <div className="relative w-[86px] h-[86px] rounded-[14px] overflow-hidden flex-shrink-0">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.07]"
          />
          {quantity > 0 && (
            <div className="absolute top-[6px] left-[6px] w-5 h-5 rounded-full bg-[#c9a030] flex items-center justify-center">
              <span className="text-[11px] font-bold text-[#0f0e0c] leading-none">
                {quantity}
              </span>
            </div>
          )}
        </div>

        {/* Info + Cart control */}
        <div className="flex-1 min-w-0 flex flex-col justify-between h-[86px]">
          {/* Top: name + desc */}
          <div className="flex flex-col gap-[3px]">
            <p className="text-[14px] font-semibold text-[#f2ece0] leading-snug truncate">
              {name}
            </p>
            {description && (
              <p className="text-[12px] text-[#5c5040] leading-snug truncate">
                {description}
              </p>
            )}
          </div>

          {/* Bottom: price + cart control */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-[7px]">
              <div className="w-4 h-[1.5px] rounded-full bg-[#c9a030] flex-shrink-0" />
              <p className="text-[15px] font-bold text-[#c9a030] tracking-wide">
                {price.toLocaleString('vi-VN')}
                <span className="text-[11px] font-normal text-[#5c5040] ml-[2px]">₫</span>
              </p>
            </div>

            {/* Cart control */}
            {quantity === 0 ? (
              <button
                onClick={handleAdd}
                className="w-[18px] h-[18px] rounded-[5px] bg-[#c9a030] flex items-center justify-center shadow-[0_2px_8px_rgba(201,160,48,0.3)] hover:bg-[#ddb83a] active:scale-90 transition-all duration-150"
              >
                <Plus className="w-[8px] h-[8px] text-[#0f0e0c]" strokeWidth={3} />
              </button>
            ) : (
              <div className="flex items-center gap-[5px]">
                <button
                  onClick={handleDecrease}
                  className="w-[18px] h-[18px] rounded-[5px] border border-[#3a3428] flex items-center justify-center hover:border-[#c9a03060] active:scale-90 transition-all duration-150"
                >
                  <Minus className="w-[8px] h-[8px] text-[#a08040]" strokeWidth={2.5} />
                </button>

                <span className="text-[12px] font-bold text-[#f2ece0] w-[14px] text-center leading-none tabular-nums">
                  {quantity}
                </span>

                <button
                  onClick={handleIncrease}
                  className="w-[22px] h-[22px] rounded-[6px] bg-[#c9a030] flex items-center justify-center hover:bg-[#ddb83a] active:scale-90 transition-all duration-150"
                >
                  <Plus className="w-[9px] h-[9px] text-[#0f0e0c]" strokeWidth={3} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}