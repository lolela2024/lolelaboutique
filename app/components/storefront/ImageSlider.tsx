"use client";

import CustomImage from "@/components/CustomImage";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface iAppProps {
  images: string[];
  slug: string;
}

export function ImageSlider({ images, slug }: iAppProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
 
  const router = useRouter();

  // Navigate to the previous image
  function handlePreviousClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  }

  // Navigate to the next image
  function handleNextClick() {
    setMainImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  }

  // Set the clicked thumbnail as the main image
  function handleImageClick(index: number) {
    setMainImageIndex(index);
  }

  return (
    <div className="grid md:grid-cols-12 gap-4 md:gap-3 items-start mb-8">
      {/* Thumbnails on the side for larger screens */}
      <div className="hidden md:block col-span-2 overflow-scroll">
        <div className="flex flex-col gap-2">
          {images.map((image, index) => (
            <div
              className={cn(
                index === mainImageIndex
                  ? "border-2 border-primary"
                  : "border-2 border-gray-200",
                "relative overflow-hidden rounded-lg cursor-pointer"
              )}
              key={index}
              onClick={() => handleImageClick(index)}
            >
              <CustomImage
                src={image}
                alt={`Thumbnail ${index}`}
                width={100}
                height={80}
                className="w-full h-[70px] md:h-[100px] object-cover"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Image with arrows for navigation */}
      <div className="col-span-12 md:col-span-10 relative">
        <div
          className="overflow-hidden rounded-lg cursor-pointer"
          // onClick={() => router.push(`/product/${slug}?prod-gallery=${mainImageIndex}`)}
         
        >
          <CustomImage
            src={images[mainImageIndex]}
            className={`h-[350px] sm:h-[350px] md:h-[370px] lg:h-[550px] object-cover w-full `}
            alt="Product image"
            sizes="(min-width: 1360px) 560px, (min-width: 1040px) calc(40vw + 24px), (min-width: 780px) calc(50vw - 36px), (min-width: 680px) 600px, 92.22vw"
          />
        </div>

        {/* Navigation Arrows */}
        <div className="absolute inset-0 flex items-center justify-between px-4">
          <Button onClick={handlePreviousClick} variant="ghost" size="icon">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <Button onClick={handleNextClick} variant="ghost" size="icon">
            <ChevronRight className="w-6 h-6" />
          </Button>
        </div>
      </div>

      {/* Thumbnails below main image for smaller screens */}
      <div className="col-span-12  md:hidden flex justify-center gap-2">
        {images.map((image, index) => (
          <div
            className={cn(
              index === mainImageIndex
                ? "border-2 border-primary"
                : "border-2 border-gray-200",
              "relative overflow-hidden rounded-lg cursor-pointer"
            )}
            key={index}
            onClick={() => handleImageClick(index)}
          >
            <CustomImage
              src={image}
              alt={`Thumbnail ${index}`}
              width={100}
              height={100}
              className="w-full h-[50px] object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
