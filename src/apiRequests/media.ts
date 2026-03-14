import http from "@/lib/http";
import { SuccessResponse } from "@/constants/type";
import { UploadImageResType } from "@/schemaValidations/media.schema";

export const mediaApiRequest = {
  upload: (formData: FormData) =>
    http.post<SuccessResponse<UploadImageResType>>('/media/upload/', formData)
}