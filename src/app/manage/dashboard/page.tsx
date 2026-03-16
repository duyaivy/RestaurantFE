// import React from 'react'
// import { cookies } from 'next/headers'
// import { accountApiRequest } from '@/apiRequests/account'

// export default async function Dashboard() {

//   const cookieStore = await cookies()
//   const accessToken = cookieStore.get('accessToken')?.value
//   let name = ''
//   try{
//     const res = await accountApiRequest.sMe(accessToken || '')
//      name = res.payload.data.name

//   } catch(error:any){
//     if(error.digest?.includes('NEXT_REDIRECT')){
//       throw error
//     }
//   }

//   return (
//     <div>Dashboard - {name}</div>
//   )
// }

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import DashboardMain from './dashboard-main'
export default async function Dashboard() {
  return (
    <main className='grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8'>
      <div className='space-y-2'>
        <Card x-chunk='dashboard-06-chunk-0'>
          <CardHeader>
            <CardTitle>Dashboard</CardTitle>
            <CardDescription>Phân tích các chỉ số</CardDescription>
          </CardHeader>
          <CardContent>
            <DashboardMain />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
