"use server"

import { OrderStatus } from "@prisma/client";
import prisma from "../lib/db";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
     // Actualizează mai întâi statusul comenzii
     const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        products: true,  // Include produsele asociate comenzii
      },
    });

    // // Verifică dacă statusul este "completed" înainte de a actualiza inventarul
    // if (status === "completed") {
    //   // Inițiază o tranzacție pentru a actualiza committed în inventar
    //   await prisma.$transaction(async (tx) => {
    //     // Actualizează committed în inventar pentru fiecare produs din comanda respectivă
    //     const inventoryUpdates = updatedOrder.products.map((product) =>
    //       tx.inventory.updateMany({
    //         where: { product: { id:product.productId } },  // Folosește id-ul produsului pentru actualizare
    //         data: {
    //           committed: {
    //             decrement: product.quantity,  // Dacă folosești o pivot table, accesează cantitatea prin relația pivot
    //           },
    //         },
    //       })
    //     );

    //     // Așteaptă să se finalizeze toate actualizările în inventar
    //     await Promise.all(inventoryUpdates);
    //   });
    // }
    

    // const updatedOrder = await prisma.order.update({
    //   where: { id: orderId },
    //   data: { status },
    // });

    revalidatePath(`/dashboard/orders/${orderId}`)

    return updatedOrder;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw new Error('Could not update order status');
  }
}