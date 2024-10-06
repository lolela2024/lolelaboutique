"use server"

import prisma from "@/app/lib/db"
import { informatiiSchema } from "@/app/lib/zodSchemas"
import { auth } from "@/auth"
import { parseWithZod } from "@conform-to/zod"
import bcrypt from 'bcryptjs';
import { error } from "console"
import { z } from "zod"


// Verifică parola actuală
async function verifyPassword(inputPassword: string, hashedPassword: string) {
  const isMatch = await bcrypt.compare(inputPassword, hashedPassword);
  return isMatch;
}

// Schimbă parola
async function changePassword(userId: string, newPassword: string) {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

  // Actualizează parola în baza de date
  await prisma.user.update({
    where: { id: userId },
    data: { password: hashedPassword },
  });
}

export async function informatiiUpdate(values:z.infer<typeof informatiiSchema>) {
  const session = await auth()
  const user = session?.user

  if(!user?.id) {
   throw new Error("Unauthorized")
  }

  const validatedFields = informatiiSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { email, password, gender, newPassword, firstName, lastName } = validatedFields.data

  // Dacă parola curentă este corectă, setează noua parolă
  if(newPassword){
    const isPasswordCorrect = await verifyPassword(password, user.password);
    if (!isPasswordCorrect) {
      return {error: "Parola curentă este incorectă"};
    }
    try {
      await changePassword(user.id, newPassword);
      return {success: 'Parola a fost schimbată cu succes!'};
    } catch (error) {
      return {error: "Something went wrong!"};
    }
    
  }

  await prisma.user.update({
    where:{id:user.id},
    data:{
      gender:gender,
      firstName:firstName,
      lastName:lastName,
      email:email,
    }
  })
  
  return { success: "Actualizat cu succes!" }
}