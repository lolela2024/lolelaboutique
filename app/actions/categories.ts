"use server"

import { redirect } from "next/navigation";
import { categorySchema } from "../lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import prisma from "../lib/db";
import { utapi } from "../server/uploadthing";
import { auth } from "@/auth";

const adminEmail = process.env.ADMIN_EMAIL;

export async function createCategory(prevState: unknown, formData:FormData){
  const session = await auth()
  const user = session?.user;

  if(!user || user.email !== adminEmail) {
    redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: categorySchema
  }) 

  if(submission.status !== "success") {
    return submission.reply()
  }

  const existingCategory = await prisma.productCategory.findUnique({
    where: { slug: submission.value.slug }
  });
  
  if(existingCategory){
    throw new Error(`Slug-ul "${submission.value.slug}" este deja folosit.`)
  }

  await prisma.productCategory.create({
    data:{
      name:submission.value.name,
      slug:submission.value.slug,
      image:submission.value.image || undefined,
      description:submission.value.description || undefined,
      parentCategoryId:submission.value.parentCategoryId || undefined,
      isFeatured:submission.value.isFeatured
    }
  })

  redirect("/dashboard/categories");
}  

export async function deleteCategory(formData: FormData) {
  const session = await auth()
  const user = session?.user;

  if (!user || user.email !== adminEmail) {
    return redirect("/");
  }

  const idCategory = parseFloat(formData.get("productId") as string)

  const category = await prisma.productCategory.findUnique({
    where:{id:idCategory },
    select:{image:true}
  }) 

  const image = category?.image as string;

  if(image){
    const imageKey = image.split('/f/')[1];

    if(imageKey) {
      await utapi.deleteFiles(imageKey);
    }
  }
  

  await prisma.productCategory.delete({
    where: {
      id: idCategory,
    },
  });

  redirect("/dashboard/categories");
}

export async function editCategory(prevState: any, formData: FormData) {
  const session = await auth()
  const user = session?.user;

  if (!user || user.email !== adminEmail) {
    return redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: categorySchema,
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  const categoryId = formData.get("categoryId") as string;


  await prisma.productCategory.update({
    where: {
      id: parseFloat(categoryId),
    },
    data: {
      name: submission.value.name,
      slug: submission.value.slug,
      description: submission.value.description,
      image: submission.value.image,
      parentCategoryId: submission.value.parentCategoryId
    },
  });

  redirect("/dashboard/categories");
}
