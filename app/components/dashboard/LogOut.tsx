"use client";

import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";
import React from "react";
import { CiLogout } from "react-icons/ci";

export default function LogOut() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      size={"sm"}
      variant={"link"}
      className="w-full text-red-500 no-underline hover:no-underline items-center gap-2 hover:text-red-400"
    >
      Deconectare <CiLogout />
    </Button>
  );
}
