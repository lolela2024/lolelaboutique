import { unstable_noStore as  noStore} from "next/cache";
import prisma from "@/app/lib/db";
import ProductFilter from "@/app/components/storefront/ProductFilter";
import { cookies } from "next/headers";
import { Wishlist } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";

async function getTipBijuterie() {
  const data = await prisma.material.findMany();

  return data
}

export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  noStore();
  const tipBijuterii = await getTipBijuterie();

  const cookieStore = cookies();
  const wishlistId = cookieStore.get("wishlistId")?.value;

  const wishlist: Wishlist | null = await redis.get(`wishlist-${wishlistId}`);

  return (
    <ProductFilter params={params} wishlist={wishlist} tipBijuterii={tipBijuterii}/>
  );
}