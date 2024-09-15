
import { deleteCategory } from "@/app/actions/categories";
import { Submitbutton } from "@/app/components/SubmitButtons";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";

export default function DeleteRoute({ params }: { params: { id: string } }) {
  
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
            <Link href="/dashboard/categories">Cancel</Link>
          </Button>
          <form action={deleteCategory}>
            <input type="hidden" name="productId" value={params.id} />
            <Submitbutton variant="destructive" title="Delete Category" />
          </form>
        </CardFooter>
      </Card>
    </div>
  );
}