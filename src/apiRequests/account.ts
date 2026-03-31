import http from "@/lib/http";
import { SuccessResponse } from "@/constants/type";
import {
  AccountListResType,
  AccountResType,
  ChangePasswordBodyType,
  CreateEmployeeAccountBodyType,
  CreateGuestResType,
  GetListGuestsResType,
  UpdateEmployeeAccountBodyType,
  UpdateMeBodyType,
} from "@/schemaValidations/account.schema";

export const accountApiRequest = {
  me: () => http.get<SuccessResponse<AccountResType>>("/me/"),
  sMe: (accessToken: string) =>
    http.get<SuccessResponse<AccountResType>>("/me/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }),
  updateMe: (body: UpdateMeBodyType) =>
    http.patch<SuccessResponse<AccountResType>>("/me/update/", body),
  changePassword: (body: ChangePasswordBodyType) =>
    http.post<SuccessResponse<AccountResType>>("/me/change-password/", body),

  list: () => http.get<SuccessResponse<AccountListResType>>("/accounts/"),
  addEmployee: (body: CreateEmployeeAccountBodyType) =>
    http.post<SuccessResponse<AccountResType>>("/accounts/", body),
  updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) =>
    http.put<SuccessResponse<AccountResType>>(`/accounts/detail/${id}/`, body),
  deleteEmployee: (id: number) =>
    http.delete<SuccessResponse<null>>(`/accounts/detail/${id}/`),
  getEmployee :(id: number) => 
    http.get<SuccessResponse<AccountResType>>(`/accounts/detail/${id}/`),
  guestList: () => http.get<SuccessResponse<GetListGuestsResType>>("/accounts/guests/"),
  createGuest: (body: { name: string; tableNumber: number }) =>
    http.post<SuccessResponse<CreateGuestResType>>("/accounts/guests/", body),
};
