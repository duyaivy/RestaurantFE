"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { DishItem, DishesDialog } from "./dishes-dialog";
import { OrderStatus, OrderStatusValues } from "@/shared/constants/type";
import {
  UpdateOrderBody,
  UpdateOrderBodyType,
} from "@/features/orders/schemas/order.schema";
import {
  useGetOrderDetailQuery,
  useUpdateOrderMutation,
} from "@/features/orders/hooks/use-order";
import { useQueryClient } from "@tanstack/react-query";
import { getVietnameseOrderStatus, handleErrorApi } from "@/shared/lib/utils";
import { useLocaleText } from "@/shared/hooks/use-locale-text";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { toast } from "@/shared/ui/use-toast";
import {
  getDisplayDishFromOrderDetail,
  getDishIdFromOrderDetail,
  getQuantityFromOrderDetail,
} from "./order-detail-normalize";

export default function EditOrder({
  id,
  setId,
  onSubmitSuccess,
}: {
  id?: number;
  setId: (value: number | undefined) => void;
  onSubmitSuccess?: () => void;
}) {
  const resolveText = useLocaleText();
  const queryClient = useQueryClient();
  const [selectedDish, setSelectedDish] = useState<DishItem | null>(null);
  const orderDetailQuery = useGetOrderDetailQuery({
    id: id ?? 0,
    enabled: Boolean(id),
  });
  const updateOrderMutation = useUpdateOrderMutation();

  const orderDetail = orderDetailQuery.data?.payload.data;

  const form = useForm<UpdateOrderBodyType>({
    resolver: zodResolver(UpdateOrderBody),
    defaultValues: {
      status: OrderStatus.Pending,
      dishId: 0,
      quantity: 1,
    },
  });

  useEffect(() => {
    if (!orderDetail) return;

    form.reset({
      status: orderDetail.status,
      dishId: getDishIdFromOrderDetail(orderDetail),
      quantity: getQuantityFromOrderDetail(orderDetail),
    });
    setSelectedDish(null);
  }, [form, orderDetail]);

  const onSubmit = async (values: UpdateOrderBodyType) => {
    if (!id || updateOrderMutation.isPending) return;

    try {
      if (!values.dishId) {
        form.setError("dishId", {
          type: "manual",
          message: "Vui lòng chọn món ăn",
        });
        return;
      }

      await updateOrderMutation.mutateAsync({
        orderId: id,
        ...values,
      });

      await queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast({
        title: "Đã cập nhật đơn hàng",
      });
      onSubmitSuccess?.();
      reset();
    } catch (error) {
      handleErrorApi({
        error,
        setError: form.setError,
      });
    }
  };

  const reset = () => {
    setSelectedDish(null);
    setId(undefined);
  };

  const displayDish = selectedDish
    ? {
        name: resolveText(selectedDish.name),
        image: selectedDish.image,
      }
    : getDisplayDishFromOrderDetail(orderDetail);

  return (
    <Dialog
      open={Boolean(id)}
      onOpenChange={(value) => {
        if (!value) {
          reset();
        }
      }}
    >
      <DialogContent className="max-h-screen overflow-auto sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật đơn hàng</DialogTitle>
        </DialogHeader>
        {orderDetailQuery.isLoading ? (
          <div className="py-6 text-sm text-muted-foreground">
            Đang tải đơn hàng...
          </div>
        ) : (
          <Form {...form}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="edit-order-form"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="dishId"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <FormLabel>Món ăn</FormLabel>
                      <div className="col-span-2 flex items-center space-x-4">
                        <Avatar className="aspect-square h-[50px] w-[50px] rounded-md object-cover">
                          <AvatarImage src={displayDish?.image} />
                          <AvatarFallback className="rounded-none">
                            {displayDish?.name ?? "Món"}
                          </AvatarFallback>
                        </Avatar>
                        <div>{displayDish?.name ?? "Chưa chọn"}</div>
                      </div>

                      <DishesDialog
                        onChoose={(dish) => {
                          field.onChange(dish.id);
                          setSelectedDish(dish);
                        }}
                      />
                      <FormMessage className="col-start-2 col-span-3" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="quantity">Số lượng</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input
                            id="quantity"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            className="w-16 text-center"
                            {...field}
                            value={field.value}
                            onChange={(event) => {
                              const numberValue = Number(event.target.value);
                              if (Number.isNaN(numberValue)) return;
                              field.onChange(numberValue);
                            }}
                          />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <FormLabel>Trạng thái</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl className="col-span-3">
                            <SelectTrigger className="w-[200px]">
                              <SelectValue placeholder="Trạng thái" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {OrderStatusValues.map((status) => (
                              <SelectItem key={status} value={status}>
                                {getVietnameseOrderStatus(status)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        )}
        <DialogFooter>
          <Button
            type="submit"
            form="edit-order-form"
            isLoading={updateOrderMutation.isPending}
            disabled={orderDetailQuery.isLoading}
          >
            Lưu
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
