import React from "react";
import FooterAccount from "../_components/FooterAccount";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import AddButton from "../_components/AddButton";
import { auth } from "@/auth";
import prisma from "@/app/lib/db";
import { unstable_noStore as noStore } from "next/cache";
import { Button } from "@/components/ui/button";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBin5Line } from "react-icons/ri";
import EditButton from "../_components/EditButton";
import DeleteAddress from "../_components/DeleteAddress";

async function getData(userId: string) {
  const data = await prisma.address.findFirst({
    where: { userId: userId },
  });

  return data;
}

export default async function AddressPage() {
  noStore();

  const session = await auth();
  const user = session?.user;

  const data = await getData(user?.id as string);

  return (
    <div className="space-y-6">
      <h1 className="text-lg lg:text-2xl font-semibold mb-4">
        LIVRARE & FACTURARE
      </h1>
      <div className="lg:grid lg:grid-cols-2 lg:gap-4">
        {data ? (
          <Card>
            <CardContent className="py-4">
              <h3 className="font-medium">
                {user?.firstName} {user?.lastName}
              </h3>
              <p className="text-gray-600">
                <span>
                  {data.strada} {data.numar},
                </span>
                  {/* {data.bloc && <span>Bloc: {data.bloc}, </span>}
                  {data.scara && <span>Scara: {data.scara}, </span>}
                  {data.etaj && <span>Etaj: {data.etaj}, </span>}
                  {data.apartament && <span>Ap: {data.apartament}</span>} */}
                <br />
                <span>
                  {data.localitate}, {data.judet},
                </span>
                <br />
                <span>{data.codPostal}</span>
              </p>
            </CardContent>
            <CardFooter className="justify-center">
              <div className="flex items-center justify-center gap-4">
                <EditButton
                  className="gap-1"
                  variant="ghost"
                  href={`/account/address/${data.id}`}
                  size="sm"
                >
                  <FaRegEdit />
                  Modifica
                </EditButton>
                <DeleteAddress addressId={data.id} />
              </div>
            </CardFooter>
          </Card>
        ) : (
          <div className="space-y-2">
            <h4>Pana acum nu ai adaugat nici o adresa de livrare.</h4>
            <Card className="border-dashed shadow-none">
              <CardContent className="flex items-center text-center h-40 p-5 justify-center">
                <AddButton
                  name="Adauga adresa noua"
                  href="/account/address/create-address"
                />
              </CardContent>
            </Card>
          </div>
        )}

        <div className="space-y-2">
          <h4>Pana acum nu ai adaugat firme.</h4>
          <Card className="border-dashed shadow-none">
            <CardContent className="flex items-center text-center h-40 p-5 justify-center">
              <AddButton
                name="Adauga firma noua"
                href="/account/address/create-company"
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <FooterAccount />
    </div>
  );
}
