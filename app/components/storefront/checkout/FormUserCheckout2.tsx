"use client";

import { createCheckoutUser2 } from "@/app/actions/createCheckoutUser";
import { ceckoutSchemaUser } from "@/app/lib/schemas/userSchemaCheckout";
import { CheckoutFormProps } from "@/app/types/types";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import AdresaDeFacturare from "./AdresaDeFacturare";

export default function FormUserCheckout2({
  user,
  address,
  persoanaJuridica,
  setShipping,
  shipping,
  transport,
}: {
  user: CheckoutFormProps["user"];
  address: CheckoutFormProps["address"];
  persoanaJuridica: CheckoutFormProps["persoanaJuridica"];
  setShipping: any;
  shipping: any;
  transport: any;
}) {
  const [termeniSiConditii, setTermeniSiConditii] = useState<boolean>(false);
  const [tipAdresaFactura, setTipAdresaFactura] =
    useState<string>("same-address");
  const [payment, setPayment] = useState<string>("card");

  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const form = useForm<z.infer<typeof ceckoutSchemaUser>>({
    resolver: zodResolver(ceckoutSchemaUser),
    defaultValues: {
      tipAdresaFactura:"same-address"
    },
  });

  function onSubmit(values: z.infer<typeof ceckoutSchemaUser>) {
    setError("");
    setSuccess("");

    startTransition(() => {
      createCheckoutUser2(values).then((data) => {
        setError(data?.error);
        setSuccess(data?.success);

        if (data?.success) {
        }
      });
    });
  }

  const handleChange = (event: any, setState: Function) => {
    setState(event.target.value);
  };

  if (transport === "gratuit") {
    setShipping("free");
  }

  if (transport === "plata") {
    setShipping("dhl");
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <AdresaDeFacturare
              form={form}
              setTipAdresaFactura={setTipAdresaFactura}
              tipAdresaFactura={tipAdresaFactura}
            />
            <FormField
              control={form.control}
              name="numeFirma"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipping carrier</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <button type="submit">submit</button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
