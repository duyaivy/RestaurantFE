"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { useMemo, useState } from "react";
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
import {
  cn,
  getVietnameseTableStatus,
  simpleMatchText,
} from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import { TableListResType } from "@/features/tables/schemas/table.schema";
import { TableStatus } from "@/shared/constants/type";
import AutoPagination from "@/shared/ui/auto-pagination";
import { useTableListQuery } from "@/features/tables/hooks/use-table";
import { ROUTE } from "@/shared/constants/route";

export type TableItem = TableListResType[number];

const columns: ColumnDef<TableItem>[] = [
  {
    accessorKey: "number",
    header: "Số bàn",
    cell: ({ row }) => <div className="capitalize">{row.getValue("number")}</div>,
    filterFn: (row, _columnId, filterValue: string) => {
      if (filterValue === undefined) return true;
      return simpleMatchText(String(row.original.number), String(filterValue));
    },
  },
  {
    accessorKey: "capacity",
    header: "Sức chứa",
    cell: ({ row }) => <div className="capitalize">{row.getValue("capacity")}</div>,
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => <div>{getVietnameseTableStatus(row.getValue("status"))}</div>,
  },
];

const PAGE_SIZE = 10;

export function TablesDialog({
  onChoose,
}: {
  onChoose: (table: TableItem) => void;
}) {
  const [open, setOpen] = useState(false);
  const tableListQuery = useTableListQuery();
  const data = useMemo(
    () =>
      [...(tableListQuery.data?.payload.data ?? [])].sort(
        (a, b) => a.number - b.number,
      ),
    [tableListQuery.data],
  );
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

  const choose = (tableItem: TableItem) => {
    onChoose(tableItem);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className="max-h-full overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chọn bàn</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Số bàn"
              value={(table.getColumn("number")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("number")?.setFilterValue(event.target.value)
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
                  table.getRowModel().rows.map((row) => {
                    const canChoose =
                      row.original.status === TableStatus.Available ||
                      row.original.status === TableStatus.Reserved;

                    return (
                      <TableRow
                        key={row.id}
                        data-state={row.getIsSelected() && "selected"}
                        onClick={() => {
                          if (canChoose) choose(row.original);
                        }}
                        className={cn({
                          "cursor-pointer": canChoose,
                          "cursor-not-allowed opacity-60": !canChoose,
                        })}
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
                    );
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={columns.length} className="h-24 text-center">
                      {tableListQuery.isLoading ? "Đang tải..." : "Không có dữ liệu"}
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
              pathname={ROUTE.MANAGE.TABLES}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
