import { addItem } from "@/app/actions/wishlist";
import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { WishlistButton } from "../SubmitButtons";
import { Wishlist } from "@/app/lib/interfaces";

export default function AddProductToWishlistForm({
  dataId,
  itemFound,
}: {
  dataId: string;
  itemFound: boolean;
}) {
  const addProductToWishlist = addItem.bind(null, dataId);

  return (
    
      <form
        className="absolute top-1 right-1 text-pink-500 p-1 hover:text-pink-400"
        action={addProductToWishlist}
      >
        <div className="bg-gray-100 bg-opacity-80 flex h-[34px] w-[34px] rounded-full items-center justify-center border border-gray-200">
        <WishlistButton itemFound={itemFound} />
        </div>
      </form>
    
  );
}
