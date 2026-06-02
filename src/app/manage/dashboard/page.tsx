
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import DashboardMain from "@/features/dashboard/components/dashboard-main"
import { Suspense } from 'react'
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
            <Suspense fallback={<p className='text-sm text-muted-foreground'>{'\u0110ang t\u1ea3i d\u1eef li\u1ec7u...'}</p>}>
              <DashboardMain />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
