"use client";

import React, { Fragment, useEffect } from "react";
import DateLivrare from "./DateLivrare";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import MenuFulfilled from "./MenuFulfilled";
import { Product } from "@prisma/client";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatCurrency } from "@/app/lib/formatters";
import Payment from "./Payment";

type FulfilledProduct = {
  productName: string;
  productImage: string;
  productPrice: number;
  fulfilledQuantity: number;
  totalQuantity: number;
  quantity: number;
};

type GroupedFulfilledProducts = {
  [key: string]: FulfilledProduct[];
};

interface iAppProps {
  data: any;
  groupedFulfilledProducts: GroupedFulfilledProducts;
}

export default function AllFulfilled({
  data,
  groupedFulfilledProducts,
}: iAppProps) {
  const totalItems = data?.products.reduce((total: number, product: any) => {
    return total + product.quantity;
  }, 0);

  return (
    <div className="grid grid-cols-3 gap-6">
      <div className="col-span-2 space-y-6">
        {Object.keys(groupedFulfilledProducts).length === 0 ? (
          <p>No fulfilled products</p>
        ) : (
          Object.keys(groupedFulfilledProducts).map((date) => {
            // Calculăm totalul de fulfilledQuantity și quantity pentru fiecare dată
            const totalFulfilled = groupedFulfilledProducts[date].reduce(
              (acc, product) => acc + (product.fulfilledQuantity || 0),
              0
            );
            // const totalQuantity = groupedFulfilledProducts[date].reduce(
            //   (acc, product) => acc + (product.quantity || 0),
            //   0
            // );
            return (
              <Card key={date} className="px-4 pb-4">
                <CardHeader className="p-0 py-4 text-sm font-light">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={"bg-green-300 py-1 px-2 rounded-md"}>
                        Fulfilled ({totalFulfilled})
                      </div>
                      <span className="ml-4">#{data?.orderNumber}</span>
                    </div>
                   
                  </div>
                </CardHeader>

                <CardContent className="border rounded-sm pt-2">
                  <div className="mb-4 text-sm">
                    <p className="text-gray-600 p-0">Fulfilled</p>
                    <p className="p-0">{date}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 p-0">Delivery method</p>
                    <p className="p-0">Standard</p>
                  </div>
                  <Separator className="mt-4" />
                  <div>
                    {groupedFulfilledProducts[date].map((product, index) => (
                      <Fragment key={index}>
                        <div className="mt-4 flex gap-4">
                          <div className="aspect-1 border rounded-sm overflow-hidden flex-shrink-0 w-1/12 relative">
                            <Image
                              src={product.productImage}
                              fill
                              alt={product.productName}
                              className="object-cover"
                            />
                          </div>
                          <div className="flex flex-1 w-full gap-4">
                            <p className="w-1/2 font-semibold">
                              {product.productName}
                            </p>
                            <div className="w-1/4 text-center">
                              {formatCurrency(product.productPrice)} x{" "}
                              {product.fulfilledQuantity}
                            </div>
                            <div className="w-1/4 text-right">
                              {formatCurrency(
                                product.productPrice * product.fulfilledQuantity
                              )}
                            </div>
                          </div>
                        </div>
                        <Separator className="mt-4" />
                      </Fragment>
                    ))}
                  </div>
                </CardContent>
              </Card>
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
