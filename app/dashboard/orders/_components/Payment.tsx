import { formatCurrency } from "@/app/lib/formatters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { OrderStatus } from "@prisma/client";
import React from "react";
import MenuStatus from "./MenuStatus";

export default function Payment({data}:{data:any}) {

  const totalItems = data?.products.reduce((total:number, product:any) => {
    return total + product.quantity;
  }, 0);

  return (
    <Card className="px-4 pb-4">
      <CardHeader className="p-0 px-4 py-4 ">
        <div className="flex  items-start justify-between">
          <p
            className={cn(
              data?.status === OrderStatus.pending && "bg-red-200",
              data?.status === OrderStatus.completed && "bg-green-200",
              data?.status === OrderStatus.refunded && "bg-gray-200",
              data?.status === OrderStatus.cancelled && "bg-yellow-200",
              "px-2 py-1 rounded-lg capitalize text-sm"
            )}
          >
            {data?.status}
          </p>
          {/* menu order */}
          {data?.payment === "ramburs" && <MenuStatus orderId={data?.id} />}
        </div>
      </CardHeader>
      <CardContent className="border rounded-sm pt-2 space-y-2">
        <h3>Metoda de plata: {data?.payment}</h3>
        <div className="grid grid-cols-3 text-sm pt-4">
          <div className="col-span-1">Subtotal</div>
          <div className="col-span-2">
            <div className="flex justify-between">
              <div>
                {totalItems}{" "}
                {totalItems === 1 ? "item" : "items"}
              </div>
              <div>{formatCurrency(data?.amount as number)}</div>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-3 text-sm">
          <div className="col-span-1">Shipping</div>
          <div className="col-span-2">
            <div className="flex justify-between">
              {data?.shippingMethod !== "free" && <div>Standard</div>}
              <div>
                {data?.shippingMethod === "dhl" && formatCurrency(24.99)}
              </div>
            </div>
          </div>
        </div>
        <div className="flex justify-between text-sm font-semibold">
          <p>Total</p>
          <p>{data?.amount ? formatCurrency(data?.amount + 24.99) : 0}</p>
        </div>

        {data?.status === OrderStatus.completed && (
          <>
            <Separator />
            <div className="flex justify-between text-sm font-semibold">
              <p>Paid</p>
              <p>{data?.amount ? formatCurrency(data?.amount + 24.99) : 0}</p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
