import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import React from "react";

export default function PersoanaFizica({ fields }: { fields: any }) {
  return (
    <Card>
      <CardHeader className="p-0 bg-primary px-2 text-white py-1 overflow-hidden rounded-t-md font-semibold">
        Persoana Fizica:
      </CardHeader>
      <CardContent className="py-4">
        <div>
          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Nume:
            </Label>
            <Input
              type="text"
              key={fields.firstName.key}
              name={fields.firstName.name}
              defaultValue={fields.firstName.initialValue}
              className={
                fields.firstName.errors
                  ? "w-full border-red-500 border-2 col-span-12 md:col-span-8"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="Nume *"
            />
            <p className="text-red-500 text-sm col-span-12">
              {fields.firstName.errors}
            </p>
          </div>
          <Separator className="mb-3" />

          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Prenume:
            </Label>
            <Input
              type="text"
              key={fields.lastName.key}
              name={fields.lastName.name}
              defaultValue={fields.lastName.initialValue}
              className={
                fields.lastName.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="Prenume *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.lastName.errors}
            </p>
          </div>
          <Separator className="mb-3" />

          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Telefon Mobil:
            </Label>
            <Input
              type="text"
              key={fields.phone.key}
              name={fields.phone.name}
              defaultValue={fields.phone.initialValue}
              className={
                fields.phone.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="Telefon Mobil *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.phone.errors}
            </p>
          </div>
          <Separator className="mb-3" />

          <div className="grid grid-cols-12 items-start">
            <Label className="col-span-12 mb-2 md:mb-0 md:col-span-4">
              Email:
            </Label>
            <Input
              type="text"
              key={fields.email.key}
              name={fields.email.name}
              defaultValue={fields.email.initialValue}
              className={
                fields.email.errors
                  ? "w-full col-span-12 md:col-span-8 border-red-500 border-2"
                  : "w-full col-span-12 md:col-span-8"
              }
              placeholder="Email *"
            />

            <p className="text-red-500 text-sm col-span-12">
              {fields.email.errors}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
