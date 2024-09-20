import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Trash2 } from "lucide-react";
import { unstable_noStore as noStore } from "next/cache";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { deleteImageBanner, handleDeleteBanner } from "./_actions/banner";
import ButtonDeleteBanner from "./_components/ButtonDeleteBanner";
import { Submitbutton } from "@/app/components/SubmitButtons";

async function getBanner() {
  const data = await prisma.bannerTop.findMany({
    take: 1,
  });

  return data;
}

export default async function HomePage() {
  noStore();
  const banner = await getBanner();
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex">
          <h3 className="flex items-center justify-between">
            Banner Top
            {banner[0] && (
              <div>
                <form action={handleDeleteBanner}>
                  <input type="hidden" name="idBanner" defaultValue={banner[0]?.id} />
                  <Submitbutton variant={"destructive"} title="Delete" />
                </form>
              </div>
            )}
          </h3>
        </CardHeader>
        <CardFooter className="float-end">
          {banner[0] ? (
            <Button size={"sm"}>
              <Link href={`/dashboard/home-page/edit-banner/${banner[0].id}`}>
                Edit
              </Link>
            </Button>
          ) : (
            <Button asChild size={"sm"}>
              <Link href={"/dashboard/home-page/create-banner"}>Add</Link>
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
