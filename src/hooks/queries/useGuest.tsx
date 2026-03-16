import guestApiRequest from "@/apiRequests/guest"
import { useMutation } from "@tanstack/react-query"

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login
  })
}


export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout
  })
}