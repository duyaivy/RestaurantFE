"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import {
  CreateDishBody,
  CreateDishBodyType,
} from "@/features/dishes/schemas/dish.schema";
import { useAddDishMutation } from "@/features/dishes/hooks/use-dish";
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
  Form,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/ui/form";
import { Input } from "@/shared/ui/input";
import { Label } from "@/shared/ui/label";
import { Textarea } from "@/shared/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
import { handleErrorApi } from "@/shared/lib/utils";
import { toast } from "@/shared/ui/use-toast";

const DEFAULT_FORM_VALUES: CreateDishBodyType = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category_id: 1,
};

export default function AddDish() {
  const [open, setOpen] = useState(false);
  const addDishMutation = useAddDishMutation();
  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody) as any,
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const image = form.watch("image");
  const name = form.watch("name");

  const reset = () => {
    form.reset(DEFAULT_FORM_VALUES);
  };

  const onSubmit = async (data: CreateDishBodyType) => {
    try {
      const result = await addDishMutation.mutateAsync(data);
      toast({
        description: result.payload.message,
      });
      reset();
      setOpen(false);
    } catch (error) {
      handleErrorApi({ error, setError: form.setError });
    }
  };

  return (
    <Dialog
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) {
          reset();
        }
      }}
      open={open}
    >
      <DialogTrigger asChild>
        <Button size="sm" className="h-7 gap-1">
          <PlusCircle className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Thêm món ăn
          </span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-screen overflow-auto">
        <DialogHeader>
          <DialogTitle>Thêm món ăn</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            noValidate
            onSubmit={form.handleSubmit(onSubmit)}
            className="grid auto-rows-max items-start gap-4 md:gap-8"
            id="add-dish-form"
          >
            <div className="grid gap-4 py-4">
              <FormField
                control={form.control}
                name="image"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-start justify-items-start gap-4">
                      <Label htmlFor="image">Ảnh</Label>
                      <div className="col-span-3 w-full space-y-3">
                        <Avatar className="aspect-square h-[100px] w-[100px] rounded-md object-cover">
                          <AvatarImage src={image} />
                          <AvatarFallback className="rounded-none">
                            {name || "Dish"}
                          </AvatarFallback>
                        </Avatar>
                        <Input
                          id="image"
                          className="w-full"
                          placeholder="https://example.com/dish.jpg"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="name">Tên món ăn</Label>
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
                name="category_id"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="category_id">Category ID</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="category_id"
                          className="w-full"
                          type="number"
                          min={1}
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-center justify-items-start gap-4">
                      <Label htmlFor="price">Giá</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Input
                          id="price"
                          className="w-full"
                          {...field}
                          type="number"
                          min={0}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <div className="grid grid-cols-4 items-start justify-items-start gap-4">
                      <Label htmlFor="description">Mô tả sản phẩm</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Textarea
                          id="description"
                          className="w-full"
                          {...field}
                        />
                        <FormMessage />
                      </div>
                    </div>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <Button
            isLoading={addDishMutation.isPending}
            type="submit"
            form="add-dish-form"
          >
            Thêm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
