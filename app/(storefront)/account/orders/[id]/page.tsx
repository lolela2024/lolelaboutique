import React, { cache } from "react";
import FooterAccount from "../../_components/FooterAccount";
import { unstable_noStore as noStore } from "next/cache";

const getData = cache(async (id:string) => {
  
})

export default function ViewSingleOrderHistory({
  params,
}: {
  params: { id: string };
}) {
  noStore();

  
  return (
    <div className="space-y-4">
      <h1 className="text-lg lg:text-2xl font-semibold uppercase">
        DETALII COMANDA
      </h1>

      <FooterAccount />
    </div>
  );
}
