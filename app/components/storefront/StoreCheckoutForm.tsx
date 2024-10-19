"use client";

import { formatCurrency } from "@/app/lib/formatters";
import Image from "next/image";
import React, { useState } from "react";
import { CheckoutFormProps } from "@/app/types/types";
import { useSearchParams } from "next/navigation";
import FormUserCheckout from "./checkout/FormUserCheckout";
import FormCustomerCheckout from "./checkout/FormCustomerCheckout";

export default function StoreCheckoutForm({
  products,
  user,
  address,
  persoanaJuridica,
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
            address={address}
            shipping={shipping}
            setShipping={setShipping}
            transport={transport}
            persoanaJuridica={persoanaJuridica}
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
  address,
  persoanaJuridica,
}: {
  user: CheckoutFormProps["user"];
  address: CheckoutFormProps["address"];
  persoanaJuridica: CheckoutFormProps["persoanaJuridica"];
  shipping: any;
  setShipping: any;
  transport: any;

}) {

  if (user) {
    return (
      <FormUserCheckout
        user={user}
        address={address}
        shipping={shipping}
        setShipping={setShipping}
        transport={transport}
        persoanaJuridica={persoanaJuridica}
        
      />
    );
  }

  return (
    <FormCustomerCheckout
      user={user}
      address={address}
      shipping={shipping}
      setShipping={setShipping}
      transport={transport}
    />
  );
}
