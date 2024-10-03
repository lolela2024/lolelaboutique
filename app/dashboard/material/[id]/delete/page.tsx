import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deleteMaterial } from "../../action/material";
import { Submitbutton } from "@/app/components/SubmitButtons";

export default function DeletePage({ params }: { params: { id: string } }) {
  return (
    <div className="h-[80vh] w-full flex items-center justify-center">
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Are you absolutely sure?</CardTitle>
          <CardDescription>
            This action cannot be undone. This will permanently delete this
            product and remove all data from our servers.
          </CardDescription>
        </CardHeader>
        <CardFooter className="w-full flex justify-between">
          <Button variant="secondary" asChild>
            <Link href="/dashboard/material">Cancel</Link>
          </Button>
          <form action={deleteMaterial}>
            <input type="hidden" name="materialId" value={params.id} />
            <Submitbutton variant="destructive" title="Delete" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}
