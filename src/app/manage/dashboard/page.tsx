import React from 'react'
import { cookies } from 'next/headers'
import { accountApiRequest } from '@/apiRequests/account'

export default async function Dashboard() {

  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value
  let name = ''
  try{
    const res = await accountApiRequest.sMe(accessToken || '')
     name = res.payload.data.name

  } catch(error:any){
    if(error.digest?.includes('NEXT_REDIRECT')){
      throw error
    }
  }

  return (
    <div>Dashboard - {name}</div>
  )
}
