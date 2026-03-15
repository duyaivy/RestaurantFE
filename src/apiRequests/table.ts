import http from "@/lib/http";
import { SuccessResponse } from "@/constants/type";
import {
  CreateTableBodyType,
  TableListResType,
  TableResType,
  UpdateTableBodyType
} from "@/schemaValidations/table.schema";

const tableApiRequest = {
  list: () => http.get<SuccessResponse<TableListResType>>('tables?limit=50'),
  add: (body: CreateTableBodyType) => http.post<SuccessResponse<TableResType>>('tables/', body),
  getTable: (id: number) => http.get<SuccessResponse<TableResType>>(`tables/${id}/`),
  updateTable: (id: number, body: UpdateTableBodyType) =>
    http.put<SuccessResponse<TableResType>>(`tables/${id}/`, body),
  deleteTable: (id: number) => http.delete<SuccessResponse<TableResType>>(`tables/${id}/`)
}

export default tableApiRequest;