"use client";

import { Button } from "@/components/ui/button";
import { Order } from "@prisma/client";
import { ArrowLeft, Dot } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";

interface HeaderMenuProps {
  orderNumer: number | undefined;
  status: string | undefined;
  fulfilled: string | undefined;
  createdAt: Date | undefined;
}


export default function HeaderMenu({
  orderNumer,
  status,
  fulfilled,
  createdAt,
}: HeaderMenuProps) {
  const { push } = useRouter();

  const formattedDate = createdAt
  ? new Intl.DateTimeFormat("ro-RO", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }).format(new Date(createdAt))
  : "Data indisponibilă";
  
  return (
    <div className="flex items-center justify-between">
      <div className="mb-4">
        <div className=" flex items-center">
          <Button
            variant={"ghost"}
            size={"sm"}
            onClick={() => push("/dashboard/orders")}
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <p>#{orderNumer}</p>
          <div className="ml-4 space-x-1 flex items-center text-xs">
            <span className="flex items-center bg-[#e3e3e3] px-2 rounded-lg">
              <Dot className="" />
              <span className="capitalize">{status}</span>
            </span>
            <span className="flex items-center bg-[#e3e3e3] px-2 rounded-lg">
              <Dot className="" />
              <span>{fulfilled}</span>
            </span>
          </div>
        </div>
        <span className="text-xs ml-10">
          {formattedDate}
        </span>
      </div>

      <div className="space-x-2">
        <Button variant={"secondary"} size={"sm"}>
          Refund
        </Button>
        <Button variant={"secondary"} size={"sm"}>
          Return
        </Button>
      </div>
    </div>
  );
}
