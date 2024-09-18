import prisma from "@/app/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { unstable_noStore as noStore} from "next/cache";
import React from "react";

async function getData() {
  const data = await prisma.homePage.findMany({
    take:1,
    include:{
      bannerTop:true
    }
  });

  return data;
} 

export default async function HomePage() {
  noStore();
  const data = await getData();
console.log(data.map((item)=>item.bannerTop))
  return (
    <div className="grid md:grid-cols-3 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex">
          <h3>Banner Top</h3>
        </CardHeader>
        <CardFooter className="float-end">
          <Button size={"sm"}>Add</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
