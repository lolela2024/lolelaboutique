import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import React from "react";
import { unstable_noStore as noStore } from "next/cache";
import { Form } from "../_components/Form";
import { auth } from "@/auth";

async function getData(verify: string) {
  const data = await prisma.order.findFirst({
    where: { verify: verify },
    select: {
      shippingAddress: true,
      Customer: true,
      billingAddress: true,
      createdAt: true,
      orderNumber: true,
      payment: true,
      shippingMethod: true,
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export default async function CheckoutComenzi({
  searchParams,
}: {
  searchParams: { verify: string };
}) {
  noStore();
  const session = await auth();
  const user = session?.user;

  let userBazaDeDate = undefined;

  if (user?.email) {
    const userData = await prisma.user.findFirst({
      where: { email: user.email },
      select: {
        email: true,
        firstName: true,
        lastName: true,
        profileImage: true,
        address: true,
        billingAddress: true,
        phone: true || undefined,
      },
    });

    if (userData) {
      // Redă utilizatorul din baza de date
      userBazaDeDate = userData;
    } else {
      // Dacă utilizatorul nu a fost găsit în baza de date, gestionează eroarea
      console.log("User not found in the database.");
    }
  } else {
    // Dacă utilizatorul nu este autentificat sau nu are un email, aruncă o eroare sau redirecționează
    console.log("User is not authenticated or email is missing.");
  }

  const data = await getData(searchParams.verify);

  const formattedTime = data.createdAt.toLocaleDateString("ro-RO");
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <h1 className="text-2xl mt-4 font-semibold">
        {user ? userBazaDeDate?.firstName : data.Customer?.firstName}, iti
        multumim pentru comanda!
      </h1>
      <br />
      <p className="font-light">
        In curand vei primi un email de la noi in care iti vom confirma
        inregistrarea comenzii si in care vei regasi toate detaliile.
      </p>
      <p className="font-light">
        Deoarece ai ales sa platesti ramburs, va fi necesar sa achiti
        contravaloarea comenzii in momentul livrarii.
      </p>
      <br />
      <p className="font-semibold">
        Comanda: <span className="font-light">{data.orderNumber}</span>
      </p>
      <p className="font-semibold">
        Status: <span className="font-light">Comanda plasata</span>
      </p>
      <p className="font-semibold">
        Data: <span className="font-light">{formattedTime}</span>
      </p>
      <p className="font-semibold">
        Metoda de plata:{" "}
        <span className="font-light">Plata in sistem ramburs</span>
      </p>
      <p className="font-semibold">
        Metoda de livrare: <span className="font-light">Livrare la adresa</span>
      </p>
      <p className="font-semibold">
        Durata de livrare:{" "}
        <span className="font-light">Livrare in 1-2 zile</span>
      </p>
      <br />
      <div className="flex flex-wrap gap-4">
        <div className="flex-grow">
          <p className="font-semibold">Date facturare</p>
          {data.billingAddress ? (
            <>
              <p className="font-light">
                {data.billingAddress.firstName} {data.billingAddress.lastName}
              </p>
              <p className="font-light">{data.billingAddress?.address}</p>
              <p className="font-light">
                {data.billingAddress?.city}, {data.billingAddress?.county},{" "}
                {data.billingAddress?.postalCode}
              </p>
              <p className="font-light">{data.billingAddress?.phone}</p>
            </>
          ) : (
            <>
              <p>
                {data.Customer?.firstName} {data.Customer?.lastName}
              </p>
              <p>{data.shippingAddress?.address}</p>
              <p>
                {data.shippingAddress?.city}, {data.shippingAddress?.county},{" "}
                {data.shippingAddress?.postalCode}
              </p>
              <p>{user ? userBazaDeDate?.phone : data.Customer?.phone}</p>
            </>
          )}
        </div>
        <div className="flex-grow font-light">
          <p className="font-semibold">Date livrare</p>
          <p>
            {user ? userBazaDeDate?.firstName : data.Customer?.firstName} {user ? userBazaDeDate?.lastName : data.Customer?.lastName}
          </p>
          <p>{data.shippingAddress?.address}</p>
          <p>
            {data.shippingAddress?.city}, {data.shippingAddress?.county},{" "}
            {data.shippingAddress?.postalCode}
          </p>
          <p>{user ? userBazaDeDate?.phone : data.Customer?.phone}</p>
        </div>
      </div>
      <br />
      {!user && (
        <>
          <h1 className="text-2xl mt-4 font-semibold">
            Vrei sa comanzi mai rapid pe viitor?
          </h1>
          <p className="font-light">
            Introdu o parola si creeaza-ti un cont de client. Iti vei putea
            urmari si administra comenzile mai usor.
          </p>
        </>
      )}

      <Form user={user} />
    </div>
  );
}
