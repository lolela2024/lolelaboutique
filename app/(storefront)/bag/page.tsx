import {
  AddQuantityItem,
  ChceckoutButtonRedirect,
  DeleteItem,
  RemoveQuantityItem,
} from "@/app/components/SubmitButtons";
import { Cart } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { unstable_noStore as noStore } from "next/cache";

import { cookies } from "next/headers";
import {
  addQuantityItem,
  delItem,
  removeQuantityItem,
} from "@/app/actions/bag";
import { formatCurrency } from "../../lib/formatters";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert } from "@/components/ui/alert";

const pretLivrare = {
  dhl: 24.99
}

export default async function BagRoute() {
  noStore();
  const cookieStore = cookies();
  const cartId = cookieStore.get("cartId")?.value;

  let gratuit = 199;
  let transport = "plata";
  let diferenta = 0;

  const cart: Cart | null = await redis.get(`cart-${cartId}`);

  let totalPrice = 0;

  cart?.items.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  const total = cart?.items.reduce((sum, item) => sum + item.quantity, 0) || 0;

  const cartLength = cart?.items.length;

  if (totalPrice >= gratuit) {
    transport = "gratuit";
  }

  if (totalPrice < gratuit) {
    diferenta = gratuit - totalPrice;
  }

  if (!cart || !cartLength) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border border-dashed p-8 text-center mt-20">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
          <ShoppingBag className="w-10 h-10 text-primary" />
        </div>

        <h2 className="mt-6 text-xl font-semibold">
          You dont have any products in your Bag
        </h2>
        <p className="mb-8 mt-2 text-center text-sm leading-6 text-muted-foreground max-w-sm mx-auto">
          You currently dont have any products in your shopping bag. Please add
          some so that you can see them right here.
        </p>

        <Button asChild>
          <Link href="/">Shop Now!</Link>
        </Button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">COSUL DE CUMPARATURI</h1>
      <div className="grid lg:grid-cols-3 mt-4 lg:gap-6">
        <div className="col-span-2">
          <Card className="shadow-lg">
            <CardContent className="p-0 px-4 py-4">
              {cart?.items.map((item, index) => {
                const isLastItem = index === cart.items.length - 1;
                return (
                  <div key={item.id}>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-4">
                        <div className="aspect-1 border rounded-sm overflow-hidden flex-shrink-0 w-1/4 relative">
                          <Image
                            src={item.imageString}
                            fill
                            alt={item.name}
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-semibold text-sm">{item.name}</p>
                          <span className="text-gray-600 text-sm">
                            {formatCurrency(item.price)}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <form
                            action={removeQuantityItem}
                            className="text-end"
                          >
                            <input
                              type="hidden"
                              name="productId"
                              value={item.id}
                            />

                            <RemoveQuantityItem />
                          </form>
                          <button className="border px-4 py-[4px] text-sm">
                            {item.quantity}
                          </button>
                          <form action={addQuantityItem} className="text-end">
                            <input
                              type="hidden"
                              name="productId"
                              value={item.id}
                            />

                            <AddQuantityItem />
                          </form>
                        </div>
                        <div className="text-primary font-semibold">
                          {formatCurrency(item.price * item.quantity)}
                        </div>
                        <form action={delItem} className="text-end">
                          <input
                            type="hidden"
                            name="productId"
                            value={item.id}
                          />
                          <DeleteItem />
                        </form>
                      </div>
                    </div>
                    {!isLastItem && <Separator className="my-4" />}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
        <div className="col-span-1">
          <Card className="shadow-lg">
            <CardHeader className="bg-[#d1ecf1] border-b rounded-t-lg py-4 text-center text-sm font-semibold">
              {total === 1
                ? `Este 1 produs in cosul tau.`
                : `Sunt ${total} produse in cosul tau.`}
            </CardHeader>
            <CardContent className="p-0 px-4 py-4">
              <div className="flex items-center justify-between font-light mb-2">
                <p>Subtotal</p>
                <p>{formatCurrency(totalPrice)}</p>
              </div>
              <div className="flex items-center justify-between font-light">
                <p>Livrare</p>
                {transport === "plata" ? <p>{formatCurrency(pretLivrare.dhl)}</p> : <p>gratuit</p>}
              </div>
              <Separator className="my-2" />
              <div className="flex items-center justify-between font-semibold">
                <p> Total (inclusiv TVA)</p>
                <p>
                  {transport === "plata"
                    ? formatCurrency(totalPrice + pretLivrare.dhl)
                    : formatCurrency(totalPrice)}
                </p>
              </div>
              {diferenta !== 0 && (
                <Alert variant={"success"} className="px-2 py-1 text-sm">
                  Cumperi de inca <strong>{formatCurrency(diferenta)}</strong>{" "}
                  si ai transport gratuit
                </Alert>
              )}
            </CardContent>
            <CardFooter className="bg-[#f7f7f7] border-t overflow-hidden rounded-b-lg px-16">
              <ChceckoutButtonRedirect transport={transport}/>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
}
