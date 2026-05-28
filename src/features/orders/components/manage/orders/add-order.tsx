"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, PlusCircle } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { accountApiRequest } from "@/features/accounts/api/account.api";
import {
  CreateGuestBody,
  CreateGuestBodyType,
} from "@/features/accounts/schemas/account.schema";
import orderApiRequest from "@/features/orders/api/order.api";
import { useDishListQuery } from "@/features/dishes/hooks/use-dish";
import { DishListResType } from "@/features/dishes/schemas/dish.schema";
import {
  CreateOrdersBodyType,
  OrderItemType,
} from "@/features/orders/schemas/order.schema";
import GuestsDialog, { GuestItem } from "./guests-dialog";
import { TablesDialog } from "./tables-dialog";
import { DishStatus } from "@/shared/constants/type";
import { useLocaleText } from "@/shared/hooks/use-locale-text";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import { Form, FormField, FormItem, FormMessage } from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Switch } from "@/shared/ui/switch";
import { toast } from "@/shared/ui/use-toast";
import { cn, formatCurrency, handleErrorApi } from "@/shared/lib/utils";

type Dish = DishListResType[number];

function Quantity({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
      >
        <Minus className="h-4 w-4" />
      </Button>
      <Input
        inputMode="numeric"
        pattern="[0-9]*"
        className="h-8 w-14 text-center"
        value={value}
        onChange={(event) => {
          const nextValue = Number(event.target.value);
          if (Number.isFinite(nextValue) && nextValue >= 0) {
            onChange(nextValue);
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        onClick={() => onChange(value + 1)}
      >
        <Plus className="h-4 w-4" />
      </Button>
    </div>
  );
}

export default function AddOrder() {
  const [open, setOpen] = useState(false);
  const [selectedGuest, setSelectedGuest] = useState<GuestItem | null>(null);
  const [isNewGuest, setIsNewGuest] = useState(true);
  const [orders, setOrders] = useState<OrderItemType[]>([]);
  const resolveText = useLocaleText();
  const queryClient = useQueryClient();

  const dishListQuery = useDishListQuery({
    page: "1",
    limit: "100",
  });
  const dishes = useMemo(
    () => dishListQuery.data?.payload.data.results ?? [],
    [dishListQuery.data],
  );

  const createGuestMutation = useMutation({
    mutationFn: accountApiRequest.createGuest,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["guests"] });
    },
  });

  const createOrderMutation = useMutation({
    mutationFn: (body: CreateOrdersBodyType) =>
      orderApiRequest.guestCreateOrders(body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
    },
  });

  const totalPrice = useMemo(() => {
    return dishes.reduce((result: number, dish: Dish) => {
      const order = orders.find((item) => item.dish_id === dish.id);
      if (!order) return result;
      return result + order.quantity * dish.price;
    }, 0);
  }, [dishes, orders]);

  const itemCount = orders.reduce((total, order) => total + order.quantity, 0);

  const form = useForm<CreateGuestBodyType>({
    resolver: zodResolver(CreateGuestBody),
    defaultValues: {
      name: "",
      tableNumber: 0,
    },
  });

  const handleQuantityChange = (dishId: number, quantity: number) => {
    setOrders((prevOrders) => {
      if (quantity === 0) {
        return prevOrders.filter((order) => order.dish_id !== dishId);
      }

      const index = prevOrders.findIndex((order) => order.dish_id === dishId);
      if (index === -1) {
        return [...prevOrders, { dish_id: dishId, quantity }];
      }

      const newOrders = [...prevOrders];
      newOrders[index] = { ...newOrders[index], quantity };
      return newOrders;
    });
  };

  const reset = () => {
    form.reset();
    setSelectedGuest(null);
    setIsNewGuest(true);
    setOrders([]);
  };

  const handleOrder = async () => {
    if (orders.length === 0) return;

    try {
      let tableNumber: number | null | undefined;

      if (isNewGuest) {
        const isValid = await form.trigger();
        if (!isValid) return;

        const guestBody = form.getValues();
        tableNumber = guestBody.tableNumber;
        await createGuestMutation.mutateAsync(guestBody);
      } else {
        tableNumber = selectedGuest?.tableNumber;
        if (!selectedGuest) {
          toast({
            title: "Chưa chọn khách",
            description: "Vui lòng chọn khách hàng trước khi đặt món.",
            variant: "destructive",
          });
          return;
        }
      }

      if (!tableNumber) {
        toast({
          title: "Chưa chọn bàn",
          description: "Vui lòng chọn bàn trước khi đặt món.",
          variant: "destructive",
        });
        return;
      }

      await createOrderMutation.mutateAsync({
        table_number_id: tableNumber,
        items: orders,
      });

      toast({
        title: "Đã tạo đơn hàng",
        description: `Đã thêm ${itemCount} món vào bàn ${tableNumber}.`,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({ error, setError: isNewGuest ? form.setError : undefined });
    }
  };

  const isSubmitting =
    createGuestMutation.isPending || createOrderMutation.isPending;

  return (
    <Dialog
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) reset();
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo đơn hàng
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-screen overflow-auto sm:max-w-150">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-4 items-center justify-items-start gap-4">
          <Label htmlFor="isNewGuest">Khách hàng mới</Label>
          <div className="col-span-3 flex items-center">
            <Switch
              id="isNewGuest"
              checked={isNewGuest}
              onCheckedChange={setIsNewGuest}
            />
          </div>
        </div>
        {isNewGuest ? (
          <Form {...form}>
            <form
              noValidate
              className="grid auto-rows-max items-start gap-4 md:gap-8"
              id="add-order-form"
            >
              <div className="grid gap-4 py-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="name">Tên khách hàng</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <Input id="name" className="w-full" {...field} />
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tableNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                        <Label htmlFor="tableNumber">Chọn bàn</Label>
                        <div className="col-span-3 w-full space-y-2">
                          <div className="flex items-center gap-4">
                            <div>{field.value || "Chưa chọn"}</div>
                            <TablesDialog
                              onChoose={(table) => {
                                field.onChange(table.number);
                              }}
                            />
                          </div>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
            </form>
          </Form>
        ) : (
          <GuestsDialog onChoose={setSelectedGuest} />
        )}
        {!isNewGuest && selectedGuest && (
          <div className="grid grid-cols-4 items-center justify-items-start gap-4">
            <Label htmlFor="selectedGuest">Khách đã chọn</Label>
            <div className="col-span-3 flex w-full items-center gap-4">
              <div>
                {selectedGuest.name} (#{selectedGuest.id})
              </div>
              <div>Bàn: {selectedGuest.tableNumber ?? "Chưa có"}</div>
            </div>
          </div>
        )}
        <div className="space-y-3">
          {dishListQuery.isLoading && (
            <div className="text-sm text-muted-foreground">Đang tải món...</div>
          )}
          {dishes
            .filter((dish) => dish.status !== DishStatus.Hidden)
            .map((dish) => {
              const dishName = resolveText(dish.name);
              const description = resolveText(dish.description);

              return (
                <div
                  key={dish.id}
                  className={cn("flex gap-4", {
                    "pointer-events-none opacity-60":
                      dish.status === DishStatus.Unavailable,
                  })}
                >
                  <div className="relative flex-shrink-0">
                    {dish.status === DishStatus.Unavailable && (
                      <span className="absolute inset-0 z-10 flex items-center justify-center bg-background/70 text-sm">
                        Hết hàng
                      </span>
                    )}
                    <Image
                      src={dish.image}
                      alt={dishName}
                      height={100}
                      width={100}
                      quality={100}
                      className="h-[80px] w-[80px] rounded-md object-cover"
                    />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm">{dishName}</h3>
                    <p className="line-clamp-2 text-xs">{description}</p>
                    <p className="text-xs font-semibold">
                      {formatCurrency(dish.price)}
                    </p>
                  </div>
                  <div className="ml-auto flex flex-shrink-0 items-center justify-center">
                    <Quantity
                      onChange={(value) => handleQuantityChange(dish.id, value)}
                      value={
                        orders.find((order) => order.dish_id === dish.id)
                          ?.quantity ?? 0
                      }
                    />
                  </div>
                </div>
              );
            })}
        </div>
        <DialogFooter>
          <Button
            className="w-full justify-between"
            onClick={handleOrder}
            disabled={orders.length === 0}
            isLoading={isSubmitting}
          >
            <span>Đặt hàng · {itemCount} món</span>
            <span>{formatCurrency(totalPrice)}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
