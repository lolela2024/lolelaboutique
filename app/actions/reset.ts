"use server"

import * as z from "zod";

import { generatePasswordResetToken } from "@/lib/tokens";
import { sentPasswordResetEmail } from "@/lib/mail";
import { ResetSchema } from "../lib/zodSchemas";
import { getUserByEmail } from "@/data/user";

export const reset = async ( values:z.infer<typeof ResetSchema>) => {
  const validatedFields = ResetSchema.safeParse(values);

  if(!validatedFields.success){
    return { error: "Invalid email!" }
  }

  const { email } = validatedFields.data;

  const existingUser =await getUserByEmail(email);

  if(!existingUser) {
    return { error: "Email not found!" };
  }

  const passwordResetToken = await generatePasswordResetToken(email);
  await sentPasswordResetEmail(passwordResetToken.email,passwordResetToken.token)


  return { success: "Reset email sent!" }

}