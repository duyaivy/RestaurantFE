import { Fragment, useState } from "react";
import { Users } from "lucide-react";
import { OrderStatus, OrderStatusValues } from "@/shared/constants/type";
import {
  OrderStatusIcon,
  cn,
  getVietnameseOrderStatus,
} from "@/shared/lib/utils";
import { Badge } from "@/shared/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/shared/ui/dialog";
import { Separator } from "@/shared/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/shared/ui/tooltip";
import { TableListResType } from "@/features/tables/schemas/table.schema";
import {
  ServingGuestByTableNumber,
  Statics,
  StatusCountObject,
} from "./order-table";
import OrderGuestDetail from "./order-guest-detail";

const activeStatuses = [
  OrderStatus.Pending,
  OrderStatus.Preparing,
  OrderStatus.Served,
] as const;

export default function OrderStatics({
  statics,
  tableList,
  servingGuestByTableNumber,
}: {
  statics: Statics;
  tableList: TableListResType;
  servingGuestByTableNumber: ServingGuestByTableNumber;
}) {
  const [selectedTableNumber, setSelectedTableNumber] = useState<number>(0);
  const selectedServingGuest = servingGuestByTableNumber[selectedTableNumber];

  return (
    <Fragment>
      <Dialog
        open={Boolean(selectedTableNumber)}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedTableNumber(0);
          }
        }}
      >
        <DialogContent className="max-h-full overflow-auto">
          {selectedServingGuest && (
            <DialogHeader>
              <DialogTitle>
                Khách đang ngồi tại bàn {selectedTableNumber}
              </DialogTitle>
            </DialogHeader>
          )}
          <div>
            {selectedServingGuest &&
              Object.keys(selectedServingGuest).map((guestId, index) => {
                const orders = selectedServingGuest[Number(guestId)];
                return (
                  <div key={guestId}>
                    <OrderGuestDetail guestId={Number(guestId)} orders={orders} />
                    {index !== Object.keys(selectedServingGuest).length - 1 && (
                      <Separator className="my-5" />
                    )}
                  </div>
                );
              })}
          </div>
        </DialogContent>
      </Dialog>
      <div className="flex flex-wrap items-stretch justify-start gap-4 py-4">
        {tableList.map((table) => {
          const tableNumber = table.number;
          const tableStatics:
            | Record<number, StatusCountObject>
            | undefined = statics.table[tableNumber];
          let isEmptyTable = true;
          const countObject: StatusCountObject = {
            PENDING: 0,
            PREPARING: 0,
            SERVED: 0,
            CANCELLED: 0,
            COMPLETED: 0,
          };
          const servingGuestCount = Object.values(
            servingGuestByTableNumber[tableNumber] ?? {},
          ).length;

          if (tableStatics) {
            for (const guestId in tableStatics) {
              const guestStatics = tableStatics[Number(guestId)];
              if (
                activeStatuses.some(
                  (status) =>
                    guestStatics[status] !== 0 &&
                    guestStatics[status] !== undefined,
                )
              ) {
                isEmptyTable = false;
              }

              OrderStatusValues.forEach((status) => {
                countObject[status] += guestStatics[status] ?? 0;
              });
            }
          }

          return (
            <div
              key={tableNumber}
              className={cn(
                "flex items-stretch gap-2 rounded-md border p-2 text-sm",
                {
                  "bg-secondary": !isEmptyTable,
                  "border-transparent": !isEmptyTable,
                  "cursor-pointer": !isEmptyTable,
                },
              )}
              onClick={() => {
                if (!isEmptyTable) setSelectedTableNumber(tableNumber);
              }}
            >
              <div className="flex flex-col items-center justify-center gap-2">
                <div className="text-center text-lg font-semibold">{tableNumber}</div>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        <span>{servingGuestCount}</span>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent>
                      Đang phục vụ: {servingGuestCount} khách
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <Separator
                orientation="vertical"
                className={cn("h-auto flex-shrink-0 flex-grow", {
                  "bg-muted-foreground": !isEmptyTable,
                })}
              />
              {isEmptyTable ? (
                <div className="flex items-center justify-between text-sm">Ready</div>
              ) : (
                <div className="flex flex-col gap-2">
                  <TooltipProvider>
                    {activeStatuses.map((status) => {
                      const StatusIcon = OrderStatusIcon[status];
                      return (
                        <Tooltip key={status}>
                          <TooltipTrigger>
                            <div className="flex items-center gap-2">
                              <StatusIcon className="h-4 w-4" />
                              <span>{countObject[status] ?? 0}</span>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent>
                            {getVietnameseOrderStatus(status)}:{" "}
                            {countObject[status] ?? 0} đơn
                          </TooltipContent>
                        </Tooltip>
                      );
                    })}
                  </TooltipProvider>
                </div>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex flex-wrap items-end justify-start gap-4 py-4">
        {OrderStatusValues.map((status) => (
          <Badge variant="secondary" key={status}>
            {getVietnameseOrderStatus(status)}: {statics.status[status] ?? 0}
          </Badge>
        ))}
      </div>
    </Fragment>
  );
}
