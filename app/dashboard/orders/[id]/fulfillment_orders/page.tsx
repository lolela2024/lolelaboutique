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

  const quantityTotal = data?.products.reduce((acc: number, product: any) =>acc + product.quantity, 0) || 0

  return (
    <>
      <ButtonBack orderId={data?.id} />
      <FulfilledForm data={data} quantityTotal={quantityTotal}/>
    </>
  );
}
