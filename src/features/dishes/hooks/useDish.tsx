import dishApiRequest from "@/features/dishes/api/dish";
import { UpdateDishBodyType } from "@/features/dishes/schemas/dish.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QueryDishConfig } from "@/features/dishes/hooks/useDishQueryConfig";
import { DishListConfig } from "@/features/dishes/types/dish-list-config";

export const useDishListQuery = (queryConfig: QueryDishConfig) => {
  return useQuery({
    queryKey: ["dishes", queryConfig],
    queryFn: () => dishApiRequest.list(queryConfig as DishListConfig),
    staleTime: 1000 * 60 * 60,
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
        exact: true,
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
