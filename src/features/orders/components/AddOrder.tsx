"use client";
import { Button } from "@/shared/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/shared/ui/select";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { Minus, Plus, PlusCircle } from "lucide-react";
import { useMemo, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/shared/ui/form";
import { handleErrorApi } from "@/shared/lib/utils";
import {
  StaffCreateOrderBody,
  StaffCreateOrderBodyType,
} from "@/features/orders/schemas/order.schema";
import { useStaffCreateOrderMutation } from "@/features/orders/hooks/use-order";
import { useGetGuestListQuery } from "@/features/accounts/hooks/use-account";
import { toast } from "@/shared/ui/use-toast";

export default function AddOrder() {
  const [open, setOpen] = useState(false);

  // Fetch guest list
  const { data: guestListData } = useGetGuestListQuery();
  const guests = useMemo(() => guestListData?.payload?.data ?? [], [guestListData]);

  const form = useForm<StaffCreateOrderBodyType>({
    resolver: zodResolver(StaffCreateOrderBody) as any,
    defaultValues: {
      table_number_id: 0,
      guest_id: 0,
      items: [{ dish_id: 0, quantity: 1, note: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  const createMutation = useStaffCreateOrderMutation();

  const onSubmit = async (values: StaffCreateOrderBodyType) => {
    try {
      await createMutation.mutateAsync(values);
      toast({ title: "Đã tạo đơn hàng thành công" });
      form.reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Tạo đơn hàng
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Tạo đơn hàng mới</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            id="add-order-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid gap-4 py-4"
          >
            <FormField
              control={form.control}
              name="table_number_id"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel>Số bàn</FormLabel>
                    <div className="col-span-3 space-y-1">
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Nhập số bàn"
                          {...field}
                          onChange={(e) =>
                            field.onChange(Number(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="guest_id"
              render={({ field }) => (
                <FormItem>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <FormLabel>Khách hàng</FormLabel>
                    <div className="col-span-3 space-y-1">
                      <Select
                        value={field.value?.toString() ?? ""}
                        onValueChange={(val) => field.onChange(Number(val))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn khách hàng" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {guests.map((guest) => (
                            <SelectItem key={guest.id} value={guest.id.toString()}>
                              {guest.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </div>
                  </div>
                </FormItem>
              )}
            />

            <div className="space-y-2">
              <Label className="text-sm font-medium">Danh sách món</Label>
              {fields.map((field, index) => (
                <div
                  key={field.id}
                  className="grid grid-cols-[1fr_80px_1fr_auto] gap-2 items-end border rounded-md p-2"
                >
                  <FormField
                    control={form.control}
                    name={`items.${index}.dish_id`}
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
                    name={`items.${index}.quantity`}
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
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`items.${index}.note`}
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
                    onClick={() => remove(index)}
                    disabled={fields.length === 1}
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
                onClick={() => append({ dish_id: 0, quantity: 1, note: "" })}
              >
                <Plus className="h-4 w-4 mr-1" />
                Thêm món
              </Button>
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            type="submit"
            form="add-order-form"
            disabled={createMutation.isPending}
          >
            {createMutation.isPending ? "Đang tạo..." : "Tạo đơn"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
