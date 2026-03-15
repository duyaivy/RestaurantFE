'use client'
import { getAccessTokenFromLocalStorage, getRefreshTokenFromLocalStorage } from '@/lib/utils'
import { useLogoutMutation } from '@/hooks/queries/useAuth'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useRef, Suspense } from 'react'
import { Loader2Icon } from 'lucide-react'

function LogoutComponent() {
  const { mutateAsync } = useLogoutMutation()
  const route = useRouter()
  const searchParams = useSearchParams()
  const refreshTokenFromUrl = searchParams.get('refreshToken')
  const accessTokenFromUrl = searchParams.get('accessToken')
  const ref = useRef<any>(null)
  useEffect(() => {
    if (ref.current || (
      refreshTokenFromUrl && refreshTokenFromUrl !== getRefreshTokenFromLocalStorage()) ||
      accessTokenFromUrl && accessTokenFromUrl !== getAccessTokenFromLocalStorage()) {
      return
    }
    ref.current = mutateAsync
    mutateAsync().then(res => {
      setTimeout(() => { }, 100)
      route.push('/login')
    })

  }, [mutateAsync, route, refreshTokenFromUrl, accessTokenFromUrl])
  return (
    <div>LogoutPage</div>
  )
}

export default function LogoutPage() {
  return (
    <Suspense fallback={<div>
      <Loader2Icon className='animate-spin size-5' />
      Logout</div>}>
      <LogoutComponent />
    </Suspense>
  )
}
