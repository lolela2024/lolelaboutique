"use server"

import { z } from "zod"
import { fulfilledSchema } from "../lib/schemas/fulfilledSchemas"
import prisma from "../lib/db"
import { OrderProduct } from '@prisma/client';
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";

function generateFulfillmentId(orderId:string) {
  const randomSuffix = Math.random().toString(36).substring(2, 5).toUpperCase(); // Generează un sufix aleator
  return `${orderId}-${randomSuffix}`;
}

export const fulfilled = async (values:z.infer<typeof fulfilledSchema>,quantities:any)  => {
  
  const validatedFields = fulfilledSchema.safeParse(values)

  if(!validatedFields.success) {
    return { error: "Invalid fields"}
  }



  const {notifyCustomerOfShipment, shippingCarrier, trackingNumber, orderId} = validatedFields.data

  try {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        orderNumber: true,
        products: {
          include: {
            Product: true,
            Fulfillments: true,
          },
        },
      },
    });

  
  
    const orderProducts = await prisma.orderProduct.findMany({
      where: { orderId },
      include: {
        Fulfillments: true,
      },
    });

    if (!order) {
      return { error: "Order not found" };
    }

    const newFulfillmentId = generateFulfillmentId(String(order?.orderNumber));

    let totalOrderQuantity = orderProducts.reduce(
      (acc, product) => acc + product.quantity,
      0
    );
    let totalFulfilledQuantity = 0;
    let hasUnfulfilledProducts = false;

    for (const product of orderProducts) {
      const newFulfilledQuantity = quantities[product.id] || 0;
      const previouslyFulfilledQuantity = product.Fulfillments.reduce(
        (acc, fulfillment) => acc + (fulfillment.fulfilledQuantity || 0),
        0
      );

      // Calculăm cantitatea totală îndeplinită
      totalFulfilledQuantity += newFulfilledQuantity + previouslyFulfilledQuantity;

      // Setează `hasUnfulfilledProducts` dacă produsul nu este complet îndeplinit
      if ((newFulfilledQuantity + previouslyFulfilledQuantity) < product.quantity) {
        hasUnfulfilledProducts = true;
      }

      if (newFulfilledQuantity > 0) {
        await prisma.fulfillment.create({
          data: {
            orderProductId: product.id,
            fulfilledQuantity: newFulfilledQuantity,
            trackingNumber,
            shippingCarrier,
            newFulfillmentId: newFulfillmentId,  // Schimbă dacă este nevoie
          },
        });
  
        await prisma.orderProduct.update({
          where: { id: product.id }, // Corectare aici pentru a actualiza produsul
          data: {
            fulfilledQuantity: newFulfilledQuantity + previouslyFulfilledQuantity,
          },
        });
      }
      
    }
  
    await prisma.order.update({
      where: { id: orderId },
      data: {
        fulfilled: totalFulfilledQuantity === 0
          ? "Unfulfilled"
          : hasUnfulfilledProducts
          ? "PartialFulfilled"
          : "Fulfilled",
      },
    });

    revalidatePath(`/dashboard/orders/${orderId}`);

    return { success: "Fulfillment successful" };
    
  } catch (error) {
    console.error("Error fulfilling order:", error);
    return { error: "An error occurred" };
  }
}

export const fulfilledDelete = async (newFulfillmentId:string, totalFulfilled:number, orderId:string) => {
  try {
    // Găsim toate fulfillment-urile cu newFulfillmentId specificat
    const fulfillments = await prisma.fulfillment.findMany({
      where: { newFulfillmentId },
    });

    // Obținem cantitățile îndeplinite pentru actualizare
    const quantitiesToReduce = fulfillments.map(f => f.fulfilledQuantity || 0);

     // Dacă există fulfillment-uri, actualizăm OrderProduct
     if (quantitiesToReduce.length > 0) {
      // Obținem id-urile OrderProduct-urilor corespunzătoare
      const orderProductIds = fulfillments.map(f => f.orderProductId);
      
       // Actualizăm fulfilledQuantity pentru fiecare OrderProduct
       await Promise.all(orderProductIds.map(async (id, index) => {
        const fulfilledQuantityToReduce = quantitiesToReduce[index];
        
        await prisma.orderProduct.update({
          where: { id },
          data: {
            fulfilledQuantity: {
              decrement: fulfilledQuantityToReduce, // Scădem cantitatea
            },
          },
        });
      }));

      // Verificăm statusul comenzii și actualizăm Order
      const id = fulfillments[0].orderProductId; // Presupunem că OrderProduct-urile au același orderId
      const orderProducts = await prisma.orderProduct.findMany({
        where: { id },
      });

      let totalOrderQuantity = 0;
      let totalFulfilledQuantity = 0;

      for (const product of orderProducts) {
        totalOrderQuantity += product.quantity;
        totalFulfilledQuantity += product.fulfilledQuantity || 0;
      }

      
      
      console.log("totalOrderQuantity",totalOrderQuantity,"totalFulfilledQuantity",totalFulfilledQuantity)

      // Actualizăm statusul comenzii în baza de date
      await prisma.order.update({
        where: { id: orderId },
        data: { 
          fulfilled: totalFulfilledQuantity === 0 
            ? "Unfulfilled" 
            : totalFulfilledQuantity < totalOrderQuantity 
            ? "PartialFulfilled" 
            : "Fulfilled", // Aici este actualizarea
        },
      });
    
     }

    // Ștergem fulfillment-urile
    await prisma.fulfillment.deleteMany({
      where: { newFulfillmentId },
    });

    revalidatePath(`/dashboard/orders/${orderId}`);

    return { success: "Fulfillment entries and related OrderProducts updated successfully." };
  } catch (error) {
    console.error("Error deleting fulfillments:", error);
    return { error: "An error occurred while deleting fulfillments." };
  }
}