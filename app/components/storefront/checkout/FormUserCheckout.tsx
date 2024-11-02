import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import React, { useState } from "react";
import UserCheckout from "../UserCheckout";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { formatCurrency } from "@/app/lib/formatters";
import { Checkbox } from "@/components/ui/checkbox";
import Link from "next/link";
import { ChceckoutButton } from "../../SubmitButtons";
import { useFormState } from "react-dom";
import { useForm } from "@conform-to/react";
import { parseWithZod } from "@conform-to/zod";
import { CheckoutFormProps } from "@/app/types/types";
import { ceckoutSchemaUser } from "@/app/lib/schemas/userSchemaCheckout";
import { createCheckoutUser } from "@/app/actions/createCheckoutUser";
import AdresaDeFacturare from "../AdresaDeFacturare";
import Image from "next/image";

export default function FormUserCheckout({
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
  const [lastResult, action] = useFormState(createCheckoutUser, undefined);
  const [termeniSiConditii, setTermeniSiConditii] = useState<boolean>(false);
  const [tipAdresaFactura, setTipAdresaFactura] =
    useState<string>("same-address");
  const [tipPersoana, setTipPersoana] = useState<string>("persoana-fizica");
  const [payment, setPayment] = useState<string>("card");

  const [form, fields] = useForm({
    lastResult,

    onValidate({ formData }) {
      return parseWithZod(formData, { schema: ceckoutSchemaUser });
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
    <Card className="border-none shadow-none">
      <CardContent>
        <UserCheckout
          user={user}
          address={address}
          fields={fields}
          persoanaJuridica={persoanaJuridica}
          tipPersoana={tipPersoana}
          setTipPersoana={setTipPersoana}
        />
        <form id={form.id} onSubmit={form.onSubmit} action={action}>
          <input type="hidden" value={tipPersoana} onChange={(ev)=>setTipPersoana(ev.target.value)} name={fields.tipPersoana.name} key={fields.tipPersoana.key}/>
          <AdresaDeFacturare
            fields={fields}
            tipAdresaFactura={tipAdresaFactura}
            setTipAdresaFactura={setTipAdresaFactura}
          />
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
                        <Image className="w-10 h-10" src="/dollar.png" alt="dollar" width={40} height={40}/>
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
                        <Image
                          className="w-[120px] "
                          src="/visa-mastercard.png"
                          alt="visa-mastercard"
                          width={80}
                          height={80}
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
          
          <ChceckoutButton
            address={address}
            user={user}
            firma={persoanaJuridica}
            tipPersoana={tipPersoana}
          />
        </form>
      </CardContent>
    </Card>
  );
}
