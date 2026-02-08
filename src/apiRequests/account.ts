import http from "@/lib/http";
import { AccountResType, UpdateMeBodyType } from "@/schemaValidations/account.schema";


 export const accountApiRequest = {
    me: () => http.get<AccountResType>('/accounts/me'),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>('/accounts/me', body)
}