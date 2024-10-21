"use client";

import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa6";

export default function ButtonAddRemoveItem({
  productQuantity,
  setQuantity,
  quantity
}: {
  productQuantity: number;
  setQuantity:any,
  quantity:number
}) {
  

  const handleQuantityChange = (ev: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseFloat(ev.target.value);

    // Asigură-te că valoarea este între 0 și productQuantity
    if (newQuantity >= 0 && newQuantity <= productQuantity) {
      setQuantity(newQuantity);
    }
  };

  const increaseQuantity = () => {
    // Crește cantitatea, dar nu depăși productQuantity
    if (quantity < productQuantity) {
      setQuantity(quantity + 1);
    }
  };

  const decreaseQuantity = () => {
    // Scade cantitatea, dar nu sub 0
    if (quantity > 0) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="border rounded-lg overflow-hidden">
      <div className="flex items-center">
        <input
          type="number"
          className="w-[42px] trx-button-none text-end mr-[-15px] focus:outline-none focus:ring-0"
          value={quantity}
          onChange={handleQuantityChange}
          min={0} // Afișează minim 0
          max={productQuantity} // Afișează maxim productQuantity
        />
        <div className="px-2 bg-white h-full">of {productQuantity}</div>
        <div className="flex flex-col">
          <button
            className="pt-1 pl-1 pr-1 bg-gray-200 hover:bg-gray-400"
            onClick={increaseQuantity}
          >
            <FaChevronUp size={12} />
          </button>
          <button
            className="pl-1 pr-1 pb-1 bg-gray-200 hover:bg-gray-400"
            onClick={decreaseQuantity}
          >
            <FaChevronDown size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}
