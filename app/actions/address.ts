"use server"

import { z } from "zod";
import { AddresSchema } from "../lib/schemas/adresaSchema";
import { auth } from "@/auth";
import prisma from "../lib/db";
import { revalidatePath } from "next/cache";

export async function addAddress(values:z.infer<typeof AddresSchema>) {
  const session = await auth()
  const user = session?.user

  if(!user?.id) {
   throw new Error("Unauthorized")
  }

  const validatedFields = AddresSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { phone, strada, numar, apartament, bloc, judet, localitate, codPostal, etaj, scara } = validatedFields.data

  try {
    await prisma.address.create({
      data:{
        phone: phone,
        strada: strada,
        numar: numar,
        bloc: bloc,
        scara: scara,
        etaj: etaj,
        apartament: apartament,
        localitate: localitate,
        judet: judet,
        codPostal: codPostal,
        userId:user.id
      }
    })
  
    revalidatePath('/checkout?transport=plata');

    return { success: "Adresa a fost adaugata cu succes" }
  
  } catch (error) {
    return { error: "Something went wrong!" }
  }

}

export async function editAddress(values:z.infer<typeof AddresSchema>) {
  const session = await auth()
  const user = session?.user
  const userId = user?.id;

  if(!userId) {
   throw new Error("Unauthorized")
  }

  const validatedFields = AddresSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { phone, strada, numar, apartament, bloc, judet, localitate, codPostal, etaj, scara } = validatedFields.data

  try {

    const address = await prisma.address.findFirst({
      where: { userId: userId } // Asigură-te că `userId` există în modelul Address
    });
    
    if(address){
      await prisma.address.update({
        where:{id:address.id},
        data:{
          phone,
          strada,
          numar,
          apartament,
          bloc,
          judet,
          localitate,
          codPostal,
          etaj,
          scara
        }
      })
    }
    
    revalidatePath('/checkout?transport=plata');
  
    return { success: "Adresa a fost editata cu succes" }
  
  } catch (error) {
    return { error: "Something went wrong!" }
  }

}