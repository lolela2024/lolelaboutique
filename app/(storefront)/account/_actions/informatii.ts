"use server"

import prisma from "@/app/lib/db"
import { informatiiSchema } from "@/app/lib/zodSchemas"
import { auth } from "@/auth"
import { parseWithZod } from "@conform-to/zod"

export async function informatiiUpdate(prevState: unknown,formData:FormData) {
  const session = await auth()
  const user = session?.user

  if(!user) {
   throw new Error("Unauthorized")
  }

  const submission = parseWithZod(formData, {
    schema: informatiiSchema
  }) 

  if(submission.status !== "success") {
    return submission.reply()
  }

  // let hashedPassword = undefined;

  // if(submission.value.newPassword){
  //   const password = await bcrypt.hash(submission.value.newPassword, 10) 
    
  //   return hashedPassword = password;
  // }


  await prisma.user.update({
    where:{id:user.id},
    data:{
      gender:submission.value.gender,
      name:submission.value.name,
      email:submission.value.email,
    }
  })
  
}