"use client"
import isUndefined from 'lodash/isUndefined'
import omitBy from 'lodash/omitBy'
import { useSearchParams } from 'next/navigation'
import { AccountListConfig } from '@/constants/interface'

export type QueryAccountConfig = {
    [key in keyof AccountListConfig]: string
}
export const useParamsString = () => {
    const searchParams = useSearchParams()
    return Object.fromEntries(searchParams.entries())
}
export const useAccountQueryConfig = () => {
    const queryString: QueryAccountConfig = useParamsString()
    const queryConfig: QueryAccountConfig = omitBy(
        {
            page: queryString.page || 1,
            limit: queryString.limit || 10,
            search: queryString.search
        },
        isUndefined

    )

    return queryConfig
}