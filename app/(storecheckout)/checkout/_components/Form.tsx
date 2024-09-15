"use client";

import { CheckoutFormProps } from "@/app/types/types";
import { Button } from "@/components/ui/button";
import { KindeUser } from "@kinde-oss/kinde-auth-nextjs/types";
import { useRouter } from "next/navigation";

export function Form({ user }: { user: KindeUser | null }) {
  const { push } = useRouter();
  console.log(user)
  return (
    <div className="mt-4">
      {user ? '' : <Button className="mr-8">Creaza cont</Button>}
      <Button className="underline" variant={"link"} onClick={() => push("/")}>
        Continua cumparaturile
      </Button>
    </div>
  );
}
