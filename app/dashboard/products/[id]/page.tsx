import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { unstable_noStore as noStore } from "next/cache";
import { EditForm } from "@/app/components/dashboard/EditForm";

async function getData(productId: string) {
  const product = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    include: {
      productCategory: true,
      material: true,
    },
  });

  if (!product) {
    return notFound();
  }

  const categories = await prisma.productCategory.findMany({
    select: {
      name: true,
      id: true,
      slug: true,
    },
  });

  const tipMaterial = await prisma.material.findMany();

  return { product, categories, tipMaterial };
}

export default async function EditRoute({
  params,
}: {
  params: { id: string };
}) {
  noStore();
  const data = await getData(params.id);

  // console.log(data)
  // return <div>sdsd</div>
  return (
    <EditForm
      data={data.product as any}
      categories={data.categories}
      tipMaterial={data.tipMaterial}
    />
  );
}
