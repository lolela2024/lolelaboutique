import { formatCurrency } from "@/app/lib/formatters";
import { Order, User } from "@prisma/client";
import React, { Fragment } from "react";

interface iAppProps {
  data: any;
}

export default function DetaliiComanda({ data }: iAppProps) {
  return (
    <table>
      <thead>
        <tr>
          <th className="w-1/3 bg-gray-100">Status comanda:</th>
          <th className="bg-gray-100">
            {data?.fulfilled === "Fulfilled" && "Finalizata"}
            {data?.fulfilled === "Unfulfilled" && "Neîmplinit"}
            {data?.fulfilled === "PartialFulfilled" && "Implinit parțial"}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Data comenzii:</td>
          <td>
            {new Intl.DateTimeFormat("ro-RO", {
              month: "short",
              day: "numeric",
              year: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(data?.createdAt || ""))}
          </td>
        </tr>
        <tr>
          <td>Nr. factura:</td>
          <td>#{data?.orderNumber}</td>
        </tr>
        <tr>
          <td>Pret total produse:</td>
          <td>{formatCurrency(data?.amount || 0)}</td>
        </tr>
        <tr>
          <td>Discount:</td>
          <td>???</td>
        </tr>
        <tr>
          <td>Taxe transport:</td>
          <td>{data?.shippingMethod}???</td>
        </tr>
        <tr>
          <td>TOTAL:</td>
          <td>???</td>
        </tr>
        <tr>
          <td colSpan={2} className="font-semibold">
            {data?.tipPersoana === "persoana-fizica" && "Persoana Contact"}
            {data?.tipPersoana === "persoana-juridica" && "Persoana Juridica"}
          </td>
        </tr>
        {data?.tipPersoana === "persoana-fizica" && (
          <Fragment>
            <tr>
              <td>Nume:</td>
              <td>{data?.User?.lastName}</td>
            </tr>
            <tr>
              <td>Prenume:</td>
              <td>{data?.User?.firstName}</td>
            </tr>
          </Fragment>
        )}
        {data?.tipPersoana === "persoana-juridica" && (
          <Fragment>
            <tr>
              <td>Date firma</td>
            </tr>
          </Fragment>
        )}
        <tr>
          <td colSpan={2} className="font-semibold">
            Adresa
          </td>
        </tr>
        <tr>
          <td>Adresa:</td>
          <td>
            <p className="p-0">Strada: {data?.shippingAddress?.strada}</p>
            <p className="p-0">Nr: {data?.shippingAddress?.numar}</p>
            {data?.shippingAddress?.bloc && <p className="p-0">Bloc: {data?.shippingAddress?.bloc}</p>}
            {data?.shippingAddress?.scara && <p className="p-0">Scara: {data?.shippingAddress?.scara}</p>}
            {data?.shippingAddress?.etaj && <p className="p-0">Etaj: {data?.shippingAddress?.etaj}</p>}
            {data?.shippingAddress?.apartament && <p className="p-0">Apartament: {data?.shippingAddress?.apartament}</p>}
          </td>
        </tr>
        <tr>
          <td>Localitate:</td>
          <td>{data?.shippingAddress?.localitate}</td>
        </tr>
        <tr>
          <td>Judet:</td>
          <td>{data?.shippingAddress?.judet}</td>
        </tr>
        <tr>
          <td>Cod Postal:</td>
          <td>{data?.shippingAddress?.codPostal}</td>
        </tr>
        <tr>
          <td>Livrare prin:</td>
          <td>{data?.shippingMethod}</td>
        </tr>
        <tr>
          <td>Alte preferinte:</td>
          <td>{data?.shippingAddress?.alteDetalii}</td>
        </tr>
      </tbody>
    </table>
  );
}
