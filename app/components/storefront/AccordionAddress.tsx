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

export default function AccordionAddress({
  user,
  fields,
}: {
  user: CheckoutFormProps["user"];
  fields: any;
}) {
  return (
    <AccordionItem value="item-2">
      <AccordionTrigger className="text-md text-gray-700 hover:no-underline hover:text-primary">
        <div className=" flex flex-col items-start space-y-2">
          <h4 className="font-normal">Expediază către</h4>
          <div className="text-sm text-secondary-foreground">
            {user && user.address.length > 0 ? (
              <p className="text-xs font-light">
                {user.firstName} {user.lastName}, {user?.address[0].address},{" "}
                {user.address[0].postalCode}, {user.address[0].city}, {user.address[0].county}, {user.phone}
              </p>
            ) : (
              <p>no address</p>
            )}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        {user && user.address.length > 0 ? (
          <ShippingForm user={user} fields={fields} />
        ) : (
          <ShippingForm user={user} fields={fields} />
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
