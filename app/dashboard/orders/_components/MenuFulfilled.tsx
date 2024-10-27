"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Ellipsis } from "lucide-react";
import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Fulfilled } from "@prisma/client";
import jsPDF from 'jspdf';
import { fulfilledDelete } from "@/app/actions/fulfilled";

export default function MenuFulfilled({
  fulfillmentId,
  order,
  totalFulfilled
}: {
  fulfillmentId: string;
  order: any;
  totalFulfilled : number;
}) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");
  const [open, setOpen] = useState(false)

  const router = useRouter();

  const orderId = order.id;

  const generatePackingSlip = (order:any) => {
    console.log(order)
    const doc = new jsPDF();
  
    doc.setFontSize(20);
    doc.text("Packing Slip", 10, 10);
    
    doc.setFontSize(12);
    doc.text(`Order Number: ${order.orderNumber}`, 10, 20);
    doc.text(`Fulfillment ID: ${order.fulfillmentId}`, 10, 30);
    doc.setFontSize(12);
    doc.text(`Address: ${order.shippingAddress.localitate}`,10,40)
    
    let y = 50;
    order.products?.forEach((product:any) => {
      doc.text(`${product.Product.name} - Qty: ${product.fulfilledQuantity}`, 10, y);
      y += 10;
    });

   
    
    doc.save(`PackingSlip_${order.orderNumber}.pdf`);
  };

  const cancelFulfillment = () => {
    setError("");
    setSuccess("");

    startTransition(() => {
      fulfilledDelete(fulfillmentId, totalFulfilled, orderId).then((data) =>{
        setError(data?.error);
        setSuccess(data?.success);
        setOpen(false)
      })
    })
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size={"sm"}>
          <Ellipsis />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="justify-start w-[200px]" align="end">
        <Button variant="ghost" size={"sm"} className="w-full justify-start" onClick={()=>generatePackingSlip(order)}>
          Print packing slip
        </Button>
        <form onSubmit={cancelFulfillment}>
          <Button
            variant="destructive"
            size={"sm"}
            type="submit"
            className="w-full justify-start text-red-600 bg-transparent hover:bg-red-200"
            
          >
            Cancel fulfillment
          </Button>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
