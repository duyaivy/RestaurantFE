import categoryApiRequest from "@/features/menu/api/category"
import { useQuery } from "@tanstack/react-query"

export const useCategoryQuery = () => {
    return useQuery({
        queryKey: ['categories'],
        queryFn: () => categoryApiRequest.list(),
        retry: 3,
        staleTime: 60 * 60 * 1000,
    })
}