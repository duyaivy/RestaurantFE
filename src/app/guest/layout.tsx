'use client'

import { usePathname } from 'next/navigation'
import { useUser } from '@/context/UserContext'
import { MikiAssistant } from '@/components/MikiAssistant'
import { useOrder } from '@/context/OrderContext'
import { useCart } from '@/context/CartContext'
import Link from 'next/link'
import { UtensilsCrossed, ShoppingCart, ClipboardList } from 'lucide-react'
import { UserProvider } from '@/context/UserContext'
import { CartProvider } from '@/context/CartContext'
import { OrderProvider } from '@/context/OrderContext'

function StoreLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { guestName } = useUser()
  const { itemCount: orderItemCount, status, orderId } = useOrder()
  const { itemCount: cartItemCount } = useCart()

  const navItems = [
    {
      href: '/guest/cart',
      icon: ShoppingCart,
      label: 'Giỏ hàng',
      isActive: pathname === '/guest/cart' || pathname === '/guest/checkout',
      badge: cartItemCount > 0 ? cartItemCount : undefined,
    },
    {
      href: '/guest/menu',
      icon: UtensilsCrossed,
      label: 'Menu',
      isActive: pathname === '/guest/menu',
    },
    {
      href: '/guest/order-confirmation',
      icon: ClipboardList,
      label: 'Đơn hàng',
      isActive: pathname === '/guest/order-confirmation',
      badge: orderId && status === 'confirmed' ? orderItemCount : undefined,
    },
  ]

  return (
    <div className="min-h-screen bg-[#0a0908] pb-20">

      {/* Header */}
      <header className="sticky top-0 z-30 bg-[#0a0908]/95 backdrop-blur-md border-b border-white/[0.06]">
        <div className="flex items-center justify-center max-w-screen-sm mx-auto h-14 px-4">
          <h1 className="text-[15px] font-semibold text-white tracking-wide">
            Bigboy Restaurant
          </h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-screen-sm mx-auto">{children}</main>

      {/* Miki Assistant — đặt trước nav, offset bottom để không đè tab */}
      <div className="fixed bottom-[64px] right-4 z-40">
        <MikiAssistant userName={guestName} />
      </div>

      {/* Bottom Tab Bar */}
      <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0f0e0c]/95 backdrop-blur-md border-t border-white/[0.06]">
        <div className="max-w-screen-sm mx-auto flex items-center justify-around h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = item.isActive
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 transition-all relative"
              >
                {/* active pill background */}
                {isActive && (
                  <div className="absolute inset-x-3 top-2 bottom-2 rounded-2xl bg-amber-500/10" />
                )}

                <div className="relative z-10">
                  <Icon
                    className={`w-5 h-5 transition-colors ${isActive ? 'text-amber-400' : 'text-white/30'
                      }`}
                    strokeWidth={isActive ? 2 : 1.5}
                  />
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="absolute -top-2 -right-2.5 bg-amber-500 text-black text-[10px] rounded-full min-w-[18px] h-[18px] flex items-center justify-center font-bold px-1 leading-none">
                      {item.badge}
                    </span>
                  )}
                </div>

                <span
                  className={`text-[10px] font-medium z-10 transition-colors ${isActive ? 'text-amber-400' : 'text-white/30'
                    }`}
                >
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

    </div>
  )
}

export default function GuestLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <CartProvider>
        <OrderProvider>
          <StoreLayout>{children}</StoreLayout>
        </OrderProvider>
      </CartProvider>
    </UserProvider>
  )
}