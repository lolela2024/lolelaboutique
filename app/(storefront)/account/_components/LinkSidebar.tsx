import { ChevronRight, LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import { LogoutLink } from '@kinde-oss/kinde-auth-nextjs/components';

const links = [
  {
    name: "Informatii personale",
    href: "/account/identitate",
  },
  {
    name: "Comenzi",
    href: "/account/comenzi",
  },
  {
    name: "Adrese",
    href: "/account/address",
  },
];

export default function LinkSidebar() {
  return (
    <ul className="px-0">
      {links.map((link) => (
        <li className="py-1" key={link.name}>
          <Link className="flex items-center hover:text-primary"  href={link.href}><ChevronRight className="w-4 h-4"/>{link.name}</Link>
          
        </li>
      ))}
      <li className="text-primary py-1"><LogoutLink className="flex items-center" ><LogOut className="w-4 h-4 mr-2"/>Deconectare</LogoutLink></li>
    </ul>
  );
}
