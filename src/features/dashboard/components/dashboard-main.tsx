'use client'

import { ChangeEvent, useCallback, useEffect, useMemo } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { RevenueLineChart } from '@/features/dashboard/components/revenue-line-chart'
import { DishBarChart } from '@/features/dashboard/components/dish-bar-chart'
import { formatCurrency } from '@/shared/lib/utils'
import { Input } from '@/shared/ui/input'
import { Button } from '@/shared/ui/button'
import { useDashboardQuery } from '@/features/dashboard/hooks/use-dashboard'

const labels = {
  from: 'T\u1eeb',
  fromPlaceholder: 'T\u1eeb ng\u00e0y',
  to: '\u0110\u1ebfn',
  toPlaceholder: '\u0110\u1ebfn ng\u00e0y',
  loading: '\u0110ang t\u1ea3i d\u1eef li\u1ec7u...',
  error: 'Kh\u00f4ng th\u1ec3 t\u1ea3i d\u1eef li\u1ec7u dashboard.',
  revenue: 'T\u1ed5ng doanh thu',
  revenueNote: '+12.5% so v\u1edbi th\u00e1ng tr\u01b0\u1edbc',
  guests: 'Kh\u00e1ch',
  guestsNote: 'G\u1ecdi m\u00f3n h\u00f4m nay',
  orders: '\u0110\u01a1n h\u00e0ng',
  ordersNote: '\u0110\u00e3 thanh to\u00e1n',
  tables: 'B\u00e0n \u0111ang ph\u1ee5c v\u1ee5',
  totalTables: 'b\u00e0n t\u1ed5ng'
}

const getDefaultDateRange = () => {
  const to = new Date()
  const from = new Date(to)
  from.setDate(from.getDate() - 30)

  return {
    from: from.toISOString(),
    to: to.toISOString()
  }
}

const toDatetimeLocalValue = (value: string) => value.slice(0, 16)

const parseDishName = (dishName: string) => {
  try {
    const parsed = JSON.parse(dishName) as { vi?: string; en?: string }
    return parsed.vi || parsed.en || dishName
  } catch {
    return dishName
  }
}

export default function DashboardMain() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fromParam = searchParams.get('from')
  const toParam = searchParams.get('to')

  const dateRange = useMemo(() => {
    if (fromParam && toParam) {
      return {
        from: fromParam,
        to: toParam
      }
    }

    return getDefaultDateRange()
  }, [fromParam, toParam])

  const updateDateRange = useCallback((nextRange: { from: string; to: string }) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('from', nextRange.from)
    params.set('to', nextRange.to)
    router.replace(`${pathname}?${params.toString()}`)
  }, [pathname, router, searchParams])

  useEffect(() => {
    if (!fromParam || !toParam) {
      updateDateRange(dateRange)
    }
  }, [dateRange, fromParam, toParam, updateDateRange])

  const dashboardQuery = useDashboardQuery(dateRange)
  const dashboardData = dashboardQuery.data?.payload.data
  const stats = dashboardData?.stats ?? {
    revenue: 0,
    guest: 0,
    tables_reserving: 0,
    total_tables: 0,
    orders: 0
  }

  const topDishes = useMemo(
    () =>
      dashboardData?.top_dishes.map((dish) => ({
        name: parseDishName(dish.dish_name),
        totalQuantity: dish.total_quantity
      })) ?? [],
    [dashboardData?.top_dishes]
  )

  const handleDateChange =
    (key: 'from' | 'to') => (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value

      if (!value) return

      updateDateRange({
        ...dateRange,
        [key]: new Date(value).toISOString()
      })
    }

  const resetDateFilter = () => {
    updateDateRange(getDefaultDateRange())
  }

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap gap-2'>
        <div className='flex items-center'>
          <span className='mr-2'>{labels.from}</span>
          <Input
            type='datetime-local'
            placeholder={labels.fromPlaceholder}
            className='text-sm'
            value={toDatetimeLocalValue(dateRange.from)}
            onChange={handleDateChange('from')}
          />
        </div>
        <div className='flex items-center'>
          <span className='mr-2'>{labels.to}</span>
          <Input
            type='datetime-local'
            placeholder={labels.toPlaceholder}
            value={toDatetimeLocalValue(dateRange.to)}
            onChange={handleDateChange('to')}
          />
        </div>
        <Button className='' variant={'outline'} onClick={resetDateFilter}>
          Reset
        </Button>
      </div>

      {dashboardQuery.isLoading ? (
        <p className='text-sm text-muted-foreground'>{labels.loading}</p>
      ) : null}

      {dashboardQuery.isError ? (
        <p className='text-sm text-destructive'>{labels.error}</p>
      ) : null}

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-4'>
        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{labels.revenue}</CardTitle>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <path d='M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{formatCurrency(stats.revenue)}</div>
            <p className='text-xs text-muted-foreground'>{labels.revenueNote}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{labels.guests}</CardTitle>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <path d='M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2' />
              <circle cx='9' cy='7' r='4' />
              <path d='M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.guest}</div>
            <p className='text-xs text-muted-foreground'>{labels.guestsNote}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{labels.orders}</CardTitle>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <rect width='20' height='14' x='2' y='5' rx='2' />
              <path d='M2 10h20' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.orders}</div>
            <p className='text-xs text-muted-foreground'>{labels.ordersNote}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{labels.tables}</CardTitle>
            <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' className='h-4 w-4 text-muted-foreground'>
              <path d='M22 12h-4l-3 9L9 3l-3 9H2' />
            </svg>
          </CardHeader>
          <CardContent>
            <div className='text-2xl font-bold'>{stats.tables_reserving}</div>
            <p className='text-xs text-muted-foreground'>/ {stats.total_tables} {labels.totalTables}</p>
          </CardContent>
        </Card>
      </div>

      <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-7'>
        <div className='lg:col-span-4'>
          <RevenueLineChart data={dashboardData?.revenue_chart ?? []} />
        </div>
        <div className='lg:col-span-3'>
          <DishBarChart data={topDishes} />
        </div>
      </div>
    </div>
  )
}
