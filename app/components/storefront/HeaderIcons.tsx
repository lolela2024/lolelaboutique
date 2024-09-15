import { ShoppingBagIcon, User } from "lucide-react";
import Link from "next/link";
import React from "react";
import { UserDropdown } from "./UserDropdown";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { signIn } from "@/auth";

interface iAppProps {
  total: number;
  user: any;
}

export default function HeaderIcons({ total, user }: iAppProps) {
  return (
    <div className="flex items-center justify-end">
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
      <Link href="/bag" className="relative group p-2 flex items-center mr-2">
        <ShoppingBagIcon className="stroke-1 h-7 w-7 text-gray-700 group-hover:text-gray-900" />
        <Badge className="absolute bottom-1 right-0 p-2 rounded-full w-4 h-4 flex items-center justify-center text-xs font-normal bg-buttonColor hover:bg-buttonColor">
          {total}
        </Badge>
      </Link>
    </div>
  );
}

function SignInButton() {
  return (
    <Button variant={"link"} className="text-gra" type="submit">
      
    </Button>
  );
}
