import { ShoppingBagIcon, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { formatCurrency } from "../../lib/formatters";

interface iAppProps {
  total: number;
  user: any;
  totalSum: number;
}

export default function HeaderIcons({ total, totalSum, user }: iAppProps) {
  return (
    <div className="flex items-center justify-end gap-4">
      {user ? (
        <>
          <UserDropdown
            email={user.email as string}
            name={user.name as string}
            userImage={user.image ?? `https://avatar.vercel.sh/${user.name}`}
          />
        </>
      ) : (
        <div>
          <Link
            href={"/auth/login"}
            className="text-gray-700 p-1 group-hover:text-gray-900"
          >
            <User className="stroke-1 w-7 h-7 " />
          </Link>
        </div>
      )}
      <Link
        href="/bag"
        className="flex items-end gap-1 p-1"
      >
        <div className="relative group">
          <HiOutlineShoppingBag className="stroke-1 h-6 w-6 text-gray-700 group-hover:text-gray-900" />
          <Badge className="absolute text-white bottom-[15px] right-[16px] p-2 rounded-full w-4 h-4 flex items-center justify-center text-xs font-normal bg-primary">
            {total}
          </Badge>
          
        </div>
        <div className="hidden lg:block text-sm ">{formatCurrency(totalSum)}</div>
      </Link>
    </div>
  );
}

function SignInButton() {
  return <Button variant={"link"} className="text-gra" type="submit"></Button>;
}
