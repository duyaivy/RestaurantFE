import http from '@/shared/api/http'
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from '@/features/dashboard/schemas/indicator.schema'

const dashboardApiRequest = {
  getIndicators: ({ from, to }: DashboardIndicatorQueryParamsType) =>
    http.get<DashboardIndicatorResType>(
      `analists/?${new URLSearchParams({ from, to }).toString()}`
    )
}

export default dashboardApiRequest
