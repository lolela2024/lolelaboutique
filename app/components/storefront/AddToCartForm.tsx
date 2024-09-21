"use client";

import React, { useState } from "react";
import { ShoppingBagButton } from "../SubmitButtons";
import { addItem } from "@/app/actions/bag";
import { Product } from "@prisma/client";
import { productSchema } from "../../lib/zodSchemas";
import { Input } from "@/components/ui/input";
import { FaMinus, FaPlus } from "react-icons/fa";

export default function AddToCartForm({ dataId }: { dataId: string }) {
  const [quantity, setQuantity] = useState(1);
  const addProducttoShoppingCart = addItem.bind(null, dataId, quantity);

  // Funcția pentru scăderea cantității
  const handleDecrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  // Funcția pentru creșterea cantității
  const handleIncrease = () => {
    setQuantity(quantity + 1);
  };

  return (
    <form className="mb-4" action={addProducttoShoppingCart}>
      <div className="group flex ">
        <button
          className="border px-4 rounded-l-md bg-gray-200"
          type="button"
          onClick={handleDecrease}
        >
          <FaMinus />
        </button>
        <div className="flex w-full border-t border-b items-center justify-center p-2">
          {quantity}
        </div>
        <button
          className="border px-4 rounded-r-md bg-gray-200"
          type="button"
          onClick={handleIncrease}
        >
          <FaPlus />
        </button>
      </div>
      <ShoppingBagButton />
    </form>
  );
}
