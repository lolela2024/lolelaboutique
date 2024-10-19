import prisma from "@/app/lib/db";
import { LoadingProductCard, ProductCard } from "./ProductCard";
import { Suspense } from "react";
import { unstable_noStore as noStore, revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { Wishlist } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";

async function getData() {
  const data = await prisma.product.findMany({
    where: {
      status: "published",
      isFeatured: true,
    },
    
    orderBy: {
      createdAt: "desc",
    },
    take: 12,
  });

  return data;
}

export function FeaturedProducts() {


  return (
    <div className="mb-8">
      <div className="flex">
      <h2 className="trx-title relative z-1 text-2xl font-medium tracking-tight uppercase">Produse Recomandate</h2>

      </div>
      <Suspense fallback={<LoadingRows />}>
        <LoadFeaturedproducts />
      </Suspense>
    </div>
  );
}

async function LoadFeaturedproducts() {
  noStore();
  const data = await getData();

  const cookieStore = cookies();
  const wishlistId = cookieStore.get("wishlistId")?.value;

  const wishlist: Wishlist | null = await redis.get(`wishlist-${wishlistId}`);


  return (
    <div className="mt-5 grid sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5">
      {data.map((item) => (
        <ProductCard loading key={item.id} item={item} wishlist={wishlist}/>
      ))}
    </div>
  );
}

function LoadingRows() {
  return (
    <div className="mt-5 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
      <LoadingProductCard />
      <LoadingProductCard />
      <LoadingProductCard />
    </div>
  );
}