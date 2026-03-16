import http from '@/lib/http'
import { PaginationResponse, SuccessResponse } from '@/constants/type'
import {
    CreateDishBodyType,
    UpdateDishBodyType
} from '@/schemaValidations/dish.schema'
import { CategoryType } from '@/schemaValidations/category.schema'

const CATEGORY_URL = 'categories/'
const categoryApiRequest = {
    list: () =>
        http.get<SuccessResponse<CategoryType[]>>(
            CATEGORY_URL
        ),
    add: (body: CreateDishBodyType) => http.post<SuccessResponse<CategoryType>>(CATEGORY_URL, body),
    getCategory: (id: number) => http.get<SuccessResponse<CategoryType>>(`${CATEGORY_URL}${id}/`),
    updateCategory: (id: number, body: UpdateDishBodyType) =>
        http.put<SuccessResponse<CategoryType>>(`${CATEGORY_URL}${id}/`, body),
    deleteCategory: (id: number) => http.delete<SuccessResponse<CategoryType>>(`${CATEGORY_URL}${id}/`)
}

export default categoryApiRequest
