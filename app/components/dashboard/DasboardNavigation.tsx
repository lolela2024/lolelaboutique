"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaProductHunt } from "react-icons/fa6";
import { BiSolidCategory } from "react-icons/bi";
import { DiMaterializecss } from "react-icons/di";
import Inventory from "../../dashboard/products/_components/Inventory";

export function DashboardNavigation() {
  const pathname = usePathname();
  const { push } = useRouter();

  const [open, setIsOpen] = useState<boolean>(false);

  const handleChange = (link: string) => {
    setIsOpen(!open);
    push(link);
  };

  return (
    <NavigationMenu className="hidden md:block">
      <NavigationMenuList>
        <NavigationMenuItem>
          <Link href="/dashboard" legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === "/dashboard"}
              className={navigationMenuTriggerStyle()}
            >
              Dashboard
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/orders" legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === "/dashboard/orders"}
              className={navigationMenuTriggerStyle()}
            >
              Orders
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <DropdownMenu open={open} onOpenChange={() => setIsOpen(!open)}>
            <DropdownMenuTrigger asChild>
              <NavigationMenuLink
                className={navigationMenuTriggerStyle()}
                active={
                  pathname === "/dashboard/products" ||
                  pathname === "/dashboard/categories" ||
                  pathname === "/dashboard/material"
                }
              >
                <button
                  className="flex items-center gap-2 cursor-pointer text-sm"
                  onClick={() => setIsOpen(!open)}
                >
                  Products{" "}
                  {!open ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
                </button>
              </NavigationMenuLink>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="start">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className={
                    pathname === "/dashboard/products" ? "bg-[#f3f1f3]" : ""
                  }
                >
                  <button
                    onClick={() => handleChange("/dashboard/products")}
                    className="flex items-center gap-2 text-sm"
                  >
                    <FaProductHunt />
                    <span>All Products</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    pathname === "/dashboard/categories" ? "bg-[#f3f1f3]" : ""
                  }
                >
                  <button
                    className="flex items-center gap-2 text-sm"
                    onClick={() => handleChange("/dashboard/categories")}
                  >
                    <BiSolidCategory />
                    <span>Categories</span>
                  </button>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className={
                    pathname === "/dashboard/material" ? "bg-[#f3f1f3]" : ""
                  }
                >
                  <button
                    className="flex items-center gap-2 text-sm"
                    onClick={() => handleChange("/dashboard/material")}
                  >
                    <DiMaterializecss />
                    <span>Material Product</span>
                  </button>
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/inventory" legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === "/dashboard/inventory"}
              className={navigationMenuTriggerStyle()}
            >
              Inventory
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <Link href="/dashboard/home-page" legacyBehavior passHref>
            <NavigationMenuLink
              active={pathname === "/dashboard/home-page"}
              className={navigationMenuTriggerStyle()}
            >
              Home page
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
