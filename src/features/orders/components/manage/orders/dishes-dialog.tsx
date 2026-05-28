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
  formatCurrency,
  getVietnameseDishStatus,
  simpleMatchText,
} from "@/shared/lib/utils";
import { Input } from "@/shared/ui/input";
import Image from "next/image";
import { DishListResType } from "@/features/dishes/schemas/dish.schema";
import AutoPagination from "@/shared/ui/auto-pagination";
import { useDishListQuery } from "@/features/dishes/hooks/use-dish";
import { useLocaleText } from "@/shared/hooks/use-locale-text";
import { ROUTE } from "@/shared/constants/route";
import { DishStatus } from "@/shared/constants/type";

export type DishItem = DishListResType[number];

const PAGE_SIZE = 10;

export function DishesDialog({ onChoose }: { onChoose: (dish: DishItem) => void }) {
  const [open, setOpen] = useState(false);
  const resolveText = useLocaleText();
  const dishListQuery = useDishListQuery({
    page: "1",
    limit: "100",
  });
  const data = useMemo(
    () =>
      (dishListQuery.data?.payload.data.results ?? []).filter(
        (dish) => dish.status !== DishStatus.Hidden,
      ),
    [dishListQuery.data],
  );

  const columns = useMemo<ColumnDef<DishItem>[]>(
    () => [
      {
        id: "dishName",
        header: "Món ăn",
        cell: ({ row }) => (
          <div className="flex items-center space-x-4">
            <Image
              src={row.original.image}
              alt={resolveText(row.original.name)}
              width={50}
              height={50}
              className="h-[50px] w-[50px] rounded-md object-cover"
            />
            <span>{resolveText(row.original.name)}</span>
          </div>
        ),
        filterFn: (row, _columnId, filterValue: string) => {
          if (filterValue === undefined) return true;
          return simpleMatchText(
            resolveText(row.original.name),
            String(filterValue),
          );
        },
      },
      {
        accessorKey: "price",
        header: "Giá cả",
        cell: ({ row }) => (
          <div className="capitalize">
            {formatCurrency(row.getValue("price"))}
          </div>
        ),
      },
      {
        accessorKey: "status",
        header: "Trạng thái",
        cell: ({ row }) => <div>{getVietnameseDishStatus(row.getValue("status"))}</div>,
      },
    ],
    [resolveText],
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

  const choose = (dish: DishItem) => {
    if (dish.status !== DishStatus.Available) return;
    onChoose(dish);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Thay đổi</Button>
      </DialogTrigger>
      <DialogContent className="max-h-full overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Chọn món ăn</DialogTitle>
        </DialogHeader>
        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Lọc tên"
              value={(table.getColumn("dishName")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("dishName")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
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
                      className={
                        row.original.status === DishStatus.Available
                          ? "cursor-pointer"
                          : "cursor-not-allowed opacity-60"
                      }
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
                      {dishListQuery.isLoading ? "Đang tải..." : "Không có dữ liệu"}
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
              pathname={ROUTE.MANAGE.DISHES}
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
