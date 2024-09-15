"use server"



import * as z from "zod"
import bcrypt from 'bcryptjs';
import { getUserByEmail } from '../../data/user';
import { RegisterSchema } from "../lib/zodSchemas";
import prisma from "../lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { sentVerificationEmail } from "@/lib/mail";




export const register = async (values:z.infer<typeof RegisterSchema>)  => {
  const validatedFields = RegisterSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const { email, password, name } = validatedFields.data
  const hashedPassword = await bcrypt.hash(password, 10)

  const existingUser = await getUserByEmail(email);

  if( existingUser ) {
    return { error: "Email already in use!"}
  }

  await prisma.user.create({
    data:{
      name,
      email,
      password: hashedPassword
    }
  })

  const verificationToken = await generateVerificationToken(email)

  await sentVerificationEmail(verificationToken.email,verificationToken.token)

  return { success: "Confirmation email sent!" }
}