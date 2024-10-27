"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { useRouter } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { formatCurrency } from "@/app/lib/formatters";
import { TbPoint, TbPointFilled } from "react-icons/tb";

interface FulfillmentStatus {
  orderId: string;
  status: number; // 1 = Unfulfilled, 2 = Partially Fulfilled, 3 = Fulfilled
}

interface iAppProps {
  item: any;
  fulfillmentStatuses: any;
}

export default function TableRowTrx({ item, fulfillmentStatuses }: iAppProps) {
  const { push } = useRouter();

  const fulfillmentClass = cn(
    item.fulfilled === "Unfulfilled"
      ? "bg-yellow-300"
      : item.fulfilled === "Fulfilled"
      ? "bg-green-300"
      : item.fulfilled === "PartialFulfilled"
      ? "bg-[#ffd6a5]"
      : "",
    "text-xs py-[2px] px-[4px] rounded-lg flex items-center"
  );

  const fulfillmentIcon =
    item.fulfilled === "Unfulfilled" ||
    item.fulfilled === "PartialFulfilled" ? (
      <TbPoint size={24} />
    ) : item.fulfilled === "Fulfilled" ? (
      <TbPointFilled size={24} />
    ) : null;

  const totalItems = item.products.reduce(
    (acc: number, product: any) => acc + product.quantity,
    0
  );

  return (
    <TableRow
      className="cursor-pointer"
      key={item.id}
      onClick={() => push(`/dashboard/orders/${item.id}`)}
    >
      <TableCell className="px-2 py-1">
        <strong>#{item.orderNumber}</strong>
      </TableCell>
      <TableCell className="px-2 py-1">
        <span className="text-sm">
          {new Intl.DateTimeFormat("ro-RO", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          }).format(new Date(item.createdAt))}
        </span>
      </TableCell>
      <TableCell className="px-2 py-1">
        <span className="w-full text-sm">
          {item.User?.firstName || item.Customer?.firstName}{" "}
          {item.User?.lastName || item.Customer?.lastName}
        </span>
      </TableCell>
      <TableCell className="px-2 py-1">{formatCurrency(item.amount)}</TableCell>
      <TableCell className="px-2 py-1">
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
      <TableCell className="px-2 py-1">{totalItems}</TableCell>
      <TableCell className="px-2 py-1">
        <span className={fulfillmentClass}>
          {fulfillmentIcon}
          {item.fulfilled}
        </span>
      </TableCell>
      <TableCell className="px-2 py-1"></TableCell>
    </TableRow>
  );
}
