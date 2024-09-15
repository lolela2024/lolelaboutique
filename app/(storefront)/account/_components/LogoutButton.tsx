"use client";
import { MdOutlineLogout } from "react-icons/md";
import React from "react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      size={"sm"}
      variant={"link"}
      className="gap-1 hover:no-underline font-semibold"
    >
      <MdOutlineLogout size={18}/>
      Deconectare
    </Button>
  );
}
