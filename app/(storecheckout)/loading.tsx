import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function Loading() {
  return (
    <div className="max-w-6xl w-full mx-auto space-y-8">
      <div className="grid md:grid-cols-2 gap-4">
        <div className="h-screen">
          <Skeleton className="h-10 mt-4 w-full p-6" />
          <Skeleton className="h-10 mt-4 w-full p-6" />
          <Skeleton className="h-[450px] mt-4 w-full p-6" />
          <Skeleton className="h-10 mt-4 w-full p-6" />
          <Skeleton className="h-10 mt-4 w-full p-6" />
        </div>
        <div className="bg-[#f5f5f5] h-screen border-l">
          <div className="flex items-center mt-4">
            <Skeleton className="h-20  ml-6 w-20  bg-gray-200" />
            <Skeleton className="h-20 ml-6 w-1/2  bg-gray-200" />
            <div className="space-y-4">
              <Skeleton className="h-8 ml-6 w-28 mr-6 bg-gray-200" />
              <Skeleton className="h-8 ml-6 w-28 mr-6 bg-gray-200" />
            </div>
          </div>
          <div className="flex items-center mt-4">
            <Skeleton className="h-20  ml-6 w-20  bg-gray-200" />
            <Skeleton className="h-20 ml-6 w-1/2  bg-gray-200" />
            <div className="space-y-4">
              <Skeleton className="h-8 ml-6 w-28 mr-6 bg-gray-200" />
              <Skeleton className="h-8 ml-6 w-28 mr-6 bg-gray-200" />
            </div>
          </div>
          <div className="flex items-center mt-4 justify-between">
            <Skeleton className="h-6 ml-6 w-28 mr-6 bg-gray-200" />
            <Skeleton className="h-6 ml-6 w-28 mr-6 bg-gray-200" />
          </div>
          <div className="flex items-center mt-4 justify-between">
            <Skeleton className="h-6 ml-6 w-36 mr-6 bg-gray-200" />
            <Skeleton className="h-6 ml-6 w-28 mr-6 bg-gray-200" />
          </div>
        </div>
        {/* <Skeleton className="h-screen w-[50%]" />
        <Skeleton className="h-screen w-[50%]" /> */}
      </div>
    </div>
  );
}
