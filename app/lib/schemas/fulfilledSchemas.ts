import * as z from 'zod';

export const fulfilledSchema = z.object({
  trackingNumber: z.string().optional(),
  shippingCarrier: z.string().optional(),
  notifyCustomerOfShipment: z.boolean().optional()
})