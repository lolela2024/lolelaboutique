import React from "react";
import EditCompanyForm from "../../../_components/EditCompanyForm";
import { auth } from "@/auth";
import prisma from "@/app/lib/db";
import { unstable_noStore } from "next/cache";

async function getData(userId: string) {
  const data = await prisma.persoanaJuridica.findFirst({
    where: { userId },
  });

  return data;
}

export default async function EditCompany() {
  unstable_noStore();
  const session = await auth();
  const user = session?.user;

  const data = await getData(user?.id as string);

  return (
    <div>
      <h1 className="uppercase font-semibold mb-2">Edit Firma</h1>
      <EditCompanyForm data={data}/>
    </div>
  );
}
