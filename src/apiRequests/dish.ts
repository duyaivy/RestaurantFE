import http from '@/lib/http'
import { SuccessResponse } from '@/constants/type'
import {
  CreateDishBodyType,
  DishListResType,
  DishResType,
  UpdateDishBodyType
} from '@/schemaValidations/dish.schema'

const dishApiRequest = {
  list: () =>
    http.get<SuccessResponse<DishListResType>>('dishes', { next: { tags: ['dishes'] } }),
  add: (body: CreateDishBodyType) => http.post<SuccessResponse<DishResType>>('dishes', body),
  getDish: (id: number) => http.get<SuccessResponse<DishResType>>(`dishes/${id}`),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.put<SuccessResponse<DishResType>>(`dishes/${id}`, body),
  deleteDish: (id: number) => http.delete<SuccessResponse<DishResType>>(`dishes/${id}`)
}

export default dishApiRequest
