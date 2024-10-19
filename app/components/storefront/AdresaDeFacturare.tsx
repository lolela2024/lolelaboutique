import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export default function AdresaDeFacturare({
  fields,
  tipAdresaFactura,
  setTipAdresaFactura,
}: {
  fields: any;
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
          <RadioGroup
            className="gap-0 space-y-4"
            defaultValue="same-address"
            key={fields.tipAdresaFactura.key}
            name={fields.tipAdresaFactura.name}
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
          {tipAdresaFactura === "different-address" && (
            <div className="border bg-[#f5f5f5] rounded-b-sm transition ease-in-out pt-4">
              <CardContent>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-9">
                      <div className="flex flex-col gap-3 w-full">
                        <Label>Strada:</Label>
                        <Input
                          type="text"
                          key={fields.stradaAdreseFacturare.key}
                          name={fields.stradaAdreseFacturare.name}
                          defaultValue={
                            fields.stradaAdreseFacturare.initialValue
                          }
                          className={
                            fields.stradaAdreseFacturare.errors
                              ? "w-full border-red-500 border-2"
                              : "w-full"
                          }
                          placeholder="Strada *"
                        />
                      </div>
                    </div>

                    <div className="col-span-3">
                      <div className="flex flex-col gap-3 w-full">
                        <Label>Nr:</Label>
                        <Input
                          type="text"
                          key={fields.numarAdreseFacturare.key}
                          name={fields.numarAdreseFacturare.name}
                          defaultValue={
                            fields.numarAdreseFacturare.initialValue
                          }
                          className={
                            fields.numarAdreseFacturare.errors
                              ? "w-full border-red-500 border-2"
                              : "w-full"
                          }
                          placeholder="Nr *"
                        />
                      </div>
                    </div>

                    <p className="text-red-500 text-sm">
                      {fields.stradaAdreseFacturare.errors ||
                        fields.numarAdreseFacturare.errors}
                    </p>
                  </div>
                  <Separator className="mb-3" />
                  <div className="grid grid-cols-12 gap-4">
                    <div className="col-span-3">
                      <Label>Bloc:</Label>
                      <Input
                        type="text"
                        key={fields.blocAdreseFacturare.key}
                        name={fields.blocAdreseFacturare.name}
                        defaultValue={fields.blocAdreseFacturare.initialValue}
                        className={
                          fields.blocAdreseFacturare.errors
                            ? "w-full border-red-500 border-2 "
                            : "w-full"
                        }
                        placeholder="Bloc"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Scara:</Label>
                      <Input
                        type="text"
                        key={fields.scaraAdreseFacturare.key}
                        name={fields.scaraAdreseFacturare.name}
                        defaultValue={fields.scaraAdreseFacturare.initialValue}
                        className={
                          fields.scaraAdreseFacturare.errors
                            ? "w-full border-red-500 border-2 "
                            : "w-full"
                        }
                        placeholder="Scara"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Etaj:</Label>
                      <Input
                        type="text"
                        key={fields.etajAdreseFacturare.key}
                        name={fields.etajAdreseFacturare.name}
                        defaultValue={fields.etajAdreseFacturare.initialValue}
                        className={
                          fields.etajAdreseFacturare.errors
                            ? "w-full border-red-500 border-2 "
                            : "w-full"
                        }
                        placeholder="Etaj"
                      />
                    </div>
                    <div className="col-span-3">
                      <Label>Ap:</Label>
                      <Input
                        type="text"
                        key={fields.apartamentAdreseFacturare.key}
                        name={fields.apartamentAdreseFacturare.name}
                        defaultValue={
                          fields.apartamentAdreseFacturare.initialValue
                        }
                        className={
                          fields.apartamentAdreseFacturare.errors
                            ? "w-full border-red-500 border-2 "
                            : "w-full"
                        }
                        placeholder="Ap"
                      />
                    </div>
                  </div>

                  <Separator className="mb-3" />
                  <div className="">
                    <Label className="mb-2">Localitate:</Label>
                    <Input
                      type="text"
                      key={fields.localitateAdreseFacturare.key}
                      name={fields.localitateAdreseFacturare.name}
                      defaultValue={
                        fields.localitateAdreseFacturare.initialValue
                      }
                      className={
                        fields.localitateAdreseFacturare.errors
                          ? "w-full border-red-500 border-2 "
                          : "w-full "
                      }
                      placeholder="Localitate *"
                    />
                    <p className="text-red-500 text-sm">
                      {fields.localitateAdreseFacturare.errors}
                    </p>
                  </div>

                  <Separator className="mb-3" />
                  <div className="">
                    <Label className="mb-2">Judet:</Label>
                    <Input
                      type="text"
                      key={fields.judetAdreseFacturare.key}
                      name={fields.judetAdreseFacturare.name}
                      defaultValue={fields.judetAdreseFacturare.initialValue}
                      className={
                        fields.judetAdreseFacturare.errors
                          ? "w-full border-red-500 border-2 "
                          : "w-full "
                      }
                      placeholder="Judet *"
                    />
                    <p className="text-red-500 text-sm">
                      {fields.judetAdreseFacturare.errors}
                    </p>
                  </div>
                </div>
              </CardContent>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
