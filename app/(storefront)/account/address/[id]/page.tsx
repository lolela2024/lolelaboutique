import React from "react";
import EditAddressForm from "../../_components/EditAddressForm";
import prisma from "@/app/lib/db";
import { auth } from "@/auth";
import { unstable_noStore } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.address.findFirst({
    where: { userId: userId },
  });

  return data;
}

export default async function EditPage() {
  unstable_noStore();
  const session = await auth();
  const user = session?.user;

  const data = await getData(user?.id as string);

  return (
    <div>
      <h1 className="uppercase font-semibold mb-2">
        Editeaza ADRESA DE LIVRARE
      </h1>
      <EditAddressForm data={data} />
    </div>
  );
}
