import CreateProductForm from "@/app/components/dashboard/CreateProductForm";
import prisma from "@/app/lib/db";

async function getData() {
  const data = await prisma.productCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  return data;
}

export default async function ProductCreateRoute() {
  const data = await getData();

  return <CreateProductForm data={data} />;
}
