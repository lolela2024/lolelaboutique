import WishlistForm from "@/app/components/storefront/WishlistForm";
import { Wishlist } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";
import { Separator } from "@/components/ui/separator";
import { cookies } from "next/headers";
import React from "react";

export default async function WishlistPage() {
  const cookieStore = cookies();
  const wishilistId = cookieStore.get("wishlistId")?.value;

  const wishlist: Wishlist | null = await redis.get(`wishlist-${wishilistId}`);


  return (
    <>
      <div className="space-y-2 ">
        <h2 className="uppercase font-semibold">Produse Favorite</h2>
        <h3>Wishlist</h3>
      </div>
      <Separator className="my-4"/>
      <div>
        {wishlist?.items.map((item) => (
          <WishlistForm key={item.id} item={item}/>
        ))}
        {wishlist?.items.length === 0 && (
          <h3>Nu exista produse adaugate in lista ta de produse.</h3>
        )}
      </div>
    </>
  );
}
