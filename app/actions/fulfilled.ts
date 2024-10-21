"use server"

import { z } from "zod"
import { fulfilledSchema } from "../lib/schemas/fulfilledSchemas"

export const fulfilled = async (values:z.infer<typeof fulfilledSchema>)  => {
  const validatedFields = fulfilledSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }

  const {notifyCustomerOfShipment, shippingCarrier, trackingNumber} = validatedFields.data

  try {
    return { success: "Success!" }
  } catch (error) {
    console.log(error)
    return {error: "Something went wrong"}
  }
}