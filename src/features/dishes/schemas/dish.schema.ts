import { DishStatusValues, LanguageSchema } from "@/shared/constants/type";
import z from "zod";

const BaseDishMutationBody = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000),
  image: z.string().url(),
  category_id: z.coerce.number().int().positive(),
});

export const CreateDishBody = BaseDishMutationBody;

export type CreateDishBodyType = z.TypeOf<typeof CreateDishBody>;

export const UpdateDishBody = BaseDishMutationBody.extend({
  status: z.enum(DishStatusValues),
});

export type UpdateDishBodyType = z.TypeOf<typeof UpdateDishBody>;

export const DishCategorySchema = z.object({
  id: z.number(),
  name: LanguageSchema,
});

export const DishSchema = z.object({
  id: z.number(),
  category: DishCategorySchema,
  name: LanguageSchema,
  price: z.coerce.number(),
  description: LanguageSchema,
  image: z.string(),
  status: z.enum(DishStatusValues),
  updated_at: z.string(),
  created_at: z.string(),
  price_usd: z.coerce.number().optional(),
});

export const DishRes = DishSchema;

export type DishResType = z.TypeOf<typeof DishRes>;

export const DishListRes = z.array(DishSchema);

export type DishListResType = z.TypeOf<typeof DishListRes>;

export const DishParams = z.object({
  id: z.coerce.number(),
});
export type DishParamsType = z.TypeOf<typeof DishParams>;
