import { formatCurrency } from "@/app/lib/formatters";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import React, { Fragment } from "react";
import FulfilledForm from "./FulfilledForm";
import { cn } from "@/lib/utils";
import MenuFulfilled from "./MenuFulfilled";
import Link from "next/link";
import Payment from "./Payment";
import DateLivrare from "./DateLivrare";

type Product = {
  id: string;
  orderId: string;
  fulfilledQuantity: number | null;
  quantity: number;
  Product: {
    name: string;
    price: number;
    images: any;
  };
};

interface UnfulfilledProductsGroupDetails {
  orderNumber: number;
  remainingQuantity: number;
  products: Product[];
}

export default function PartiallyFulfilled({
  groupedPartiallyFulfilledProducts,
  unfulfilledProducts,
  data
}: {
  groupedPartiallyFulfilledProducts: {
    [date: string]: { orderNumber: number; products: any };
  };
  unfulfilledProducts: {
    [date: string]: {
      orderNumber: number;
      orderId: string;
      remainingQuantity: number;
      products: Product[];
    };
  };
  data:any
}) {
  console.log(groupedPartiallyFulfilledProducts)
  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        {Object.keys(groupedPartiallyFulfilledProducts).length === 0 ? (
          <p>No partially fulfilled products</p>
        ) : (
          Object.keys(groupedPartiallyFulfilledProducts).map((date) => {
            const totalPartiallyFulfilled = groupedPartiallyFulfilledProducts[
              date
            ].products.reduce(
              (acc: number, product: any) =>
                acc + (product.fulfilledQuantity || 0),
              0
            );

            return (
              <Card key={date} className="px-4 pb-4">
                <CardHeader className="p-0 py-4 text-sm font-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={"bg-green-300 py-1 px-2 rounded-md"}>
                        Fulfilled ({totalPartiallyFulfilled})
                      </div>
                      <span className="ml-4">
                        #{groupedPartiallyFulfilledProducts[date].orderNumber}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="border rounded-sm pt-2">
                  <div className="mb-4 text-sm">
                    <p className="text-gray-600 p-0">Fulfilled</p>
                    <p className="p-0">{date}</p>
                  </div>
                  <Separator className="mt-4" />
                  <div>
                    {groupedPartiallyFulfilledProducts[date].products.map(
                      (product: any, index: number) => {
                        const unfulfilledQuantity =
                          product.quantity - (product.fulfilledQuantity || 0);

                        return (
                          <Fragment key={index}>
                            <div className="mt-4 flex gap-4">
                              <div className="aspect-1 border rounded-sm overflow-hidden flex-shrink-0 w-1/12 relative">
                                <Image
                                  src={
                                    product.Product.images
                                      ? product.Product.images[0]
                                      : ""
                                  }
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
                                  {product.fulfilledQuantity}
                                </div>
                                <div className="w-1/4 text-right">
                                  {formatCurrency(
                                    product.Product.price *
                                      product.fulfilledQuantity
                                  )}
                                </div>
                              </div>
                            </div>
                            <Separator className="mt-4" />
                          </Fragment>
                        );
                      }
                    )}
                    <div className="flex items-end justify-end mt-4">
                      <Button variant={"dashboard"} size={"sm"}>
                        Add tracking
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })
        )}

        {Object.keys(unfulfilledProducts).length === 0 ? (
          <p>No partially fulfilled products</p>
        ) : (
          Object.keys(unfulfilledProducts).map((date, index) => {
            const totalUnfulfilledProducts = unfulfilledProducts[
              date
            ].products.reduce(
              (acc: number, product: any) =>
                acc + (product.quantity - product.fulfilledQuantity || 0),
              0
            );

            return (
              <div key={index}>
                <Card className="px-4 pb-4">
                  <CardHeader className="p-0 py-4 text-sm font-light">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={"bg-yellow-300 py-1 px-2 rounded-md"}>
                          Unfulfilled ({totalUnfulfilledProducts})
                        </div>
                        <span className="ml-4">
                          #{unfulfilledProducts[date].orderNumber}
                        </span>
                      </div>
                      {/* <MenuFulfilled
                        fulfill={data?.fulfilled}
                        orderId={data?.id}
                      /> */}
                    </div>
                  </CardHeader>
                  <CardContent className="border rounded-sm pt-2">
                    <div>
                      <p className="text-gray-600 p-0">Delivery method</p>
                      <p className="p-0">Standard</p>
                    </div>
                    <Separator className="mt-4" />
                    <div>
                      {unfulfilledProducts[date].products.map(
                        (product, index) => {
                          const produseRamase =
                            product.quantity -
                              (product.fulfilledQuantity || 0) || 0;

                          return (
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
                                    {produseRamase}
                                  </div>
                                  <div className="w-1/4 text-right">
                                    {formatCurrency(
                                      product.Product.price * produseRamase
                                    )}
                                  </div>
                                </div>
                              </div>
                              <Separator className="mt-4" />
                            </Fragment>
                          );
                        }
                      )}
                    </div>
                    <div className="flex items-center justify-end mt-4">
                      
                        <Link
                          href={`/dashboard/orders/${unfulfilledProducts[date].orderId}/fulfillment_orders`}
                        >
                          <Button variant={"dashboard"} size={"sm"}>
                            Fulfill item
                          </Button>
                        </Link>
                      
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}
        <Payment data={data} />
      </div>
      <div className="col-span-1">
        <DateLivrare data={data} />
      </div>
    </div>
  );
}
