"use server"

import * as z from "zod";

import { MaterialCreateSchema, MaterialSchema } from "@/app/lib/zodSchemas"
import { auth } from "@/auth";
import { error } from "console";
import prisma from "@/app/lib/db";
import { redirect } from "next/navigation";

export const createMaterial = async (values:z.infer<typeof MaterialCreateSchema>) => {
  const session = await auth();
  const user = session?.user;
  const admin = user?.role === "ADMIN";

  if(!user && !admin){
    return {error: "Not authorized"}
  }
  const validatedFields = MaterialCreateSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { name, value } = validatedFields.data;

  try {
    await prisma.material.create({
      data:{
        name,
        value
      }
    })
  } catch (error) {
    return {error:"Something went wrong"+ error}
  }

  return { success: "Created successfully" }
}

export const updateMaterial = async (values:z.infer<typeof MaterialSchema>) => {
  const session = await auth();
  const user = session?.user;
  const admin = user?.role === "ADMIN";

  if(!user && !admin){
    return {error: "Not authorized"}
  }
  const validatedFields = MaterialSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { name, value, id } = validatedFields.data;

  try {
    await prisma.material.update({
      where:{id},
      data:{
        name,
        value
      }
    })
  } catch (error) {
    return {error:"Something went wrong"+ error}
  }

  return { success: "Updated successfully" }
}

export const deleteMaterial = async (formData:FormData) => {
  const session = await auth()
  const user = session?.user

  if (!user || user.role !== "ADMIN") {
    return redirect("/");
  }

  await prisma.material.delete({
    where:{id: parseFloat(formData.get("materialId") as string)}
  })

  redirect("/dashboard/material");

}