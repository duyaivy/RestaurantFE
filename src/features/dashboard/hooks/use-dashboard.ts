import dashboardApiRequest from '@/features/dashboard/api/dashboard.api'
import { DashboardIndicatorQueryParamsType } from '@/features/dashboard/schemas/indicator.schema'
import { useQuery } from '@tanstack/react-query'

export const getDashboardQueryKey = ({ from, to }: DashboardIndicatorQueryParamsType) =>
  ['dashboard', from, to] as const

export const useDashboardQuery = ({ from, to }: DashboardIndicatorQueryParamsType) => {
  return useQuery({
    queryKey: getDashboardQueryKey({ from, to }),
    queryFn: () => dashboardApiRequest.getIndicators({ from, to }),
    enabled: Boolean(from && to)
  })
}
