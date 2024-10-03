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
    name: "Bijuterii oțel inoxidabil",
    href: "/products/bijuterii-otel-inoxidabil",
    submenu: [
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
    ],
  },
  {
    id: 5,
    name: "Bijuterii pietre semiprețioase",
    href: "/products/bijuterii-pietre-semipretioase",
    submenu: [
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
    ],
  },
  {
    id: 6,
    name: "Bijuterii personalizate",
    href: "/products/bijuterii-personalizate",
    submenu: [
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
    ],
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
              ? "border-b-[3px] border-primary bg-buttonColor/30 rounded-lg "
              : "hover:text-gray-600 hover:bg-opacity-75",
            "px-2 py-1 my-2 group uppercase text-sm font-semibold"
          )}
        >
          {item.name}
        </Link>
      ))}
    </div>
  );
}
