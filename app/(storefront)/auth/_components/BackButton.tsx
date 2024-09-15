"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";


interface BackButtonProps {
  href: string;
  label: string;
  buttonLabel: string
}

export const BackButton = ({ href, label, buttonLabel }: BackButtonProps) => {
  return (
    <div className="flex items-center text-sm">
      <p>{label}</p>
      <Button
        variant={"link"}
        className="font-normal"
        size={"sm"}
        asChild
      >
        <Link className="font-semibold" href={href}>{buttonLabel}</Link>
      </Button>
    </div>
  );
};