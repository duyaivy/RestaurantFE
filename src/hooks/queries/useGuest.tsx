import authApiRequest from "@/apiRequests/auth"
import guestApiRequest from "@/apiRequests/guest"
import { useMutation } from "@tanstack/react-query"

export const useLoginMutation = () => {
 
  return useMutation({
    mutationFn: guestApiRequest.login
  
})}


export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}