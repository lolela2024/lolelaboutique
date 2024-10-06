"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { ReactNode } from "react";

interface iAppProps {
  name: string;
  href: string;
}

export default function AddButton(props: iAppProps) {
  const { push } = useRouter();
  return <Button onClick={() => push(props.href)}>{props.name}</Button>;
}
