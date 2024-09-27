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
        country:submission.value.country,
        address:submission.value.address,
        address2:submission.value.address2,
        city:submission.value.city,
        postalCode:submission.value.postalCode,
        county:submission.value.county,
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
        country:submission.value.country,
        address:submission.value.address,
        address2:submission.value.address2,
        city:submission.value.city,
        postalCode:submission.value.postalCode,
        county:submission.value.county,
        userId:userData.id,
      }
    })
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}

export async function updateBillingAddress(userData:{id:string},formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.billingAddress.updateMany({
      where:{userId: userData.id},
      data:{
        country:submission.value.countryBilling || '',
        address:submission.value.addressBilling || '',
        address2:submission.value.address2Billing,
        city:submission.value.cityBilling || '',
        postalCode:submission.value.postalCodeBilling,
        county:submission.value.countyBilling || '',
        phone:submission.value.phoneBilling || '',
        lastName:submission.value.lastNameBilling || '',
        firstName:submission.value.firstNameBilling || '',
        userId:userData.id,
        company: submission.value.companyBilling
      }
    })
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}

export async function createBillingAddress(userData:{id:string},formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.billingAddress.create({
      data:{
        country:submission.value.countryBilling || '',
        address:submission.value.addressBilling || '',
        address2:submission.value.address2Billing,
        city:submission.value.cityBilling || '',
        postalCode:submission.value.postalCodeBilling,
        county:submission.value.countyBilling || '',
        phone:submission.value.phoneBilling || '',
        lastName:submission.value.lastNameBilling || '',
        firstName:submission.value.firstNameBilling || '',
        userId:userData.id,
        company: submission.value.companyBilling
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
        country: submission.value.country,
        address: submission.value.address,
        address2: submission.value.address2 || undefined,
        postalCode: submission.value.postalCode || undefined,
        city: submission.value.city,
        county: submission.value.county,
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
        address: submission.value.address,
        address2: submission.value.address2,
        postalCode: submission.value.postalCode,
        city: submission.value.city,
        county: submission.value.county,
      },
    });
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}

export async function createCustomerBillingAddress(customerId:string,formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.billingAddress.create({
      data: {
        country: submission.value.country,
        address: submission.value.addressBilling || '',
        address2: submission.value.address2Billing || undefined,
        postalCode: submission.value.postalCodeBilling || undefined,
        city: submission.value.cityBilling || '',
        county: submission.value.countyBilling || '',
        customerId,
        firstName: submission.value.firstNameBilling || '',
        lastName: submission.value.lastNameBilling || '',
        phone: submission.value.phoneBilling || '',
      },
    });
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}

export async function updateCustomerBillingAddress(existingBillingAddress:{id:number},formData:FormData) {
  const submission = parseWithZod(formData, {
    schema: ceckoutSchema
  });

  if (submission.status !== "success") {
    return submission.reply();
  }

  try {
    await prisma.billingAddress.update({
      where: { id: existingBillingAddress.id },
      data: {
        address: submission.value.addressBilling,
        address2: submission.value.address2Billing,
        postalCode: submission.value.postalCodeBilling,
        city: submission.value.cityBilling,
        county: submission.value.countyBilling,
        firstName: submission.value.firstNameBilling,
        lastName: submission.value.lastNameBilling,
        phone: submission.value.phoneBilling,
      },
    });
  } catch (error) {
    throw new Error("Someting went wrong")
  }
}
