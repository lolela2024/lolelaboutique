"use server"

import prisma from "@/app/lib/db";
import { CompanySchema } from "@/app/lib/zodSchemas";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import { z } from "zod";

export async function addCompany(values:z.infer<typeof CompanySchema>) {
  const session = await auth()
  const user = session?.user

  if(!user?.id) {
   throw new Error("Unauthorized")
  }

  const validatedFields = CompanySchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { numeFirma, cif, nrRegComert } = validatedFields.data;

  try {

    await prisma.persoanaJuridica.create({
      data:{
        numeFirma,
        CIF:cif,
        nrRegComert,
        userId:user.id
      }
    })

    revalidatePath("/account/address");
    
    return { success: "Firma a fost adaugata cu succes" };
  } catch (error) {
    return {error: "Something went wrong!"}
  }
}

export async function editCompany(values:z.infer<typeof CompanySchema>,id:number) {
  const session = await auth()
  const user = session?.user

  if(!user?.id) {
   throw new Error("Unauthorized")
  }

  const validatedFields = CompanySchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { numeFirma, cif, nrRegComert } = validatedFields.data;

  try {

    await prisma.persoanaJuridica.update({
      where:{id},
      data:{
        numeFirma,
        CIF:cif,
        nrRegComert
      }
    })

    revalidatePath("/account/address");
    
    return { success: "Firma a fost editata cu succes" };
  } catch (error) {
    return {error: "Something went wrong!"}
  }
}

export async function deleteFirma(firmaId:number) {

  try {
    await prisma.persoanaJuridica.deleteMany({
      where:{id:firmaId}
    })

    revalidatePath("/account/address")
    
  } catch (error) {
    return {error: "Something went wrong!"}
  }


  return {success: "Firma a fost stearsa cu succes"}
  
}