import { ceckoutSchemaUser } from "@/app/lib/schemas/userSchemaCheckout";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { FormField } from "@/components/ui/form";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function AdresaDeFacturare({
  form,
  tipAdresaFactura,
  setTipAdresaFactura,
}: {
  form: any;
  tipAdresaFactura: string;
  setTipAdresaFactura: any;
}) {
  const handleChange = (event: any, setState: Function) => {
    setState(event.target.value);
  };

  return (
    <Card className="mt-4 space-y-2">
      <CardHeader className="p-0 bg-primary px-2 text-white py-1 overflow-hidden rounded-t-md font-semibold">
        Adresa facturare
      </CardHeader>
      <CardContent>
        <div>
          <FormField
            control={form.control}
            name="tipAdresaFactura"
            render={({ field }) => (
              <RadioGroup
                {...field}
                className="gap-0 space-y-4"
                defaultValue="same-address"
                onChange={(event) => handleChange(event, setTipAdresaFactura)}
              >
                <Label
                  className={cn(
                    tipAdresaFactura === "same-address"
                      ? "bg-primary/20 border rounded-lg"
                      : "border rounded-lg ",
                    "flex items-center space-x-2 w-full text-end px-4 py-4 cursor-pointer"
                  )}
                >
                  <RadioGroupItem value="same-address" id="same-address" />
                  <div className="flex w-full justify-between items-center">
                    <p className="text-sm text-start">
                      La fel ca adresa de livrare
                    </p>
                  </div>
                </Label>
                <Label
                  className={cn(
                    tipAdresaFactura === "different-address"
                      ? "bg-primary/20 border rounded-t-lg"
                      : "border rounded-lg ",
                    "flex items-center space-x-2 w-full  text-end px-4 py-4 cursor-pointer"
                  )}
                >
                  <RadioGroupItem
                    value="different-address"
                    id="different-address"
                  />
                  <div className="flex w-full justify-between items-center">
                    <p className="text-sm text-start">
                      Utilizați o adresă de facturare diferită
                    </p>
                  </div>
                </Label>
              </RadioGroup>
            )}
          />
          {tipAdresaFactura === "different-address" && <p>vcvf</p>}
        </div>
      </CardContent>
    </Card>
  );
}
