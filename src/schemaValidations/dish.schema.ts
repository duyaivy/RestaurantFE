import { DishStatusValues, LanguageSchema } from '@/constants/type'
import z from 'zod'

export const CreateDishBody = z.object({
  name: z.string().min(1).max(256),
  price: z.coerce.number().positive(),
  description: z.string().max(10000),
  image: z.string().url(),
  status: z.enum(DishStatusValues).optional(),
  category: z.number()
})


export type CreateDishBodyType = z.TypeOf<typeof CreateDishBody>

export const DishSchema = z.object({
  id: z.number(),
  name: LanguageSchema,
  price: z.coerce.number(),
  description: LanguageSchema,
  image: z.string(),
  status: z.enum(DishStatusValues),
  created_at: z.date(),
  updated_at: z.date(),
  category: z.number()
})

export const DishRes = DishSchema

export type DishResType = z.TypeOf<typeof DishRes>

export const DishListRes = z.array(DishSchema)

export type DishListResType = z.TypeOf<typeof DishListRes>

export const UpdateDishBody = CreateDishBody
export type UpdateDishBodyType = CreateDishBodyType
export const DishParams = z.object({
  id: z.coerce.number()
})
export type DishParamsType = z.TypeOf<typeof DishParams>
