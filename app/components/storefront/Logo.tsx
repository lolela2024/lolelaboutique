import CustomImage from "@/components/CustomImage";
import { Gem } from "lucide-react";
import Link from "next/link";
import React from "react";

export default function Logo() {
  return (
    <div className="flex items-center">
      <Link href="/">
        <div className="">
          <CustomImage src={"/cropped-logooo8.png"} alt="logo" priority width={200} height={65} sizes="(min-width: 620px) 240px, calc(48.67vw - 52px)"/>
        </div>
      </Link>
    </div>
  );
}
