import { CheckoutFormProps } from "@/app/types/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import React from "react";

const județeRomânia = [
  { romanian: "Arad", english: "Arad" },
  { romanian: "Argeș", english: "Argeș" },
  { romanian: "Alba", english: "Alba" },
  { romanian: "Bacău", english: "Bacău" },
  { romanian: "Bihor", english: "Bihor" },
  { romanian: "Bistrița-Năsăud", english: "Bistrița-Năsăud" },
  { romanian: "Botoșani", english: "Botoșani" },
  { romanian: "Brașov", english: "Brașov" },
  { romanian: "Brăila", english: "Brăila" },
  { romanian: "Buzău", english: "Buzău" },
  { romanian: "Caraș-Severin", english: "Caraș-Severin" },
  { romanian: "Călărași", english: "Călărași" },
  { romanian: "Cluj", english: "Cluj" },
  { romanian: "Constanța", english: "Constanța" },
  { romanian: "Covasna", english: "Covasna" },
  { romanian: "Dâmbovița", english: "Dâmbovița" },
  { romanian: "Dolj", english: "Dolj" },
  { romanian: "Galați", english: "Galați" },
  { romanian: "Giurgiu", english: "Giurgiu" },
  { romanian: "Gorj", english: "Gorj" },
  { romanian: "Harghita", english: "Harghita" },
  { romanian: "Hunedoara", english: "Hunedoara" },
  { romanian: "Ialomița", english: "Ialomița" },
  { romanian: "Iași", english: "Iași" },
  { romanian: "Ilfov", english: "Ilfov" },
  { romanian: "Maramureș", english: "Maramureș" },
  { romanian: "Mehedinți", english: "Mehedinți" },
  { romanian: "Mureș", english: "Mureș" },
  { romanian: "Neamț", english: "Neamț" },
  { romanian: "Olt", english: "Olt" },
  { romanian: "Prahova", english: "Prahova" },
  { romanian: "Satu Mare", english: "Satu Mare" },
  { romanian: "Sălaj", english: "Sălaj" },
  { romanian: "Sibiu", english: "Sibiu" },
  { romanian: "Suceava", english: "Suceava" },
  { romanian: "Teleorman", english: "Teleorman" },
  { romanian: "Timiș", english: "Timiș" },
  { romanian: "Tulcea", english: "Tulcea" },
  { romanian: "Vaslui", english: "Vaslui" },
  { romanian: "Vâlcea", english: "Vâlcea" },
  { romanian: "Vrancea", english: "Vrancea" },
];

