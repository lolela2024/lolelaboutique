"use client";

import { createCeckout } from "@/app/actions/createCeckout";
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

  const [shipping, setSipping] = useState<string>("free");
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
            setSipping={setSipping}
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
  setSipping,
  transport,
}: {
  user: CheckoutFormProps["user"];
  shipping: any;
  setSipping: any;
  transport: any;
}) {
  const [lastResult, action] = useFormState(createCeckout, undefined);

  const [billingAddress, setBillingAddress] = useState<string>("same-address");
  const [tipPersoana, setTipPersoana] = useState<string>("persoana-fizica");

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
    setSipping("free");
  }

  if (transport === "plata") {
    setSipping("dhl");
  }

  console.log(tipPersoana);
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
                  <PersoanaFizica fields={fields} />
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
                onChange={(event) => handleChange(event, setSipping)}
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
          {/* Billing address */}
          {/* <div className="mt-4 space-y-2">
            <h3 className="font-semibold">Billing address</h3>
            <Card className="border-none">
              <div className="">
                <RadioGroup
                  className="gap-0"
                  defaultValue="same-address"
                  key={fields.billingAddress.key}
                  name={fields.billingAddress.name}
                  onChange={(event) => handleChange(event, setBillingAddress)}
                >
                  <Label
                    className={`flex items-center space-x-2 w-full text-end px-4 py-4 cursor-pointer ${
                      billingAddress === "same-address"
                        ? "bg-red-100 border border-red-500 rounded-t-sm"
                        : "border rounded-t-sm"
                    }`}
                  >
                    <RadioGroupItem value="same-address" id="same-address" />
                    <div className="flex w-full justify-between items-center">
                      <p className="text-sm text-start">
                        Same as shipping address
                      </p>
                    </div>
                  </Label>
                  <Label
                    className={`flex items-center space-x-2 w-full  text-end px-4 py-4 cursor-pointer ${
                      billingAddress === "different-address"
                        ? "bg-red-100 overflow-hidden border border-red-500 "
                        : "rounded-b-sm border"
                    }`}
                  >
                    <RadioGroupItem
                      value="different-address"
                      id="different-address"
                    />
                    <div className="flex w-full justify-between items-center">
                      <p className="text-sm text-start">
                        Use a different billing address
                      </p>
                    </div>
                  </Label>
                </RadioGroup>
                {billingAddress === "different-address" && (
                  <div className="border bg-[#f5f5f5] rounded-b-sm transition ease-in-out pt-4">
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex flex-col gap-3 mt-4">
                          <Label>Country</Label>
                          <Select
                            key={fields.countryBilling.key}
                            name={fields.countryBilling.name}
                            defaultValue={"romania"}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select Country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="romania">Romania</SelectItem>
                              <SelectItem value="germany">Germany</SelectItem>
                              <SelectItem value="hungary">Hungary</SelectItem>
                            </SelectContent>
                          </Select>
                          <p className="text-red-500 text-sm">
                            {fields.countryBilling.errors}
                          </p>
                        </div>
                        <div className="flex gap-4">
                          <div className="flex flex-col gap-3 w-full">
                            <Input
                              type="text"
                              key={fields.firstNameBilling.key}
                              name={fields.firstNameBilling.name}
                              defaultValue={
                                fields.firstNameBilling.initialValue
                              }
                              className={
                                fields.firstNameBilling.errors
                                  ? "w-full border-red-500 border-2"
                                  : "w-full"
                              }
                              placeholder="First name"
                            />
                            <p className="text-red-500 text-sm">
                              {fields.firstNameBilling.errors}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3 w-full">
                            <Input
                              type="text"
                              key={fields.lastNameBilling.key}
                              name={fields.lastNameBilling.name}
                              defaultValue={fields.lastNameBilling.initialValue}
                              className={
                                fields.lastNameBilling.errors
                                  ? "w-full border-red-500 border-2"
                                  : "w-full"
                              }
                              placeholder="Last name"
                            />
                            <p className="text-red-500 text-sm">
                              {fields.lastNameBilling.errors}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <Input
                            type="text"
                            key={fields.companyBilling.key}
                            name={fields.companyBilling.name}
                            defaultValue={fields.companyBilling.initialValue}
                            className={
                              fields.companyBilling.errors
                                ? "w-full border-red-500 border-2"
                                : "w-full"
                            }
                            placeholder="Company (optional)"
                          />
                          <p className="text-red-500 text-sm">
                            {fields.companyBilling.errors}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <Input
                            type="text"
                            key={fields.addressBilling.key}
                            name={fields.addressBilling.name}
                            defaultValue={fields.addressBilling.initialValue}
                            className={
                              fields.addressBilling.errors
                                ? "w-full border-red-500 border-2"
                                : "w-full"
                            }
                            placeholder="Address"
                          />
                          <p className="text-red-500 text-sm">
                            {fields.addressBilling.errors}
                          </p>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <Input
                            type="text"
                            key={fields.address2Billing.key}
                            name={fields.address2Billing.name}
                            defaultValue={fields.address2Billing.initialValue}
                            className={
                              fields.address2.errors
                                ? "w-full border-red-500 border-2"
                                : "w-full"
                            }
                            placeholder="Apartment, suite, etc. (optional)"
                          />
                          <p className="text-red-500 text-sm">
                            {fields.address2Billing.errors}
                          </p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-3 w-full">
                            <Input
                              type="text"
                              key={fields.postalCodeBilling.key}
                              name={fields.postalCodeBilling.name}
                              defaultValue={
                                fields.postalCodeBilling.initialValue
                              }
                              className={
                                fields.postalCodeBilling.errors
                                  ? "w-full border-red-500 border-2"
                                  : "w-full text-[11px]"
                              }
                              placeholder="Postal code (optional)"
                            />
                            <p className="text-red-500 text-sm">
                              {fields.postalCodeBilling.errors}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3 w-full">
                            <Input
                              type="text"
                              key={fields.cityBilling.key}
                              name={fields.cityBilling.name}
                              defaultValue={fields.cityBilling.initialValue}
                              className={
                                fields.cityBilling.errors
                                  ? "w-full border-red-500 border-2"
                                  : "w-full"
                              }
                              placeholder="City"
                            />
                            <p className="text-red-500 text-xs">
                              {fields.cityBilling.errors}
                            </p>
                          </div>
                          <div className="flex flex-col gap-3 ">
                            <Select
                              key={fields.countyBilling.key}
                              name={fields.countyBilling.name}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="County" />
                              </SelectTrigger>
                              <SelectContent>{countyOptions}</SelectContent>
                            </Select>
                            <p className="text-red-500 text-xs">
                              {fields.countyBilling.errors}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-col gap-3 w-full">
                          <Input
                            type="text"
                            key={fields.phoneBilling.key}
                            name={fields.phoneBilling.name}
                            defaultValue={fields.phoneBilling.initialValue}
                            className={
                              fields.phoneBilling.errors
                                ? "w-full border-red-500 border-2"
                                : "w-full"
                            }
                            placeholder="Phone (optional)"
                          />
                          <p className="text-red-500 text-xs">
                            {fields.phoneBilling.errors}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </div>
                )}
              </div>
            </Card>
          </div> */}

          {/* Termeni si conditii */}
          <div className="flex items-center space-x-2 mt-4">
            <Checkbox id="terms" />
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
