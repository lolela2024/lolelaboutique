import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { $Enums, Order } from "@prisma/client";
import React from "react";
import { FaAnglesRight } from "react-icons/fa6";
import { formatCurrency } from "../../../lib/formatters";
import { fulfilled } from "../../../actions/fulfilled";
import { cn } from "@/lib/utils";

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
  let id = 0;

  return (
    <Table>
     
      <TableHeader className="">
        <TableRow className="text-xs ">
          <TableHead className="w-[60px] px-2 py-0 bg-gray-100 ">ID</TableHead>
          <TableHead className="px-2 py-0 bg-gray-100">Data comanda</TableHead>
          <TableHead className="px-2 py-0 bg-gray-100 w-[200px]">
            Locatie livrare
          </TableHead>
          <TableHead className="text-center px-2 py-0 bg-gray-100">
            Total (Lei)
          </TableHead>
          <TableHead className="px-2 py-0 text-center w-[100px] bg-gray-100">
            Nr Factura
          </TableHead>
          <TableHead className="px-2 py-0 bg-gray-100">Emisa in</TableHead>
          <TableHead className="px-2 py-0 text-center bg-gray-100">
            Status Comanda
          </TableHead>
          <TableHead className="px-2 py-0 w-[80px] bg-gray-100"></TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {order.map((order) => {
          return (
            <TableRow
              key={order.id}
              className={cn(
                order.fulfilled === "Unfulfilled" && "bg-red-100",
                order.fulfilled === "PartialFulfilled" && "bg-orange-100",
                order.fulfilled === "Fulfilled" && "bg-green-100",
                "hover:bg-opacity-5"
              )}
            >
              <TableCell className="font-medium">{++id}</TableCell>
              <TableCell className="px-2">
                <span className="text-sm">
                  {new Intl.DateTimeFormat("ro-RO", {
                    month: "short",
                    day: "numeric",
                    year: "2-digit",
                    hour: "2-digit",
                    minute: "2-digit",
                  }).format(new Date(order.createdAt))}
                </span>
              </TableCell>
              <TableCell className="w-full ">
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
              </TableCell>
              <TableCell className="text-right">
                {formatCurrency(order.amount)}
              </TableCell>
              <TableCell className="text-right">#{order.orderNumber}</TableCell>
              <TableCell className="text-right"></TableCell>
              <TableCell className="text-center">
                {order.fulfilled === "Fulfilled" && "Finalizata"}
                {order.fulfilled === "Unfulfilled" && "Neîmplinit"}
                {order.fulfilled === "PartialFulfilled" && "Implinit parțial"}
              </TableCell>
              <TableCell className="p-0 text-center ">
                <Button variant={"link"} size={"sm"} className="gap-1">
                  Detalii <FaAnglesRight size={10} />
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}
