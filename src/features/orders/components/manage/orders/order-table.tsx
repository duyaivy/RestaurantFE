"use client";

import {
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { createContext, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { endOfDay, format, startOfDay } from "date-fns";
import { Check, ChevronsUpDown } from "lucide-react";
import { accountApiRequest } from "@/features/accounts/api/account.api";
import { GetListGuestsResType } from "@/features/accounts/schemas/account.schema";
import orderApiRequest from "@/features/orders/api/order.api";
import {
  OrderMiniResType,
  UpdateOrderBodyType,
} from "@/features/orders/schemas/order.schema";
import { useGetOrderListQuery } from "@/features/orders/hooks/use-order";
import { useTableListQuery } from "@/features/tables/hooks/use-table";
import { OrderStatusValues } from "@/shared/constants/type";
import { ROUTE } from "@/shared/constants/route";
import {
  cn,
  getVietnameseOrderStatus,
  handleErrorApi,
} from "@/shared/lib/utils";
import AutoPagination from "@/shared/ui/auto-pagination";
import { Button } from "@/shared/ui/button";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/shared/ui/command";
import { Input } from "@/shared/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/shared/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { toast } from "@/shared/ui/use-toast";
import AddOrder from "./add-order";
import EditOrder from "./edit-order";
import OrderStatics from "./order-statics";
import { useOrderService } from "./order.service";
import orderTableColumns from "./order-table-columns";
import {
  getDishIdFromOrderDetail,
  getQuantityFromOrderDetail,
} from "./order-detail-normalize";

type GuestObjectById = Record<number, GetListGuestsResType[number]>;

export const OrderTableContext = createContext({
  setOrderIdEdit: (_value: number | undefined) => {},
  orderIdEdit: undefined as number | undefined,
  changeStatus: (_payload: {
    orderId: number;
    status: (typeof OrderStatusValues)[number];
  }) => {},
  orderObjectByGuestId: {} as OrderObjectByGuestID,
  guestObjectById: {} as GuestObjectById,
});

export type StatusCountObject = Record<(typeof OrderStatusValues)[number], number>;
export type Statics = {
  status: StatusCountObject;
  table: Record<number, Record<number, StatusCountObject>>;
};
export type OrderObjectByGuestID = Record<number, OrderMiniResType[]>;
export type ServingGuestByTableNumber = Record<number, OrderObjectByGuestID>;

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function OrderTable() {
  const searchParam = useSearchParams();
  const queryClient = useQueryClient();
  const [openStatusFilter, setOpenStatusFilter] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const page = searchParam.get("page") ? Number(searchParam.get("page")) : 1;
  const pageIndex = page - 1;
  const [orderIdEdit, setOrderIdEdit] = useState<number | undefined>();

  const orderListQuery = useGetOrderListQuery({ fromDate, toDate });
  const orderList = orderListQuery.data?.payload.data.results ?? [];
  const tableListQuery = useTableListQuery();
  const tableListSortedByNumber = useMemo(
    () =>
      [...(tableListQuery.data?.payload.data ?? [])].sort(
        (a, b) => a.number - b.number,
      ),
    [tableListQuery.data],
  );
  const guestListQuery = useQuery({
    queryKey: ["guests"],
    queryFn: accountApiRequest.guestList,
    staleTime: 1000 * 60,
  });
  const guestObjectById = useMemo(() => {
    return (guestListQuery.data?.payload.data ?? []).reduce<GuestObjectById>(
      (acc, guest) => {
        acc[guest.id] = guest;
        return acc;
      },
      {},
    );
  }, [guestListQuery.data]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex,
    pageSize: PAGE_SIZE,
  });

  const { statics, orderObjectByGuestId, servingGuestByTableNumber } =
    useOrderService(orderList);

  const updateOrderMutation = useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: number;
      status: (typeof OrderStatusValues)[number];
    }) => {
      const detailResponse = await orderApiRequest.getOrderDetail(orderId);
      const detail = detailResponse.payload.data;
      const body: UpdateOrderBodyType = {
        status,
        dishId: getDishIdFromOrderDetail(detail),
        quantity: getQuantityFromOrderDetail(detail),
      };
      return orderApiRequest.updateOrder(orderId, body);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({ title: "Đã cập nhật trạng thái đơn hàng" });
    },
    onError: (error) => {
      handleErrorApi({ error });
    },
  });

  const changeStatus = ({
    orderId,
    status,
  }: {
    orderId: number;
    status: (typeof OrderStatusValues)[number];
  }) => {
    updateOrderMutation.mutate({ orderId, status });
  };

  const table = useReactTable({
    data: orderList,
    columns: orderTableColumns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    onPaginationChange: setPagination,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination,
    },
  });

  useEffect(() => {
    setPagination((prev) => ({
      ...prev,
      pageIndex,
      pageSize: PAGE_SIZE,
    }));
  }, [pageIndex]);

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  return (
    <OrderTableContext.Provider
      value={{
        orderIdEdit,
        setOrderIdEdit,
        changeStatus,
        orderObjectByGuestId,
        guestObjectById,
      }}
    >
      <div className="w-full">
        <EditOrder
          id={orderIdEdit}
          setId={setOrderIdEdit}
          onSubmitSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["orders"] });
          }}
        />
        <div className="flex items-center">
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center">
              <span className="mr-2">Từ</span>
              <Input
                type="datetime-local"
                placeholder="Từ ngày"
                className="text-sm"
                value={format(fromDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setFromDate(new Date(event.target.value))}
              />
            </div>
            <div className="flex items-center">
              <span className="mr-2">Đến</span>
              <Input
                type="datetime-local"
                placeholder="Đến ngày"
                value={format(toDate, "yyyy-MM-dd HH:mm").replace(" ", "T")}
                onChange={(event) => setToDate(new Date(event.target.value))}
              />
            </div>
            <Button variant="outline" onClick={resetDateFilter}>
              Reset
            </Button>
          </div>
          <div className="ml-auto">
            <AddOrder />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 py-4">
          <Input
            placeholder="Khách"
            value={(table.getColumn("guestName")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("guestName")?.setFilterValue(event.target.value)
            }
            className="max-w-25"
          />
          <Input
            placeholder="Số bàn"
            value={
              (table.getColumn("table_number")?.getFilterValue() as string) ?? ""
            }
            onChange={(event) =>
              table.getColumn("table_number")?.setFilterValue(event.target.value)
            }
            className="max-w-20"
          />
          <Popover open={openStatusFilter} onOpenChange={setOpenStatusFilter}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openStatusFilter}
                className="w-37.5 justify-between text-sm"
              >
                {table.getColumn("status")?.getFilterValue()
                  ? getVietnameseOrderStatus(
                      table.getColumn("status")?.getFilterValue() as (typeof OrderStatusValues)[number],
                    )
                  : "Trạng thái"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-50 p-0">
              <Command>
                <CommandGroup>
                  <CommandList>
                    {OrderStatusValues.map((status) => (
                      <CommandItem
                        key={status}
                        value={status}
                        onSelect={(currentValue) => {
                          table
                            .getColumn("status")
                            ?.setFilterValue(
                              currentValue ===
                                table.getColumn("status")?.getFilterValue()
                                ? ""
                                : currentValue,
                            );
                          setOpenStatusFilter(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            table.getColumn("status")?.getFilterValue() === status
                              ? "opacity-100"
                              : "opacity-0",
                          )}
                        />
                        {getVietnameseOrderStatus(status)}
                      </CommandItem>
                    ))}
                  </CommandList>
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        <OrderStatics
          statics={statics}
          tableList={tableListSortedByNumber}
          servingGuestByTableNumber={servingGuestByTableNumber}
        />
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
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
                    colSpan={orderTableColumns.length}
                    className="h-24 text-center"
                  >
                    {orderListQuery.isLoading ? "Đang tải..." : "Không có dữ liệu"}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="flex-1 py-4 text-xs text-muted-foreground">
            Hiển thị <strong>{table.getPaginationRowModel().rows.length}</strong>{" "}
            trong <strong>{orderList.length}</strong> kết quả
          </div>
          <AutoPagination
            page={table.getState().pagination.pageIndex + 1}
            pageSize={Math.max(table.getPageCount(), 1)}
            pathname={ROUTE.MANAGE.ORDERS}
          />
        </div>
      </div>
    </OrderTableContext.Provider>
  );
}
