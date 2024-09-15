"use server"

import { OrderStatus } from "@prisma/client";
import prisma from "../lib/db";

export async function updateOrderStatus(orderId: string, status: OrderStatus) {
  try {
    const updatedOrder = await prisma.order.update({
      where: { id: orderId },
      data: { status },
    });
    return updatedOrder;
  } catch (error) {
    console.error('Failed to update order status:', error);
    throw new Error('Could not update order status');
  }
}