"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function Form({ user }: { user: any | null }) {
  const { push } = useRouter();
 
  return (
    <div className="mt-4 mb-8 ">
      {user ? '' : <Button className="mr-8">Creaza cont</Button>}
      <Button className="underline" variant={"link"} onClick={() => push("/")}>
        Continua cumparaturile
      </Button>
    </div>
  );
}
