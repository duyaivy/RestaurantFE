import orderApiRequest from "@/features/orders/api/order.api";
import {
  GuestOrderListQueryParams,
  GuestOrderListItem,
} from "@/features/orders/api/order.api";
import {
  GetOrdersQueryParamsType,
  ManageOrdersQueryParamsType,
  OrderItemType,
  PayGuestOrdersBodyType,
  StaffCreateOrderBodyType,
  UpdateOrderBodyType,
  UpdateOrderInfoBodyType,
  UpdateOrderItemsBodyType,
} from "@/features/orders/schemas/order.schema";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

// ── Manage-side hooks ─────────────────────────────────────────────────────────

export const useGetManageOrderListQuery = (
  queryParams: ManageOrdersQueryParamsType,
) => {
  return useQuery({
    queryFn: () => orderApiRequest.getManageOrderList(queryParams),
    queryKey: ["orders", queryParams.page ?? 1, queryParams.limit ?? 10],
    placeholderData: keepPreviousData,
  });
};

export const useStaffCreateOrderMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: StaffCreateOrderBodyType) =>
      orderApiRequest.staffCreateOrder(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });
};

export const useUpdateOrderInfoMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderInfoBodyType & { orderId: number }) =>
      orderApiRequest.updateOrderInfo(orderId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail", variables.orderId] });
    },
  });
};

export const useUpdateOrderItemsMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      orderId,
      ...body
    }: UpdateOrderItemsBodyType & { orderId: number }) =>
      orderApiRequest.updateOrderItems(orderId, body),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["order-detail", variables.orderId] });
    },
  });
};

/** Fetch order detail for editing */
export const useGetOrderDetailForEditQuery = (orderId: number | null) => {
  return useQuery({
    queryFn: () => orderApiRequest.getOrderDetail(orderId!),
    queryKey: ["order-detail", orderId],
    enabled: orderId != null,
    staleTime: 0, // Always fetch fresh data when opening edit modal
  });
};

