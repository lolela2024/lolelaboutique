import Image from "next/image";
import React from "react";

export default function CategoriesHeroHolder() {
  return (
    <div className="relative mb-6">
      <div className="relative h-[330px]">
        <Image
          src={"/home-slide-1.jpg"}
          alt="Category Image"
          fill
          className="object-cover w-full h-full rounded-lg object-right"
        />
      </div>

      <div className="absolute top-[35%] bg-white pl-12 py-2 pr-2 rounded-r-lg w-sm">
        <h1 className="text-2xl font-bold mb-4">Noua colecție de bijuterii cu pietre prețioase</h1>
      </div>
    </div>
  );
}
