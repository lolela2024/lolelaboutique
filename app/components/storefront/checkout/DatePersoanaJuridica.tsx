"use client";

import { CheckoutFormProps } from "@/app/types/types";
import { Accordion, AccordionItem } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CardContent } from "@/components/ui/card";
import React, { useState } from "react";
import DialogEditDateJuridica from "./DialogEditDateJuridica";

export default function DatePersoanaJuridica({
  persoanaJuridica,
}: {
  persoanaJuridica: CheckoutFormProps["persoanaJuridica"];
}) {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <CardContent>
      <Accordion
        type="single"
        collapsible
        className="w-full"
        defaultValue={"item-2"}
      >
        <AccordionItem value="item-2" className="pb-4">
          <div className=" flex flex-col items-start space-y-2">
            <h4 className="font-normal">Persoana juridica</h4>
            <div className="text-sm text-secondary-foreground ">
              {persoanaJuridica && persoanaJuridica.length > 0 ? (
                <p className="text-xs md:text-sm font-semibold">
                  <span className="font-normal">Nume Firma:</span>{" "}
                  {persoanaJuridica[0].numeFirma},{" "}
                  <span className="font-normal">CIF:</span>{" "}
                  {persoanaJuridica[0].CIF},{" "}
                  <span className="font-normal">Nr. reg. comertului / An:</span>{" "}
                  {persoanaJuridica[0].nrRegComert}
                </p>
              ) : (
                <p>no data</p>
              )}
            </div>
          </div>
          <div className="flex justify-end">
            <Button
              variant={"outline"}
              size={"sm"}
              type="button"
              onClick={() => setOpen(!open)}
            >
              Editați datele
            </Button>
          </div>
        </AccordionItem>
      </Accordion>
      
        <DialogEditDateJuridica
          open={open}
          setOpen={setOpen}
          persoanaJuridica={persoanaJuridica}
    
        />
     
    </CardContent>
  );
}
