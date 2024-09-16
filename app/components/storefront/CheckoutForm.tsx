"use client";

import React, { FormEvent, useState } from "react";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import { formatCurrency } from "@/app/lib/formatters";
import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Cart } from "@/app/lib/interfaces";


type CheckoutFormProps = {
  products: Cart;
  clientSecret: string;
  user: {
    id: string;
    email: any;
    family_name: any;
    given_name: any;
  };
};

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY as string
);

export default function CheckoutForm({
  products,
  clientSecret,
  user,
}: CheckoutFormProps) {

  const totalAmount = products.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <div className="max-w-6xl w-full mx-auto space-y-8">
      <div className="grid lg:grid-cols-2">
        <div className="bg-white">
          <Elements options={{ clientSecret }} stripe={stripePromise}>
            <Form totalAmount={totalAmount} user={user} />
          </Elements>
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
                className="text-sm flex items-center justify-between"
              >
                <p>Subtotal</p>
                <p>{formatCurrency(totalAmount)}</p>
              </div>
              <div role="row"></div>
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
  totalAmount,
  user,
}: {
  totalAmount: number;
  user: { id: string; email: any; family_name: any; given_name: any };
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>();
  const [email, setEmail] = useState<string>();
  const [paymentMethod, setPaymentMethod] = useState<string>("card");

 
  async function handleSubmit(e: FormEvent) {
    e.preventDefault();

   

    if (paymentMethod === "card") {
      if (stripe == null || elements == null) return;

      setIsLoading(true);

      stripe
        .confirmPayment({
          elements,
          confirmParams: {
            return_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/purchase-success`,
          },
        })
        .then(({ error }) => {
          if (
            error.type === "card_error" ||
            error.type === "validation_error"
          ) {
            setErrorMessage(error.message);
          } else {
            setErrorMessage("An unknown error occurred");
          }
        })
        .finally(() => setIsLoading(false));
    } else if (paymentMethod === "cash_on_delivery") {
      // Implement logic for cash on delivery (e.g., finalize order, notify backend)
      console.log("Order placed with cash on delivery");
      // Redirect to success page or show confirmation
      window.location.href = `${process.env.NEXT_PUBLIC_SERVER_URL}/payment/success`;
    }
  }

  return (
    // <form onSubmit={handleSubmit}>
    //   <div>
    //     <CardHeader>
    //       <CardTitle>Checkout</CardTitle>
    //       {errorMessage && (
    //         <CardDescription className="text-destructive">
    //           {errorMessage}
    //         </CardDescription>
    //       )}
    //     </CardHeader>
    //     <div>
    //       <PaymentElement />
    //     </div>
    //     <CardFooter>
    //       <Button
    //         type="submit"
    //         className="w-full"
    //         size={"lg"}
    //         disabled={stripe == null || elements == null || isLoading}
    //       >
    //         {isLoading
    //           ? "Purchase..."
    //           : `Purchase - ${formatCurrency(totalAmount)}`}
    //       </Button>
    //     </CardFooter>
    //   </div>
    // </form>
    <form>
      <div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Date livrare</CardTitle>
            {!user && (
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
            )}
          </div>

          {errorMessage && (
            <CardDescription className="text-destructive">
              {errorMessage}
            </CardDescription>
          )}
        </CardHeader>
        <CardContent>
        
        </CardContent>
        <div className="mb-4">
          <label
            htmlFor="payment-method"
            className="block text-sm font-medium text-gray-700"
          >
            Choose payment method:
          </label>
          <select
            id="payment-method"
            name="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          >
            <option value="card">Credit/Debit Card</option>
            <option value="cash_on_delivery">Cash on Delivery</option>
            {/* Add more payment methods here if needed */}
          </select>
        </div>
        {paymentMethod === "card" && <PaymentElement />}
        <CardFooter>
          <Button
            className="w-full"
            size={"lg"}
            disabled={stripe == null || elements == null || isLoading}
          >
            {isLoading
              ? "Processing..."
              : `Purchase - ${formatCurrency(totalAmount)}`}
          </Button>
        </CardFooter>
      </div>
    </form>
  );
}
