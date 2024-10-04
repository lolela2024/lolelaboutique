import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

interface IAppProps {
  fields:any
}

export default function Inventory({fields}:IAppProps) {
  return (
    <Card>
      <CardHeader className="text-sm font-semibold">Inventory</CardHeader>
      <CardContent>
        <div>
          <div className="flex flex-col gap-3">
            <Label>SKU (Stock Keeping Unit)</Label>
            <Input
              key={fields.salePrice.key}
              name={fields.salePrice.name}
              defaultValue={fields.salePrice.initialValue}
              type="text"
              
            />
            <p className="text-red-500">{fields.salePrice.errors}</p>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox id="trackQuantity" />
            <label
              htmlFor="trackQuantity"
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Track quantity
            </label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
