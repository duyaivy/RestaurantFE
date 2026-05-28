"use client";

import { accountApiRequest } from "@/features/accounts/api/account.api";
import { GetListGuestsResType } from "@/features/accounts/schemas/account.schema";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import {
  ColumnDef,
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
import { useQuery } from "@tanstack/react-query";
import { endOfDay, format, startOfDay } from "date-fns";
import { useMemo, useState } from "react";
import AutoPagination from "@/shared/ui/auto-pagination";
import { formatDateTimeToLocaleString, simpleMatchText } from "@/shared/lib/utils";

export type GuestItem = GetListGuestsResType[number];

const columns: ColumnDef<GuestItem>[] = [
  {
    accessorKey: "name",
    header: "Tên",
    cell: ({ row }) => (
      <div className="capitalize">
        {row.getValue("name")} | (#{row.original.id})
      </div>
    ),
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(
        row.original.name + String(row.original.id),
        String(filterValue),
      );
    },
  },
  {
    accessorKey: "tableNumber",
    header: "Số bàn",
    cell: ({ row }) => (
      <div className="capitalize">{row.getValue("tableNumber") ?? ""}</div>
    ),
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(String(row.original.tableNumber), String(filterValue));
    },
  },
  {
    accessorKey: "createdAt",
    header: () => <div>Tạo</div>,
    cell: ({ row }) => (
      <div className="flex items-center space-x-4 text-sm">
        {formatDateTimeToLocaleString(row.getValue("createdAt"))}
      </div>
    ),
  },
];

const PAGE_SIZE = 10;
const initFromDate = startOfDay(new Date());
const initToDate = endOfDay(new Date());

export default function GuestsDialog({
  onChoose,
}: {
  onChoose: (guest: GuestItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const [fromDate, setFromDate] = useState(initFromDate);
  const [toDate, setToDate] = useState(initToDate);
  const guestListQuery = useQuery({
    queryKey: ["guests"],
    queryFn: accountApiRequest.guestList,
    enabled: open,
    staleTime: 1000 * 60,
  });
  const data = useMemo(() => {
    const guests = guestListQuery.data?.payload.data ?? [];
    return guests.filter((guest) => {
      const createdAt = new Date(guest.createdAt);
      return createdAt >= fromDate && createdAt <= toDate;
    });
  }, [fromDate, guestListQuery.data, toDate]);

  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});
  const [pagination, setPagination] = useState({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const table = useReactTable({
    data,
    columns,
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

  const choose = (guest: GuestItem) => {
    onChoose(guest);
    setOpen(false);
  };

  const resetDateFilter = () => {
    setFromDate(initFromDate);
    setToDate(initToDate);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Chọn khách</Button>
      </DialogTrigger>
      <DialogContent className="max-h-full overflow-auto sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle>Chọn khách hàng</DialogTitle>
        </DialogHeader>
        <div className="w-full">
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
          <div className="flex items-center gap-2 py-4">
            <Input
              placeholder="Tên hoặc Id"
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="w-[170px]"
            />
            <Input
              placeholder="Số bàn"
              value={
                (table.getColumn("tableNumber")?.getFilterValue() as string) ?? ""
              }
              onChange={(event) =>
                table.getColumn("tableNumber")?.setFilterValue(event.target.value)
              }
              className="w-[80px]"
            />
          </div>
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
                      onClick={() => choose(row.original)}
                      className="cursor-pointer"
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
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {guestListQuery.isLoading ? "Đang tải..." : "Không có dữ liệu"}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 py-4 text-xs text-muted-foreground">
              Hiển thị{" "}
              <strong>{table.getPaginationRowModel().rows.length}</strong> trong{" "}
              <strong>{data.length}</strong> kết quả
            </div>
            <AutoPagination
              page={table.getState().pagination.pageIndex + 1}
              pageSize={table.getPageCount()}
              pathname="/manage/orders"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
