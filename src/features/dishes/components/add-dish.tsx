"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Upload } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useForm } from "react-hook-form";

import {
  CreateDishBody,
  CreateDishBodyType,
} from "@/features/dishes/schemas/dish.schema";
import { useAddDishMutation } from "@/features/dishes/hooks/use-dish";
import { useCategoryQuery } from "@/features/menu/hooks/use-category";
import { useUploadMediaMutation } from "@/shared/hooks/use-media";
import { handleErrorApi } from "@/shared/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/shared/ui/avatar";
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
  FormControl,
  FormField,
  FormItem,
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
import { Textarea } from "@/shared/ui/textarea";
import { toast } from "@/shared/ui/use-toast";

const DEFAULT_FORM_VALUES: CreateDishBodyType = {
  name: "",
  description: "",
  price: 0,
  image: "",
  category_id: 0,
};

export default function AddDish() {
  const [file, setFile] = useState<File | null>(null);
  const [open, setOpen] = useState(false);
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const addDishMutation = useAddDishMutation();
  const uploadMediaMutation = useUploadMediaMutation();
  const categoryQuery = useCategoryQuery();

  const form = useForm<CreateDishBodyType>({
    resolver: zodResolver(CreateDishBody) as any,
    defaultValues: DEFAULT_FORM_VALUES,
  });
  const image = form.watch("image");
  const name = form.watch("name");
  const previewImage = useMemo(() => {
    if (file) {
      return URL.createObjectURL(file);
    }
    return image;
  }, [file, image]);

  const reset = () => {
    form.reset(DEFAULT_FORM_VALUES);
    setFile(null);
  };

  const onSubmit = async (values: CreateDishBodyType) => {
    if (addDishMutation.isPending || uploadMediaMutation.isPending) return;

    try {
      let body = values;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        const uploadRes = await uploadMediaMutation.mutateAsync(formData);
        body = {
          ...values,
          image: uploadRes.payload.data,
        };
      }

      const result = await addDishMutation.mutateAsync(body);
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
                    <div className="flex gap-2 items-start justify-start">
                      <Avatar className="aspect-square size-25 rounded-md object-cover">
                        <AvatarImage src={previewImage} />
                        <AvatarFallback className="rounded-none">
                          {name || "Dish"}
                        </AvatarFallback>
                      </Avatar>
                      <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        onChange={(event) => {
                          const selectedFile = event.target.files?.[0];
                          if (selectedFile) {
                            setFile(selectedFile);
                            field.onChange(
                              "http://localhost:3000/" + selectedFile.name,
                            );
                          }
                        }}
                        className="hidden"
                      />
                      <button
                        className="flex aspect-square w-25 items-center justify-center rounded-md border border-dashed"
                        type="button"
                        onClick={() => imageInputRef.current?.click()}
                      >
                        <Upload className="h-4 w-4 text-muted-foreground" />
                        <span className="sr-only">Upload</span>
                      </button>
                    </div>
                    <FormMessage />
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
                      <Label htmlFor="category_id">Danh mục</Label>
                      <div className="col-span-3 w-full space-y-2">
                        <Select
                          onValueChange={(value) => field.onChange(Number(value))}
                          value={field.value ? String(field.value) : undefined}
                          disabled={categoryQuery.isLoading}
                        >
                          <FormControl>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Chọn danh mục" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {(categoryQuery.data?.payload.data ?? []).map(
                              (category) => (
                                <SelectItem
                                  key={category.id}
                                  value={String(category.id)}
                                >
                                  {category.name.vi}
                                </SelectItem>
                              ),
                            )}
                          </SelectContent>
                        </Select>
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
            isLoading={addDishMutation.isPending || uploadMediaMutation.isPending}
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
