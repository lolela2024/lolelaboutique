"use server"

import { parseWithZod } from "@conform-to/zod"
import { newsletterSchema } from "../lib/zodSchemas"
import prisma from "../lib/db"

export async function newsletterEmail(prevState: unknown, formData:FormData) {
  // Construct an object using `Object.fromEntries`
  const payload = Object.fromEntries(formData);
  const result = newsletterSchema.safeParse(payload);

  const submission = parseWithZod(formData, {
    schema: newsletterSchema
  })  

  if(submission.status !== "success") {
    return submission.reply()
  }

  const existingEmail = await prisma.newsletter.findUnique({
    where:{email:submission.value.email}
  })


  if (existingEmail) {
   
    return submission.reply({
      formErrors: [" este deja înregistrat."],
    });
  }

  try {
    await prisma.newsletter.create({
      data:{
        email:submission.value.email
      }
    })

    return submission.reply({
      formErrors: [" este deja înregistrat."],
    });

  } catch (error) {
    console.log(error)
  }
 

}