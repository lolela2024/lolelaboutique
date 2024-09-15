import { Gem } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link href="/">
        <h1 className="text-black font-bold text-xl lg:text-3xl flex items-center gap-2">
          <span className="-rotate-45"><Gem className="text-primary w-8 h-8"/></span>Lolela <span className="text-primary">Boutique</span>
        </h1>
      </Link>
    </div>
  );
}
