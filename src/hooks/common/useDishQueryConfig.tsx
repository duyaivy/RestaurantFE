'use client'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { useSearchParams } from 'next/navigation'
import { DishListConfig } from '@/constants/interface'

export type QueryDishConfig = {
    [key in keyof DishListConfig]: string
}
export const useParamsString = () => {
    const searchParams = useSearchParams()
    return Object.fromEntries(searchParams.entries())
}
export const useDishQueryConfig = () => {
    const queryString: QueryDishConfig = useParamsString()
    const queryConfig: QueryDishConfig = omitBy(
        {
            page: queryString.page || 1,
            limit: queryString.limit || 10,
            category_id: queryString.category_id,
            max_price: queryString.max_price,
            min_price: queryString.min_price,
            search: queryString.search
        },
        isUndefined

    )

    return queryConfig
}
