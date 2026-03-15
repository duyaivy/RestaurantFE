import http from '@/lib/http'
import { SuccessResponse } from '@/constants/type'
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType
} from '@/schemaValidations/order.schema'
import queryString from 'query-string'

const orderApiRequest = {
  createOrders: (body: CreateOrdersBodyType) =>
    http.post<SuccessResponse<CreateOrdersResType>>('/orders', body),
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<SuccessResponse<GetOrdersResType>>(
      '/orders?' +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString()
        })
    ),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<SuccessResponse<UpdateOrderResType>>(`/orders/${orderId}`, body),
  getOrderDetail: (orderId: number) =>
    http.get<SuccessResponse<GetOrderDetailResType>>(`/orders/${orderId}`),
  pay: (body: PayGuestOrdersBodyType) =>
    http.post<SuccessResponse<PayGuestOrdersResType>>(`/orders/pay`, body)
}

export default orderApiRequest
