"use client";


import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/app/lib/formatters";

export default function TableRowTrx({ item }: { item: any }) {
  const { push } = useRouter();

  console.log(item);
  return (
    <TableRow
      className="cursor-pointer"
      key={item.id}
      onClick={() => push(`/dashboard/orders/${item.id}`)}
    >
      <TableCell>#{item.orderNumber}</TableCell>
      <TableCell>
        {new Intl.DateTimeFormat("ro-RO", {
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }).format(new Date(item.createdAt))}
      </TableCell>
      <TableCell>
        {item.User?.firstName || item.Customer?.firstName}{" "}
        {item.User?.lastName || item.Customer?.lastName}
      </TableCell>
      <TableCell>{formatCurrency(item.amount)}</TableCell>
      <TableCell>
        <span
          className={cn(
            item.status === "pending" && "bg-red-200",
            item.status === "completed" && "bg-green-200",
            "rounded-lg px-2 py-1"
          )}
        >
          {item.status}
        </span>
      </TableCell>
      <TableCell>{item._count.products}</TableCell>
      <TableCell>
        <span
          className={cn(
            item.fulfilled === "Unfulfilled" ? "bg-yellow-300" : "bg-green-300",
            "text-sm py-1 px-2 rounded-lg"
          )}
        >
          {item.fulfilled}
        </span>
      </TableCell>
      <TableCell></TableCell>
    </TableRow>
  );
}
