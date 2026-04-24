import { LanguageSchema } from "@/shared/constants/type";
import z from "zod";
import { DishListRes } from "@/features/dishes/schemas/dish.schema";

export const CategorySchema = z.object({
  id: z.number(),
  name: LanguageSchema,
  image: z.string(),
  description: LanguageSchema,
  is_active: z.boolean(),
  created_at: z.date(),
  updated_at: z.date(),
});

export const CategoryDetailSchema = CategorySchema.extend({
  dishes: z.array(DishListRes).nullable(),
});
export const Category = CategorySchema;
export type CategoryType = z.TypeOf<typeof Category>;
