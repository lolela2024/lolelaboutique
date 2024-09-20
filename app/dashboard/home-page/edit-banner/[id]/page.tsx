import React from "react";
import BannerForm from "../../_components/BannerForm";
import { unstable_noStore as noStore } from "next/cache";
import prisma from "@/app/lib/db";

async function getData(id: number) {
  const banner = await prisma.bannerTop.findUnique({
    where: {
      id: id,
    },
  });

  return banner;
}

export default async function EditBanner({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(parseFloat(params.id));
  
  return <BannerForm data={data} />;
}
