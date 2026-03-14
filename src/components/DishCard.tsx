'use client'

import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { Plus, Minus } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface DishCardProps {
  id: number
  name: string
  price: number
  image: string
  description?: string
}

export function DishCard({
  id,
  name,
  price,
  image,
  description
}: DishCardProps) {
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
    if (quantity > 0) {
      updateQuantity(id, quantity - 1)
    }
  }

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    addItem({ id, name, price, image })
  }

  return (
    <Link href={`/guest/menu/${id}`}>
      <div className="bg-card rounded-lg overflow-hidden border border-border hover:border-primary/50 transition-all flex gap-4 p-3">
        
        {/* Image */}
        <div className="w-24 h-24 bg-secondary rounded-lg flex-shrink-0 overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <h3 className="font-semibold text-foreground text-sm line-clamp-2">
              {name}
            </h3>

            {description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                {description}
              </p>
            )}
          </div>

          <p className="text-primary font-bold text-base">
            {price.toLocaleString()} VND
          </p>
        </div>

        {/* Add to Cart */}
        <div className="flex items-center">
          {quantity === 0 ? (
            <Button
              size="sm"
              onClick={handleAdd}
              className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-9 h-9 p-0"
            >
              <Plus className="w-5 h-5" />
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={handleDecrease}
                className="rounded-full w-8 h-8 p-0 border-primary text-primary"
              >
                <Minus className="w-4 h-4" />
              </Button>

              <span className="w-6 text-center font-semibold text-foreground">
                {quantity}
              </span>

              <Button
                size="sm"
                onClick={handleIncrease}
                className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full w-8 h-8 p-0"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

      </div>
    </Link>
  )
}