
import { ProductCard } from "@/app/components/storefront/ProductCard";
import CategoriesHeroHolder from "@/app/components/storefront/CategoriesHeroHolder";

import axios from "axios";
import { QueriesResults, useQuery } from "@tanstack/react-query";

import { LoadingProductCard } from "@/app/components/ProductCard";

import PietrePretioaseSort from "@/app/components/storefront/sort/PietrePretioaseSort";
import PriceFilter from "@/app/components/storefront/sort/PriceFilter";
import CategoryFilter from "@/app/components/storefront/sort/CategoryFilter";
import SortFilter from "@/app/components/storefront/sort/SortFilter";
import { unstable_noStore as  noStore} from "next/cache";
import prisma from "@/app/lib/db";
import { notFound } from "next/navigation";
import { useState } from "react";
import ProductFilter from "@/app/components/storefront/ProductFilter";
import { cookies } from "next/headers";
import { Wishlist } from "@/app/lib/interfaces";
import { redis } from "@/app/lib/redis";

async function getData(productCategory: string) {
  const data = await prisma.product.findMany({
    select: {
      name: true,
      images: true,
      price: true,
      id: true,
      description: true,
    },
    where: {
      status: "published",
      productCategory: {
        slug: productCategory,
      },
    },
  });
  switch (productCategory) {
    case "all": {
      const data = await prisma.product.findMany({
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
        where: {
          status: "published",
        },
      });

      return {
        title: "All Products",
        data: data,
      };
    }
    case "cercei": {
      const data = await prisma.product.findMany({
        where: {
          status: "published",
          productCategory: {
            slug: "cercei",
          },
        },
        select: {
          name: true,
          images: true,
          price: true,
          id: true,
          description: true,
        },
      });

      return {
        title: "",
        data: data,
      };
    }
    default: {
      return notFound();
    }
  }
}



export default async function CategoriesPage({
  params,
}: {
  params: { name: string };
}) {
  noStore();
  // const { data, title } = await getData(params.name);

  const cookieStore = cookies();
  const wishlistId = cookieStore.get("wishlistId")?.value;

  const wishlist: Wishlist | null = await redis.get(`wishlist-${wishlistId}`);

  return (
    <ProductFilter params={params} wishlist={wishlist}/>
  );
}
