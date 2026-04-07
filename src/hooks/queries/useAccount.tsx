import { accountApiRequest } from "@/apiRequests/account"
import { UpdateEmployeeAccountBodyType } from "@/schemaValidations/account.schema"
import { keepPreviousData, useQuery, useQueryClient } from "@tanstack/react-query"
import { useMutation } from "@tanstack/react-query"
import { QueryAccountConfig } from "@/hooks/common/useAccountQueryConfig"
export const useAccountMe = () => {
    return useQuery({
        queryKey: ['account-me'],
        queryFn: accountApiRequest.me
    })
}

export const useUpdateMeMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.updateMe
    })

}
export const useChangePasswordMutation = () => {
    return useMutation({
        mutationFn: accountApiRequest.changePassword,
        onError: () => {
            console.log("loiooo");

        }
    })
}

export const useGetAccountList = (queryConfig: QueryAccountConfig) =>{
    return useQuery({
        queryKey: ['accounts', queryConfig],
        queryFn: () => accountApiRequest.list({
            page: queryConfig.page ? Number(queryConfig.page) : undefined,
            limit: queryConfig.limit ? Number(queryConfig.limit) : undefined,
            search: queryConfig.search
        }),
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 30,
        retry: 2,
        placeholderData: keepPreviousData
    })
}

export const useGetAccount =({ id, enabled, }:{
    id : number,
    enabled: boolean
}) =>
    { return useQuery({
        queryKey: ['account', id],
        queryFn: () => accountApiRequest.getEmployee(id),
        enabled,
        staleTime: 1000 * 60 * 30,
        gcTime: 1000 * 60 * 30,
        retry: 2,
        placeholderData: keepPreviousData
    })

}

export const useAddEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accountApiRequest.addEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }
    })
}
export const useUpdateEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
    mutationFn: ({id, ...body} : UpdateEmployeeAccountBodyType & { id: number }) => accountApiRequest.updateEmployee(id, body),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }
    })
}
export const useDeleteEmployeeMutation = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: accountApiRequest.deleteEmployee,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['accounts'] });
        }
    })
}
