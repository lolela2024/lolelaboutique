import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { Fragment } from "react";
import HeaderMenu from "../../_components/HeaderMenu";
import { unstable_noStore } from "next/cache";
import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ButtonBack from "../../_components/ButtonBack";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import CustomImage from "@/components/CustomImage";
import ButtonAddRemoveItem from "../../_components/ButtonAddRemoveItem";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { IoMdInformationCircleOutline } from "react-icons/io";
import FulfilledForm from "../../_components/FulfilledForm";
import { fulfilled } from "../../../../actions/fulfilled";

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

export default async function FulfillmentOrders({
  params,
}: {
  params: { id: string };
}) {
  unstable_noStore();
  const data = await getData(params.id);

  if (data?.fulfilled === "Unfulfilled") {
    const quantityTotal =
      data?.products.reduce(
        (acc: number, product: any) => acc + product.quantity,
        0
      ) || 0;

    return (
      <>
        <ButtonBack orderId={data?.id} />
        <FulfilledForm
          fulfilledOrder={"Unfulfilled"}
          data={data}
          quantityTotal={quantityTotal}
          orderId={params.id}
        />
      </>
    );
  }

  if (data?.fulfilled === "PartialFulfilled") {
    // Calculăm quantityTotal ca suma fulfilledQuantity pentru produsele parțial îndeplinite
    const quantityFulfilledTotal =
      data?.products.reduce((acc: number, product: any) => {
        const fulfilledQuantitySum = product.Fulfillments.reduce(
          (sum: number, fulfillment: any) =>
            sum + (fulfillment.fulfilledQuantity || 0),
          0
        );
        return acc + fulfilledQuantitySum;
      }, 0) || 0;

    const quantity =
      data?.products.reduce(
        (acc: number, product: any) => acc + product.quantity,
        0
      ) || 0;
    const quantityTotal = quantity - quantityFulfilledTotal
    return (
      <>
        <ButtonBack orderId={data?.id} />
        <FulfilledForm
          fulfilledOrder={"PartialFulfilled"}
          data={data}
          quantityTotal={quantityTotal}
          orderId={params.id}
        />
      </>
    );
  }
}
