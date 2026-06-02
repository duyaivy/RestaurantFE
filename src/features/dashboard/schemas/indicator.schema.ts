import z from 'zod'

export const DashboardIndicatorQueryParams = z.object({
  from: z.string(),
  to: z.string()
})

export type DashboardIndicatorQueryParamsType = z.TypeOf<typeof DashboardIndicatorQueryParams>

export const DashboardIndicatorRes = z.object({
  success: z.boolean(),
  message: z.string(),
  data: z.object({
    stats: z.object({
      revenue: z.number(),
      guest: z.number(),
      tables_reserving: z.number(),
      total_tables: z.number(),
      orders: z.number()
    }),
    top_dishes: z.array(
      z.object({
        dish_id: z.number(),
        dish_name: z.string(),
        total_quantity: z.number()
      })
    ),
    revenue_chart: z.array(
      z.object({
        date: z.string(),
        revenue: z.number()
      })
    )
  })
})

export type DashboardIndicatorResType = z.TypeOf<typeof DashboardIndicatorRes>
