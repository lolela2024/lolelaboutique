import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React from "react";

export default function Status({fields}:{fields:any}) {
  return (
    <Card>
      <CardContent className="py-4">
        <div className="flex flex-col gap-3">
          <Label>Status</Label>
          <Select
            key={fields.status.key}
            name={fields.status.name}
            defaultValue={fields.status.initialValue}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="published">Published</SelectItem>
              <SelectItem value="archived">Archived</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-red-500">{fields.status.errors}</p>
        </div>
      </CardContent>
    </Card>
  );
}
