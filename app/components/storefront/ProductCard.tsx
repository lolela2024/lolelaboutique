"use client";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useState } from "react";
import Rating from "./rating/Rating";
import { useRouter } from "next/navigation";
import { formatCurrency } from "../../lib/formatters";
import CustomImage from "@/components/CustomImage";
import AddProductToWishlistForm from "./AddProductToWishlistForm";
import { Wishlist } from "@/app/lib/interfaces";

interface iAppProps {
  item: any;
  loading: boolean;
  wishlist?: Wishlist | null;
}

const styles = {
  image: {
    width: '100%',
    height: '380px', // Default height
    objectFit: 'cover',
  },
  '@media (min-width: 640px)': {
    image: {
      height: '280px', // Height for small screens
    },
  },
  '@media (min-width: 768px)': {
    image: {
      height: '300px', // Height for medium screens
    },
  },
  '@media (min-width: 1024px)': {
    image: {
      height: '350px', // Height for large screens
    },
  },
};

export function ProductCard({ item,loading, wishlist }: iAppProps) {
  const [visible, setVisible] = useState(false);
  const { push } = useRouter();

  let itemFound = false;

  wishlist?.items.map((product) => {
    if (product.id === item.id) {
      itemFound = true;
    }

    return item;
  });

  return (
    <div
      className="rounded-lg shadow-lg border border-gray-200"
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      <Card className="relative w-full mx-auto shadow-none border-none ">
        <div
          className="cursor-pointer"
          onMouseEnter={() => setVisible(true)}
          onMouseLeave={() => setVisible(false)}
        >
          <CardHeader className=" p-0 rounded-none">
            <div className="relative rounded-t-lg">
              <div onClick={() => push(`/product/${item.slug}`)}>
                <CustomImage
                  src={item.images[0]}
                  alt="Product Image"
                  sizes="(min-width: 1360px) 289px, (min-width: 1040px) calc(20vw + 21px), (min-width: 780px) calc(33.33vw - 29px), calc(96.52vw - 22px)"
                  className={`absolute h-[360px] sm:h-[340px] md:h-[300px] lg:h-[280px] object-cover rounded-t-lg overflow-hidden transition-opacity duration-700 ease-in-out ${
                    visible && item.images[1] ? "opacity-0" : "opacity-100"
                  }`}
                  // style={styles.image} // Dimensiuni fixe și ajustare a imaginii
                />
                {!item.images[1] && (
                    <CustomImage
                    src={item.images[0]}
                    alt="Product Image"
                    sizes="(min-width: 1360px) 289px, (min-width: 1040px) calc(20vw + 21px), (min-width: 780px) calc(33.33vw - 29px), calc(96.52vw - 22px)"
                    className={`rounded-t-lg h-[360px] sm:h-[340px] md:h-[300px] lg:h-[280px] object-cover overflow-hidden transition-opacity duration-700 ease-in-out ${
                      visible ? "opacity-100" : "opacity-0"
                    }`}
                  // style={styles.image} // Dimensiuni fixe și ajustare a imaginii
                  />
                )}
                {item.images[1] && (
                  <CustomImage
                    src={item.images[1]}
                    alt="Product Image"
                    sizes="(min-width: 1360px) 289px, (min-width: 1040px) calc(20vw + 21px), (min-width: 780px) calc(33.33vw - 29px), calc(96.52vw - 22px)"
                    className={`rounded-t-lg h-[360px] sm:h-[340px] md:h-[300px] lg:h-[280px] object-cover overflow-hidden transition-opacity duration-700 ease-in-out ${
                      visible ? "opacity-100" : "opacity-0"
                    }`}
                  // style={styles.image} // Dimensiuni fixe și ajustare a imaginii
                  />
                )}
              </div>
              <AddProductToWishlistForm dataId={item.id} itemFound={itemFound}/>

              <div
                className={`${visible ? "block" : "hidden"}`}
                onClick={() => push(`/product/${item.slug}`)}
              >
                <div className="absolute bottom-[0px]  w-full  bg-buttonColor/90 py-1  text-white capitalize text-center">
                  Vizualizare
                </div>
              </div>
            </div>
          </CardHeader>
        </div>
        <CardContent className="p-0">
          <h1
            className="font-semibold text-sm my-2 cursor-pointer px-2"
            onClick={() => push(`/product/${item.slug}`)}
          >
            {item.name}
          </h1>
          <Rating isEditable={false} rating={5} />
          <div className="flex mt-2 items-center space-x-2">
            {item.originalPrice && (
              <p className="text-black text-sm line-through font-light opacity-60">
                {formatCurrency(item.originalPrice)}
              </p>
            )}

            <p className="text-primary">{item.price} Lei</p>
          </div>
          {item.originalPrice && item.discountPercentage && (
            <div className="absolute top-4 bg-[#ed4999] px-2 text-white font-semibold rounded-r-sm shadow-md">
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
      <Skeleton className="w-full h-[220px]" />
      <div className="flex flex-col mt-2 gap-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="w-full h-6" />
      </div>
      <Skeleton className="w-full h-10 mt-5" />
    </div>
  );
}
