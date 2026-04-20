
import { mediaApiRequest } from "@/shared/api/media"
import { useMutation } from "@tanstack/react-query"
export const useUploadMediaMutation = () => {
    return useMutation({
        mutationFn: mediaApiRequest.upload
    })

}