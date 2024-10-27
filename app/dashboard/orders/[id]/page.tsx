import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { Fragment } from "react";
import MenuFulfilled from "../_components/MenuFulfilled";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatCurrency } from "../../../lib/formatters";
import MenuCustomer from "../_components/MenuCustomer";
import { OrderStatus, Fulfilled } from "@prisma/client";
import HeaderMenu from "../_components/HeaderMenu";
import MenuStatus from "../_components/MenuStatus";
import { Button } from "@/components/ui/button";
import { unstable_noStore } from "next/cache";
import Link from "next/link";
import {
  checkFulfillmentStatus,
  cn,
  getOrderFulfillmentDetails2,
} from "@/lib/utils";
import AllFulfilled from "../_components/AllFulfilled";
import PartiallyFulfilled from "../_components/PartiallyFulfilled";
import Unfulfilled from "../_components/Unfulfilled";
import { fulfilled } from "../../../actions/fulfilled";
import { Product } from "../../../components/storefront/ProductFilter";
import CardProducts from "../_components/CardProducts";
import CardFulfilledProducts from "../_components/CardProducts";
import Payment from "../_components/Payment";
import DateLivrare from "../_components/DateLivrare";

async function getData(id: string) {
  const data = await prisma.order.findUnique({
    where: { id },
    include: {
      shippingAddress: true,
      adresaFacturare: true,
      dateFacturare: true,
      User: true,
      Customer: true,
      _count: {
        select: {
          products: true,
        },
      },
      products: {
        include: {
          Product: true,
          Fulfillments: true,
        },
      },
    },
  });

  return data;
}

type FulfilledProduct = {
  productName: string;
  fulfilledQuantity: number;
  totalQuantity: number;
};

type GroupedFulfilledProducts = {
  [key: string]: FulfilledProduct[];
};

export default async function EditOrder({
  params,
}: {
  params: { id: string };
}) {
  unstable_noStore();
  const data = await getData(params.id);

  const totalItems = data?.products.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

  const showOrderDetails2 = await getOrderFulfillmentDetails2(params.id);
  const groupedFulfilledProducts = showOrderDetails2.groupedByFulfillmentId;
  const groupedUnfulfilledProducts = showOrderDetails2.unfulfilledProducts;
  
  return (
    <>
      <HeaderMenu
        orderNumer={data?.orderNumber}
        status={data?.status}
        fulfilled={data?.fulfilled}
        createdAt={data?.createdAt}
      />
      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          {Object.keys(groupedFulfilledProducts).length > 0 &&
            Object.keys(groupedFulfilledProducts).map((fulfillmentId) => {
              // Calculăm totalul de fulfilledQuantity și quantity pentru fiecare dată
              const totalFulfilled = groupedFulfilledProducts[
                fulfillmentId
              ].products.reduce(
                (acc, product) => acc + (product.fulfilledQuantity || 0),
                0
              );

              return (
                <Card className="px-4 pb-4" key={fulfillmentId}>
                  <CardHeader className="p-0 py-4 text-sm font-light">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={"bg-green-300 py-1 px-2 rounded-md"}>
                          Fulfilled ({totalFulfilled})
                        </div>
                        <span className="ml-4">#{fulfillmentId}</span>
                      </div>
                      <MenuFulfilled
                        fulfillmentId={fulfillmentId}
                        totalFulfilled={totalFulfilled}
                        order={data}

                      />
                    </div>
                  </CardHeader>
                  <CardContent className="border rounded-sm pt-2">
                    <div className="mb-4 text-sm">
                      <p className="text-gray-600 p-0">Fulfilled</p>
                      <p className="p-0">
                        {groupedFulfilledProducts[fulfillmentId].date}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600 p-0">Delivery method</p>
                      <p className="p-0">Standard</p>
                    </div>
                    <Separator className="mt-4" />
                    <div>
                      {groupedFulfilledProducts[fulfillmentId].products.map(
                        (product, index) => (
                          <CardProducts key={index} product={product} />
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          {Object.keys(groupedUnfulfilledProducts).length > 0 &&  groupedUnfulfilledProducts.Unfulfilled.products.length >0 &&
            Object.keys(groupedUnfulfilledProducts).map((unfulfilled) => {
              // Calculăm totalul de fulfilledQuantity și quantity pentru fiecare dată
              const totalUnfulfilled =
                groupedUnfulfilledProducts.Unfulfilled.products.reduce(
                  (acc, product) => acc + (product.unfulfilledQuantity || 0),
                  0
                );

              return (
                <Card className="px-4 pb-4" key={unfulfilled}>
                  <CardHeader className="p-0 py-4 text-sm font-light">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className={"bg-yellow-300 py-1 px-2 rounded-md"}>
                          {unfulfilled} ({totalUnfulfilled})
                        </div>
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
                      {groupedUnfulfilledProducts.Unfulfilled.products.map(
                        (product, index) => (
                          <CardProducts key={index} product={product} />
                        )
                      )}
                    </div>
                    <div className="flex items-center justify-end mt-4">
                      
                        <Link
                          href={`/dashboard/orders/${data?.id}/fulfillment_orders`}
                        >
                          <Button variant={"dashboard"} size={"sm"}>
                            Fulfill item
                          </Button>
                        </Link>
                    
                    </div>
                  </CardContent>
                </Card>
              );
            })}

          <Payment data={data} />
        </div>

        <div className="col-span-1">
          <DateLivrare data={data} />
        </div>
      </div>
    </>
  );
}
