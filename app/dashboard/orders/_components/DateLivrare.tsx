import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React from "react";
import MenuCustomer from "./MenuCustomer";

export default function DateLivrare({data}:{data:any}) {
  return (
    <Card>
      <CardHeader className="p-0 px-4 pt-4">
        <div className="flex items-center justify-between">
          <h4 className="text-base">Customer</h4>
          <MenuCustomer />
        </div>
      </CardHeader>
      <CardContent className="p-0 px-4 pb-4 text-sm text-gray-700">
        <p>
          {data?.Customer?.firstName || data?.User?.firstName}{" "}
          {data?.Customer?.lastName || data?.User?.lastName}{" "}
        </p>
        <h4 className="my-4 text-black text-base">Contact information</h4>
        <p>{data?.Customer?.email || data?.User?.email}</p>
        <p>
          {data?.Customer?.mobilePhone || data?.User?.phone
            ? data.Customer?.mobilePhone || data.User?.phone
            : "No phone number"}
        </p>
        <h4 className="my-4 text-black text-base">Shipping address</h4>
        <p>
          {data?.Customer?.firstName || data?.User?.firstName}{" "}
          {data?.Customer?.lastName || data?.User?.lastName}
        </p>
        <p>
          {data?.shippingAddress?.strada} {data?.shippingAddress?.numar}
        </p>

        {/* {data?.shippingAddress?.company ? (
      <p>Company: {data?.shippingAddress?.company}</p>
    ) : null} */}
        <p>
          {data?.shippingAddress?.codPostal} {data?.shippingAddress?.localitate}
        </p>
        <p>{data?.shippingAddress?.judet}</p>
        <p>{"Romania"}</p>
        <h4 className="my-4 text-black text-base">Billing address</h4>
        {data?.adresaFacturare ? (
          <div>
            <p>
              {data.Customer?.firstName || data.User?.firstName}{" "}
              {data.Customer?.lastName || data.User?.lastName}
            </p>
            {data?.tipPersoana === "persoana-juridica" ? (
              <p>Company: {data?.dateFacturare?.numeFirma}</p>
            ) : null}
            <p>
              {data.adresaFacturare.strada} {data.adresaFacturare.numar}
            </p>
            <p>
              {data.adresaFacturare.codPostal} {data.adresaFacturare.localitate}
            </p>
            <p>{data.adresaFacturare.judet}</p>
          </div>
        ) : (
          "Same as shipping address"
        )}
      </CardContent>
    </Card>
  );
}
