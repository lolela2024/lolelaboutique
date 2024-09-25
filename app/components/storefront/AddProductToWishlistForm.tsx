import { addItem } from "@/app/actions/wishlist";
import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { WishlistButton } from "../SubmitButtons";
import { Wishlist } from "@/app/lib/interfaces";

export default function AddProductToWishlistForm({
  dataId,
  itemFound
}: {
  dataId: string;
  itemFound: boolean
}) {
  const addProductToWishlist = addItem.bind(null, dataId);


  return (
    <form
      className="absolute top-1 right-1 text-pink-500 p-1 hover:text-pink-300"
      action={addProductToWishlist}
    >
      <WishlistButton itemFound={itemFound}/>
    </form>
  );
}
