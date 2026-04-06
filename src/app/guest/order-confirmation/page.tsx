"use client";

import { useEffect, useMemo, useState } from "react";
import {
  getGuestOrderListQueryKey,
  useGetGuestOrderListQuery,
  usePaymentGuestMutation,
} from "@/hooks/queries/useOrder";
import {
  getCurrentChatIdentity,
  toNullableNumber,
} from "@/hooks/common/chat-identity";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/hooks/common/useSocket";
import { SOCKET_EVENTS } from "@/lib/socket-events";
import { OrderNotificationPayload } from "@/types/socket";
import { useTableChat } from "@/hooks/common/useTableChat";
import { toast } from "@/components/ui/use-toast";
import { PAYMENT_METHOD, PaymentMethod } from "@/constants/type";
import { ORDER_STATUS_UI, PAGE_STYLE } from "./components/constants";
import { pickLatestOrder } from "./components/utils";
import { EmptyOrderState } from "./components/empty-order-state";
import { OrderHeaderSection } from "./components/order-header-section";
import { OrderItemsSection } from "./components/order-items-section";
import { OrderSummaryCard } from "./components/order-summary-card";
import { PaymentMethodCard } from "./components/payment-method-card";
import { StaffRequestCard } from "./components/staff-request-card";

export default function OrderConfirmationPage() {
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();
  const { sendMessage } = useTableChat();
  const { mutateAsync: paymentOrderMutate, isPending: isPaymentSubmitting } =
    usePaymentGuestMutation();
  const [guestId, setGuestId] = useState<number | null>(null);

  useEffect(() => {
    const syncGuestIdentity = () => {
      setGuestId(getCurrentChatIdentity().userId);
    };

    syncGuestIdentity();

    const onStorage = (event: StorageEvent) => {
      if (event.key === "accessToken" || event.key === null) {
        syncGuestIdentity();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const { data, isLoading, isFetching } = useGetGuestOrderListQuery({
    guestId: guestId ?? 0,
    enabled: guestId !== null,
  });

  const [showStaffCall, setShowStaffCall] = useState(false);
  const [staffRequest, setStaffRequest] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showPaymentMethod, setShowPaymentMethod] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(
    null,
  );

  const rawOrders =
    (data?.payload.data as Record<string, unknown>[] | undefined) ?? [];

  const currentOrder = useMemo(() => pickLatestOrder(rawOrders), [rawOrders]);

  const items = currentOrder?.items ?? [];
  const total = currentOrder?.totalAmount ?? 0;
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  useEffect(() => {
    if (!socket || guestId === null) return;

    const handleOrderStatusUpdated = (payload: OrderNotificationPayload) => {
      const updatedOrderId = toNullableNumber(payload.id ?? payload.order_id);
      if (updatedOrderId === null) return;

      queryClient.setQueryData(
        getGuestOrderListQueryKey({ guestId }),
        (oldData: unknown) => {
          if (!oldData || typeof oldData !== "object") return oldData;
          const old = oldData as {
            payload?: { data?: Record<string, unknown>[] };
          };
          const results = old.payload?.data;
          if (!Array.isArray(results)) return oldData;

          const nextResults = results.map((order) => {
            if (toNullableNumber(order.id) !== updatedOrderId) return order;
            return {
              ...order,
              ...payload,
            };
          });

          return {
            ...old,
            payload: {
              ...old.payload,
              data: nextResults,
            },
          };
        },
      );

      queryClient.invalidateQueries({
        queryKey: getGuestOrderListQueryKey({ guestId }),
      });
    };

    socket.on(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleOrderStatusUpdated);

    return () => {
      socket.off(SOCKET_EVENTS.ORDER_STATUS_UPDATED, handleOrderStatusUpdated);
    };
  }, [socket, guestId, queryClient]);

  if (guestId === null) {
    return (
      <EmptyOrderState
        title="Không xác định được khách hàng"
        description="Vui lòng đăng nhập lại để xem đơn hàng."
      />
    );
  }

  const handleStaffSubmit = () => {
    if (!isConnected) {
      toast({
        title: "Gọi nhân viên thất bại",
        description: "Mất kết nối realtime, vui lòng thử lại.",
        variant: "destructive",
      });
      return;
    }

    const tableNumber =
      typeof window !== "undefined"
        ? localStorage.getItem("table_number_id")
        : null;

    const fallbackMessage = `Khách ở bàn số ${tableNumber || "xxx"} yêu cầu gọi nhân viên.`;
    const message = staffRequest.trim() || fallbackMessage;

    sendMessage(message);

    setIsSubmitted(true);
    setTimeout(() => {
      setShowStaffCall(false);
      setStaffRequest("");
      setIsSubmitted(false);
    }, 1500);
  };

  const handlePaymentSubmit = async () => {
    if (!currentOrder?.id) return;

    try {
      const { payload } = await paymentOrderMutate({
        orderId: currentOrder.id,
        body: {
          payment_method: paymentMethod || PAYMENT_METHOD.CASH,
        },
      });

      const paymentUrl = payload.data.url;
      if (paymentUrl) {
        window.open(paymentUrl, "_blank");
      }

      toast({
        title: "Đã tạo thanh toán",
        description: paymentUrl
          ? "Vui lòng hoàn tất thanh toán trên VNPay."
          : "Yêu cầu thanh toán tiền mặt đã được ghi nhận.",
      });

      setShowPaymentMethod(false);
      setPaymentMethod(null);

      if (guestId !== null) {
        queryClient.invalidateQueries({
          queryKey: getGuestOrderListQueryKey({ guestId }),
        });
      }
    } catch {
      toast({
        title: "Thanh toán thất bại",
        description: "Không thể tạo thanh toán, vui lòng thử lại.",
        variant: "destructive",
      });
    }
  };

  const isInitialLoading = isLoading && !data;

  if (isInitialLoading) {
    return (
      <div className="h-full pt-14 bg-[#0f0e0c] flex flex-col items-center justify-center p-8">
        <p className="text-white/70 text-sm">Đang tải đơn hàng...</p>
      </div>
    );
  }

  if (!currentOrder || itemCount === 0) {
    return (
      <EmptyOrderState
        title="Chưa có đơn hàng"
        description="Hãy chọn món để đặt hàng"
      />
    );
  }

  const normalizedStatus = currentOrder.status.toUpperCase();
  const statusUI = ORDER_STATUS_UI[normalizedStatus] ?? {
    label: normalizedStatus,
    className: "bg-slate-500/15 text-slate-300 border border-slate-500/20",
    dotClassName: "bg-slate-300",
  };

  return (
    <>
      <style>{`
        .order-page { background-color: #0f0e0c !important; background: #0f0e0c !important; }
        .order-card { background-color: #171512 !important; background: #171512 !important; }
        .order-card-alt { background-color: #1a1814 !important; background: #1a1814 !important; }
        .order-input { background-color: #0f0e0c !important; background: #0f0e0c !important; }
      `}</style>

      <div className="order-page min-h-full pt-14 pb-50" style={PAGE_STYLE}>
        <OrderHeaderSection
          orderId={currentOrder.id}
          statusClassName={statusUI.className}
          statusDotClassName={statusUI.dotClassName}
          statusLabel={statusUI.label}
          isFetching={isFetching}
        />

        <div className="px-4 pt-4 pb-20 max-w-sm mx-auto flex flex-col gap-3">
          <OrderItemsSection items={items} />

          <OrderSummaryCard
            itemCount={itemCount}
            total={total}
            onOpenStaffRequest={() => setShowStaffCall(true)}
            onOpenPayment={() => setShowPaymentMethod(true)}
          />

          {showPaymentMethod && (
            <PaymentMethodCard
              paymentMethod={paymentMethod}
              isSubmitting={isPaymentSubmitting}
              onChooseMethod={setPaymentMethod}
              onCancel={() => setShowPaymentMethod(false)}
              onSubmit={handlePaymentSubmit}
            />
          )}

          {showStaffCall && (
            <StaffRequestCard
              isSubmitted={isSubmitted}
              staffRequest={staffRequest}
              isSubmitDisabled={!isConnected}
              onChangeStaffRequest={setStaffRequest}
              onCancel={() => setShowStaffCall(false)}
              onSubmit={handleStaffSubmit}
            />
          )}
        </div>
      </div>
    </>
  );
}