export default function ShippingForm({
  fields,
  user,
}: {
  fields: any;
  user: CheckoutFormProps["user"];
}) {
  const countyOptions = județeRomânia.map((judet, index) => (
    <SelectItem key={index} value={judet.romanian}>
      {judet.romanian}
    </SelectItem>
  ));

  return (
    <Card>
      <CardHeader className="p-0 bg-primary px-2 text-white py-1 overflow-hidden rounded-t-md font-semibold">
        Adresa de livrare:
      </CardHeader>
      <CardContent className="py-4">
        <div className="grid grid-cols-12 items-start">
          <Label className="col-span-12 mb-2 md:mb-0 md:col-span-2">
            Adresa:
          </Label>
          <div className="col-span-full md:col-span-10 ">
            <Label>Telefon:</Label>
            <Input
              type="text"
              key={fields.numeFirma.key}
              name={fields.numeFirma.name}
              defaultValue={fields.numeFirma.initialValue}
              className={
                fields.numeFirma.errors
                  ? "w-full border-red-500 border-2 "
                  : "w-full"
              }
              placeholder="Telefon"
            />
            <p className="text-red-500 text-sm">{fields.numeFirma.errors}</p>
          </div>

          <Label className="col-span-12 mb-2 md:mb-0 md:col-span-2"></Label>
          <div className="col-span-full md:col-span-10">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-9">
                <Label>Strada:</Label>
                <Input
                  type="text"
                  key={fields.numeFirma.key}
                  name={fields.numeFirma.name}
                  defaultValue={fields.numeFirma.initialValue}
                  className={
                    fields.numeFirma.errors
                      ? "w-full border-red-500 border-2 "
                      : "w-full"
                  }
                  placeholder="Strada *"
                />
                <p className="text-red-500 text-sm">
                  {fields.numeFirma.errors}
                </p>
              </div>
              <div className="col-span-3">
                <Label>Nr:</Label>
                <Input
                  type="text"
                  key={fields.numeFirma.key}
                  name={fields.numeFirma.name}
                  defaultValue={fields.numeFirma.initialValue}
                  className={
                    fields.numeFirma.errors
                      ? "w-full border-red-500 border-2 "
                      : "w-full"
                  }
                  placeholder="Nr *"
                />
                <p className="text-red-500 text-sm">
                  {fields.numeFirma.errors}
                </p>
              </div>
            </div>
          </div>

          <Label className="col-span-12 mb-2 md:mb-0 md:col-span-2"></Label>
          <div className="col-span-full md:col-span-10">
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-3">
                <Label>Bloc:</Label>
                <Input
                  type="text"
                  key={fields.numeFirma.key}
                  name={fields.numeFirma.name}
                  defaultValue={fields.numeFirma.initialValue}
                  className={
                    fields.numeFirma.errors
                      ? "w-full border-red-500 border-2 "
                      : "w-full"
                  }
                  placeholder="Bloc"
                />
                <p className="text-red-500 text-sm">
                  {fields.numeFirma.errors}
                </p>
              </div>
              <div className="col-span-3">
                <Label>Scara:</Label>
                <Input
                  type="text"
                  key={fields.numeFirma.key}
                  name={fields.numeFirma.name}
                  defaultValue={fields.numeFirma.initialValue}
                  className={
                    fields.numeFirma.errors
                      ? "w-full border-red-500 border-2 "
                      : "w-full"
                  }
                  placeholder="Scara"
                />
                <p className="text-red-500 text-sm">
                  {fields.numeFirma.errors}
                </p>
              </div>
              <div className="col-span-3">
                <Label>Etaj:</Label>
                <Input
                  type="text"
                  key={fields.numeFirma.key}
                  name={fields.numeFirma.name}
                  defaultValue={fields.numeFirma.initialValue}
                  className={
                    fields.numeFirma.errors
                      ? "w-full border-red-500 border-2 "
                      : "w-full"
                  }
                  placeholder="Etaj"
                />
                <p className="text-red-500 text-sm">
                  {fields.numeFirma.errors}
                </p>
              </div>
              <div className="col-span-3">
                <Label>Ap:</Label>
                <Input
                  type="text"
                  key={fields.numeFirma.key}
                  name={fields.numeFirma.name}
                  defaultValue={fields.numeFirma.initialValue}
                  className={
                    fields.numeFirma.errors
                      ? "w-full border-red-500 border-2 "
                      : "w-full"
                  }
                  placeholder="Ap"
                />
                <p className="text-red-500 text-sm">
                  {fields.numeFirma.errors}
                </p>
              </div>
            </div>
          </div>
        </div>
        <Separator className="mb-3" />
        <div className="">
          <Label className="mb-2">Localitate:</Label>
          <Input
            type="text"
            key={fields.numeFirma.key}
            name={fields.numeFirma.name}
            defaultValue={fields.numeFirma.initialValue}
            className={
              fields.numeFirma.errors
                ? "w-full border-red-500 border-2 "
                : "w-full "
            }
            placeholder="Localitate *"
          />
          <p className="text-red-500 text-sm">{fields.numeFirma.errors}</p>
        </div>
        <Separator className="mb-3" />

        <div className="">
          <Label className="mb-2">Judet:</Label>
          <Input
            type="text"
            key={fields.numeFirma.key}
            name={fields.numeFirma.name}
            defaultValue={fields.numeFirma.initialValue}
            className={
              fields.numeFirma.errors
                ? "w-full border-red-500 border-2 "
                : "w-full "
            }
            placeholder="Judet *"
          />
          <p className="text-red-500 text-sm">{fields.numeFirma.errors}</p>
        </div>
        <Separator className="mb-3" />

        <div className="">
          <Label className="mb-2">Cod Postal:</Label>
          <Input
            type="text"
            key={fields.numeFirma.key}
            name={fields.numeFirma.name}
            defaultValue={fields.numeFirma.initialValue}
            className={
              fields.numeFirma.errors
                ? "w-full border-red-500 border-2 "
                : "w-full "
            }
            placeholder="Cod Postal"
          />
          <p className="text-red-500 text-sm">{fields.numeFirma.errors}</p>
        </div>
        <Separator className="mb-3" />

        <div className="">
          <Label className="mb-2">Alte detalii:</Label>
          <Textarea
            key={fields.numeFirma.key}
            name={fields.numeFirma.name}
            defaultValue={fields.numeFirma.initialValue}
            className={
              fields.numeFirma.errors
                ? "w-full border-red-500 border-2 "
                : "w-full "
            }
            placeholder="Alte detalii"
          />
          <p className="text-red-500 text-sm">{fields.numeFirma.errors}</p>
        </div>
        <Separator className="mb-3" />  
      </CardContent>
    </Card>
  );
}
