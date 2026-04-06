import orderApiRequest from "@/apiRequests/order";
import {
  GuestOrderListQueryParams,
  GuestOrderListItem,
} from "@/apiRequests/order";
import {
  GetOrdersQueryParamsType,
  OrderItemType,
  PayGuestOrdersBodyType,
  UpdateOrderBodyType,
} from "@/schemaValidations/order.schema";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";

export const getGuestOrderListQueryKey = ({
  guestId,
}: GuestOrderListQueryParams) => ["guest-orders", guestId] as const;

export const useUpdateOrderMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderBodyType & {
      orderId: number;
    }) => orderApiRequest.updateOrder(orderId, body),
  });
};

export const useGetOrderListQuery = (queryParams: GetOrdersQueryParamsType) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderList(queryParams),
    queryKey: ["orders", queryParams],
  });
};

export const useGetGuestOrderListQuery = ({
  guestId,
  enabled = true,
}: GuestOrderListQueryParams & {
  enabled?: boolean;
}) => {
  return useQuery({
    queryFn: () =>
      orderApiRequest.getGuestOrderList({
        guestId,
      }),
    queryKey: getGuestOrderListQueryKey({
      guestId,
    }),
    enabled,
    placeholderData: keepPreviousData,
    staleTime: 15 * 1000,
    refetchOnWindowFocus: false,
  });
};

export const useGetOrderDetailQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderDetail(id),
    queryKey: ["orders", id],
    enabled,
  });
};

export const usePaymentGuestMutation = () => {
  return useMutation({
    mutationFn: ({
      orderId,
      body,
    }: {
      orderId: number;
      body: PayGuestOrdersBodyType;
    }) => orderApiRequest.pay(orderId, body),
  });
};

export const useCreateOrderMutation = () => {
  return useMutation({
    mutationFn: ({ items }: { items: OrderItemType[] }) => {
      const table_number_id =
        typeof window !== "undefined"
          ? localStorage.getItem("table_number_id") || undefined
          : undefined;

      return orderApiRequest.guestCreateOrders({
        table_number_id: Number(table_number_id),
        items,
      });
    },
  });
};
