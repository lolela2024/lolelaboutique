import React from "react";
import FooterAccount from "../_components/FooterAccount";
import IstoricComenzi from "../_components/IstoricComenzi";
import { auth } from "@/auth";
import prisma from "@/app/lib/db";
import { unstable_noStore } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.order.findMany({
    where: { userId: userId },
  });

  return data;
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
      {data.length>0 ? (
         <IstoricComenzi />
      ) : (
        <div className="py-4">
          <h1 className="font-semibold">No orders found!</h1>
        </div>
      )}
     
      <FooterAccount />
    </div>
  );
}
