import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import OrderTable from "@/features/orders/components/OrderTable";
import { Suspense } from "react";

export default function OrdersPage() {
  return (
    <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
      <div className="space-y-2">
        <Card x-chunk="dashboard-orders-chunk-0">
          <CardHeader>
            <CardTitle>Đơn hàng</CardTitle>
            <CardDescription>Quản lý đơn hàng của nhà hàng</CardDescription>
          </CardHeader>
          <CardContent>
            <Suspense>
              <OrderTable />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
