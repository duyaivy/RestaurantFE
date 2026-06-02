import http from "@/shared/api/http";
import { PaginationResponse, SuccessResponse } from "@/shared/constants/type";
import {
  CreateOrdersBodyType,
  CreateOrdersResType,
  GetOrderDetailResType,
  GetOrdersQueryParamsType,
  ManageOrdersQueryParamsType,
  OrderMiniResType,
  PayGuestOrdersBodyType,
  PayGuestOrdersResType,
  StaffCreateOrderBodyType,
  StaffCreateOrderResType,
  UpdateOrderBodyType,
  UpdateOrderInfoBodyType,
  UpdateOrderItemsBodyType,
  UpdateOrderResType,
} from "@/features/orders/schemas/order.schema";
import queryString from "query-string";

const ORDER_URL = "/orders";

export type GuestOrderListQueryParams = {
  guestId: number;
};

export type GuestOrderListItem = Record<string, unknown>;

const orderApiRequest = {
  guestCreateOrders: (body: CreateOrdersBodyType) =>
    http.post<SuccessResponse<CreateOrdersResType>>(
      `${ORDER_URL}/guest-create/`,
      body,
    ),
  getOrderList: (queryParams: GetOrdersQueryParamsType) =>
    http.get<SuccessResponse<PaginationResponse<OrderMiniResType>>>(
      `${ORDER_URL}?` +
        queryString.stringify({
          fromDate: queryParams.fromDate?.toISOString(),
          toDate: queryParams.toDate?.toISOString(),
        }),
    ),
  /** GET /orders/?page=x&limit=y — paginated list for the admin dashboard */
  getManageOrderList: (queryParams: ManageOrdersQueryParamsType) =>
    http.get<SuccessResponse<PaginationResponse<OrderMiniResType>>>(
      `${ORDER_URL}/?` +
        queryString.stringify({
          page: queryParams.page ?? 1,
          limit: queryParams.limit ?? 10,
        }),
    ),
  getGuestOrderList: ({ guestId }: GuestOrderListQueryParams) =>
    http.get<SuccessResponse<GuestOrderListItem[]>>(`/orders/guest/${guestId}`),
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
  /** POST /orders/staff-create/ */
  staffCreateOrder: (body: StaffCreateOrderBodyType) =>
    http.post<SuccessResponse<StaffCreateOrderResType>>(
      `${ORDER_URL}/staff-create/`,
      body,
    ),
  /** PATCH /orders/{id}/update/ */
  updateOrderInfo: (orderId: number, body: UpdateOrderInfoBodyType) =>
    http.patch<SuccessResponse<OrderMiniResType>>(
      `${ORDER_URL}/${orderId}/update/`,
      body,
    ),
  /** PATCH /orders/{id}/items/ */
  updateOrderItems: (orderId: number, body: UpdateOrderItemsBodyType) =>
    http.patch<SuccessResponse<unknown>>(
      `${ORDER_URL}/${orderId}/items/`,
      body,
    ),
};

export default orderApiRequest;
