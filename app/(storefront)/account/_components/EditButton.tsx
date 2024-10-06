"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React from "react";

interface iAppProps {
  icon?: string;
  href: string;
  className?: string;
  variant?: "default" | "ghost" | undefined;
  size?: "sm" | "lg" | undefined;
  children?: React.ReactNode 
}

export default function EditButton(props: iAppProps) {
  const { push } = useRouter();
  return (
    <Button className={props.className} onClick={() => push(props.href)} variant={props.variant} size={props.size}>
      {props.children}
    </Button>
  );
}
