"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface BackButtonProps {
  href: string;
  label: string;
  buttonLabel: string;
}

export const BackButton = ({ href, label, buttonLabel }: BackButtonProps) => {
  const router = useRouter();

  return (
    <div className="flex items-center text-sm cursor-pointer">
      <p>{label}</p>
      <Button
        variant={"link"}
        className="font-normal text-gray-800"
        size={"sm"}
        onClick={() => router.push(href)}
      >
        {buttonLabel}
      </Button>
    </div>
  );
};
