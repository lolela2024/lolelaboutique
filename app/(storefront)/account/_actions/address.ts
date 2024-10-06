"use server"

import prisma from "@/app/lib/db"
import { AddresSchema } from "@/app/lib/zodSchemas"
import { auth } from "@/auth"
import { error } from "console"
import { redirect } from "next/navigation"
import * as z from "zod"

export async function addAddress (values:z.infer<typeof AddresSchema>) {
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
  
    return { success: "Adresa a fost adaugata cu succes" }
  
  } catch (error) {
    return { error: "Something went wrong!" }
  }
}

export async function deleteAddress(addressId:number) {
  try {
    await prisma.address.deleteMany({
      where:{id:addressId}
    })
    
  } catch (error) {
    return {error: "Something went wrong!"}
  }
  

  return {success: "Adresa a fost stearsa cu succes"}
}