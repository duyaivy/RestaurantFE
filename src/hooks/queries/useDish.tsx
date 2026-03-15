import dishApiRequest from '@/apiRequests/dish'
import { UpdateDishBodyType } from '@/schemaValidations/dish.schema'
import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { QueryDishConfig } from '@/hooks/common/useDishQueryConfig'
import { DishListConfig } from '@/constants/interface'

export const useDishListQuery = (queryConfig: QueryDishConfig) => {
  return useQuery({
    queryKey: ['dishes', queryConfig],
    queryFn: () => dishApiRequest.list(queryConfig as DishListConfig),
    placeholderData: keepPreviousData,

  })
}

export const useGetDishQuery = ({
  id,
  enabled
}: {
  id: number
  enabled: boolean
}) => {
  return useQuery({
    queryKey: ['dishes', id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled
  })
}

export const useAddDishMutation = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })
    }
  })
}

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes'],
        exact: true
      })
    }
  })
}

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['dishes']
      })
    }
  })
}
