import React, { ReactNode, use } from "react";
import { DashboardNavigation } from "../components/dashboard/DasboardNavigation";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { CircleUser, MenuIcon } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import Image from "next/image";
import getSession from "@/lib/getSession";
import { UserRole } from "@prisma/client";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  const user = session?.user;

  if (!user) {
    redirect("/");
  }

  console.log(session)
  if (user.role !== UserRole.ADMIN){
    return <p>not authorized</p>
  }

  return (
    <>
      <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="sticky top-0 flex h-16 items-center justify-between gap-4 bg-white z-10">
          <nav className="hidden font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <DashboardNavigation />
          </nav>

          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="shrink-0 md:hidden"
                variant="outline"
                size="icon"
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left">
              <nav className="flex flex-col gap-6 text-lg font-medium mt-5">
                <DashboardNavigation />
              </nav>
            </SheetContent>
          </Sheet>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                {session ? (
                  <Image
                    src={user.image || ""}
                    alt="User profil image"
                    width={50}
                    height={50}
                    className="aspect-square rounded-full bg-background object-cover"
                  />
                ) : (
                  <CircleUser className="w-5 h-5" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>My Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <LogoutLink>Logout</LogoutLink>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
      </div>
      <div className="bg-[#f1f1f1]">
        <div className="flex w-full flex-col max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <main className="my-5 min-h-[calc(100vh-100px)]">{children}</main>
        </div>
      </div>
    </>
  );
}
