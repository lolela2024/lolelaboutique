import { formatCurrency } from "@/app/lib/formatters";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import Image from "next/image";
import React, { Fragment } from "react";

export default function CardProducts({ product }: { product: any }) {
  return (
    <Fragment>
      <div className="mt-4 flex gap-4">
        <div className="aspect-1 border rounded-sm overflow-hidden flex-shrink-0 w-1/12 relative">
          <Image
            src={product.productImage}
            fill
            alt={product.productName}
            className="object-cover"
          />
        </div>
        <div className="flex flex-1 w-full gap-4">
          <p className="w-1/2 font-semibold">{product.productName}</p>
          <div className="w-1/4 text-center">
            {formatCurrency(product.productPrice)} x{" "}
            {product.fulfilledQuantity || product.unfulfilledQuantity}
          </div>
          <div className="w-1/4 text-right">
            {formatCurrency(
              product.productPrice *
                (product.fulfilledQuantity || product.unfulfilledQuantity)
            )}
          </div>
        </div>
      </div>
      <Separator className="mt-4" />
    </Fragment>
  );
}
