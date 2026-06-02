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
import { Minus, Plus } from "lucide-react";
import { useState } from "react";
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
  UpdateOrderItemsBody,
  UpdateOrderItemsBodyType,
  OrderMiniResType,
} from "@/features/orders/schemas/order.schema";
import { useUpdateOrderItemsMutation } from "@/features/orders/hooks/use-order";
import { OrderItemStatusValues } from "@/shared/constants/type";
import { toast } from "@/shared/ui/use-toast";
import { zodResolver } from "@hookform/resolvers/zod";

const ITEM_STATUS_LABELS: Record<string, string> = {
  PENDING: "Chờ",
  COOKING: "Đang nấu",
  DONE: "Xong",
  CANCELLED: "Đã hủy",
};

export default function EditOrderItems({
  order,
  setOrder,
}: {
  order: OrderMiniResType | null;
  setOrder: (value: OrderMiniResType | null) => void;
}) {
  const form = useForm<UpdateOrderItemsBodyType>({
    resolver: zodResolver(UpdateOrderItemsBody) as any,
    defaultValues: {
      add_items: [],
      cancel_item_ids: [],
      update_items: [],
    },
  });

  const addItems = useFieldArray({ control: form.control, name: "add_items" });
  const updateItems = useFieldArray({
    control: form.control,
    name: "update_items",
  });

  // cancel_item_ids is a simple number array — managed via local state
  const [cancelIds, setCancelIds] = useState<string[]>([""]);

  const updateMutation = useUpdateOrderItemsMutation();

  const onSubmit = async (values: UpdateOrderItemsBodyType) => {
    if (!order) return;
    const cancel_item_ids = cancelIds
      .map((v) => Number(v))
      .filter((v) => !isNaN(v) && v > 0);
    try {
      await updateMutation.mutateAsync({
        orderId: order.id,
        ...values,
        cancel_item_ids,
      });
      toast({ title: "Cập nhật món thành công" });
      form.reset();
      setCancelIds([""]);
      setOrder(null);
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog
      open={Boolean(order)}
      onOpenChange={(value) => {
        if (!value) {
          form.reset();
          setCancelIds([""]);
          setOrder(null);
        }
      }}
    >
      <DialogContent className="sm:max-w-[640px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Sửa món đơn #{order?.id}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            id="edit-order-items-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* Section 1: Add items */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Thêm món mới</Label>
              {addItems.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_70px_1fr_auto] gap-2 items-end border rounded-md p-2"
                >
                  <FormField
                    control={form.control}
                    name={`add_items.${index}.dish_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">ID món</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Dish ID"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                    className="h-9 w-9 text-destructive"
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

            {/* Section 2: Cancel items */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Hủy món (ID)</Label>
              {cancelIds.map((val, index) => (
                <div key={index} className="flex gap-2">
                  <Input
                    type="number"
                    placeholder="Order item ID"
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
                    onClick={() =>
                      setCancelIds(cancelIds.filter((_, i) => i !== index))
                    }
                    disabled={cancelIds.length === 1}
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
                Thêm hàng hủy
              </Button>
            </div>

            {/* Section 3: Update items */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">
                Cập nhật món hiện có
              </Label>
              {updateItems.fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[80px_60px_1fr_120px_auto] gap-2 items-end border rounded-md p-2"
                >
                  <FormField
                    control={form.control}
                    name={`update_items.${index}.order_item_id`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-xs">Item ID</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="ID"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`update_items.${index}.quantity`}
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
                    control={form.control}
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
                    control={form.control}
                    name={`update_items.${index}.item_status`}
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
                    className="h-9 w-9 text-destructive"
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
                  updateItems.append({
                    order_item_id: 0,
                    quantity: 1,
                    note: "",
                  })
                }
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm dòng cập nhật
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="edit-order-items-form"
            disabled={updateMutation.isPending}
          >
            {updateMutation.isPending ? "Đang lưu..." : "Lưu"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
