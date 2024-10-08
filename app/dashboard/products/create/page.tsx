import CreateProductForm from "@/app/components/dashboard/CreateProductForm";
import prisma from "@/app/lib/db";

async function getData() {
  const productCategories = await prisma.productCategory.findMany({
    select: {
      id: true,
      name: true,
      slug: true,
    },
  });

  const tipBijuterie = await prisma.material.findMany();

  const tags = await prisma.tag.findMany();

  const data = {
    productCategories,
    tipBijuterie,
    tags
  }

  return data;
}



export default async function ProductCreateRoute() {
  const data = await getData();
 
  return <CreateProductForm productCategories={data.productCategories} tipBijuterie={data.tipBijuterie} tags={data.tags}/>;
}
