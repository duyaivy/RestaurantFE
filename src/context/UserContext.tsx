'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

export interface UserContextType {
  guestName: string
  setGuestName: (name: string) => void
  isLoggedIn: boolean
}

const UserContext = createContext<UserContextType | undefined>(undefined)

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [guestName, setGuestName] = useState<string>('')

  const handleSetGuestName = useCallback((name: string) => {
    setGuestName(name)
  }, [])

  const isLoggedIn = guestName.length > 0

  return (
    <UserContext.Provider
      value={{
        guestName,
        setGuestName: handleSetGuestName,
        isLoggedIn,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within UserProvider')
  }
  return context
}
