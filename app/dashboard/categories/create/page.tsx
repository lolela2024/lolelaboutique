
import CategoryForm from "@/app/components/form/CategoryForm";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";

async function getData() {
  const data = await prisma.productCategory.findMany({
    select:{
      id:true,
      name:true,
      slug:true
    }
  });

  return data
}

export default async function CategoryCreateRoute() {
  noStore();
  const data = await getData()

  return (
    <CategoryForm data={data}/>
  );
}
