import { Card } from "@/components/ui/card";

import { SellForm } from "../components/form/Sellform";
import { unstable_noStore as noStore } from "next/cache";
import { auth } from "@/auth";


export default async function SellRoute() {
  noStore();
  const session = await auth()
  const user = session?.user
  
  if (!user) {
    throw new Error("Unauthorized");
  }

  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 mb-14">
      <Card>
        <SellForm />
      </Card>
    </section>
  );
}