import { parseWithZod } from "@conform-to/zod";
import { ceckoutSchema } from "./zodSchemas";
import prisma from "./db";

export async function updateAddress(userData:{id:string},formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.address.updateMany({
      where:{ userId: userData.id },
      data:{
        phone:submission.value.phone,
        strada:submission.value.strada,
        numar:submission.value.numar,
        bloc:submission.value.bloc,
        scara:submission.value.scara,
        etaj:submission.value.etaj,
        apartament:submission.value.apartament,
        localitate:submission.value.localitate,
        judet:submission.value.judet,
        codPostal:submission.value.codPostal,
        alteDetalii:submission.value.alteDetalii,
        userId:userData.id,
      }
    })
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}

export async function createAddress(userData:{id:string},formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.address.create({
      data:{
        phone:submission.value.phone,
        strada:submission.value.strada,
        numar:submission.value.numar,
        bloc:submission.value.bloc,
        scara:submission.value.scara,
        etaj:submission.value.etaj,
        apartament:submission.value.apartament,
        localitate:submission.value.localitate,
        judet:submission.value.judet,
        codPostal:submission.value.codPostal,
        alteDetalii:submission.value.alteDetalii,
        userId:userData.id,
      }
    })
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}

export async function createCustomerAddress(customerId:string,formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.address.create({
      data: {
        phone:submission.value.phone,
        strada:submission.value.strada,
        numar:submission.value.numar,
        bloc:submission.value.bloc,
        scara:submission.value.scara,
        etaj:submission.value.etaj,
        apartament:submission.value.apartament,
        localitate:submission.value.localitate,
        judet:submission.value.judet,
        codPostal:submission.value.codPostal,
        alteDetalii:submission.value.alteDetalii,
        customerId,
      },
    });
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}

export async function updateCustomerAddress(existingAddress:{id:number},formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.address.update({
      where: { id: existingAddress.id },
      data: {
        phone:submission.value.phone,
        strada:submission.value.strada,
        numar:submission.value.numar,
        bloc:submission.value.bloc,
        scara:submission.value.scara,
        etaj:submission.value.etaj,
        apartament:submission.value.apartament,
        localitate:submission.value.localitate,
        judet:submission.value.judet,
        codPostal:submission.value.codPostal,
        alteDetalii:submission.value.alteDetalii,
      },
    });
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}
