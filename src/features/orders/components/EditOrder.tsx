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
import { Minus, Plus, User } from "lucide-react";
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
import { handleErrorApi } from "@/shared/lib/utils";
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

// ── Props ────────────────────────────────────────────────────────────────────

type Props = {
  order: OrderMiniResType | null;
  setOrder: (value: OrderMiniResType | null) => void;
  guestMap: Record<number, string>;
  staffMap: Record<number, string>;
};

// ── Component ────────────────────────────────────────────────────────────────

export default function EditOrder({ order, setOrder, guestMap, staffMap }: Props) {
  const currentUserId = useMemo(() => getCurrentUserId(), []);

  // ── Dish lookup for dropdown ─────────────────────────────────────────────
  const { data: dishData } = useAllDishesQuery();
  const dishes = dishData?.payload?.data?.results ?? [];
  const dishOptions = dishes.map((d) => ({
    id: d.id,
    label: typeof d.name === "object" ? d.name.vi : String(d.name),
  }));

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
        // order_handler_id intentionally NOT surfaced to user
      });
    }
  }, [order, infoForm]);

  // ── Section 2: Order items form ──────────────────────────────────────────
  const itemsForm = useForm<UpdateOrderItemsBodyType>({
    resolver: zodResolver(UpdateOrderItemsBody) as any,
    defaultValues: { add_items: [], update_items: [] },
  });

  const addItems = useFieldArray({ control: itemsForm.control, name: "add_items" });
  const updateItems = useFieldArray({ control: itemsForm.control, name: "update_items" });
  const [cancelIds, setCancelIds] = useState<string[]>([]);

  // ── Mutations ────────────────────────────────────────────────────────────
  const updateInfoMutation = useUpdateOrderInfoMutation();
  const updateItemsMutation = useUpdateOrderItemsMutation();

  // ── Submit ───────────────────────────────────────────────────────────────
  const handleClose = () => {
    infoForm.reset();
    itemsForm.reset();
    setCancelIds([]);
    setOrder(null);
  };

  const onSubmit = async () => {
    if (!order) return;

    const infoValues = infoForm.getValues();
    const itemsValues = itemsForm.getValues();

    const hasAddItems = (itemsValues.add_items ?? []).some((i) => i.dish_id > 0);
    const hasUpdateItems = (itemsValues.update_items ?? []).some(
      (i) => i.order_item_id > 0,
    );
    const hasCancelIds = cancelIds.some((v) => Number(v) > 0);
    const hasItemChanges = hasAddItems || hasUpdateItems || hasCancelIds;

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
      const cancel_item_ids = cancelIds
        .map(Number)
        .filter((v) => !isNaN(v) && v > 0);
      try {
        await updateItemsMutation.mutateAsync({
          orderId: order.id,
          add_items: hasAddItems ? itemsValues.add_items : undefined,
          update_items: hasUpdateItems ? itemsValues.update_items : undefined,
          cancel_item_ids: cancel_item_ids.length ? cancel_item_ids : undefined,
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

  const guestName = order?.guest_id != null
    ? (guestMap[order.guest_id] ?? `Guest #${order.guest_id}`)
    : "—";

  const handlerName = currentUserId != null
    ? (staffMap[currentUserId] ?? `Staff #${currentUserId}`)
    : "—";

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <Dialog
      open={Boolean(order)}
      onOpenChange={(open) => { if (!open) handleClose(); }}
    >
      <DialogContent className="sm:max-w-[680px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Sửa đơn hàng #{order?.id}</DialogTitle>
        </DialogHeader>

        {/* ── Section 1: Order info ── */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Thông tin đơn hàng
          </h3>

          {/* Read-only: guest & handler */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Khách hàng</Label>
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
                        placeholder="Bàn"
                        value={field.value ?? ""}
                        onChange={(e) =>
                          field.onChange(
                            e.target.value ? Number(e.target.value) : undefined,
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                    <Select onValueChange={field.onChange} value={field.value}>
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

        {/* ── Section 2: Order items ── */}
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
            Món trong đơn
          </h3>

          <Form {...itemsForm}>
            {/* Add new items */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Thêm món mới</Label>
              {addItems.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[2fr_60px_1fr_auto] gap-2 items-end border rounded-md p-2"
                >
                  <FormField
                    control={itemsForm.control}
                    name={`add_items.${index}.dish_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Món ăn</FormLabel>
                        <Select
                          onValueChange={(v) => field.onChange(Number(v))}
                          value={field.value ? String(field.value) : ""}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn món" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {dishOptions.map((d) => (
                              <SelectItem key={d.id} value={String(d.id)}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
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
                            onChange={(e) => field.onChange(Number(e.target.value))}
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

            {/* Update existing items */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Cập nhật món hiện có</Label>
              {updateItems.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[70px_50px_1fr_110px_auto] gap-2 items-end border rounded-md p-2"
                >
                  <FormField
                    control={itemsForm.control}
                    name={`update_items.${index}.order_item_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Item ID</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="ID"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={itemsForm.control}
                    name={`update_items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">SL</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min={1}
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={itemsForm.control}
                    name={`update_items.${index}.note`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Ghi chú</FormLabel>
                        <FormControl>
                          <Input placeholder="Ghi chú..." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={itemsForm.control}
                    name={`update_items.${index}.item_status`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Trạng thái</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Chọn" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OrderItemStatusValues.map((s) => (
                              <SelectItem key={s} value={s}>
                                {ITEM_STATUS_LABELS[s] ?? s}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive self-end"
                    onClick={() => updateItems.remove(index)}
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
                  updateItems.append({ order_item_id: 0, quantity: 1, note: "" })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm dòng cập nhật
              </Button>
            </div>

            {/* Cancel items */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold">Hủy món (Order Item ID)</Label>
              {cancelIds.map((val, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Order item ID cần hủy"
                    value={val}
                    onChange={(e) => {
                      const next = [...cancelIds];
                      next[index] = e.target.value;
                      setCancelIds(next);
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-9 w-9 text-destructive"
                    onClick={() => setCancelIds(cancelIds.filter((_, i) => i !== index))}
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
                onClick={() => setCancelIds([...cancelIds, ""])}
              >
                <Plus className="h-4 w-4 mr-1" />
                Hủy món
              </Button>
            </div>
          </Form>
        </div>

        <DialogFooter className="pt-2">
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            Đóng
          </Button>
          <Button onClick={onSubmit} disabled={isPending}>
            {isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
