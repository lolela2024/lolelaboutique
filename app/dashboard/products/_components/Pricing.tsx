import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React from "react";

export default function Pricing({fields}:{fields:any}) {
  return (
    <Card>
      <CardHeader className="text-sm font-semibold">Pricing</CardHeader>
      <CardContent className="py-4">
        <div className="flex items-start gap-4">
          <div className="flex flex-col gap-3">
            <Label>Price</Label>
            <Input
              key={fields.price.key}
              name={fields.price.name}
              defaultValue={fields.price.initialValue}
              type="number"
              placeholder="$55"
            />
            <p className="text-red-500">{fields.price.errors}</p>
          </div>

          <div className="flex flex-col gap-3">
            <Label>Sale Price</Label>
            <Input
              key={fields.salePrice.key}
              name={fields.salePrice.name}
              defaultValue={fields.salePrice.initialValue}
              type="number"
              placeholder="$55"
            />
            <p className="text-red-500">{fields.salePrice.errors}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
