"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Button } from "@/shared/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { Badge } from "@/shared/ui/badge";
import { createContext, useContext, useMemo, useState } from "react";
import { formatCurrency } from "@/shared/lib/utils";
import AutoPagination from "@/shared/ui/auto-pagination";
import { ROUTE } from "@/shared/constants/route";
import { useOrderQueryConfig } from "@/features/orders/hooks/use-order-query-config";
import { useGetManageOrderListQuery } from "@/features/orders/hooks/use-order";
import { OrderMiniResType } from "@/features/orders/schemas/order.schema";
import AddOrder from "@/features/orders/components/AddOrder";
import EditOrder from "@/features/orders/components/EditOrder";
import { useGetAccountList } from "@/features/accounts/hooks/use-account";
import { useGetGuestListQuery } from "@/features/accounts/hooks/use-account";
import { AccountType } from "@/features/accounts/schemas/account.schema";

// ── Status badge config ──────────────────────────────────────────────────────

const STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  PREPARING: "default",
  COMPLETED: "outline",
  CANCELLED: "destructive",
  SERVED: "default",
};

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PREPARING: "Đang chuẩn bị",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  SERVED: "Đã phục vụ",
};

const PAYMENT_LABEL: Record<string, string> = {
  CASH: "Tiền mặt",
  QR_CODE: "QR Code",
};

// ── Table context ────────────────────────────────────────────────────────────

type OrderTableContextType = {
  setEditOrder: (order: OrderMiniResType | null) => void;
  guestMap: Record<number, string>;
  staffMap: Record<number, string>;
};

const OrderTableContext = createContext<OrderTableContextType>({
  setEditOrder: () => {},
  guestMap: {},
  staffMap: {},
});

// ── Column definitions ───────────────────────────────────────────────────────

const columns: ColumnDef<OrderMiniResType>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "guest_id",
    header: "Khách hàng",
    cell: function GuestCell({ row }) {
      const { guestMap } = useContext(OrderTableContext);
      const id: number | null = row.getValue("guest_id");
      if (id == null) return <span className="text-muted-foreground">—</span>;
      return guestMap[id] ?? `Guest #${id}`;
    },
  },
  {
    accessorKey: "table_number",
    header: "Bàn",
    cell: ({ row }) => {
      const val = row.getValue("table_number");
      return val ?? <span className="text-muted-foreground">—</span>;
    },
  },
  {
    accessorKey: "order_handler_id",
    header: "Nhân viên xử lý",
    cell: function StaffCell({ row }) {
      const { staffMap } = useContext(OrderTableContext);
      const id: number | null = row.getValue("order_handler_id");
      if (id == null)
        return <span className="text-muted-foreground">Chưa phân công</span>;
      return staffMap[id] ?? `Staff #${id}`;
    },
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status: string = row.getValue("status");
      return (
        <Badge variant={STATUS_VARIANT[status] ?? "secondary"}>
          {STATUS_LABEL[status] ?? status}
        </Badge>
      );
    },
  },
  {
    accessorKey: "payment_method",
    header: "Thanh toán",
    cell: ({ row }) => {
      const method: string = row.getValue("payment_method");
      return PAYMENT_LABEL[method] ?? method;
    },
  },
  {
    accessorKey: "total_amount",
    header: "Tổng tiền",
    cell: ({ row }) => {
      const raw: string = row.getValue("total_amount");
      return formatCurrency(parseFloat(raw));
    },
  },
  {
    accessorKey: "created_at",
    header: "Tạo lúc",
    cell: ({ row }) => {
      const raw: string = row.getValue("created_at");
      return new Date(raw).toLocaleString("vi-VN");
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setEditOrder } = useContext(OrderTableContext);
      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setEditOrder(row.original)}>
              Sửa đơn hàng
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

// ── Main component ───────────────────────────────────────────────────────────

export default function OrderTable() {
  const queryConfig = useOrderQueryConfig();
  const page = queryConfig.page;
  const limit = queryConfig.limit;
  const pageIndex = page - 1;

  const { data, isLoading, isError } = useGetManageOrderListQuery(queryConfig);
  const orders = data?.payload?.data?.results ?? [];
  
  // Use API response for pagination
  const totalPages = Math.max(1, data?.payload?.data?.count ?? 1);
  const currentPage = page;

  // ── Lookup data ──────────────────────────────────────────────────────────
  const { data: accountListData } = useGetAccountList();
  const { data: guestListData } = useGetGuestListQuery();

  const staffMap = useMemo<Record<number, string>>(() => {
    const raw = accountListData?.payload?.data;
    // list() returns PaginationResponse<AccountResType>
    const arr: AccountType[] = raw?.results ?? [];
    return Object.fromEntries(arr.map((s) => [s.id, s.name]));
  }, [accountListData]);

  const guestMap = useMemo<Record<number, string>>(() => {
    // guestList() returns SuccessResponse<GetListGuestsResType> — plain array
    const arr = guestListData?.payload?.data ?? [];
    return Object.fromEntries(arr.map((g) => [g.id, g.name]));
  }, [guestListData]);

  const [editOrder, setEditOrder] = useState<OrderMiniResType | null>(null);

  const table = useReactTable({
    data: orders,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    pageCount: totalPages,
    autoResetPageIndex: false,
    state: {
      pagination: { pageIndex, pageSize: limit },
    },
  });

  const rows = table.getRowModel().rows;

  return (
    <OrderTableContext.Provider value={{ setEditOrder, guestMap, staffMap }}>
      <div className="w-full">
        {/* Unified edit modal */}
        <EditOrder
          order={editOrder}
          setOrder={setEditOrder}
          guestMap={guestMap}
          staffMap={staffMap}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-end py-4">
          <AddOrder />
        </div>

        {/* Table */}
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-destructive"
                  >
                    Có lỗi xảy ra khi tải danh sách đơn hàng.
                  </TableCell>
                </TableRow>
              ) : rows.length ? (
                rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Không có đơn hàng nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="min-w-fit shrink-0 whitespace-nowrap text-xs text-muted-foreground">
            Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>{" "}
            · Hiển thị <strong>{orders.length}</strong> đơn hàng
          </div>
          <AutoPagination
            page={currentPage}
            pageSize={totalPages}
            pathname={ROUTE.MANAGE.ORDERS}
          />
        </div>
      </div>
    </OrderTableContext.Provider>
  );
}
