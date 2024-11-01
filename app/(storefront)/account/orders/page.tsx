import React from "react";
import FooterAccount from "../_components/FooterAccount";
import IstoricComenzi from "../_components/IstoricComenzi";
import { auth } from "@/auth";
import prisma from "@/app/lib/db";
import { unstable_noStore } from "next/cache";

async function getData(userId: string) {
  const order = await prisma.order.findMany({
    where: { userId: userId },
    select: {
      shippingAddress: true,
      createdAt:true,
      status:true,
      id:true,
      orderNumber:true,
      amount:true,
      fulfilled: true
    },
    orderBy:{createdAt:"desc"}
  });

  const adresaDeLivrare = await prisma.address.findFirst({
    where:{userId}
  })



  return {order, adresaDeLivrare};
}

export default async function OrdersPage() {
  unstable_noStore();
  const session = await auth();
  const user = session?.user;

  const data = await getData(user?.id as string);

  return (
    <div className="space-y-4">
      <h1 className="text-lg lg:text-2xl font-semibold uppercase">
        ISTORIA COMENZILOR
      </h1>
      <p className="font-medium">
        Aici vezi comenzile facute de tine de la crearea contului.
      </p>
      {data.order.length>0 ? (
         <IstoricComenzi order={data.order} adresaDeLivrare={data.adresaDeLivrare}/>
      ) : (
        <div className="py-4">
          <h1 className="font-semibold">Pana acum nu ai facut nici o comanda.</h1>
        </div>
      )}
     
      <FooterAccount />
    </div>
  );
}
