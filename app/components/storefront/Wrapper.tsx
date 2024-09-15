import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";

interface iAppProps {
  children: ReactNode;
  className?: string;
}

export default function Wrapper({ children, className }: iAppProps) {
  return (
    <div
      className={cn(
        "w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2",
        className
      )}
    >
      {children}
    </div>
  );
}
