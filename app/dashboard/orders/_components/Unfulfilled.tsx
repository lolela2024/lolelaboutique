import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import React, { Fragment } from "react";
import MenuFulfilled from "./MenuFulfilled";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatCurrency } from "@/app/lib/formatters";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Payment from "./Payment";
import DateLivrare from "./DateLivrare";

export default function Unfulfilled({ data }: { data: any }) {
  const totalItems = data?.products.reduce((total: number, product: any) => {
    return total + product.quantity;
  }, 0);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        <Card className="px-4 pb-4">
          <CardHeader className="p-0 py-4 text-sm font-light">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div
                  className={cn(
                    data?.fulfilled === "Unfulfilled"
                      ? "bg-yellow-300"
                      : "bg-green-300",
                    "py-1 px-2 rounded-md"
                  )}
                >
                  {data?.fulfilled} ({totalItems})
                </div>
                <span className="ml-4">#{data?.orderNumber}</span>
              </div>
              
            </div>
          </CardHeader>
          <CardContent className="border rounded-sm pt-2">
            {data?.fulfilled === "Fulfilled" && (
              <div className="mb-4">
                <p className="text-gray-600">Fulfilled</p>
                <p>
                  {data.updatedAt
                    ? data.updatedAt.toLocaleDateString("ro-RO", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })
                    : "Data indisponibilă"}
                </p>
              </div>
            )}

            <div>
              <p className="text-gray-600">Delivery method</p>
              <p>Standard</p>
            </div>
            <Separator className="mt-4" />
            <div>
              {data?.products.map((product: any) => (
                <Fragment key={product.id}>
                  <div className="mt-4 flex gap-4">
                    <div className="aspect-1 border rounded-sm overflow-hidden flex-shrink-0 w-1/12 relative">
                      <Image
                        src={product.Product.images[0]}
                        fill
                        alt={product.Product.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-1 w-full gap-4">
                      <p className="w-1/2 font-semibold">
                        {product.Product.name}
                      </p>
                      <div className="w-1/4 text-center">
                        {formatCurrency(product.Product.price)} x{" "}
                        {product.quantity}
                      </div>
                      <div className="w-1/4 text-right">
                        {formatCurrency(
                          product.Product.price * product.quantity
                        )}
                      </div>
                    </div>
                  </div>
                  <Separator className="mt-4" />
                </Fragment>
              ))}
            </div>
            <div className="flex items-center justify-end mt-4">
              {data?.fulfilled === "Unfulfilled" && (
                <Link href={`/dashboard/orders/${data.id}/fulfillment_orders`}>
                  <Button variant={"dashboard"} size={"sm"}>
                    Fulfill item
                  </Button>
                </Link>
              )}
            </div>
          </CardContent>
        </Card>

        <Payment data={data} />
      </div>

      <div className="col-span-1">
        <DateLivrare data={data} />
      </div>
    </div>
  );
}
