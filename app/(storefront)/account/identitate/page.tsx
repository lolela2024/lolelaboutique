import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import InformatiiForm from "../_components/InformatiiForm";
import prisma from "@/app/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FooterAccount from "../_components/FooterAccount";
import { unstable_noStore } from "next/cache";

async function getData(email: string) {
  const data = await prisma.user.findUnique({
    where: { email: email },
  });

  return data;
}

export default async function IdentitatePage() {
  unstable_noStore();
  const session = await auth();
  const user = session?.user;

  if (!user || !user.email) {
    redirect("/");
  }
  
  const data = await getData(user?.email);

  return (
    <div className="space-y-6">
      <h1 className="text-lg lg:text-2xl font-semibold mb-4">
        INFORMATIILE TALE PERSONALE
      </h1>
      <Card className="shadow-lg">
        <CardContent className="py-4">
          <InformatiiForm user={data} />
        </CardContent>
      </Card>

      <FooterAccount />
    </div>
  );
}
