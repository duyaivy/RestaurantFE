"use client";

import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";

import AddDish from "@/features/dishes/components/add-dish";
import EditDish from "@/features/dishes/components/edit-dish";
import { useDishQueryConfig } from "@/features/dishes/hooks/use-dish-query-config";
import {
  useDeleteDishMutation,
  useDishListQuery,
} from "@/features/dishes/hooks/use-dish";
import { DishListResType } from "@/features/dishes/schemas/dish.schema";
import { ROUTE } from "@/shared/constants/route";
import { DishStatus, type PaginationResponse } from "@/shared/constants/type";
import { formatCurrency, getVietnameseDishStatus, handleErrorApi } from "@/shared/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/shared/ui/alert-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
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
import { Input } from "@/shared/ui/input";
import AutoPagination from "@/shared/ui/auto-pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/ui/table";
import { toast } from "@/shared/ui/use-toast";

type DishItem = DishListResType[0];
type DishPaginationData = PaginationResponse<DishItem> | undefined;

type BadgeVariant = "default" | "secondary" | "destructive" | "outline";

const DISH_STATUS_VARIANT: Record<string, BadgeVariant> = {
  [DishStatus.Available]: "default",
  [DishStatus.Hidden]: "secondary",
  [DishStatus.Unavailable]: "outline",
};

const DishTableContext = createContext<{
  setDishIdEdit: (value: number | undefined) => void;
  dishIdEdit: number | undefined;
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
}>({
  setDishIdEdit: () => {},
  dishIdEdit: undefined,
  dishDelete: null,
  setDishDelete: () => {},
});

