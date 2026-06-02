import dishApiRequest from "@/features/dishes/api/dish.api";
import { UpdateDishBodyType } from "@/features/dishes/schemas/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryDishConfig } from "@/features/dishes/hooks/use-dish-query-config";
import { DishListConfig } from "@/features/dishes/types/dish-list-config.types";

export const useDishListQuery = (queryConfig: QueryDishConfig) => {
  const { page, limit, category_id, search, min_price, max_price } = queryConfig;

  return useQuery({
    queryKey: [
      "dishes",
      page,
      limit,
      category_id,
      search,
      min_price,
      max_price,
    ],
    queryFn: () =>
      dishApiRequest.list({
        page,
        limit,
        category_id,
        search,
        min_price,
        max_price,
      } as DishListConfig),
    staleTime: 1000 * 60 * 60,
    placeholderData: (previousData) => previousData,
  });
};

/** Flat dish list for dropdowns — fetches up to 200 dishes, cached 5 min */
export const useAllDishesQuery = () => {
  return useQuery({
    queryKey: ["dishes", "all"],
    queryFn: () => dishApiRequest.list({ limit: 200, page: 1 } as DishListConfig),
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 10,
  });
};

export const useGetDishQuery = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: () => dishApiRequest.getDish(id),
    enabled,
    staleTime: 1000 * 60 * 60,
  });
};

export const useAddDishMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: dishApiRequest.add,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};

export const useUpdateDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...body }: UpdateDishBodyType & { id: number }) =>
      dishApiRequest.updateDish(id, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};

export const useDeleteDishMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: dishApiRequest.deleteDish,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["dishes"],
      });
    },
  });
};
