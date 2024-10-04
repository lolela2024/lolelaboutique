import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

interface iAppProps {
  fields:any;
  tipBijuterie: {
    id: number;
    name: string;
    value: string;
  }[];
}

export default function TipBujuterie({fields, tipBijuterie}:iAppProps) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col gap-3">
          <Label>Tip bijuterie</Label>
          <Select
            key={fields.tipBijuterie.key}
            name={fields.tipBijuterie.name}
            defaultValue={fields.tipBijuterie.initialValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Tip bijuterie" />
            </SelectTrigger>
            <SelectContent>
              {tipBijuterie.map((tip) => (
                <SelectItem key={tip.id} value={tip.value}>
                  {tip.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-red-500">{fields.status.errors}</p>
        </div>
      </CardContent>
    </Card>
  );
}
