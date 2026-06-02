import http from "@/shared/api/http";
import { PaginationResponse, SuccessResponse } from "@/shared/constants/type";
import {
  CreateDishBodyType,
  DishResType,
  UpdateDishBodyType,
} from "@/features/dishes/schemas/dish.schema";
import { DishListConfig } from "@/features/dishes/types/dish-list-config.types";

import queryString from "query-string";

const dishApiRequest = {
  list: (queryParams: DishListConfig) =>
    http.get<SuccessResponse<PaginationResponse<DishResType>>>(
      "dishes/?" +
        queryString.stringify({
          ...queryParams,
        }),
      { next: { tags: ["dishes"] } },
    ),
  add: (body: CreateDishBodyType) =>
    http.post<SuccessResponse<DishResType>>("dishes/", body),
  getDish: (id: number) =>
    http.get<SuccessResponse<DishResType>>(`dishes/${id}/`),
  updateDish: (id: number, body: UpdateDishBodyType) =>
    http.patch<SuccessResponse<DishResType>>(`dishes/${id}/`, body),
  deleteDish: (id: number) =>
    http.delete<SuccessResponse<DishResType>>(`dishes/${id}/`),
};

export default dishApiRequest;
