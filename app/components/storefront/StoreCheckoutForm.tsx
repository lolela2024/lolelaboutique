"use client";

import { formatCurrency } from "@/app/lib/formatters";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import Image from "next/image";
import React, { Fragment, useState } from "react";
import { useFormState } from "react-dom";
import { ceckoutSchema } from "../../lib/zodSchemas";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ChceckoutButton } from "../SubmitButtons";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import ShippingForm from "./ShippingForm";
import AccordionAddress from "./AccordionAddress";
import { CheckoutFormProps } from "@/app/types/types";
import { useSearchParams } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import PersoanaFizica from "./PersoanaFizica";
import PersoanaJuridica from "./PersoanaJuridica";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { createCheckout } from "@/app/actions/createCeckout";
import AdresaDeFacturare from "./AdresaDeFacturare";

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

export default function StoreCheckoutForm({
  products,
  user,
}: CheckoutFormProps) {
  const searchParams = useSearchParams();
  const transport = searchParams.get("transport");

  const [shipping, setShipping] = useState<string>("free");
  const totalAmountItems = products.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  let totalAmount = 0;

  if (shipping === "dhl") {
    totalAmount = totalAmountItems + 24.99;
  } else {
    totalAmount = totalAmountItems;
  }

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8">
      <div className="grid lg:grid-cols-2">
        <div className="bg-white py-4">
          <Form
            user={user}
            shipping={shipping}
            setShipping={setShipping}
            transport={transport}
          />
        </div>

        <div className="bg-[#f5f5f5] h-screen p-8 border-l sticky top-0">
          <div className="space-y-4">
            {products.items.map((product) => (
              <div className="relative flex items-center " key={product.id}>
                <div className="aspect-1 border rounded-sm overflow-hidden flex-shrink-0 w-1/6 relative">
                  <Image
                    src={product.imageString}
                    fill
                    alt={product.name}
                    className="object-cover"
                  />
                </div>

                <div className="absolute bg-gray-500 rounded-full w-6 h-6 flex items-center justify-center text-white border border-gray-600 shadow top-[-8px] left-[70px]">
                  {product.quantity}
                </div>
                <div className="w-full flex flex-col ml-4 space-y-1">
                  <p className="text-sm">{product.name}</p>
                  <p className="text-xs flex items-center text-gray-700">
                    <span className="ml-1">-{product.discountPercentage}%</span>
                    <span className="ml-1 uppercase">
                      extra reducere (-{formatCurrency(product.discountAmount)})
                    </span>
                  </p>
                </div>
                <div className="text-lg flex flex-col justify-end w-48 text-right">
                  {product.originalPrice > 0 && (
                    <p className="text-black text-sm line-through font-light opacity-60">
                      {formatCurrency(product.originalPrice)}
                    </p>
                  )}
                  <p>{formatCurrency(product.price)}</p>
                </div>
              </div>
            ))}
          </div>

          <section className="mt-4 space-y-2">
            <div role="table">
              <div
                role="row"
                className="text-sm flex items-center justify-between mb-4"
              >
                <p>Subtotal</p>
                <p>{formatCurrency(totalAmountItems)}</p>
              </div>
              {shipping && (
                <div
                  role="row"
                  className="text-sm flex items-center justify-between"
                >
                  <p>Taxă de Transport și Livrare</p>
                  {shipping === "free" && <p>free</p>}
                  {shipping === "dhl" && <p>{formatCurrency(24.99)}</p>}
                </div>
              )}
            </div>
            <div role="row" className="flex items-center justify-between">
              <div>
                <span className="text-xl font-semibold">Total</span>
              </div>
              <div className="flex items-end text-sm gap-2">
                <div className="uppercase text-gray-700">Ron</div>
                <div>
                  <span className="text-lg font-semibold">
                    {formatCurrency(totalAmount)}
                  </span>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function Form({
  user,
  shipping,
  setShipping,
  transport,
}: {
  user: CheckoutFormProps["user"];
  shipping: any;
  setShipping: any;
  transport: any;
}) {
  const [lastResult, action] = useFormState(createCheckout, undefined);

  const [tipPersoana, setTipPersoana] = useState<string>("persoana-fizica");
  const [tipAdresaFactura, setTipAdresaFactura] =
    useState<string>("same-address");
  const [termeniSiConditii, setTermeniSiConditii] = useState<boolean>(false);

  const [payment, setPayment] = useState<string>("card");

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ceckoutSchema });
    },

    shouldValidate: "onBlur",
    shouldRevalidate: "onInput",
  });

  const handleChange = (event: any, setState: Function) => {
    setState(event.target.value);
  };

  if (transport === "gratuit") {
    setShipping("free");
  }

  if (transport === "plata") {
    setShipping("dhl");
  }

  const countyOptions = județeRomânia.map((judet, index) => (
    <SelectItem key={index} value={judet.romanian}>
      {judet.romanian}
    </SelectItem>
  ));

  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <Card className="border-none shadow-none">
        <CardContent>
          {user ? (
            <div>
              <input
                type="hidden"
                value={user.email}
                key={fields.email.key}
                name={fields.email.name}
              />
              <Accordion
                type="single"
                collapsible
                className="w-full"
                defaultValue={"item-2"}
              >
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-md text-gray-700 hover:no-underline hover:text-primary">
                    <div className="flex flex-col items-start space-y-2">
                      <h4 className="font-normal">Cont</h4>
                      <p className="text-sm text-secondary-foreground">
                        {user.email}
                      </p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>Deconectează-te</AccordionContent>
                </AccordionItem>
                <AccordionAddress fields={fields} user={user} />
              </Accordion>
            </div>
          ) : (
            <div className="space-y-4">
              <Card className="mb-4">
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
                          <Label htmlFor="persoana-fizica">
                            Persoana Fizica
                          </Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem
                            value="persoana-juridica"
                            id="persoana-juridica"
                          />
                          <Label htmlFor="persoana-juridica">
                            Persoana Juridica
                          </Label>
                        </div>
                      </div>
                    </RadioGroup>
                  </div>
                </CardContent>
              </Card>
              {tipPersoana === "persoana-fizica" && (
                <PersoanaFizica fields={fields} />
              )}

              {tipPersoana === "persoana-juridica" && (
                <div className="space-y-4">
                  <PersoanaJuridica fields={fields} />
                  <PersoanaFizica fields={fields} tipPersoana={tipPersoana} />
                </div>
              )}

              {/* <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Contact</h3>
                <div className="text-sm text-gray-600">
                  Ai deja un cont?
                  <Button
                    variant="link"
                    asChild
                    className="text-gray-700 p-1 group-hover:text-gray-900 underline"
                  >
                    Autentifica-te
                  </Button>
                </div>
              </div> */}

              {/* <div className="flex flex-col gap-3">
                <Input
                  type="text"
                  key={fields.email.key}
                  name={fields.email.name}
                  defaultValue={fields.email.initialValue}
                  className={
                    fields.email.errors
                      ? "w-full border-red-500 border-2"
                      : "w-full"
                  }
                  placeholder="Email"
                />
                <p className="text-red-500 text-sm">{fields.email.errors}</p>
              </div> */}

              {/* livrare */}

              <ShippingForm fields={fields} user={user} />

              <AdresaDeFacturare
                fields={fields}
                tipAdresaFactura={tipAdresaFactura}
                setTipAdresaFactura={setTipAdresaFactura}
              />
            </div>
          )}

          {/* Shipping method */}
          <Card className="mt-4 space-y-2">
            <CardHeader className="p-0 bg-primary px-2 text-white py-1 overflow-hidden rounded-t-md font-semibold">
              Metoda de livrare
            </CardHeader>

            <CardContent>
              <RadioGroup
                className="gap-0"
                defaultValue={transport === "gratuit" ? "free" : "dhl"}
                key={fields.shipping.key}
                name={fields.shipping.name}
                onChange={(event) => handleChange(event, setShipping)}
              >
                {transport === "gratuit" ? (
                  <Label
                    className={`flex items-center space-x-2 w-full   text-end px-4 py-4 cursor-pointer ${
                      shipping === "free"
                        ? "bg-primary/20 border rounded-lg"
                        : "border rounded-lg"
                    }`}
                  >
                    <RadioGroupItem value="free" id="free" />
                    <div className="flex w-full justify-between items-center">
                      <p>Livrare GRATUITĂ</p>
                      <p>Free</p>
                    </div>
                  </Label>
                ) : (
                  <Label
                    className={`flex items-center space-x-2 w-full  text-end px-4 py-4 cursor-pointer ${
                      shipping === "dhl"
                        ? "bg-primary/20 border rounded-lg"
                        : "border rounded-lg"
                    }`}
                  >
                    <RadioGroupItem value="dhl" id="dhl" />
                    <div className="flex w-full justify-between items-center">
                      <p className="text-sm text-start">Taxă de Transport</p>
                      <p>{formatCurrency(24.99)}</p>
                    </div>
                  </Label>
                )}
              </RadioGroup>
            </CardContent>
          </Card>

          {/* Payment */}
          <Card className="mt-4 space-y-2">
            <CardHeader className="p-0 bg-primary px-2 text-white py-1 overflow-hidden rounded-t-md font-semibold">
              Metoda de plată
            </CardHeader>

            <CardContent className="border-none">
              <CardDescription>
                Toate tranzacțiile sunt securizate și criptate.
              </CardDescription>
              <div>
                <RadioGroup
                  className="gap-0 space-y-4"
                  defaultValue="card"
                  key={fields.payment.key}
                  name={fields.payment.name}
                  onChange={(event) => handleChange(event, setPayment)}
                >
                  <Label
                    className={`flex items-center space-x-2 w-full   text-end px-4 py-4 cursor-pointer ${
                      payment === "ramburs"
                        ? "bg-primary/20 border rounded-lg"
                        : "border rounded-lg"
                    }`}
                  >
                    <RadioGroupItem value="ramburs" id="ramburs" />
                    <div className="flex w-full justify-between items-center">
                      <p className="text-sm text-start">
                        Plata in sistem ramburs
                        <br />
                        <span className="text-xs font-light text-gray-500">
                          Vei efectua plata in momentul in care curierul iti va
                          livra comanda.
                        </span>
                      </p>
                      <p>
                        <img className="w-10 h-10" src="/dollar.png" />
                      </p>
                    </div>
                  </Label>
                  <Label
                    className={`flex items-center space-x-2 w-full  text-end px-4 py-4 cursor-pointer ${
                      payment === "card"
                        ? "bg-primary/20 border rounded-lg"
                        : "border rounded-lg"
                    }`}
                  >
                    <RadioGroupItem value="card" id="card" />
                    <div className="flex w-full justify-between items-center">
                      <p className="text-sm text-start">
                        Plata online cu cardul - Stripe <br />
                        <span className="text-xs font-light text-gray-500">
                          Toate tranzactiile sunt securizate. Datele tale sunt
                          encriptate si nu vor fi stocate.
                        </span>
                      </p>
                      <p>
                        <img
                          className="w-[120px] "
                          src="/visa-mastercard.png"
                        />
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
              </div>
            </CardContent>
          </Card>

          {/* Termeni si conditii */}
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox
              required
              id="terms"
              key={fields.termeniSiConditii.key}
              name={fields.termeniSiConditii.name}
              // onChange={(event) => handleChange(event, setTermeniSiConditii)}
            />
            <label
              htmlFor="terms"
              className="text-sm font-light leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              Accept{" "}
              <Link className="text-primary font-normal" href={"#"}>
                termenii si conditiile
              </Link>{" "}
              website-ului si,
              <br />
              in conformitate cu{" "}
              <Link className="text-primary font-normal" href={"#"}>
                Politica de Protectie a Datelor Personale
              </Link>
              ,
              <br />
              sunt de acord cu prelucrarea datelor mele cu caracter personal
              completate in formular.
            </label>
          </div>
        </CardContent>
        <CardFooter>
          <ChceckoutButton />
        </CardFooter>
      </Card>
    </form>
  );
}
