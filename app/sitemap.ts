import { MetadataRoute } from "next";
import prisma from "./lib/db";

async function getData() {
  const data = await prisma.product.findMany();

  return data;
}

export default async function sitemap():Promise<MetadataRoute.Sitemap>{
  const products = await getData();

  const productEntries : MetadataRoute.Sitemap = products.map(({slug,updatedAt})=>({
    url: `${process.env.NEXT_PUBLIC_BASE_URL}/product/${slug}`,
    lastModified: new Date(updatedAt)
  }))

  return [
    {
      url:`${process.env.NEXT_PUBLIC_BASE_URL}/about`
    },
    ...productEntries
  ]
}