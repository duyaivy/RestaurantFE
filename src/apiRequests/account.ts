import http from "@/lib/http";
import { AccountResType } from "@/schemaValidations/account.schema";


 export const accountApiRequest = {
    me: () => http.get<AccountResType>('/account/me')
}