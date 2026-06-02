'use client'
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { useSearchParams } from 'next/navigation'
import { DishListConfig } from '@/features/dishes/types/dish-list-config.types'

export type QueryDishConfig = DishListConfig

export const useParamsString = () => {
    const searchParams = useSearchParams()
    return Object.fromEntries(searchParams.entries())
}

const toPositiveNumber = (value?: string) => {
    const parsedValue = Number(value)
    return Number.isFinite(parsedValue) && parsedValue > 0 ? parsedValue : undefined
}

export const useDishQueryConfig = () => {
    const queryString = useParamsString()
    const queryConfig: QueryDishConfig = omitBy(
        {
            page: toPositiveNumber(queryString.page) || 1,
            limit: toPositiveNumber(queryString.limit) || 10,
            category_id: toPositiveNumber(queryString.category_id),
            max_price: toPositiveNumber(queryString.max_price),
            min_price: toPositiveNumber(queryString.min_price),
            search: queryString.search
        },
        isUndefined
    ) as QueryDishConfig

    return queryConfig
}
