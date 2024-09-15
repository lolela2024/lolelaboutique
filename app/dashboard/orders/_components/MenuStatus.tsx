"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { DropdownMenuLabel } from "@/components/ui/dropdown-menu";
import { OrderStatus, Order } from "@prisma/client";
import { updateOrderStatus } from "@/app/actions/orders";

export default function MenuStatus({
  orderId,
}: {
  orderId: string | undefined;
}) {
  const [orderStatus, setOrderStatus] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

 

  async function handleSubmit(status: OrderStatus) {
    setOrderStatus(status);

    try {
      await updateOrderStatus(orderId as string, status);
      setIsMenuOpen(false)
      window.location.reload();
      console.log("Order status updated to:", status);
    } catch (error) {
      console.error("Error updating order status:", error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"} onClick={()=>setIsMenuOpen(!isMenuOpen)}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="justify-start" align="end">
        <DropdownMenuLabel>Order Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <div className="flex flex-col">
          <Button
            onClick={() => handleSubmit(OrderStatus.pending)}
            variant="ghost"
            size={"sm"}
            className="justify-start"
          >
            Pending
          </Button>
          <Button
            onClick={() => handleSubmit(OrderStatus.completed)}
            variant="ghost"
            size={"sm"}
            className="justify-start"
          >
            Completed
          </Button>
          <Button
            onClick={() => handleSubmit(OrderStatus.cancelled)}
            variant="ghost"
            size={"sm"}
            className="justify-start"
          >
            Cancelled
          </Button>
          <Button
            onClick={() => handleSubmit(OrderStatus.refunded)}
            variant="ghost"
            size={"sm"}
            className="justify-start"
          >
            Refunded
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
