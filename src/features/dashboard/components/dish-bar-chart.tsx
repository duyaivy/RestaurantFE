'use client'

import { Bar, BarChart, XAxis, YAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/ui/card'
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from '@/shared/ui/chart'

const colors = ['#e07832', '#f59342', '#c45e1a', '#fbb06e', '#fdd4a8']
const labels = {
  title: 'X\u1ebfp h\u1ea1ng m\u00f3n \u0103n',
  description: '\u0110\u01b0\u1ee3c g\u1ecdi nhi\u1ec1u nh\u1ea5t',
  paidOrders: '\u0110\u01a1n thanh to\u00e1n'
}

type DishBarChartProps = {
  data: {
    name: string
    totalQuantity: number
  }[]
}

export function DishBarChart({ data }: DishBarChartProps) {
  const chartData = data.map((dish, index) => ({
    ...dish,
    fill: colors[index % colors.length]
  }))

  const chartConfig = chartData.reduce<ChartConfig>((config, dish) => {
    config[dish.name] = {
      label: dish.name,
      color: dish.fill
    }
    return config
  }, {})

  return (
    <Card>
      <CardHeader>
        <CardTitle>{labels.title}</CardTitle>
        <CardDescription>{labels.description}</CardDescription>
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
              tickFormatter={(value) => value}
            />
            <XAxis dataKey='totalQuantity' type='number' hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey='totalQuantity' name={labels.paidOrders} layout='vertical' radius={6} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
