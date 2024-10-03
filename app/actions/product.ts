"use server"
import { redirect } from "next/navigation";
import { parseWithZod } from '@conform-to/zod';
import { productSchema } from '../lib/zodSchemas';
import prisma from "../lib/db";
import { utapi } from "../server/uploadthing";
import { auth } from "@/auth";


export async function createProduct(prevState: unknown, formData:FormData) {
  const session = await auth()
  const user = session?.user

  if(!user || user.role !== "ADMIN") {
    redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchema
  })  

  if(submission.status !== "success") {
    return submission.reply()
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  let discountAmount = 0;
  let discountPercentage = 0;

  if (submission.value.salePrice) {
    discountAmount = submission.value.price - submission.value.salePrice 
    discountPercentage = Math.round(discountAmount / submission.value.price * 100)
  }

  

  const description = submission.value.description;

  


  await prisma.product.create({
    data: {
      name: submission.value.name,
      description:JSON.parse(JSON.stringify(description)) ,
      status: submission.value.status,
      price: submission.value.salePrice ? submission.value.salePrice : submission.value.price,
      discountAmount: submission.value.salePrice ? discountAmount : undefined,
      discountPercentage: submission.value.salePrice ?  discountPercentage : undefined,
      originalPrice: submission.value.salePrice ? submission.value.price : undefined,
      images: flattenUrls,
      productCategoryId: submission.value.productCategoryId,
      isFeatured: submission.value.isFeatured === true ? true : false,
      smallDescription:submission.value.smallDescription,
     
    },
  });

  redirect("/dashboard/products");

}

export async function editProduct(prevState: any, formData: FormData) {
  const session = await auth()
  const user = session?.user

  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: productSchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const flattenUrls = submission.value.images.flatMap((urlString) =>
    urlString.split(",").map((url) => url.trim())
  );

  const productId = formData.get("productId") as string;

  let discountAmount = 0;
  let discountPercentage = 0;

  if (submission.value.salePrice) {
    discountAmount = submission.value.price - submission.value.salePrice 
    discountPercentage = Math.round(discountAmount / submission.value.price * 100)
  }

  
  
  await prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      name: submission.value.name,
      description:JSON.parse(JSON.stringify(submission.value.description) ),
      smallDescription: submission.value.smallDescription,
      productCategoryId: submission.value.productCategoryId,
      price: submission.value.salePrice ? submission.value.salePrice : submission.value.price,
      discountAmount: submission.value.salePrice ? discountAmount : undefined,
      discountPercentage: submission.value.salePrice ? discountPercentage : undefined,
      originalPrice: submission.value.salePrice ? submission.value.price : undefined,
      isFeatured: submission.value.isFeatured === true,
      status: submission.value.status,
      images: flattenUrls,
    },
  });

  redirect("/dashboard/products");
}

export async function deleteProduct(formData: FormData) {
  const session = await auth()
  const user = session?.user

  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }

  const product = await prisma.product.findUnique({
    where:{id:formData.get("productId") as string},
    select:{images:true}
  }) 

  const images = product?.images || [];

  // Extrage `imageKey` pentru fiecare imagine
  const imageKeys = images.map(image => image.split('/f/')[1]);

  if(imageKeys) {
    await utapi.deleteFiles(imageKeys);
  }

  await prisma.product.delete({
    where: {
      id: formData.get("productId") as string,
    },
  });

  redirect("/dashboard/products");
}

export async function deleteImage(image:string) {
  const imageKey = image.split('/f/')[1];
  
  try {
    await utapi.deleteFiles(imageKey);
    return {success:"Image deleted", status:200};

  } catch (error) {
    return {error:error, status:500}
  }
}

