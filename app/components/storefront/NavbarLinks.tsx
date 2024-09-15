"use client";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";

export const navbarLinks = [
  {
    id: 0,
    name: "Home",
    href: "/",
  },
  {
    id: 1,
    name: "All Products",
    href: "/products/all",
  },
  {
    id: 2,
    name: "Cercei",
    href: "/products/cercei",
  },
  {
    id: 3,
    name: "Women",
    href: "/products/women",
  },
  {
    id: 4,
    name: "Kids",
    href: "/products/kids",
  },
];

export function NavbarLinks() {
  const location = usePathname();
  return (
    <div className="flex justify-center items-center gap-x-2 ml-8">
      {navbarLinks.map((item) => (
        <Link
          href={item.href}
          key={item.id}
          className={cn(
            location === item.href
              ? "border-b-2 border-[#ff095c]"
              : "hover:text-black hover:bg-opacity-75",
            "group p-4 uppercase text-sm font-semibold text-[#3e3e3e]"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}