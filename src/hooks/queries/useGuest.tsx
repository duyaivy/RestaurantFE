import guestApiRequest from "@/apiRequests/guest";
import { toast } from "@/components/ui/use-toast";
import { useMutation } from "@tanstack/react-query";

export const useGuestLoginMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.login,
  });
};

export const useLogoutMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.logout,
  });
};
export const useMessageEmployeeMutation = () => {
  return useMutation({
    mutationFn: guestApiRequest.messageEmployee,
    onSuccess: () => {
      toast({
        title: "Goị nhân viên thành công",
      });
    },
  });
};
