import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import { OrderStatus } from "@/shared/constants/type";
import {
  OrderStatusIcon,
  formatCurrency,
  formatDateTimeToLocaleString,
  formatDateTimeToTimeString,
  getVietnameseOrderStatus,
} from "@/shared/lib/utils";
import { Fragment } from "react";
import { OrderMiniResType } from "@/features/orders/schemas/order.schema";
import { GetListGuestsResType } from "@/features/accounts/schemas/account.schema";

type Guest = GetListGuestsResType[number];

interface OrderGuestDetailProps {
  guest?: Guest | null;
  guestId?: number | null;
  orders: OrderMiniResType[];
}

const getOrderTotal = (order: OrderMiniResType) => Number(order.total_amount) || 0;

export default function OrderGuestDetail({
  guest,
  guestId,
  orders,
}: OrderGuestDetailProps) {
  const displayGuestId = guest?.id ?? guestId ?? orders[0]?.guest_id ?? null;
  const ordersFilterToPurchase = orders.filter(
    (order) =>
      order.status !== OrderStatus.Completed &&
      order.status !== OrderStatus.Cancelled,
  );
  const purchasedOrderFilter = orders.filter(
    (order) => order.status === OrderStatus.Completed,
  );

  return (
    <div className="space-y-2 text-sm">
      {guest ? (
        <Fragment>
          <div className="space-x-1">
            <span className="font-semibold">Tên:</span>
            <span>{guest.name}</span>
            <span className="font-semibold">(#{guest.id})</span>
            <span>|</span>
            <span className="font-semibold">Bàn:</span>
            <span>{guest.tableNumber ?? "Chưa có"}</span>
          </div>
          <div className="space-x-1">
            <span className="font-semibold">Ngày đăng ký:</span>
            <span>{formatDateTimeToLocaleString(guest.createdAt)}</span>
          </div>
        </Fragment>
      ) : (
        <div className="space-x-1">
          <span className="font-semibold">Khách:</span>
          <span>{displayGuestId ? `#${displayGuestId}` : "Không xác định"}</span>
        </div>
      )}

      <div className="space-y-1">
        <div className="font-semibold">Đơn hàng:</div>
        {orders.map((order, index) => {
          const StatusIcon = OrderStatusIcon[order.status];

          return (
            <div key={order.id} className="flex gap-2 items-center text-xs">
              <span className="w-2.5">{index + 1}</span>
              <span title={getVietnameseOrderStatus(order.status)}>
                <StatusIcon className="h-4 w-4" />
              </span>
              <span className="font-semibold">#{order.id}</span>
              <span className="italic">{formatCurrency(getOrderTotal(order))}</span>
              <span className="hidden sm:inline">
                {formatDateTimeToLocaleString(order.created_at)}
              </span>
              <span className="sm:hidden">
                {formatDateTimeToTimeString(order.created_at)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-x-1">
        <span className="font-semibold">Chưa thanh toán:</span>
        <Badge>
          <span>
            {formatCurrency(
              ordersFilterToPurchase.reduce(
                (acc, order) => acc + getOrderTotal(order),
                0,
              ),
            )}
          </span>
        </Badge>
      </div>
      <div className="space-x-1">
        <span className="font-semibold">Đã thanh toán:</span>
        <Badge variant="outline">
          <span>
            {formatCurrency(
              purchasedOrderFilter.reduce(
                (acc, order) => acc + getOrderTotal(order),
                0,
              ),
            )}
          </span>
        </Badge>
      </div>

      <div>
        <Button
          className="w-full"
          size="sm"
          variant="secondary"
          disabled={ordersFilterToPurchase.length === 0}
        >
          Thanh toán tất cả ({ordersFilterToPurchase.length} đơn)
        </Button>
      </div>
    </div>
  );
}
