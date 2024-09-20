"use server"

import prisma from "@/app/lib/db";
import { Banner } from "@/app/lib/zodSchemas";
import { auth } from "@/auth";
import { parseWithZod } from "@conform-to/zod";
import { redirect } from "next/navigation";

export async function createBanner (prevState: unknown, formData:FormData) {
  const session = await auth()
  const user = session?.user

  if(!user) {
    redirect("/");
  }

  const submission = parseWithZod(formData, {
    schema: Banner
  })  

  if(submission.status !== "success") {
    return submission.reply()
  }

  if(submission.value.id){
    await prisma.bannerTop.update({
      where:{
        id:submission.value.id
      },
      data:{
        image:submission.value.image as string,
        description:JSON.parse(JSON.stringify(submission.value.description)),
        on:submission.value.on === undefined ? false : true
      }
    })

    redirect("/dashboard/home-page")
   
  }


  await prisma.bannerTop.create({
    data:{
      image:submission.value.image as string,
      description:JSON.parse(JSON.stringify(submission.value.description)),
      on:submission.value.on === undefined ? false : true
    }
  })

  redirect("/dashboard/home-page")
}

export async function deleteImageBanner (image:string) {

}

export async function handleDeleteBanner(formData: FormData) {
  const idBanner = parseFloat(formData.get("idBanner") as string)

  await prisma.bannerTop.delete({
    where:{id:idBanner}
  })

  redirect("/dashboard")
}