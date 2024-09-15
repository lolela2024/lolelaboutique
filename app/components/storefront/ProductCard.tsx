"use client";

import { Product } from "@/app/(storefront)/products/[name]/page";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import Rating from "./rating/Rating";
import { useRouter } from "next/navigation";
import { formatCurrency } from '../../lib/formatters';

interface iAppProps {
  item: any;
  loading: boolean;
}

export function ProductCard({ item }: iAppProps) {
  const [visible, setVisible] = useState(false);
  const { push } = useRouter();

  return (
    <div
      className="rounded-lg"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Card
        className="relative w-full mx-auto shadow-none border-none cursor-pointer"
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onClick={() => push(`/product/${item.id}`)}
      >
        <CardHeader className=" p-0 rounded-none">
          <div className="relative h-[270px] rounded-t-lg overflow-hidden">
            <Image
              src={item.images[0]}
              alt="Product Image"
              fill
              className={`object-cover bg-gray-50 w-full h-full absolute transition-opacity duration-700 ease-in-out ${
                visible && item.images[1] ? "opacity-0" : "opacity-100"
              }`}
            />
            {item.images[1] && (
              <Image
                src={item.images[1]}
                alt="Product Image"
                fill
                className={`object-cover bg-gray-50 w-full h-full absolute transition-opacity duration-700 ease-in-out ${
                  visible ? "opacity-100" : "opacity-0"
                }`}
              />
            )}
            <div className={`${visible ? "block" : "hidden"}`}>
              <div className="absolute bottom-[0px]  w-full  bg-buttonColor/90 py-1  text-white capitalize text-center">
                Vizualizare
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0">
          <h1 className="font-semibold text-sm my-2">{item.name}</h1>
          <Rating isEditable={false} rating={5} />
          <div className="flex mt-2 items-center space-x-2">
            {item.originalPrice && (
              <p className="text-black text-sm line-through font-light opacity-60">{formatCurrency(item.originalPrice)}</p>
            )}

            <p className="text-primary">{item.price} Lei</p>
          </div>
          {item.originalPrice && item.discountPercentage && (
            <div className="absolute top-4 bg-primary px-2 text-white font-semibold rounded-r-sm shadow-md">
              - {item.discountPercentage}%
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

export function LoadingProductCard() {
  return (
    <div className="flex flex-col">
      <Skeleton className="w-full h-[330px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
      </div>
      <Skeleton className="w-full h-10 mt-5" />
    </div>
  );
}
