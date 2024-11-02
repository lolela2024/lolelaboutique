"use client"

import { Button } from "@/components/ui/button";
import { $Enums } from "@prisma/client";
import React from "react";
import { FaAnglesRight } from "react-icons/fa6";
import { formatCurrency } from "../../../lib/formatters";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface iAppProps {
  order: {
    id: string;
    status: $Enums.OrderStatus;
    createdAt: Date;
    orderNumber: number;
    amount: number;
    fulfilled: $Enums.Fulfilled;
  }[];
  adresaDeLivrare: {
    id: number;
    phone: string | null;
    strada: string;
    numar: string;
    bloc: string | null;
    scara: string | null;
    etaj: string | null;
    apartament: string | null;
    localitate: string;
    judet: string;
    codPostal: string | null;
    alteDetalii: string | null;
  } | null;
}

export default function IstoricComenzi({ order, adresaDeLivrare }: iAppProps) {
  const router = useRouter();
  let id = 0;

  return (
    <table>
      <thead className="text-xs font-light">
        <tr>
          <td className="w-[40px] px-2 py-1 bg-gray-100 ">ID</td>
          <td className="px-2 py-1 bg-gray-100">Data comanda</td>
          <td className="hidden lg:table-cell px-2 py-1 bg-gray-100 w-[200px]">
            Locatie livrare
          </td>
          <td className="text-center px-2 py-1 bg-gray-100 w-[80px]">
            Total (Lei)
          </td>
          <td className="hidden lg:table-cell px-2 py-1 text-center w-[100px] bg-gray-100">
            Nr Factura
          </td>
          <td className="hidden lg:table-cell w-[80px] px-2 py-1 bg-gray-100">
            Emisa in
          </td>
          <td className="px-2 py-1 text-center bg-gray-100">Status Comanda</td>
          <td className="px-2 py-1 w-[65px] bg-gray-100"></td>
        </tr>
      </thead>

      <tbody className="text-xs">
        {order.map((order) => {
          return (
            <tr
              key={order.id}
              className={cn(
                order.fulfilled === "Unfulfilled" && "bg-red-100",
                order.fulfilled === "PartialFulfilled" && "bg-orange-100",
                order.fulfilled === "Fulfilled" && "bg-green-100",
                "hover:bg-opacity-5"
              )}
            >
              <td className="text-center">{++id}</td>
              <td className="px-2">
                <span className="">
                  {new Intl.DateTimeFormat("ro-RO", {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(order.createdAt))}
                </span>
              </td>
              <td className="hidden lg:table-cell w-[200px]">
                <div className="w-full">
                  <span>
                    str. {adresaDeLivrare?.strada} {adresaDeLivrare?.numar},
                  </span>
                  <br />
                  <span>
                    {adresaDeLivrare?.bloc &&
                      "bl." + adresaDeLivrare.bloc + ","}
                    {adresaDeLivrare?.scara &&
                      "sc." + adresaDeLivrare.scara + ","}
                    {adresaDeLivrare?.etaj &&
                      "et." + adresaDeLivrare.etaj + ","}
                    {adresaDeLivrare?.apartament &&
                      "ap." + adresaDeLivrare.apartament + ","}
                  </span>
                  <br />
                  <span>
                    {adresaDeLivrare?.codPostal} {adresaDeLivrare?.judet},{" "}
                    {adresaDeLivrare?.localitate}
                  </span>
                </div>
              </td>
              <td className="text-center">{formatCurrency(order.amount)}</td>
              <td className="hidden lg:table-cell text-center">
                #{order.orderNumber}
              </td>
              <td className="hidden lg:table-cell"></td>
              <td className="text-center">
                {order.fulfilled === "Fulfilled" && "Finalizata"}
                {order.fulfilled === "Unfulfilled" && "Neîmplinit"}
                {order.fulfilled === "PartialFulfilled" && "Implinit parțial"}
              </td>
              <td className="p-0 text-center ">
                <Button
                  variant={"link"}
                  size={"sm"}
                  className="gap-1 text-xs px-2 py-1"
                  onClick={()=>router.push(`/account/orders/${order.id}`)}
                >
                  Detalii <FaAnglesRight size={10} />
                </Button>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
