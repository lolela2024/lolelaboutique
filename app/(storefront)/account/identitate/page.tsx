import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import InformatiiForm from "../_components/InformatiiForm";
import prisma from "@/app/lib/db";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import FooterAccount from "../_components/FooterAccount";

async function getData(email: string) {
  const data = await prisma.user.findUnique({
    where: { email: email },
  });

  return data;
}

export default async function IdentitatePage() {
  const session = await auth();
  const user = session?.user;

  const data = await getData(user?.email as string);

  if (!user) {
    redirect("/");
  }

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
