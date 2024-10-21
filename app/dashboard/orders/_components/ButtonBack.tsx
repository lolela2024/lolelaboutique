"use client";

import React from "react";

import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ButtonBack({ orderId }: { orderId?: string }) {
  const { push } = useRouter();
  return (
    <div className="flex items-center justify-between">
      <div className="mb-4">
        <div className=" flex items-center">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => push(`/dashboard/orders/${orderId}`)}
          >
            <ArrowLeft className="w-5 h-5" />
            Fulfill items
          </Button>
        </div>
      </div>

      <div className="space-x-2">
        <Button variant={"secondary"} size={"sm"}>
          Print packing slip
        </Button>
      </div>
    </div>
  );
}
