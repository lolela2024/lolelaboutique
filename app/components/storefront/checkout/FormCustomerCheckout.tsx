import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import React, { useState } from "react";
import PersoanaFizica from "../PersoanaFizica";
import PersoanaJuridica from "../PersoanaJuridica";
import ShippingForm from "../ShippingForm";
import AdresaDeFacturare from "../AdresaDeFacturare";
import { formatCurrency } from "@/app/lib/formatters";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ChceckoutButton } from "../../SubmitButtons";
import { useFormState } from "react-dom";
import { createCheckout } from "@/app/actions/createCeckout";
import { ceckoutSchema } from "@/app/lib/zodSchemas";
import { parseWithZod } from "@conform-to/zod";
import { useForm } from "@conform-to/react";
import { CheckoutFormProps } from "@/app/types/types";

export default function FormCustomerCheckout({
  transport,
  setShipping,
  shipping,
  user,
  address,
}: {
  transport: any;
  setShipping: any;
  shipping: any;
  user: CheckoutFormProps["user"];
  address: CheckoutFormProps["address"];
}) {
  const [lastResult, action] = useFormState(createCheckout, undefined);
  const [tipPersoana, setTipPersoana] = useState<string>("persoana-fizica");
  const [tipAdresaFactura, setTipAdresaFactura] = useState<string>("same-address");
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
  return (
    <form id={form.id} onSubmit={form.onSubmit} action={action}>
      <Card className="border-none shadow-none">
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-2">
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
            </div>
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
                        <Label htmlFor="persoana-fizica">Persoana Fizica</Label>
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

            {/* livrare */}

            <ShippingForm fields={fields} user={user} address={address} />

            <AdresaDeFacturare
              fields={fields}
              tipAdresaFactura={tipAdresaFactura}
              setTipAdresaFactura={setTipAdresaFactura}
            />
          </div>

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
