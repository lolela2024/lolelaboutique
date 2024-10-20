import prisma from "@/app/lib/db";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import React, { Fragment } from "react";
import { cn } from "../../../../lib/utils";
import MenuFulfilled from "../_components/MenuFulfilled";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { formatCurrency } from "../../../lib/formatters";
import MenuCustomer from "../_components/MenuCustomer";
import { OrderStatus } from "@prisma/client";
import HeaderMenu from "../_components/HeaderMenu";
import MenuStatus from "../_components/MenuStatus";
import PersoanaJuridica from "../../../components/storefront/PersoanaJuridica";
import { Button } from "@/components/ui/button";
import { Item } from "@radix-ui/react-dropdown-menu";
import { unstable_noStore } from "next/cache";
import Link from "next/link";

async function getData(id: string) {
  const data = await prisma.order.findUnique({
    where: { id },
    include: {
      shippingAddress: true,
      adresaFacturare: true,
      dateFacturare: true,
      User: true,
      Customer: true,
      _count: {
        select: {
          products: true,
        },
      },
      products: {
        include: {
          Product: true,
        },
      },
    },
  });

  return data;
}

export default async function EditOrder({
  params,
}: {
  params: { id: string };
}) {
  unstable_noStore();
  const data = await getData(params.id);

  const totalItems = data?.products.reduce((total, product) => {
    return total + product.quantity;
  }, 0);

  return (
    <>
      <HeaderMenu
        orderNumer={data?.orderNumber}
        status={data?.status}
        fulfilled={data?.fulfilled}
        createdAt={data?.createdAt}
      />

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 space-y-6">
          <Card className="px-4 pb-4">
            <CardHeader className="p-0 py-4 text-sm font-light">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className={cn(
                      data?.fulfilled === "Unfulfilled"
                        ? "bg-yellow-300"
                        : "bg-green-300",
                      "py-1 px-2 rounded-md"
                    )}
                  >
                    {data?.fulfilled} ({totalItems})
                  </div>
                  <span className="ml-4">#{data?.orderNumber}</span>
                </div>
                <MenuFulfilled fulfill={data?.fulfilled} orderId={data?.id} />
              </div>
            </CardHeader>
            <CardContent className="border rounded-sm pt-2">
              {data?.fulfilled === "Fulfilled" && (
                <div className="mb-4">
                  <p className="text-gray-600">Fulfilled</p>
                  <p>
                    {data.updatedAt
                      ? data.updatedAt.toLocaleDateString("ro-RO", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                        })
                      : "Data indisponibilă"}
                  </p>
                </div>
              )}

              <div>
                <p className="text-gray-600">Delivery method</p>
                <p>Standard</p>
              </div>
              <Separator className="mt-4" />
              <div>
                {data?.products.map((product) => (
                  <Fragment key={product.id}>
                    <div className="mt-4 flex gap-4">
                      <div className="aspect-1 border rounded-sm overflow-hidden flex-shrink-0 w-1/12 relative">
                        <Image
                          src={product.Product.images[0]}
                          fill
                          alt={product.Product.name}
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-1 w-full gap-4">
                        <p className="w-1/2 font-semibold">
                          {product.Product.name}
                        </p>
                        <div className="w-1/4 text-center">
                          {formatCurrency(product.Product.price)} x{" "}
                          {product.quantity}
                        </div>
                        <div className="w-1/4 text-right">
                          {formatCurrency(
                            product.Product.price * product.quantity
                          )}
                        </div>
                      </div>
                    </div>
                    <Separator className="mt-4" />
                  </Fragment>
                ))}
              </div>
              <div className="flex items-center justify-end mt-4">
                {data?.fulfilled === "Unfulfilled" && (
                  <Link href={`/dashboard/orders/${data.id}/fulfillment_orders`}>
                    <Button variant={"dashboard"} size={"sm"}>
                      Fulfill item
                    </Button>
                  </Link>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="px-4 pb-4">
            <CardHeader className="p-0 px-4 py-4 ">
              <div className="flex  items-start justify-between">
                <p
                  className={cn(
                    data?.status === OrderStatus.pending && "bg-red-200",
                    data?.status === OrderStatus.completed && "bg-green-200",
                    data?.status === OrderStatus.refunded && "bg-gray-200",
                    data?.status === OrderStatus.cancelled && "bg-yellow-200",
                    "px-2 py-1 rounded-lg capitalize text-sm"
                  )}
                >
                  {data?.status}
                </p>
                {/* menu order */}
                {data?.payment === "ramburs" && (
                  <MenuStatus orderId={data?.id} />
                )}
              </div>
            </CardHeader>
            <CardContent className="border rounded-sm pt-2 space-y-2">
              <h3>Metoda de plata: {data?.payment}</h3>
              <div className="grid grid-cols-3 text-sm pt-4">
                <div className="col-span-1">Subtotal</div>
                <div className="col-span-2">
                  <div className="flex justify-between">
                    <div>
                      {data?._count.products}{" "}
                      {data?._count.products === 1 ? "item" : "items"}
                    </div>
                    <div>{formatCurrency(data?.amount as number)}</div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-3 text-sm">
                <div className="col-span-1">Shipping</div>
                <div className="col-span-2">
                  <div className="flex justify-between">
                    {data?.shippingMethod !== "free" && <div>Standard</div>}
                    <div>
                      {data?.shippingMethod === "dhl" && formatCurrency(24.99)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between text-sm font-semibold">
                <p>Total</p>
                <p>{data?.amount ? formatCurrency(data?.amount + 24.99) : 0}</p>
              </div>

              {data?.status === OrderStatus.completed && (
                <>
                  <Separator />
                  <div className="flex justify-between text-sm font-semibold">
                    <p>Paid</p>
                    <p>
                      {data?.amount ? formatCurrency(data?.amount + 24.99) : 0}
                    </p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="col-span-1">
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
                {data?.shippingAddress?.codPostal}{" "}
                {data?.shippingAddress?.localitate}
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
                    {data.adresaFacturare.codPostal}{" "}
                    {data.adresaFacturare.localitate}
                  </p>
                  <p>{data.adresaFacturare.judet}</p>
                </div>
              ) : (
                "Same as shipping address"
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
