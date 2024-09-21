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
    id: 2,
    name: "Cercei",
    href: "/products/cercei",
  },
  {
    id: 3,
    name: "Brățări",
    href: "/products/bratari",
  },
  {
    id: 4,
    name: "Coliere",
    href: "/products/coliere",
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
              ? "border-b-2 border-primary bg-primary text-white rounded-lg my-2"
              : "hover:text-primary hover:bg-opacity-75",
            "px-2 py-1 group uppercase text-sm font-semibold"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}