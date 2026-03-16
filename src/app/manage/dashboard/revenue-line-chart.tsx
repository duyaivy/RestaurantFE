'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'
import { format, parse } from 'date-fns'

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: '#e07832'
  }
} satisfies ChartConfig

const chartData = [
  { date: '01/03/2024', revenue: 12_500_000 },
  { date: '02/03/2024', revenue: 18_200_000 },
  { date: '03/03/2024', revenue: 15_800_000 },
  { date: '04/03/2024', revenue: 22_400_000 },
  { date: '05/03/2024', revenue: 19_600_000 },
  { date: '06/03/2024', revenue: 28_100_000 },
  { date: '07/03/2024', revenue: 31_500_000 },
  { date: '08/03/2024', revenue: 25_300_000 },
  { date: '09/03/2024', revenue: 34_700_000 },
  { date: '10/03/2024', revenue: 29_200_000 },
  
]

export function RevenueLineChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={chartData}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} stroke='#2c2620' />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                const date = parse(value, 'dd/MM/yyyy', new Date())
                return format(date, 'dd')
              }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) =>
                value >= 1_000_000
                  ? `${(value / 1_000_000).toFixed(0)}M`
                  : `${(value / 1_000).toFixed(0)}K`
              }
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  indicator='dashed'
                  formatter={(value) =>
                    new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(value as number)
                  }
                />
              }
            />
            <Line
              dataKey='revenue'
              type='monotone'
              stroke='#e07832'
              strokeWidth={2}
              dot={{ fill: '#e07832', r: 3 }}
              activeDot={{ r: 5, fill: '#e07832' }}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}