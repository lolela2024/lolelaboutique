import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import React from "react";

export default function FeaturedProduct({fields}:{fields:any}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col gap-3">
          <Label>Featured Product</Label>
          <Switch
            key={fields.isFeatured.key}
            name={fields.isFeatured.name}
            defaultValue={fields.isFeatured.initialValue}
          />
          <p className="text-red-500">{fields.isFeatured.errors}</p>
        </div>
      </CardContent>
    </Card>
  );
}