const columns: ColumnDef<DishItem>[] = [
  {
    accessorKey: "id",
    header: "ID",
  },
  {
    accessorKey: "image",
    header: "Ảnh",
    cell: ({ row }) => (
      <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
        <AvatarImage src={row.original.image} alt={row.original.name.vi} />
        <AvatarFallback className="rounded-none">
          {row.original.name.vi}
        </AvatarFallback>
      </Avatar>
    ),
  },
  {
    id: "name",
    accessorFn: (dish) => dish.name.vi,
    header: "Tên",
    cell: ({ row }) => <div className="font-medium">{row.original.name.vi}</div>,
  },
  {
    id: "category",
    accessorFn: (dish) => dish.category.name.vi,
    header: "Danh mục",
    cell: ({ row }) => <div>{row.original.category.name.vi}</div>,
  },
  {
    accessorKey: "price",
    header: "Giá cả",
    cell: ({ row }) => (
      <div className="whitespace-nowrap">
        {formatCurrency(Number(row.original.price))}
      </div>
    ),
  },
  {
    id: "description",
    accessorFn: (dish) => dish.description.vi,
    header: "Mô tả",
    cell: ({ row }) => (
      <div className="max-w-sm whitespace-pre-line text-sm text-muted-foreground">
        {row.original.description.vi}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Trạng thái",
    cell: ({ row }) => {
      const status = row.original.status;

      return (
        <Badge variant={DISH_STATUS_VARIANT[status] ?? "secondary"}>
          {getVietnameseDishStatus(status)}
        </Badge>
      );
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: function Actions({ row }) {
      const { setDishIdEdit, setDishDelete } = useContext(DishTableContext);

      return (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Hành động</span>
              <DotsHorizontalIcon className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setDishIdEdit(row.original.id)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setDishDelete(row.original)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

function buildManageDishesUrl(page: number, limit: number) {
  const searchParams = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  return `${ROUTE.MANAGE.DISHES}?${searchParams.toString()}`;
}

function getPaginationTotalPages(data: DishPaginationData) {
  const totalPages =
    data?.total_pages ?? data?.totalPages ?? data?.count ?? 1;

  return Math.max(1, totalPages);
}

function AlertDialogDeleteDish({
  dishDelete,
  setDishDelete,
  currentPage,
  pageSize,
  currentPageRowCount,
}: {
  dishDelete: DishItem | null;
  setDishDelete: (value: DishItem | null) => void;
  currentPage: number;
  pageSize: number;
  currentPageRowCount: number;
}) {
  const router = useRouter();
  const deleteDishMutation = useDeleteDishMutation();

  const handleDeleteDish = async () => {
    if (!dishDelete) return;

    try {
      const result = await deleteDishMutation.mutateAsync(dishDelete.id);
      toast({
        description: result.payload.message,
      });
      setDishDelete(null);

      if (currentPage > 1 && currentPageRowCount === 1) {
        router.push(buildManageDishesUrl(currentPage - 1, pageSize));
      }
    } catch (error) {
      handleErrorApi({ error });
    }
  };

  return (
    <AlertDialog
      open={Boolean(dishDelete)}
      onOpenChange={(value) => {
        if (!value) {
          setDishDelete(null);
        }
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xóa món ăn?</AlertDialogTitle>
          <AlertDialogDescription>
            Món{" "}
            <span className="bg-foreground text-primary-foreground rounded px-1">
              {dishDelete?.name?.vi}
            </span>{" "}
            sẽ bị xóa vĩnh viễn.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deleteDishMutation.isPending}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={deleteDishMutation.isPending}
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              void handleDeleteDish();
            }}
          >
            {deleteDishMutation.isPending ? "Đang xóa..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default function DishTable() {
  const router = useRouter();
  const queryConfig = useDishQueryConfig();
  const pageSize = queryConfig.limit || 10;
  const page = queryConfig.page || 1;

  const dishListQuery = useDishListQuery(queryConfig);
  const paginationData = dishListQuery.data?.payload.data;
  const dishes = paginationData?.results ?? [];
  const currentPage = page;
  const totalPages = getPaginationTotalPages(paginationData);
  const pageIndex = currentPage - 1;

  const [dishIdEdit, setDishIdEdit] = useState<number | undefined>();
  const [dishDelete, setDishDelete] = useState<DishItem | null>(null);
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = useState({});

  const table = useReactTable({
    data: dishes,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    manualPagination: true,
    pageCount: totalPages,
    autoResetPageIndex: false,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex,
        pageSize,
      },
    },
  });

  useEffect(() => {
    if (!dishListQuery.isSuccess || page <= totalPages) return;

    router.replace(buildManageDishesUrl(totalPages, pageSize));
  }, [dishListQuery.isSuccess, page, pageSize, router, totalPages]);

  const rows = table.getRowModel().rows;

  return (
    <DishTableContext.Provider
      value={{ dishIdEdit, setDishIdEdit, dishDelete, setDishDelete }}
    >
      <div className="w-full">
        <EditDish id={dishIdEdit} setId={setDishIdEdit} />
        <AlertDialogDeleteDish
          dishDelete={dishDelete}
          setDishDelete={setDishDelete}
          currentPage={currentPage}
          pageSize={pageSize}
          currentPageRowCount={dishes.length}
        />
        <div className="flex items-center py-4">
          <Input
            placeholder="Lọc tên"
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <div className="ml-auto flex items-center gap-2">
            <AddDish />
          </div>
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
              {dishListQuery.isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-muted-foreground"
                  >
                    Đang tải...
                  </TableCell>
                </TableRow>
              ) : dishListQuery.isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center text-destructive"
                  >
                    Có lỗi xảy ra khi tải danh sách món ăn.
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
                    Không có món ăn nào.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="min-w-fit shrink-0 whitespace-nowrap text-xs text-muted-foreground">
            Trang <strong>{currentPage}</strong> / <strong>{totalPages}</strong>{" "}
            · Hiển thị <strong>{rows.length}</strong> món ăn
          </div>
          <AutoPagination
            page={currentPage}
            pageSize={totalPages}
            pathname={ROUTE.MANAGE.DISHES}
          />
        </div>
      </div>
    </DishTableContext.Provider>
  );
}
