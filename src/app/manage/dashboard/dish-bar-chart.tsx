'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart'

const chartConfig = {
  visitors: { label: 'Bún bò Huế' },
  chrome:  { label: 'Cơm tấm sương',  color: '#e07832' },
  safari:  { label: 'Phở bò',  color: '#f59342' },
  firefox: { label: 'Mì Quảng', color: '#c45e1a' },
  edge:    { label: 'Bánh mì',    color: '#fbb06e' },
  other:   { label: 'Other',   color: '#fdd4a8' }
} satisfies ChartConfig

const chartData = [
  { name: 'chrome',  successOrders: 275, fill: '#e07832' },
  { name: 'safari',  successOrders: 200, fill: '#f59342' },
  { name: 'firefox', successOrders: 187, fill: '#c45e1a' },
  { name: 'edge',    successOrders: 173, fill: '#fbb06e' },
  { name: 'other',   successOrders: 90,  fill: '#fdd4a8' }
]

export function DishBarChart() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Xếp hạng món ăn</CardTitle>
        <CardDescription>Được gọi nhiều nhất</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            layout='vertical'
            margin={{ left: 0 }}
          >
            <YAxis
              dataKey='name'
              type='category'
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              width={60}
              tickFormatter={(value) =>
                chartConfig[value as keyof typeof chartConfig]?.label ?? value
              }
            />
            <XAxis dataKey='successOrders' type='number' hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='successOrders' name='Đơn thanh toán' layout='vertical' radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}