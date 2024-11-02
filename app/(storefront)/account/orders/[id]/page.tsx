import React, { cache } from "react";
import FooterAccount from "../../_components/FooterAccount";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";
import DetaliiComanda from "../../_components/DetaliiComanda";
import DetaliiProduse from "../../_components/DetaliiProduse";

const getData = cache(async (id: string) => {
  const data = await prisma.order.findUnique({
    where: { id },
    include: {
      User: true,
      shippingAddress: true,
      products: {
        include: {
          Product: true,
          Fulfillments: true,
        },
      },
    },
  });

  return data;
});

export default async function ViewSingleOrderHistory({
  params,
}: {
  params: { id: string };
}) {
  noStore();

  const data = await getData(params.id);

  console.log(data);
  return (
    <div className="space-y-4">
      <h1 className="text-lg lg:text-2xl font-semibold uppercase">
        DETALII COMANDA #{data?.orderNumber}
      </h1>
      <DetaliiComanda data={data} />
      <DetaliiProduse data={data}/>

      <FooterAccount />
    </div>
  );
}
