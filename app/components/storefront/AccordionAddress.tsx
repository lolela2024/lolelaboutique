"use client";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import React, { useEffect, useState } from "react";
import ShippingForm from "./ShippingForm";
import { Cart } from "@/app/lib/interfaces";
import { CheckoutFormProps } from "@/app/types/types";
import { Button } from "@/components/ui/button";

export default function AccordionAddress({
  user,
  fields,
  address,
}: {
  user: CheckoutFormProps["user"];
  address: CheckoutFormProps["address"];
  fields: any;
}) {
  const [addressEdit, setAddressEdit] = useState<boolean>(false);

  return (
    <>
      <div className="text-md text-gray-700 hover:no-underline py-4 ">
        <div className=" flex flex-col items-start space-y-2">
          <h4 className="font-normal">Expediază către</h4>
          <div className="text-sm text-secondary-foreground ">
            {user && user.address.length > 0 ? (
              <p className="text-xs md:text-sm font-semibold">
                {user.firstName}, {user?.address[0].strada},{" "}
                {user.address[0].codPostal}, {user.address[0].localitate},{" "}
                {user.address[0].judet}, {user.address[0].phone}
              </p>
            ) : (
              <p>no address</p>
            )}
          </div>
        </div>
        <div className="flex justify-end">
          <Button variant={"outline"} size={"sm"} type="button">
            {address ? "Editați adresa" : "Adauga adresa"}
          </Button>
        </div>
      </div>

      {/* <ShippingForm user={user} address={address} fields={fields} /> */}
    </>
  );
}
