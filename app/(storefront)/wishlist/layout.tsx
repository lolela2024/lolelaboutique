import SidebarWishlist from "@/app/components/storefront/SidebarWishlist";
import { auth } from "@/auth";
import React, { ReactNode } from "react";

export default async function LayoutWishlist({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="grid grid-cols-12 mt-4">
      {!user && (
        <div className="hidden lg:block lg:col-span-3">
          <SidebarWishlist />
        </div>
      )}

      <div className="col-span-12 lg:col-span-9">{children}</div>
    </div>
  );
}
