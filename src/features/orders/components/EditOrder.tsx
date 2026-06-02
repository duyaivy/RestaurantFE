"use client";

import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Minus, Pencil, Plus, Trash2, User, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { formatCurrency, handleErrorApi } from "@/shared/lib/utils";
import {
  UpdateOrderInfoBody,
  UpdateOrderInfoBodyType,
  UpdateOrderItemsBody,
  UpdateOrderItemsBodyType,
  OrderMiniResType,
} from "@/features/orders/schemas/order.schema";
import {
  useUpdateOrderInfoMutation,
  useUpdateOrderItemsMutation,
  useGetOrderDetailForEditQuery,
} from "@/features/orders/hooks/use-order";
import {
  OrderStatusValues,
  PAYMENT_METHOD_VALUES,
  OrderItemStatusValues,
} from "@/shared/constants/type";
import { toast } from "@/shared/ui/use-toast";
import {
  decodeToken,
  getAccessTokenFromLocalStorage,
} from "@/shared/auth/token";
import { useAllDishesQuery } from "@/features/dishes/hooks/use-dish";
import { SearchableSelect } from "@/shared/ui/searchable-select";
import { Skeleton } from "@/shared/ui/skeleton";
import { Badge } from "@/shared/ui/badge";
import { Card } from "@/shared/ui/card";
import { getOrderItemsFromRaw } from "@/features/orders/lib/order-normalize";

// ── Label maps ───────────────────────────────────────────────────────────────

const ORDER_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ xử lý",
  PREPARING: "Đang chuẩn bị",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  SERVED: "Đã phục vụ",
};

const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Tiền mặt",
  QR_CODE: "QR Code",
};

const ITEM_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ",
  COOKING: "Đang nấu",
  DONE: "Xong",
  CANCELLED: "Đã hủy",
};

const ITEM_STATUS_VARIANT: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  PENDING: "secondary",
  COOKING: "default",
  DONE: "outline",
  CANCELLED: "destructive",
};

// ── Helper: get current logged-in user ID from JWT ───────────────────────────

function getCurrentUserId(): number | null {
  try {
    const token = getAccessTokenFromLocalStorage();
    if (!token) return null;
    return decodeToken(token)?.userId ?? null;
  } catch {
    return null;
  }
}

// ── Types for order items ────────────────────────────────────────────────────

type OrderItemDisplay = {
  id: number; // order_item_id
  dishName: string;
  quantity: number;
  note?: string;
  status: string;
  price: number;
  dishSnapshot?: any;
};

// ── Props ────────────────────────────────────────────────────────────────────

type Props = {
  order: OrderMiniResType | null;
  setOrder: (value: OrderMiniResType | null) => void;
  guestMap: Record<number, string>;
  staffMap: Record<number, string>;
};

// ── Component ────────────────────────────────────────────────────────────────

