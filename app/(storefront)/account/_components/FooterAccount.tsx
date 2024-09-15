import React from "react";
import { Card, CardContent } from '@/components/ui/card';
import Link from "next/link";
import LogoutButton from "./LogoutButton";
import { FaUser } from "react-icons/fa";

export default function FooterAccount() {
  return (
    <Card className="shadow-lg border">
      <CardContent className="py-4">
        <div className="flex items-center justify-between">
          <Link
            href={"/account"}
            className="flex items-center gap-2 text-sm hover:text-primary"
          >
            <FaUser />
            Inapoi la contul tau
          </Link>

          <LogoutButton />
        </div>
      </CardContent>
    </Card>
  );
}
