import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import EditFormCategory from "@/app/components/dashboard/EditFormCategory";


async function getData(categoryId: number) {
  const data = await prisma.productCategory.findUnique({
    where: {
      id: categoryId,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function EditRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();

  const categoryId = parseFloat(params.id)

  const data = await getData(categoryId);

  return <EditFormCategory data={data} />;
}