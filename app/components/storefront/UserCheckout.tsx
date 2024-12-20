import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import LogOut from "../dashboard/LogOut";
import AccordionAddress from "./AccordionAddress";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { CheckoutFormProps } from "@/app/types/types";
import DatePersoanaJuridica from "./checkout/DatePersoanaJuridica";
import AdaugaAdresa from "./checkout/AdaugaAdresa";
import AdaugaFirma from "./checkout/AdaugaFirma";
import { cn } from "@/lib/utils";

export default function UserCheckout({
  user,
  address,
  persoanaJuridica,
  fields,
  tipPersoana,
  setTipPersoana,
}: {
  user: CheckoutFormProps["user"];
  address: CheckoutFormProps["address"];
  persoanaJuridica: CheckoutFormProps["persoanaJuridica"];
  fields: any;
  tipPersoana: string;
  setTipPersoana: any;
}) {
  return (
    <Card className="border-none shadow-none">
      <CardContent>
        <div>
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue={"item-2"}
          >
            <AccordionItem value="item-1">
              <div className="text-md text-gray-700 hover:no-underline flex items-end justify-between ">
                <div className="flex flex-col items-start space-y-2">
                  <h4 className="font-normal">Cont</h4>
                  <p className="text-sm text-secondary-foreground font-semibold">
                    {user?.email}
                  </p>
                </div>
                <LogOut className="justify-end" />
              </div>
            </AccordionItem>

            <AccordionItem value="item-2" className="border-none">
              {address !== null ? (
                <AccordionAddress
                  fields={fields}
                  user={user}
                  address={address}
                />
              ) : (
                <AdaugaAdresa />
              )}
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
      <Card
        className={cn(tipPersoana === "persoana-juridica" && "rounded-b-none")}
      >
        <CardContent className="py-4">
          <div className="block md:flex items-center justify-between space-y-4 md:space-y-0">
            <Label className="font-semibold">Tip Persoana</Label>

            <RadioGroup
              defaultValue="persoana-fizica"
              key={fields.tipPersoana.key}
              name={fields.tipPersoana.name}
              onValueChange={(value) => setTipPersoana(value)} // Folosim onValueChange pentru a actualiza starea
            >
              <div className="flex items-center gap-8">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="persoana-fizica"
                    id="persoana-fizica"
                  />
                  <Label htmlFor="persoana-fizica">Persoana Fizica</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem
                    value="persoana-juridica"
                    id="persoana-juridica"
                  />
                  <Label htmlFor="persoana-juridica">Persoana Juridica</Label>
                </div>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {tipPersoana === "persoana-juridica" && (
        <div className="space-y-4">
          {persoanaJuridica && persoanaJuridica?.length > 0 ? (
            <DatePersoanaJuridica
              persoanaJuridica={persoanaJuridica}
              tipPersoana={tipPersoana}
            />
          ) : (
            // <PersoanaJuridica fields={fields} />
            <AdaugaFirma tipPersoana={tipPersoana} />
          )}
        </div>
      )}
    </Card>
  );
}
