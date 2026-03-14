'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
  note?: string
}

export type OrderStatus = 'pending' | 'confirmed' | 'serving' | 'ready' | 'completed'

export interface OrderContextType {
  items: OrderItem[]
  total: number
  status: OrderStatus
  orderId: string | null
  addItem: (item: Omit<OrderItem, 'quantity'>) => void
  updateQuantity: (id: string, quantity: number) => void
  updateNote: (id: string, note: string) => void
  placeOrder: () => void
  confirmOrder: (orderId: string) => void
  completeOrder: () => void
  clearOrder: () => void
  itemCount: number
}

const OrderContext = createContext<OrderContextType | undefined>(undefined)

export function OrderProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<OrderItem[]>([])
  const [status, setStatus] = useState<OrderStatus>('pending')
  const [orderId, setOrderId] = useState<string | null>(null)

  const addItem = useCallback((newItem: Omit<OrderItem, 'quantity'>) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id)
      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      }
      return [...prevItems, { ...newItem, quantity: 1 }]
    })
  }, [])

  const updateQuantity = useCallback((id: string, quantity: number) => {
    if (quantity <= 0) {
      setItems((prevItems) => prevItems.filter((item) => item.id !== id))
      return
    }
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    )
  }, [])

  const updateNote = useCallback((id: string, note: string) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, note } : item
      )
    )
  }, [])

  const placeOrder = useCallback(() => {
    const newOrderId = `ORD-${Date.now()}`
    setOrderId(newOrderId)
    setStatus('confirmed')
  }, [])

  const confirmOrder = useCallback((id: string) => {
    setOrderId(id)
    setStatus('confirmed')
  }, [])

  const completeOrder = useCallback(() => {
    setStatus('completed')
  }, [])

  const clearOrder = useCallback(() => {
    setItems([])
    setStatus('pending')
    setOrderId(null)
  }, [])

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <OrderContext.Provider
      value={{
        items,
        total,
        status,
        orderId,
        addItem,
        updateQuantity,
        updateNote,
        placeOrder,
        confirmOrder,
        completeOrder,
        clearOrder,
        itemCount,
      }}
    >
      {children}
    </OrderContext.Provider>
  )
}

export function useOrder() {
  const context = useContext(OrderContext)
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider')
  }
  return context
}
