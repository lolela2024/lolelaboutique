"use client";

import { formatCurrency } from "@/app/lib/formatters";
import { Wishlist } from "@/app/lib/interfaces";
import CustomImage from "@/components/CustomImage";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { IoCheckmark } from "react-icons/io5";
import AddToCartForm from "./AddToCartForm";
import { LuX } from "react-icons/lu";
import { deleteItemFromWishlist } from "@/app/actions/wishlist";

interface IWishlistForm {
  item: {
    id: string;
    name: string;
    price: number;
    originalPrice: number;
    discountAmount: number;
    discountPercentage: number;
    imageString: string;
    available?: number;
  };
}

export default function WishlistForm({ item }: IWishlistForm) {
  console.log(item.available);

  return (
    <>
      <div className="block md:flex justify-between">
        <div className="flex items-start gap-2">
          <CustomImage
            width={100}
            height={100}
            src={item.imageString}
            alt={item.name}
          />
          <div>
            <h4>{item.name}</h4>
            <div className="flex">
              <p className="text-black text-sm line-through font-light opacity-60">
                {formatCurrency(item.originalPrice)}
              </p>
              <p className="text-primary">{formatCurrency(item.price)}</p>
            </div>
            {item.available && item.available > 0 || item.available === undefined ? (
               <p className="text-buttonColor flex uppercase items-center font-semibold">
               <IoCheckmark size={22} />
               In Stoc
             </p>
            ): 
              <p className="text-red-500 flex uppercase items-center font-semibold">Out of stock</p>
            }
           
          </div>
        </div>
        <div className="flex items-start gap-6 justify-end">
          {item.available && item.available > 0 ? (
            <AddToCartForm dataId={item.id} />
          ) : null}
          {item.available === undefined ? (
            <AddToCartForm dataId={item.id} />
          ) : null}

          <span
            className="bg-red-500 text-white cursor-pointer shadow-md hover:bg-red-500/90 p-1 rounded-full"
            onClick={() => deleteItemFromWishlist(item.id)}
          >
            <LuX size={22} />
          </span>
        </div>
      </div>
      <Separator className="my-4" />
    </>
  );
}
