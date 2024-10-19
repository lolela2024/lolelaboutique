"use server"

import { z } from "zod";
import { FirmaSchema } from "../lib/schemas/firmaSchema";
import { auth } from "@/auth";
import prisma from "../lib/db";
import { revalidatePath } from "next/cache";

export async function addFirma(values:z.infer<typeof FirmaSchema>) {
  const session = await auth()
  const user = session?.user

  if(!user?.id) {
   throw new Error("Unauthorized")
  }

  const validatedFields = FirmaSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { cif, nrRegComert, numeFirma } = validatedFields.data

  try {
    await prisma.persoanaJuridica.create({
      data:{
        CIF:cif,
        nrRegComert,
        numeFirma,
        userId:user.id
      }
    })

    revalidatePath('/checkout?transport=plata');
  
    return { success: "Firma a fost adaugata cu succes" }
  
  } catch (error) {
    return { error: "Something went wrong!" }
  }
}

export const editDateFirma = async (values:z.infer<typeof FirmaSchema>) => {
  const session = await auth()
  const user = session?.user

  if(!user?.id) {
   throw new Error("Unauthorized")
  }

  const validatedFields = FirmaSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { numeFirma, cif, nrRegComert } = validatedFields.data

  try {
    const firma = await prisma.persoanaJuridica.findFirst({
      where:{userId:user.id}
    })
  
    if(firma){
      await prisma.persoanaJuridica.update({
        where:{id:firma.id},
        data:{
          CIF:cif,
          numeFirma,
          nrRegComert
        }
      })
    }

    revalidatePath('/checkout?transport=plata');

    return { success: "Firma a fost actualizata cu succes" }
    
    
  } catch (error) {
    return { error: "Something went wrong!" }
  }
}