import http from "@/lib/http";
import { SuccessResponse } from "@/constants/type";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  GetOrdersResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  UpdateOrderBodyType,
  UpdateOrderResType,
} from "@/schemaValidations/order.schema";
import queryString from "query-string";
const ORDER_URL = "/orders";
const orderApiRequest = {
  guestCreateOrders: (body: CreateOrdersBodyType) =>
    http.post<SuccessResponse<CreateOrdersResType>>(
      `${ORDER_URL}/guest-create/`,
      body,
    ),
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<SuccessResponse<GetOrdersResType>>(
      `${ORDER_URL}?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        }),
    ),
  updateOrder: (orderId: number, body: UpdateOrderBodyType) =>
    http.put<SuccessResponse<UpdateOrderResType>>(
      `${ORDER_URL}/${orderId}/`,
      body,
    ),
  getOrderDetail: (orderId: number) =>
    http.get<SuccessResponse<GetOrderDetailResType>>(
      `${ORDER_URL}/${orderId}/`,
    ),
  pay: (orderId: number, body: PayGuestOrdersBodyType) =>
    http.post<SuccessResponse<PayGuestOrdersResType>>(
      `${ORDER_URL}/${orderId}/payment/`,
      body,
    ),
};

export default orderApiRequest;
