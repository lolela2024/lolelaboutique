"use client";

import { signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { FaCalendarDays, FaCircleUser, FaLocationDot } from "react-icons/fa6";
import { CiLogout } from "react-icons/ci";

interface iAppProps {
  email: string;
  name: string;
  userImage: string;
}

export function UserDropdown({ email, name, userImage }: iAppProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={userImage} alt="User Image" />
            <AvatarFallback>{name?.slice(0, 3)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuItem asChild>
          <Link className="flex items-center justify-between" href={"/account/identitate"}>Informatii <FaCircleUser /></Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className="flex items-center justify-between" href={"/account/identitate"}>Adrese <FaLocationDot /></Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link className="flex items-center justify-between" href={"/account/identitate"}>Comenzi <FaCalendarDays /></Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <Button
          onClick={() => signOut({ callbackUrl: "/" })}
          size={"sm"}
          variant={"link"}
          className="w-full text-red-500 no-underline hover:no-underline items-center gap-2 hover:text-red-400"
        >
          Deconectare <CiLogout />
        </Button>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
