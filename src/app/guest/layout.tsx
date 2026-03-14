'use client'

import { UserProvider } from '@/context/UserContext'
import { CartProvider } from '@/context/CartContext'
import { OrderProvider } from '@/context/OrderContext'

export default function GuestLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          {children}
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  )
}