export default function EditOrder({
  order,
  setOrder,
  guestMap,
  staffMap,
}: Props) {
  const currentUserId = useMemo(() => getCurrentUserId(), []);
  const isOpen = Boolean(order);
  const orderId = order?.id ?? null;

  // ── Fetch order detail ───────────────────────────────────────────────────
  const {
    data: orderDetailData,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
  } = useGetOrderDetailForEditQuery(orderId);

  const orderDetail = orderDetailData?.payload?.data;

  // Parse order items from detail using the normalize utility
  const existingItems = useMemo<OrderItemDisplay[]>(() => {
    if (!orderDetail) return [];
    
    // Convert orderDetail to Record for the normalize function
    const rawOrder = orderDetail as unknown as Record<string, unknown>;
    
    // Use the existing normalize function to parse items
    const normalizedItems = getOrderItemsFromRaw(rawOrder);
    
    // Convert to our display format
    return normalizedItems.map((item) => ({
      id: Number(item.id),
      dishName: item.name,
      quantity: item.quantity,
      note: item.note,
      status: item.status || "PENDING",
      price: item.price,
      dishSnapshot: null, // Not needed for display
    }));
  }, [orderDetail]);

  // ── Lookup data for dropdowns ────────────────────────────────────────────
  const { data: dishData } = useAllDishesQuery();
  const dishes = dishData?.payload?.data?.results ?? [];

  // Build options for comboboxes
  const dishOptions = useMemo(
    () =>
      dishes.map((d) => ({
        value: String(d.id),
        label: typeof d.name === "object" ? d.name.vi : String(d.name),
      })),
    [dishes]
  );

  // ── Section 1: Order info form ───────────────────────────────────────────
  const infoForm = useForm<UpdateOrderInfoBodyType>({
    resolver: zodResolver(UpdateOrderInfoBody) as any,
    defaultValues: {
      table_number: undefined,
      status: undefined,
      payment_method: undefined,
    },
  });

  useEffect(() => {
    if (order) {
      infoForm.reset({
        table_number: order.table_number ?? undefined,
        status: order.status,
        payment_method: order.payment_method,
      });
    }
  }, [order, infoForm]);

  // ── Section 2: Order items management ────────────────────────────────────
  const itemsForm = useForm<UpdateOrderItemsBodyType>({
    resolver: zodResolver(UpdateOrderItemsBody) as any,
    defaultValues: { add_items: [], update_items: [] },
  });

  const addItems = useFieldArray({
    control: itemsForm.control,
    name: "add_items",
  });

  // Track which items to update or cancel
  const [editingItemId, setEditingItemId] = useState<number | null>(null);
  const [editingItemData, setEditingItemData] = useState<{
    quantity: number;
    note: string;
    status: string;
  } | null>(null);

  const [itemsToCancel, setItemsToCancel] = useState<Set<number>>(new Set());

  // ── Mutations ────────────────────────────────────────────────────────────
  const updateInfoMutation = useUpdateOrderInfoMutation();
  const updateItemsMutation = useUpdateOrderItemsMutation();

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleClose = () => {
    infoForm.reset();
    itemsForm.reset();
    setEditingItemId(null);
    setEditingItemData(null);
    setItemsToCancel(new Set());
    setOrder(null);
  };

  const handleEditItem = (item: OrderItemDisplay) => {
    setEditingItemId(item.id);
    setEditingItemData({
      quantity: item.quantity,
      note: item.note || "",
      status: item.status,
    });
  };

  const handleCancelEditItem = () => {
    setEditingItemId(null);
    setEditingItemData(null);
  };

  const handleToggleCancelItem = (itemId: number) => {
    const newSet = new Set(itemsToCancel);
    if (newSet.has(itemId)) {
      newSet.delete(itemId);
    } else {
      newSet.add(itemId);
    }
    setItemsToCancel(newSet);
  };

  const onSubmit = async () => {
    if (!order) return;

    const infoValues = infoForm.getValues();
    const itemsValues = itemsForm.getValues();

    const hasAddItems = (itemsValues.add_items ?? []).some(
      (i) => i.dish_id > 0
    );

    // Build update_items from editing state
    const updateItemsPayload =
      editingItemId && editingItemData
        ? [
            {
              order_item_id: editingItemId,
              quantity: editingItemData.quantity,
              note: editingItemData.note,
              item_status: editingItemData.status as any,
            },
          ]
        : [];

    const hasCancelIds = itemsToCancel.size > 0;
    const hasItemChanges =
      hasAddItems || updateItemsPayload.length > 0 || hasCancelIds;

    let infoOk = true;
    let itemsOk = true;

    // Always send info patch (staff who touched the form becomes handler)
    try {
      await updateInfoMutation.mutateAsync({
        orderId: order.id,
        ...infoValues,
        order_handler_id: currentUserId ?? undefined,
      });
    } catch (error) {
      handleErrorApi({ error, setError: infoForm.setError });
      infoOk = false;
    }

    if (hasItemChanges) {
      try {
        await updateItemsMutation.mutateAsync({
          orderId: order.id,
          add_items: hasAddItems ? itemsValues.add_items : undefined,
          update_items:
            updateItemsPayload.length > 0 ? updateItemsPayload : undefined,
          cancel_item_ids: hasCancelIds
            ? Array.from(itemsToCancel)
            : undefined,
        });
      } catch (error) {
        handleErrorApi({ error, setError: itemsForm.setError });
        itemsOk = false;
      }
    }

    if (infoOk && itemsOk) {
      toast({ title: "Cập nhật đơn hàng thành công" });
      handleClose();
    }
  };

  const isPending =
    updateInfoMutation.isPending || updateItemsMutation.isPending;

  const guestName =
    order?.guest_id != null
      ? guestMap[order.guest_id] ?? `Guest #${order.guest_id}`
      : "—";

  const handlerName =
    currentUserId != null
      ? staffMap[currentUserId] ?? `Staff #${currentUserId}`
      : "—";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) handleClose();
      }}
    >
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa đơn hàng #{order?.id}</DialogTitle>
        </DialogHeader>

        {isLoadingDetail ? (
          <div className="space-y-4 py-8">
            <Skeleton className="h-4 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-1/2 mx-auto" />
            <Skeleton className="h-4 w-2/3 mx-auto" />
          </div>
        ) : isErrorDetail ? (
          <div className="text-center py-8 text-destructive">
            Không thể tải chi tiết đơn hàng. Vui lòng thử lại.
          </div>
        ) : (
          <>
            {/* ── Section 1: Order info ── */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thông tin đơn hàng
              </h3>

              {/* Read-only: guest & handler */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Khách hàng
                  </Label>
                  <div className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border bg-muted/40">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {guestName}
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Nhân viên xử lý (bạn)
                  </Label>
                  <div className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-md border bg-muted/40">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    {handlerName}
                  </div>
                </div>
              </div>

              <Form {...infoForm}>
                <div className="grid grid-cols-3 gap-3">
                  <FormField
                    control={infoForm.control}
                    name="table_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Số bàn</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Số bàn"
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value
                                  ? Number(e.target.value)
                                  : undefined
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={infoForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Trạng thái</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OrderStatusValues.map((s) => (
                              <SelectItem key={s} value={s}>
                                {ORDER_STATUS_LABELS[s] ?? s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={infoForm.control}
                    name="payment_method"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Thanh toán</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PAYMENT_METHOD_VALUES.map((m) => (
                              <SelectItem key={m} value={m}>
                                {PAYMENT_METHOD_LABELS[m] ?? m}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </Form>
            </div>

            <hr className="my-1 border-border" />

            {/* ── Section 2: Current Order Items ── */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Món ăn trong đơn
              </h3>

              {existingItems.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Không có món ăn nào trong đơn hàng.
                </p>
              ) : (
                <div className="space-y-2">
                  {existingItems.map((item) => {
                    const isEditing = editingItemId === item.id;
                    const isMarkedForCancel = itemsToCancel.has(item.id);

                    return (
                      <Card
                        key={item.id}
                        className={`p-3 ${
                          isMarkedForCancel
                            ? "border-destructive bg-destructive/5"
                            : ""
                        }`}
                      >
                        {isEditing ? (
                          // Edit mode
                          <div className="space-y-3">
                            <div className="flex items-center justify-between">
                              <div className="font-medium text-sm">
                                {item.dishName}
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  type="button"
                                  size="sm"
                                  variant="ghost"
                                  onClick={handleCancelEditItem}
                                >
                                  <X className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-2">
                              <div>
                                <Label className="text-xs">Số lượng</Label>
                                <Input
                                  type="number"
                                  min={1}
                                  value={editingItemData?.quantity ?? 1}
                                  onChange={(e) =>
                                    setEditingItemData(
                                      editingItemData
                                        ? {
                                            ...editingItemData,
                                            quantity: Number(e.target.value),
                                          }
                                        : null
                                    )
                                  }
                                  className="h-8"
                                />
                              </div>
                              <div className="col-span-2">
                                <Label className="text-xs">Ghi chú</Label>
                                <Input
                                  value={editingItemData?.note ?? ""}
                                  onChange={(e) =>
                                    setEditingItemData(
                                      editingItemData
                                        ? {
                                            ...editingItemData,
                                            note: e.target.value,
                                          }
                                        : null
                                    )
                                  }
                                  placeholder="Ghi chú..."
                                  className="h-8"
                                />
                              </div>
                            </div>
                            <div>
                              <Label className="text-xs">Trạng thái món</Label>
                              <Select
                                value={editingItemData?.status}
                                onValueChange={(val) =>
                                  setEditingItemData(
                                    editingItemData
                                      ? {
                                          ...editingItemData,
                                          status: val,
                                        }
                                      : null
                                  )
                                }
                              >
                                <SelectTrigger className="h-8">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {OrderItemStatusValues.map((s) => (
                                    <SelectItem key={s} value={s}>
                                      {ITEM_STATUS_LABELS[s] ?? s}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        ) : (
                          // Display mode
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="font-medium">
                                  {item.dishName}
                                </span>
                                <Badge
                                  variant={
                                    ITEM_STATUS_VARIANT[item.status] ??
                                    "secondary"
                                  }
                                  className="text-xs"
                                >
                                  {ITEM_STATUS_LABELS[item.status] ??
                                    item.status}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                Số lượng: <strong>{item.quantity}</strong> ·
                                Giá: {formatCurrency(item.price)}
                                {item.note && (
                                  <span className="ml-2">
                                    · Ghi chú: {item.note}
                                  </span>
                                )}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                ID: {item.id}
                              </div>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditItem(item)}
                                disabled={isMarkedForCancel}
                              >
                                <Pencil className="h-3.5 w-3.5" />
                              </Button>
                              <Button
                                type="button"
                                size="sm"
                                variant={
                                  isMarkedForCancel ? "default" : "ghost"
                                }
                                onClick={() => handleToggleCancelItem(item.id)}
                                className={
                                  isMarkedForCancel ? "text-white" : ""
                                }
                              >
                                {isMarkedForCancel ? (
                                  <>
                                    <X className="h-3.5 w-3.5 mr-1" />
                                    Bỏ hủy
                                  </>
                                ) : (
                                  <Trash2 className="h-3.5 w-3.5 text-destructive" />
                                )}
                              </Button>
                            </div>
                          </div>
                        )}
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>

            <hr className="my-1 border-border" />

            {/* ── Section 3: Add new items ── */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Thêm món mới
              </h3>

              <Form {...itemsForm}>
                <div className="space-y-2">
                  {addItems.fields.map((field, index) => (
                    <div
                      key={field.id}
                      className="grid grid-cols-[1fr_80px_1fr_auto] gap-2 items-end border rounded-md p-3"
                    >
                      <FormField
                        control={itemsForm.control}
                        name={`add_items.${index}.dish_id`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Món ăn</FormLabel>
                            <FormControl>
                              <SearchableSelect
                                options={dishOptions}
                                value={
                                  field.value ? String(field.value) : undefined
                                }
                                onChange={(v) =>
                                  field.onChange(v ? Number(v) : 0)
                                }
                                placeholder="Chọn món..."
                                searchPlaceholder="Tìm món..."
                                emptyText="Không tìm thấy món ăn."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={itemsForm.control}
                        name={`add_items.${index}.quantity`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">SL</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min={1}
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={itemsForm.control}
                        name={`add_items.${index}.note`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-xs">Ghi chú</FormLabel>
                            <FormControl>
                              <Input placeholder="Ghi chú..." {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 text-destructive self-end"
                        onClick={() => addItems.remove(index)}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() =>
                      addItems.append({ dish_id: 0, quantity: 1, note: "" })
                    }
                  >
                    <Plus className="h-4 w-4 mr-1" />
                    Thêm món
                  </Button>
                </div>
              </Form>
            </div>
          </>
        )}

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Đóng
          </Button>
          <Button
            onClick={onSubmit}
            disabled={isPending || isLoadingDetail || isErrorDetail}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang lưu...
              </>
            ) : (
              "Lưu"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
