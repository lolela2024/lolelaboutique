"use client";

import React, { useState } from "react";
import { ShoppingBagButton } from "../SubmitButtons";
import { addItem } from "@/app/actions/bag";
import { Inventory } from "@prisma/client";
import { FaMinus, FaPlus } from "react-icons/fa";
import { toast } from "sonner";

interface iAppProps {
  dataId: string;
  inventory: Inventory | null;
}

export default function AddToCartForm({ dataId, inventory }: iAppProps) {
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
    if (inventory?.available === undefined || inventory?.available === -1) {
      // Produs fără limită de stoc
      setQuantity(quantity + 1);
    } else if (inventory && inventory.available > 0) {
      // Produs cu stoc limitat
      if (quantity < inventory.available) {
        setQuantity(quantity + 1);
      } else {
        // Toast când cantitatea maximă este atinsă
        toast.warning("Stoc insuficient", {
          description: `Nu poți adăuga mai mult de ${inventory.available} produse.`,
          position: "top-right",
        });
      }
    } else {
      // Toast când stocul este epuizat
      toast.error("Out of Stock", {
        description: "Acest produs nu mai este disponibil în stoc.",
        position: "top-right",
      });
    }
  };

  // Verifică stocul pentru a dezactiva/activa butonul "Adaugă în coș"
  const isOutOfStock = inventory?.available === 0;

  return (
    <form className="mb-4" action={addProducttoShoppingCart}>
      {/* Mesaj "Out of Stock" sau buton pentru adăugare în coș */}
      {isOutOfStock ? (
        <div className="mt-4 text-red-500 font-semibold">Out of Stock</div>
      ) : (
        <>
          <div className="group flex">
            {/* Buton scădere cantitate */}
            <button
              className="border px-4 rounded-l-md bg-gray-200"
              type="button"
              disabled={quantity <= 1} // Dezactivează dacă cantitatea este <= 1
              onClick={handleDecrease}
            >
              <FaMinus />
            </button>

            {/* Afișează cantitatea curentă */}
            <div className="flex w-full border-t border-b items-center justify-center p-2">
              {quantity}
            </div>

            {/* Buton creștere cantitate */}
            <button
              className="border px-4 rounded-r-md bg-gray-200"
              type="button"
              disabled={isOutOfStock} // Dezactivează dacă stocul este 0
              onClick={handleIncrease}
            >
              <FaPlus />
            </button>
          </div>
          <ShoppingBagButton />
        </>
      )}
    </form>
  );
}
