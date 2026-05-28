"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { useContext } from "react";
import { OrderMiniResType } from "@/features/orders/schemas/order.schema";
import { OrderStatus, OrderStatusValues } from "@/shared/constants/type";
import { Badge } from "@/shared/ui/badge";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import {
  formatCurrency,
  formatDateTimeToLocaleString,
  getVietnameseOrderStatus,
  simpleMatchText,
} from "@/shared/lib/utils";
import { OrderTableContext } from "./order-table";
import OrderGuestDetail from "./order-guest-detail";

const getOrderTotal = (order: OrderMiniResType) =>
  Number(order.total_amount) || 0;

const orderTableColumns: ColumnDef<OrderMiniResType>[] = [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>#{row.original.id}</div>,
  },
  {
    accessorKey: "table_number",
    header: "Bàn",
    cell: ({ row }) => <div>{row.original.table_number ?? ""}</div>,
    filterFn: (row, columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(String(row.getValue(columnId) ?? ""), String(filterValue));
    },
  },
  {
    id: "guestName",
    header: "Khách hàng",
    cell: function Cell({ row }) {
      const { orderObjectByGuestId, guestObjectById } =
        useContext(OrderTableContext);
      const guestId = row.original.guest_id;
      const guest = guestId ? guestObjectById[guestId] : null;
      const orders = guestId ? (orderObjectByGuestId[guestId] ?? []) : [row.original];

      return (
        <div>
          {!guestId ? (
            <span>Không có khách</span>
          ) : (
            <Popover>
              <PopoverTrigger>
                <div>
                  <span>{guest?.name ?? `Khách #${guestId}`}</span>
                  <span className="font-semibold">(#{guestId})</span>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-[320px] sm:w-110">
                <OrderGuestDetail guest={guest} guestId={guestId} orders={orders} />
              </PopoverContent>
            </Popover>
          )}
        </div>
      );
    },
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(
        `#${row.original.guest_id ?? ""} ${row.original.guest_id ?? ""}`,
        String(filterValue),
      );
    },
  },
  {
    accessorKey: "total_amount",
    header: "Tổng tiền",
    cell: ({ row }) => (
      <div className="space-y-1">
        <div className="font-medium">{formatCurrency(getOrderTotal(row.original))}</div>
        <Badge className="px-1" variant="secondary">
          {row.original.payment_method}
        </Badge>
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: function Cell({ row }) {
      const { changeStatus } = useContext(OrderTableContext);

      return (
        <Select
          onValueChange={(value: (typeof OrderStatusValues)[number]) => {
            changeStatus({
              orderId: row.original.id,
              status: value,
            });
          }}
          defaultValue={OrderStatus.Pending}
          value={row.getValue("status")}
        >
          <SelectTrigger className="w-35">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {OrderStatusValues.map((status) => (
              <SelectItem key={status} value={status}>
                {getVietnameseOrderStatus(status)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    },
  },
  {
    accessorKey: "order_handler_id",
    header: "Người xử lý",
    cell: ({ row }) => <div>{row.original.order_handler_id ?? ""}</div>,
  },
  {
    accessorKey: "created_at",
    header: () => <div>Tạo/Cập nhật</div>,
    cell: ({ row }) => (
      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-4">
          {formatDateTimeToLocaleString(row.original.created_at)}
        </div>
        <div className="flex items-center space-x-4">
          {formatDateTimeToLocaleString(row.original.updated_at)}
        </div>
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setOrderIdEdit } = useContext(OrderTableContext);

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Mở menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setOrderIdEdit(row.original.id)}>
              Sửa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default orderTableColumns;
