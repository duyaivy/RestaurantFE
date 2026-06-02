'use client'

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart'

const chartConfig = {
  revenue: {
    label: 'Doanh thu',
    color: '#e07832'
  }
} satisfies ChartConfig

type RevenueLineChartProps = {
  data: {
    date: string
    revenue: number
  }[]
}

export function RevenueLineChart({ data }: RevenueLineChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Doanh thu</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <LineChart
            accessibilityLayer
            data={data}
            margin={{ left: 12, right: 12 }}
          >
            <CartesianGrid vertical={false} stroke='#2c2620' />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value}
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
