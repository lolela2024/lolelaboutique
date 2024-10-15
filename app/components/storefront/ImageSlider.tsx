"use client";

import CustomImage from "@/components/CustomImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface iAppProps {
  images: string[];
}

export function ImageSlider({ images }: iAppProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);

  function handlePreviousClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }

  function handleNextClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }

  function handleImageClick(index: number) {
    setMainImageIndex(index);
  }

  return (
    <div className="grid gap-6 md:gap-3 items-start mb-8 cursor-zoom-in">
      <div className="relative overflow-hidden rounded-lg">
        <CustomImage
          width={600}
          height={600}
          src={images[mainImageIndex]}
          alt="Product image"
          sizes="(min-width: 1360px) 560px, (min-width: 1040px) calc(40vw + 24px), (min-width: 780px) calc(50vw - 36px), (min-width: 680px) 600px, 92.22vw"
        />

        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={handlePreviousClick} variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button onClick={handleNextClick} variant="ghost" size="icon">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-4 md:grid-cols-6 gap-4">
        {images.map((image, index) => (
          <div
            className={cn(
              index === mainImageIndex
                ? "border-2 border-primary"
                : "border border-gray-200",
              "relative overflow-hidden rounded-lg cursor-pointer"
            )}
            key={index}
            onClick={() => handleImageClick(index)}
          >
            <CustomImage
              src={image}
              alt="Product Image"
              width={100}
              height={100}
              className=" w-full h-18 md:h-[70px] lg:h-[100px]"
            />
          </div>
        ))}
      </div>
    </div>
  );
}