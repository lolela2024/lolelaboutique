"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React, { useEffect, useState } from "react";
import StockProducts from "./StockProducts";

function generateSKU(prefix: string = "LO", length: number = 5): string {
  // Generează un număr aleatoriu cu numărul de cifre specificat
  const randomNumber = Math.floor(Math.random() * Math.pow(10, length)).toString().padStart(length, "0");
  
  // Concatenăm prefixul cu numărul aleatoriu pentru a forma SKU-ul
  return `${prefix}${randomNumber}`;
}

interface IAppProps {
  fields: any;
}

export default function Inventory({ fields }: IAppProps) {
  const [trackQuantity, setTrackQuantity] = useState<boolean>(false);

  let sku = ""

  if(trackQuantity){
    sku = generateSKU() 
  }

  return (
    <Card>
      <CardHeader className="text-sm font-semibold">Inventory</CardHeader>
      <CardContent>
        <div>
          <div className="flex flex-col gap-3">
            <Label>SKU (Stock Keeping Unit)</Label>
            <Input
              className="max-w-sm"
              type="text"
              name={fields.sku.name}
              key={fields.sku.key}
              value={sku}
              disabled={!trackQuantity}
            />
            <p className="text-red-500">{fields.salePrice.errors}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="trackQuantity"
              checked={trackQuantity}
              name={fields.trackQuantity.name}
              key={fields.trackQuantity.key}
              onCheckedChange={() => setTrackQuantity(!trackQuantity)}
            />
            <label
              htmlFor="trackQuantity"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Track quantity
            </label>
          </div>
        </div>
      </CardContent>
      <div>
        <Separator />
        <CardContent className="py-4">
          {trackQuantity ? (
            <StockProducts fields={fields} />
          ) : (
            <div className="flex items-center justify-between">
              <span>Shop location</span>
              <span>Not tracked</span>
            </div>
          )}
        </CardContent>
      </div>
    </Card>
  );
}
