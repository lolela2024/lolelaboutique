"use server"

import { redirect } from "next/dist/server/api-utils";
import prisma from "../lib/db";

export async function BuyProduct(formData: FormData) {
  const id = formData.get("id") as string;
  const data = await prisma.product.findUnique({
    where: {
      id: id,
    },
    select: {
      name: true,
      smallDescription: true,
      price: true,
      images: true,
      User: {
       
      },
    },
  });

  

  return data
}